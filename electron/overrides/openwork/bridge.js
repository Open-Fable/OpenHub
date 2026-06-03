/**
 * OpenWork desktop bridge polyfill
 *
 * 1. Sets window.__OPENWORK_ELECTRON__ for isDesktopRuntime()
 * 2. Patches globalThis.fetch AND window.fetch to intercept workspace API calls
 *    that opencode serve cannot handle
 */
(function () {
  "use strict";
  if (window.__OPENWORK_ELECTRON__) return;

  // ── Desktop bridge ──
  window.__OPENWORK_ELECTRON__ = {
    invokeDesktop: function (command) {
      var args = Array.prototype.slice.call(arguments, 1);
      return window.openhub.openworkDesktopInvoke.apply(null, [command].concat(args));
    },
    shell: {
      openExternal: function (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return Promise.resolve();
      },
    },
    meta: {
      platform: "darwin",
      version: "openhub",
    },
  };

  // ── Fetch interceptor ──
  // desktopFetch calls globalThis.fetch for loopback URLs at call time.
  // We need to patch the actual fetch property on both window and globalThis
  // so any reference path resolves to our interceptor.
  var nativeFetch = globalThis.fetch.bind(globalThis);

  function jsonResponse(data, status) {
    return new Response(JSON.stringify(data), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  function makeWorkspaceList(wsPath, wsName) {
    var id = "openhub-" + Date.now();
    return {
      selectedId: id,
      activeId: id,
      workspaces: [
        {
          id: id,
          name: wsName || wsPath.split("/").pop() || "workspace",
          path: wsPath,
          preset: "default",
          workspaceType: "local",
          displayName: wsName || wsPath.split("/").pop() || "workspace",
        },
      ],
    };
  }

  function interceptedFetch(input, init) {
    var url;
    if (typeof input === "string") {
      url = input;
    } else if (typeof Request !== "undefined" && input instanceof Request) {
      url = input.url;
    } else if (input instanceof URL) {
      url = input.toString();
    } else {
      url = String(input);
    }

    // Only intercept opencode serve workspace endpoints
    var isServerUrl = url.indexOf("://127.0.0.1:4096") !== -1 || url.indexOf("://localhost:4096") !== -1;
    if (!isServerUrl) {
      return nativeFetch(input, init);
    }

    try {
      var parsed = new URL(url);
      var path = parsed.pathname;
    } catch (e) {
      return nativeFetch(input, init);
    }

    var method = "GET";
    if (init && init.method) {
      method = init.method.toUpperCase();
    } else if (typeof Request !== "undefined" && input instanceof Request) {
      method = input.method.toUpperCase();
    }

    // Extract body from either init or Request
    var bodyStr = null;
    if (init && typeof init.body === "string") {
      bodyStr = init.body;
    }

    // POST /workspaces/local
    if (path === "/workspaces/local" && method === "POST") {
      try {
        var body = bodyStr ? JSON.parse(bodyStr) : {};
        return Promise.resolve(jsonResponse(makeWorkspaceList(body.folderPath || "/", body.name)));
      } catch (e) {
        return Promise.resolve(jsonResponse(makeWorkspaceList("/")));
      }
    }

    // GET /workspaces
    if (path === "/workspaces" && method === "GET") {
      return Promise.resolve(jsonResponse({
        selectedId: "openhub-default",
        activeId: "openhub-default",
        workspaces: [],
      }));
    }

    // POST /workspaces/remote
    if (path === "/workspaces/remote" && method === "POST") {
      try {
        var rBody = bodyStr ? JSON.parse(bodyStr) : {};
        return Promise.resolve(jsonResponse(makeWorkspaceList(rBody.baseUrl || "/", rBody.name)));
      } catch (e) {
        return Promise.resolve(jsonResponse(makeWorkspaceList("/")));
      }
    }

    // Workspace mutations — activate, display-name, delete
    if (/^\/workspaces\/[^/]+\/activate/.test(path) && method === "POST") {
      return Promise.resolve(jsonResponse({ ok: true }));
    }
    if (/^\/workspaces\/[^/]+\/display-name$/.test(path) && method === "PUT") {
      return Promise.resolve(jsonResponse({ ok: true }));
    }
    if (/^\/workspaces\/[^/]+$/.test(path) && method === "DELETE") {
      return Promise.resolve(jsonResponse({ ok: true }));
    }

    // Status checks
    if (path === "/status" || path === "/health") {
      return Promise.resolve(jsonResponse({ running: true, version: "openhub" }));
    }

    // Everything else passes through to opencode serve
    return nativeFetch(input, init);
  }

  // Patch both references so any code path (window.fetch, globalThis.fetch,
  // or a cached module-level reference) picks up our interceptor.
  Object.defineProperty(window, "fetch", {
    value: interceptedFetch,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(globalThis, "fetch", {
    value: interceptedFetch,
    writable: true,
    configurable: true,
  });
})();
