/**
 * OpenWork Projects — injects project management UI.
 *
 * Adds a project selector below the workspace header and a modal
 * for creating/editing projects with custom instructions.
 * Active project instructions are injected as system prompts
 * via the proxy layer — this script only handles the UI.
 */
(function () {
  "use strict";
  if (window.__OPENHUB_PROJECTS__) return;
  window.__OPENHUB_PROJECTS__ = true;

  var hub = window.openhub;
  if (!hub || !hub.getProjects) return;

  var state = {
    projects: [],
    activeProject: null,
    dropdownOpen: false,
  };

  // ── API helpers ────────────────────────────────────────────────────────────
  function loadProjects() {
    return Promise.all([hub.getProjects(), hub.getActiveProject()]).then(
      function (results) {
        state.projects = results[0] || [];
        state.activeProject = results[1] || null;
        renderSelector();
      },
    );
  }

  function activateProject(id) {
    return hub.setActiveProject(id).then(function () {
      return loadProjects();
    });
  }

  function saveProjectData(data) {
    return hub.saveProject(data).then(function () {
      return loadProjects();
    });
  }

  function removeProject(id) {
    return hub.deleteProject(id).then(function () {
      return loadProjects();
    });
  }

  // ── Selector ───────────────────────────────────────────────────────────────
  var selectorEl = null;

  function createSelector() {
    var wrapper = document.createElement("div");
    wrapper.id = "oh-project-selector";

    var row = document.createElement("div");
    row.className = "oh-project-row";

    var btn = document.createElement("button");
    btn.id = "oh-project-btn";
    btn.type = "button";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      state.dropdownOpen = !state.dropdownOpen;
      renderSelector();
    });

    var addBtn = document.createElement("button");
    addBtn.id = "oh-project-add";
    addBtn.type = "button";
    addBtn.title = "Nouveau projet";
    addBtn.textContent = "+";
    addBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      state.dropdownOpen = false;
      renderSelector();
      openModal(null);
    });

    row.appendChild(btn);
    row.appendChild(addBtn);

    var dropdown = document.createElement("div");
    dropdown.id = "oh-project-dropdown";

    wrapper.appendChild(row);
    wrapper.appendChild(dropdown);
    selectorEl = wrapper;
    return wrapper;
  }

  function renderSelector() {
    if (!selectorEl) return;
    var btn = selectorEl.querySelector("#oh-project-btn");
    var dropdown = selectorEl.querySelector("#oh-project-dropdown");

    btn.innerHTML = "";
    if (state.activeProject) {
      var dot = document.createElement("span");
      dot.className = "oh-project-dot";
      dot.style.background = state.activeProject.color || "#7c5cfc";
      btn.appendChild(dot);
      var label = document.createElement("span");
      label.className = "oh-project-label";
      label.textContent = state.activeProject.name;
      btn.appendChild(label);
    } else {
      var lbl = document.createElement("span");
      lbl.className = "oh-project-label oh-project-label-muted";
      lbl.textContent = "Projet";
      btn.appendChild(lbl);
    }
    var chevron = document.createElement("span");
    chevron.className = "oh-project-chevron";
    chevron.textContent = state.dropdownOpen ? "▴" : "▾";
    btn.appendChild(chevron);

    dropdown.style.display = state.dropdownOpen ? "block" : "none";
    if (!state.dropdownOpen) return;

    dropdown.innerHTML = "";

    // "No project" option
    var noProject = document.createElement("button");
    noProject.className = "oh-dd-item" + (!state.activeProject ? " oh-dd-active" : "");
    noProject.innerHTML =
      '<span class="oh-dd-item-icon">○</span><span>Aucun projet</span>';
    noProject.addEventListener("click", function () {
      activateProject(null);
      state.dropdownOpen = false;
      renderSelector();
    });
    dropdown.appendChild(noProject);

    if (state.projects.length > 0) {
      var sep = document.createElement("div");
      sep.className = "oh-dd-sep";
      dropdown.appendChild(sep);
    }

    state.projects.forEach(function (p) {
      var item = document.createElement("div");
      item.className =
        "oh-dd-project-row" +
        (state.activeProject && state.activeProject.id === p.id ? " oh-dd-active" : "");

      var selectBtn = document.createElement("button");
      selectBtn.className = "oh-dd-project-select";
      var d = document.createElement("span");
      d.className = "oh-project-dot";
      d.style.background = p.color || "#7c5cfc";
      selectBtn.appendChild(d);
      var n = document.createElement("span");
      n.textContent = p.name;
      selectBtn.appendChild(n);
      selectBtn.addEventListener("click", function () {
        activateProject(p.id);
        state.dropdownOpen = false;
        renderSelector();
      });

      var editBtn = document.createElement("button");
      editBtn.className = "oh-dd-edit-btn";
      editBtn.textContent = "✎";
      editBtn.title = "Modifier";
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        state.dropdownOpen = false;
        renderSelector();
        openModal(p);
      });

      item.appendChild(selectBtn);
      item.appendChild(editBtn);
      dropdown.appendChild(item);
    });

    var sepBottom = document.createElement("div");
    sepBottom.className = "oh-dd-sep";
    dropdown.appendChild(sepBottom);

    var newBtn = document.createElement("button");
    newBtn.className = "oh-dd-item oh-dd-new";
    newBtn.innerHTML =
      '<span class="oh-dd-item-icon">+</span><span>Nouveau projet</span>';
    newBtn.addEventListener("click", function () {
      state.dropdownOpen = false;
      renderSelector();
      openModal(null);
    });
    dropdown.appendChild(newBtn);
  }

  document.addEventListener("click", function (e) {
    if (state.dropdownOpen && selectorEl && !selectorEl.contains(e.target)) {
      state.dropdownOpen = false;
      renderSelector();
    }
  });

  // ── Modal ──────────────────────────────────────────────────────────────────
  var COLORS = [
    "#7c5cfc",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#8b5cf6",
    "#06b6d4",
  ];

  function openModal(project) {
    renderModal(project || null);
  }

  function closeModal() {
    var el = document.getElementById("oh-project-modal-overlay");
    if (el) el.remove();
  }

  function renderModal(editing) {
    closeModal();
    var isEdit = Boolean(editing);

    var overlay = document.createElement("div");
    overlay.id = "oh-project-modal-overlay";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    var modal = document.createElement("div");
    modal.id = "oh-project-modal";

    // Header
    var header = document.createElement("div");
    header.className = "oh-modal-header";
    var title = document.createElement("h2");
    title.textContent = isEdit ? "Modifier le projet" : "Nouveau projet";
    var closeBtn = document.createElement("button");
    closeBtn.className = "oh-modal-close";
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", closeModal);
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Name
    var nameGroup = document.createElement("div");
    nameGroup.className = "oh-modal-field";
    var nameLabel = document.createElement("label");
    nameLabel.textContent = "Nom du projet";
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Ex: Assistant Marketing";
    nameInput.value = editing ? editing.name : "";
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // Color
    var colorGroup = document.createElement("div");
    colorGroup.className = "oh-modal-field";
    var colorLabel = document.createElement("label");
    colorLabel.textContent = "Couleur";
    var colorRow = document.createElement("div");
    colorRow.className = "oh-color-row";
    var selectedColor = editing ? editing.color : COLORS[0];

    COLORS.forEach(function (c) {
      var swatch = document.createElement("button");
      swatch.className =
        "oh-color-swatch" + (c === selectedColor ? " oh-color-selected" : "");
      swatch.style.background = c;
      swatch.type = "button";
      swatch.addEventListener("click", function () {
        selectedColor = c;
        colorRow.querySelectorAll(".oh-color-swatch").forEach(function (s) {
          var bg = s.style.background || s.style.backgroundColor;
          s.classList.toggle("oh-color-selected", bg === c);
        });
      });
      colorRow.appendChild(swatch);
    });
    colorGroup.appendChild(colorLabel);
    colorGroup.appendChild(colorRow);

    // Instructions
    var instrGroup = document.createElement("div");
    instrGroup.className = "oh-modal-field oh-modal-field-grow";
    var instrLabel = document.createElement("label");
    instrLabel.textContent = "Instructions";
    var instrHelp = document.createElement("span");
    instrHelp.className = "oh-field-help";
    instrHelp.textContent =
      "Ajoutées automatiquement comme contexte système à chaque message.";
    var instrTextarea = document.createElement("textarea");
    instrTextarea.placeholder =
      "Ex: Tu es un assistant spécialisé en marketing digital. Réponds en français. Sois concis.";
    instrTextarea.value = editing ? editing.instructions : "";
    instrGroup.appendChild(instrLabel);
    instrGroup.appendChild(instrHelp);
    instrGroup.appendChild(instrTextarea);

    // Footer
    var footer = document.createElement("div");
    footer.className = "oh-modal-footer";

    if (isEdit) {
      var deleteBtn = document.createElement("button");
      deleteBtn.className = "oh-btn oh-btn-danger";
      deleteBtn.textContent = "Supprimer";
      deleteBtn.addEventListener("click", function () {
        removeProject(editing.id);
        closeModal();
      });
      footer.appendChild(deleteBtn);
    }

    var spacer = document.createElement("div");
    spacer.style.flex = "1";
    footer.appendChild(spacer);

    var cancelBtn = document.createElement("button");
    cancelBtn.className = "oh-btn oh-btn-ghost";
    cancelBtn.textContent = "Annuler";
    cancelBtn.addEventListener("click", closeModal);
    footer.appendChild(cancelBtn);

    var saveBtn = document.createElement("button");
    saveBtn.className = "oh-btn oh-btn-primary";
    saveBtn.textContent = isEdit ? "Enregistrer" : "Créer";
    saveBtn.addEventListener("click", function () {
      var name = nameInput.value.trim();
      if (!name) {
        nameInput.style.borderColor = "#ef4444";
        return;
      }
      var data = {
        name: name,
        instructions: instrTextarea.value,
        color: selectedColor,
      };
      if (isEdit) data.id = editing.id;
      saveProjectData(data).then(function () {
        closeModal();
        if (!isEdit) {
          hub.getProjects().then(function (projects) {
            var latest = projects[projects.length - 1];
            if (latest) activateProject(latest.id);
          });
        }
      });
    });
    footer.appendChild(saveBtn);

    modal.appendChild(header);
    modal.appendChild(nameGroup);
    modal.appendChild(colorGroup);
    modal.appendChild(instrGroup);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    nameInput.focus();
  }

  // ── Injection ──────────────────────────────────────────────────────────────
  function tryInject() {
    if (document.getElementById("oh-project-selector")) return true;

    // Insert just before the sidebar-footer ("+ Add workspace")
    var footer = document.querySelector('[data-slot="sidebar-footer"]');
    if (!footer || !footer.parentNode) return false;

    var selector = createSelector();
    footer.parentNode.insertBefore(selector, footer);
    loadProjects();
    return true;
  }

  function ensureInjected() {
    if (!document.getElementById("oh-project-selector")) {
      selectorEl = null;
      tryInject();
    }
  }

  if (!tryInject()) {
    var observer = new MutationObserver(function () {
      if (tryInject()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setInterval(ensureInjected, 1000);

  var lastUrl = location.href;
  setInterval(function () {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      tryInject();
    }
  }, 500);
})();
