/**
 * OpenWork desktop bridge polyfill
 *
 * Sets window.__OPENWORK_ELECTRON__ so isDesktopRuntime() returns true,
 * unlocking folder-selection UI and desktop boot paths.
 *
 * Workspace API interception (/workspaces/*) is handled at the Electron
 * network level via session.protocol.handle in main.ts — not here.
 */
(function () {
  "use strict";
  if (window.__OPENWORK_ELECTRON__) return;

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
    updater: {
      getChannel: function () {
        return Promise.resolve({
          channel: "stable",
          currentVersion: "openhub",
        });
      },
      setChannel: function (ch) {
        return Promise.resolve({ channel: ch, currentVersion: "openhub" });
      },
      check: function () {
        return Promise.resolve({
          available: false,
          currentVersion: "openhub",
          reason: "unavailable",
        });
      },
      download: function () {
        return Promise.resolve({ ok: false, reason: "unavailable" });
      },
      installAndRestart: function () {
        return Promise.resolve({ ok: false, reason: "unavailable" });
      },
    },
    meta: {
      platform: "darwin",
      version: "openhub",
    },
  };
})();
