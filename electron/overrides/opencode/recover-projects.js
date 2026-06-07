(function () {
  if (window.__OPENHUB_RECOVER_PROJECTS__) return;
  window.__OPENHUB_RECOVER_PROJECTS__ = true;

  var STORAGE_KEY = "opencode.global.dat:server";
  var raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      var data = JSON.parse(raw);
      if (data && data.projects && Object.keys(data.projects).length > 0) {
        return;
      }
    } catch {}
  }

  var directory = (typeof __OPENHUB_WORKSPACE_DIR__ !== "undefined" ? __OPENHUB_WORKSPACE_DIR__ : null) || "";
  var value = JSON.stringify({
    projects: (function () {
      var p = {};
      p[location.origin] = [{ worktree: directory, expanded: true }];
      return p;
    })(),
    lastProject: (function () {
      var lp = {};
      lp[location.origin] = directory;
      return lp;
    })(),
  });
  localStorage.setItem(STORAGE_KEY, value);

  setTimeout(function () {
    location.reload();
  }, 100);
})();
