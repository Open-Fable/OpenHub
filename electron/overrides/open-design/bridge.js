/*
 * OpenHub → Open Design — sidebar trigger remover
 * Cache le bouton sidebar trigger (inutile dans OpenHub)
 * via MutationObserver pour les SPA qui réinjectent le DOM.
 */
(function () {
  if (window.__OPENHUB_DESIGN_BRIDGE_INJECTED__) return;
  window.__OPENHUB_DESIGN_BRIDGE_INJECTED__ = true;

  var SIDEBAR_TRIGGER_SELECTOR = [
    "[data-sidebar='trigger']",
    "[data-slot='sidebar-trigger']",
    "button[data-sidebar='trigger']",
  ].join(",");

  function hideTrigger() {
    var els = document.querySelectorAll(SIDEBAR_TRIGGER_SELECTOR);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
      el.setAttribute("hidden", "");
    }
  }

  hideTrigger();

  var observer = new MutationObserver(function () {
    hideTrigger();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
