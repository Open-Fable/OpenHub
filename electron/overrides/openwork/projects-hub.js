(function () {
  "use strict";
  if (window.__OH_PROJECTS_HUB_V2__) return;
  window.__OH_PROJECTS_HUB_V2__ = true;

  const hub = window.openhub;
  if (!hub) return;

  let selectMode = false;
  const selectedIds = new Set();
  let cachedProjects = [];
  let orchSectionOpen = false;

  // ── Inline i18n (webview has no runtime) ──
  let lang = (hub && hub.language) || "fr";
  const DICT = {
    fr: {
      projects: "Projets",
      select: "Sélectionner",
      newProject: "Nouveau projet",
      close: "Fermer",
      nSelected: "{n} sélectionné",
      nSelectedPlural: "{n} sélectionnés",
      cancel: "Annuler",
      deleteN: "Supprimer ({n})",
      back: "← Retour",
      newChat: "Nouveau chat",
      conversations: "Conversations",
      deleteProject: "Supprimer le projet",
      instructions: "Instructions",
      instructionsAria: "Instructions du projet",
      save: "Enregistrer",
      files: "Fichiers",
      filesHint:
        "Ajoutez des fichiers via l'interface OpenWork habituelle pour ce projet.",
      confirmDeleteN: "Supprimer {n} projet définitivement ?",
      confirmDeleteNPlural: "Supprimer {n} projets définitivement ?",
      instructionsSaved: "Instructions enregistrées",
      saveError: "Échec de l'enregistrement des instructions : {err}",
      type: "Type : {v}",
      lastModified: "Dernière modif : {v}",
      orchProjects: "Projets de l'orchestrateur",
      noProjects: "Aucun projet trouvé.",
      noPersonal: "Aucun projet personnel.",
      detailChatHint: "Utilisez le bouton Nouveau Chat pour démarrer dans ce contexte.",
      unlinkFolder: "Dissocier le dossier",
      loading: "Chargement...",
      confirmUnlink:
        "Voulez-vous dissocier ce dossier du projet ? (Les fichiers ne seront pas supprimés du disque)",
      noFiles: "Aucun fichier trouvé dans le dossier lié.",
      filesError: "Erreur lors du chargement des fichiers.",
      confirmDeleteFile: 'Supprimer définitivement le fichier "{name}" ?',
      confirmDeleteDir: 'Supprimer définitivement le dossier "{name}" ?',
      deleteError: "Erreur lors de la suppression : {err}",
      noFolder: "Aucun dossier lié à ce projet.",
      linkFolder: "Lier un dossier maintenant",
      orchestrator: "orchestrateur",
      projet: "projet",
      confirmDeleteProject: 'Supprimer définitivement le projet "{name}" ?',
    },
    en: {
      projects: "Projects",
      select: "Select",
      newProject: "New project",
      close: "Close",
      nSelected: "{n} selected",
      nSelectedPlural: "{n} selected",
      cancel: "Cancel",
      deleteN: "Delete ({n})",
      back: "← Back",
      newChat: "New chat",
      conversations: "Conversations",
      deleteProject: "Delete project",
      instructions: "Instructions",
      instructionsAria: "Project instructions",
      save: "Save",
      files: "Files",
      filesHint: "Add files through the regular OpenWork interface for this project.",
      confirmDeleteN: "Permanently delete {n} project?",
      confirmDeleteNPlural: "Permanently delete {n} projects?",
      instructionsSaved: "Instructions saved",
      saveError: "Failed to save instructions: {err}",
      type: "Type: {v}",
      lastModified: "Last modified: {v}",
      orchProjects: "Orchestrator projects",
      noProjects: "No projects found.",
      noPersonal: "No personal projects.",
      detailChatHint: "Use the New Chat button to start in this context.",
      unlinkFolder: "Unlink folder",
      loading: "Loading...",
      confirmUnlink:
        "Unlink this folder from the project? (Files will not be deleted from disk)",
      noFiles: "No files found in the linked folder.",
      filesError: "Error loading files.",
      confirmDeleteFile: 'Permanently delete the file "{name}"?',
      confirmDeleteDir: 'Permanently delete the folder "{name}"?',
      deleteError: "Delete error: {err}",
      noFolder: "No folder linked to this project.",
      linkFolder: "Link a folder now",
      orchestrator: "orchestrator",
      projet: "project",
      confirmDeleteProject: 'Permanently delete the project "{name}"?',
    },
  };
  function t(key, vars) {
    var str = (DICT[lang] || DICT.fr)[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return str;
  }

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    // Échappe aussi les guillemets : div.innerHTML ne les encode pas, donc une
    // valeur réinjectée dans un attribut HTML pourrait s'en échapper (XSS stocké).
    // Cohérent avec le helper durci de projects.js.
    return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Un projet "orchestrateur" (agent de workflow, nœud de canvas ou sous-agent généré)
  // possède toujours une empreinte qu'un projet autonome de Work n'a jamais : le flag
  // generated, un type d'agent, ou des coordonnées de canvas.
  function isOrchestratorProject(p) {
    return (
      p.generated === true ||
      (typeof p.type === "string" && p.type.length > 0) ||
      typeof p.x === "number"
    );
  }

  // ── HTML Structure ──
  const overlay = document.createElement("div");
  overlay.id = "oh-projects-hub-overlay";
  overlay.innerHTML = `
        <header class="oh-hub-header">
            <div class="oh-hub-title">${t("projects")}</div>
            <div id="oh-hub-default-actions" style="display: flex; gap: 12px;">
                <button class="oh-btn-ghost" id="oh-select-mode-btn">${t("select")}</button>
                <button class="oh-btn-primary" id="oh-new-project">${t("newProject")}</button>
                <button class="oh-btn-ghost" id="oh-close-hub">${t("close")}</button>
            </div>
            <div id="oh-hub-select-actions" style="display: none; gap: 12px; align-items: center;">
                <span id="oh-select-count" style="font-size:13px; color: var(--text-muted);">${t("nSelected", { n: 0 })}</span>
                <button class="oh-btn-ghost" id="oh-cancel-select">${t("cancel")}</button>
                <button class="oh-btn oh-btn-danger" id="oh-delete-selected-btn">${t("deleteN", { n: 0 })}</button>
            </div>
        </header>
        <div class="oh-hub-grid" id="oh-hub-grid"></div>
    `;

  const detailView = document.createElement("div");
  detailView.id = "oh-project-detail-view";
  detailView.innerHTML = `
        <header class="oh-hub-header">
            <div class="oh-hub-title">
                <button class="oh-btn-ghost" id="oh-back-to-hub">${t("back")}</button>
                <span id="oh-detail-name"></span>
            </div>
        </header>
        <div class="oh-detail-body">
            <aside class="oh-detail-sidebar">
                <div style="padding: 20px;">
                    <button class="oh-btn-primary" style="width: 100%" id="oh-new-chat-in-proj">${t("newChat")}</button>
                </div>
                <div id="oh-detail-convs-label" style="font-size: 11px; text-transform: uppercase; color: #666666; padding: 0 20px 10px; font-weight: 600;">${t("conversations")}</div>
                <div id="oh-detail-convs" style="flex: 1; overflow-y: auto; padding: 0 12px;"></div>
                <div style="padding: 20px; border-top: 1px solid #1f1f1f;">
                    <button class="oh-btn oh-btn-danger" style="width: 100%" id="oh-delete-project-btn">${t("deleteProject")}</button>
                </div>
            </aside>
            <main class="oh-detail-main">
                <div class="oh-context-grid">
                    <div class="oh-panel">
                        <div id="oh-detail-instr-label" style="font-weight: 600; margin-bottom: 8px;">${t("instructions")}</div>
                        <textarea class="oh-textarea" id="oh-detail-instructions" aria-label="${t("instructionsAria")}" maxlength="8000"></textarea>
                        <div style="margin-top: 16px; text-align: right;">
                            <button class="oh-btn-primary" id="oh-save-instructions">${t("save")}</button>
                        </div>
                    </div>
                    <div class="oh-panel">
                        <div id="oh-detail-files-label" style="font-weight: 600; margin-bottom: 8px;">${t("files")}</div>
                        <div id="oh-detail-files" style="color: #666666; font-size: 13px;">
                            ${t("filesHint")}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

  document.body.appendChild(overlay);
  document.body.appendChild(detailView);

  // ── Select Mode Helpers ──
  function enterSelectMode() {
    selectMode = true;
    selectedIds.clear();
    document.getElementById("oh-hub-default-actions").style.display = "none";
    document.getElementById("oh-hub-select-actions").style.display = "flex";
    renderGrid();
  }

  function exitSelectMode() {
    selectMode = false;
    selectedIds.clear();
    document.getElementById("oh-hub-default-actions").style.display = "flex";
    document.getElementById("oh-hub-select-actions").style.display = "none";
    renderGrid();
  }

  function toggleCardSelect(id) {
    if (selectedIds.has(id)) {
      selectedIds.delete(id);
    } else {
      selectedIds.add(id);
    }
    const card = document.getElementById("oh-card-" + id);
    if (card) card.classList.toggle("oh-card-selected", selectedIds.has(id));
    const n = selectedIds.size;
    const countEl = document.getElementById("oh-select-count");
    const deleteBtn = document.getElementById("oh-delete-selected-btn");
    if (countEl)
      countEl.textContent = t(n > 1 ? "nSelectedPlural" : "nSelected", { n: n });
    if (deleteBtn) deleteBtn.textContent = t("deleteN", { n: n });
  }

  // ── Event Delegation ──
  document.addEventListener("click", async (e) => {
    const target = e.target;

    // Enter select mode
    if (target.id === "oh-select-mode-btn" || target.closest("#oh-select-mode-btn")) {
      enterSelectMode();
    }

    // Cancel select mode
    if (target.id === "oh-cancel-select" || target.closest("#oh-cancel-select")) {
      exitSelectMode();
    }

    // Delete selected
    if (
      target.id === "oh-delete-selected-btn" ||
      target.closest("#oh-delete-selected-btn")
    ) {
      const n = selectedIds.size;
      if (n === 0) return;
      if (!confirm(t(n > 1 ? "confirmDeleteNPlural" : "confirmDeleteN", { n: n })))
        return;
      const ids = Array.from(selectedIds);
      for (const id of ids) {
        await hub.deleteProject(id);
      }
      exitSelectMode();
      showHub();
    }

    // Back to hub
    if (target.id === "oh-back-to-hub" || target.closest("#oh-back-to-hub")) {
      detailView.classList.remove("oh-visible");
      overlay.classList.add("oh-visible");
    }

    // Close hub
    if (target.id === "oh-close-hub" || target.closest("#oh-close-hub")) {
      overlay.classList.remove("oh-visible");
    }

    // Save instructions
    if (target.id === "oh-save-instructions" || target.closest("#oh-save-instructions")) {
      const id = detailView.dataset.projectId;
      const projects = await hub.getProjects();
      const p = projects.find((x) => x.id === id);
      if (p) {
        p.instructions = document.getElementById("oh-detail-instructions").value;
        try {
          await hub.saveProject(p);
          alert(t("instructionsSaved"));
        } catch (err) {
          alert(t("saveError", { err: err && err.message ? err.message : "?" }));
        }
      }
    }

    // New chat in project
    if (target.id === "oh-new-chat-in-proj" || target.closest("#oh-new-chat-in-proj")) {
      const id = detailView.dataset.projectId;
      await hub.setActiveProject(id);
      const nwBtn =
        document.querySelector('[data-testid="new-chat-button"]') ||
        document.querySelector('button[aria-label*="New Chat"]') ||
        document.querySelector('button[aria-label*="Nouveau Chat"]');
      if (nwBtn) nwBtn.click();
      detailView.classList.remove("oh-visible");
      overlay.classList.remove("oh-visible");
    }

    // Nouveau projet (FIX: use modal instead of prompt)
    if (target.id === "oh-new-project") {
      if (window.__OH_OPEN_MODAL) {
        window.__OH_OPEN_MODAL(null);
      }
    }

    // Delete project
    if (
      target.id === "oh-delete-project-btn" ||
      target.closest("#oh-delete-project-btn")
    ) {
      const id = detailView.dataset.projectId;
      const projects = await hub.getProjects();
      const p = projects.find((x) => x.id === id);
      if (p && confirm(t("confirmDeleteProject", { name: p.name }))) {
        await hub.deleteProject(id);
        detailView.classList.remove("oh-visible");
        showHub();
      }
    }
  });

  // ── Logic ──
  const ORCH_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 6 9 6 9-6"/><path d="M3 10v6l9 6 9-6v-6"/><path d="m3 10 9 6 9-6"/></svg>';
  const PROJECT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>';

  function buildCard(p) {
    const card = document.createElement("div");
    card.className =
      "oh-project-card" + (selectedIds.has(p.id) ? " oh-card-selected" : "");
    card.id = "oh-card-" + p.id;

    const isOrch = isOrchestratorProject(p);
    const icon = isOrch ? ORCH_ICON : PROJECT_ICON;
    const type = p.type || (isOrch ? t("orchestrator") : t("projet"));
    const date = new Date(p.updatedAt || Date.now()).toLocaleDateString(
      lang === "fr" ? "fr-FR" : "en-US",
    );

    const checkboxHtml = selectMode
      ? `<div class="oh-card-checkbox" aria-hidden="true">${selectedIds.has(p.id) ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>' : ""}</div>`
      : "";

    card.innerHTML = `
        ${checkboxHtml}
        <div class="oh-project-card-top">
            <div class="oh-project-card-icon-wrap" data-type="${isOrch ? "orchestrator" : "code"}">${icon}</div>
            <div class="oh-project-card-name">${escapeHtml(p.name)}</div>
        </div>
        <div class="oh-project-card-meta">
            <div class="oh-project-meta-row">${t("type", { v: escapeHtml(type) })}</div>
            <div class="oh-project-meta-row">${t("lastModified", { v: escapeHtml(date) })}</div>
        </div>
      `;

    card.onclick = (e) => {
      e.stopPropagation();
      if (selectMode) {
        toggleCardSelect(p.id);
      } else {
        showDetail(p);
      }
    };
    return card;
  }

  function buildOrchToggle(count) {
    const toggle = document.createElement("div");
    toggle.className = "oh-gen-toggle";
    toggle.tabIndex = 0;
    toggle.setAttribute("role", "button");
    toggle.setAttribute("aria-expanded", orchSectionOpen ? "true" : "false");
    toggle.setAttribute("aria-label", t("orchProjects"));
    toggle.innerHTML =
      '<svg class="oh-gen-chevron" style="transform:rotate(' +
      (orchSectionOpen ? "0" : "-90") +
      'deg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>' +
      '<span class="oh-gen-label">' +
      t("orchProjects") +
      "</span>" +
      '<span class="oh-gen-count">' +
      count +
      "</span>";
    const onToggle = () => {
      orchSectionOpen = !orchSectionOpen;
      renderGrid();
    };
    toggle.addEventListener("click", onToggle);
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    });
    return toggle;
  }

  function renderGrid() {
    const grid = document.getElementById("oh-hub-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const all = cachedProjects || [];
    const userProjects = all.filter((p) => !isOrchestratorProject(p));
    const orchProjects = all.filter(isOrchestratorProject);

    if (userProjects.length === 0 && orchProjects.length === 0) {
      grid.innerHTML =
        '<div style="grid-column:1/-1; text-align:center; padding:48px; color:#666666;">' +
        t("noProjects") +
        "</div>";
      return;
    }

    if (userProjects.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText =
        "grid-column:1/-1; text-align:center; padding:32px; color:#666666;";
      empty.textContent = t("noPersonal");
      grid.appendChild(empty);
    } else {
      userProjects.forEach((p) => grid.appendChild(buildCard(p)));
    }

    if (orchProjects.length > 0) {
      grid.appendChild(buildOrchToggle(orchProjects.length));
      if (orchSectionOpen) {
        orchProjects.forEach((p) => grid.appendChild(buildCard(p)));
      }
    }
  }

  async function showHub() {
    cachedProjects = await hub.getProjects();
    renderGrid();
    overlay.classList.add("oh-visible");
  }

  async function showDetail(project) {
    detailView.dataset.projectId = project.id;
    document.getElementById("oh-detail-name").textContent = project.name;
    document.getElementById("oh-detail-instructions").value = project.instructions || "";

    const convList = document.getElementById("oh-detail-convs");
    convList.innerHTML =
      '<div style="padding:20px; text-align:center; color:#666666; font-size:12px;">' +
      t("detailChatHint") +
      "</div>";

    // Render files
    const filePanel = document.getElementById("oh-detail-files");
    if (project.path) {
      filePanel.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                    <div style="font-weight: 600;">${t("files")}</div>
                    <button class="oh-btn oh-btn-ghost" id="oh-unlink-folder" style="font-size: 11px; padding: 4px 8px; border: 1px solid var(--border-default);">${t("unlinkFolder")}</button>
                </div>
                <div id="oh-file-list-container"><div style="text-align: center; padding: 20px; color: #666666;">${t("loading")}</div></div>
            `;

      const listContainer = filePanel.querySelector("#oh-file-list-container");

      filePanel.querySelector("#oh-unlink-folder").onclick = async () => {
        if (confirm(t("confirmUnlink"))) {
          const updated = { ...project, path: "" };
          await hub.saveProject(updated);
          showDetail(updated); // Refresh view
          if (window.__OH_REFRESH_HUB) window.__OH_REFRESH_HUB();
        }
      };

      try {
        const files = await hub.getProjectFiles(project.id);
        if (files && files.length > 0) {
          listContainer.innerHTML = "";
          const list = document.createElement("div");
          list.className = "oh-file-list";
          list.style.cssText = "display: flex; flex-direction: column; gap: 4px;";

          files.forEach((f) => {
            const item = document.createElement("div");
            item.className = "oh-file-item";
            item.style.cssText =
              "display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 13px; cursor: pointer; group;";
            item.onmouseover = () => (item.style.background = "rgba(255,255,255,0.06)");
            item.onmouseout = () => (item.style.background = "rgba(255,255,255,0.03)");

            const icon = f.isDirectory ? "📁" : "📄";

            const nameSpan = document.createElement("span");
            nameSpan.style.cssText =
              "flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
            nameSpan.textContent = f.name;
            nameSpan.onclick = () => {
              if (!f.isDirectory && hub.openworkDesktopInvoke) {
                hub.openworkDesktopInvoke("__openPath", f.path);
              }
            };

            const delBtn = document.createElement("button");
            delBtn.innerHTML = "🗑️";
            delBtn.style.cssText =
              "border: none; background: transparent; cursor: pointer; opacity: 0.3; font-size: 14px; padding: 4px; border-radius: 4px;";
            delBtn.onmouseover = (e) => {
              e.stopPropagation();
              delBtn.style.opacity = "1";
              delBtn.style.background = "rgba(239, 68, 68, 0.15)";
            };
            delBtn.onmouseout = () => {
              delBtn.style.opacity = "0.3";
              delBtn.style.background = "transparent";
            };
            delBtn.onclick = async (e) => {
              e.stopPropagation();
              if (
                confirm(
                  t(f.isDirectory ? "confirmDeleteDir" : "confirmDeleteFile", {
                    name: f.name,
                  }),
                )
              ) {
                const res = await hub.deleteProjectFile(project.id, f.path);
                if (res && res.ok) {
                  showDetail(project); // Refresh list
                } else {
                  alert(t("deleteError", { err: res?.error || "?" }));
                }
              }
            };

            item.appendChild(document.createTextNode(icon));
            item.appendChild(nameSpan);
            item.appendChild(delBtn);
            list.appendChild(item);
          });
          listContainer.appendChild(list);
        } else {
          listContainer.innerHTML =
            '<div style="text-align: center; padding: 20px; color: #666666;">' +
            t("noFiles") +
            "</div>";
        }
      } catch {
        listContainer.innerHTML =
          '<div style="text-align: center; padding: 20px; color: #ef4444;">' +
          t("filesError") +
          "</div>";
      }
    } else {
      filePanel.innerHTML = `
                <div style="text-align: center; padding: 32px 20px; color: #666666; font-size: 13px; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                    <span>${t("noFolder")}</span>
                    <button class="oh-btn-primary" id="oh-link-folder-now" style="padding: 10px 24px; height: auto; font-weight: 600; font-size: 14px;">${t("linkFolder")}</button>
                </div>
            `;
      filePanel.querySelector("#oh-link-folder-now").onclick = () => {
        if (window.__OH_OPEN_MODAL) window.__OH_OPEN_MODAL(project);
      };
    }

    detailView.classList.add("oh-visible");
  }

  function updateStaticTexts() {
    var el;
    el = overlay.querySelector(".oh-hub-title");
    if (el) el.textContent = t("projects");
    el = document.getElementById("oh-select-mode-btn");
    if (el) el.textContent = t("select");
    el = document.getElementById("oh-new-project");
    if (el) el.textContent = t("newProject");
    el = document.getElementById("oh-close-hub");
    if (el) el.textContent = t("close");
    el = document.getElementById("oh-select-count");
    if (el) el.textContent = t("nSelected", { n: 0 });
    el = document.getElementById("oh-cancel-select");
    if (el) el.textContent = t("cancel");
    el = document.getElementById("oh-delete-selected-btn");
    if (el) el.textContent = t("deleteN", { n: 0 });
    el = document.getElementById("oh-back-to-hub");
    if (el) el.textContent = t("back");
    el = document.getElementById("oh-new-chat-in-proj");
    if (el) el.textContent = t("newChat");
    el = document.getElementById("oh-detail-convs-label");
    if (el) el.textContent = t("conversations");
    el = document.getElementById("oh-delete-project-btn");
    if (el) el.textContent = t("deleteProject");
    el = document.getElementById("oh-detail-instr-label");
    if (el) el.textContent = t("instructions");
    el = document.getElementById("oh-detail-instructions");
    if (el) el.setAttribute("aria-label", t("instructionsAria"));
    el = document.getElementById("oh-save-instructions");
    if (el) el.textContent = t("save");
    el = document.getElementById("oh-detail-files-label");
    if (el) el.textContent = t("files");
  }

  if (hub.onLanguageChanged) {
    hub.onLanguageChanged(function (newLang) {
      lang = newLang === "en" ? "en" : "fr";
      updateStaticTexts();
      if (selectMode) exitSelectMode();
      if (overlay.classList.contains("oh-visible")) renderGrid();
      if (detailView.classList.contains("oh-visible") && detailView.dataset.projectId) {
        hub.getProjects().then(function (projects) {
          var p = projects.find(function (x) {
            return x.id === detailView.dataset.projectId;
          });
          if (p) showDetail(p);
        });
      }
    });
  }

  window.__OH_SHOW_HUB = showHub;
  window.__OH_REFRESH_HUB = showHub;
})();
