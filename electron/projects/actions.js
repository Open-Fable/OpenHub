/* actions.js — Event delegation dispatcher (CSP: script-src 'self', no inline handlers)
 *
 * Inline on* handlers were removed from projects.html and the rendered HTML in
 * the other modules. Elements now declare a `data-action` (plus optional
 * `data-arg` / `data-arg2`) and the listeners below dispatch to the existing
 * global functions. `closest('[data-action]')` resolves nested handlers to the
 * innermost element, which replaces the old `event.stopPropagation()` calls. */

(function () {
  function el(id) {
    return document.getElementById(id);
  }

  var CLICK_ACTIONS = {
    toggleWfDropdown: function () {
      var dd = el("wfDropdown");
      if (dd) dd.classList.toggle("open");
    },
    switchPanelTab: function (t) {
      switchPanelTab(t.dataset.arg);
    },
    toggleConvDropdown: function (t, e) {
      toggleConvDropdown(e);
    },
    sendChat: function () {
      sendChat();
    },
    focusTaskCard: function () {
      var ta = el("taskCardText");
      if (ta) ta.focus();
    },
    importDemoTemplate: function () {
      importDemoTemplate();
    },
    importWebsiteTemplate: function () {
      importWebsiteTemplate();
    },
    importSEOContentTemplate: function () {
      importSEOContentTemplate();
    },
    closeModal: function (t) {
      closeModal(t.dataset.arg);
    },
    closeManagement: function () {
      closeManagement();
    },
    showAllProjectsModal: function () {
      showAllProjectsModal();
    },
    openNewProjectFromMgmt: function () {
      openNewProjectFromMgmt();
    },
    createWorkflow: function () {
      createWorkflow();
    },
    openManagement: function () {
      openManagement();
    },
    openWorkflowInOrch: function () {
      openWorkflowInOrch();
    },
    toggleMgmtMenu: function (t, e) {
      toggleMgmtMenu(e);
    },
    renameCurrentWorkflow: function () {
      renameCurrentWorkflow();
    },
    deleteCurrentWorkflow: function () {
      deleteCurrentWorkflow();
    },
    linkSelectedProjects: function () {
      linkSelectedProjects();
    },
    deleteSelectedProjects: function () {
      deleteSelectedProjects();
    },
    switchWorkflow: function (t) {
      switchWorkflow(t.dataset.arg);
    },
    selectMgmtWf: function (t) {
      selectMgmtWf(t.dataset.arg);
    },
    switchWorkflowFromMgmt: function (t) {
      switchWorkflowFromMgmt(t.dataset.arg);
    },
    duplicateProjectFromMgmt: function (t) {
      duplicateProjectFromMgmt(t.dataset.arg);
    },
    duplicateProjectFromModal: function (t) {
      duplicateProjectFromModal(t.dataset.arg);
    },
    unlinkProjectFromWf: function (t) {
      unlinkProjectFromWf(t.dataset.arg, t.dataset.arg2);
    },
    linkProjectToWf: function (t) {
      linkProjectToWf(t.dataset.arg, t.dataset.arg2);
    },
    linkProjectToWfAndClose: function (t) {
      linkProjectToWf(t.dataset.arg, t.dataset.arg2);
      closeModal("modal-all-projects");
    },
    pickWfWorkdir: function (t) {
      pickWfWorkdir(t.dataset.arg);
    },
    setAllProjTypeFilter: function (t) {
      setAllProjTypeFilter(t, t.dataset.arg);
    },
    toggleNoWorkflowFilter: function (t) {
      toggleNoWorkflowFilter(t);
    },
  };

  var CHANGE_ACTIONS = {
    onProjectTypeChange: function () {
      onProjectTypeChange();
    },
    toggleProjectSelection: function (t) {
      toggleProjectSelection(t.dataset.arg);
    },
  };

  var INPUT_ACTIONS = {
    filterAvailableProjects: function (t) {
      filterAvailableProjects(t.value);
    },
    filterMgmtProjects: function (t) {
      filterMgmtProjects(t.value);
    },
  };

  function dispatch(map) {
    return function (e) {
      var target = e.target.closest("[data-action]");
      if (!target) return;
      var fn = map[target.dataset.action];
      if (fn) fn(target, e);
    };
  }

  document.addEventListener("click", dispatch(CLICK_ACTIONS));
  document.addEventListener("change", dispatch(CHANGE_ACTIONS));
  document.addEventListener("input", dispatch(INPUT_ACTIONS));
})();
