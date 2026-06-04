/*
 * OpenHub → Open Design — floating back button
 */
(function () {
  if (!window.openhub) return;

  var btn = document.createElement("button");
  btn.id = "openhub-back-btn";
  btn.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="12 4 6 10 12 16"/></svg>';
  btn.title = "Retour";
  btn.style.cssText =
    "position:fixed;bottom:20px;left:12px;z-index:999999;width:40px;height:40px;" +
    "border-radius:8px;border:1px solid #2a2a34;background:#141418;color:#7c6af2;" +
    "cursor:pointer;display:flex;align-items:center;justify-content:center;" +
    "opacity:0.6;transition:opacity 0.15s;-webkit-app-region:no-drag;" +
    "backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);";

  btn.addEventListener("mouseenter", function () {
    btn.style.opacity = "1";
    btn.style.background = "#1c1c24";
  });
  btn.addEventListener("mouseleave", function () {
    btn.style.opacity = "0.6";
    btn.style.background = "#141418";
  });

  btn.addEventListener("click", function () {
    window.history.back();
  });

  function inject() {
    if (document.body && !document.getElementById("openhub-back-btn")) {
      document.body.appendChild(btn);
    }
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener("DOMContentLoaded", inject);
  }

  window.addEventListener("load", function () {
    setTimeout(inject, 200);
  });
})();