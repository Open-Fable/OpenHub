/* modals.js — Project modal, templates, suggestions */

function onProjectTypeChange() {
  var type = document.getElementById("projType").value;
  var isOrch = type === "orchestrator";
  document.getElementById("orchAutoSection").style.display = isOrch ? "" : "none";
  document.getElementById("dependencySelectGroup").style.display = isOrch ? "none" : "";
  if (!isOrch) {
    var depList = document.getElementById("dependencyList");
    var activeOrch = projects.find(function (p) {
      return p.id === selectedOrchestratorId;
    });
    var activeWf = workflows.find(function (w) {
      return w.id === activeWorkflowId;
    });
    var linkedIds = activeWf
      ? activeWf.linkedProjectIds || []
      : activeOrch
        ? activeOrch.linked || []
        : [];
    var potentialDeps = projects.filter(function (p) {
      return (
        p.type !== "orchestrator" && (linkedIds.includes(p.id) || p.id === selectedNodeId)
      );
    });
    var editId = document.getElementById("btnSaveProjectConfirm").dataset.editId;
    depList.innerHTML = potentialDeps
      .filter(function (p) {
        return p.id !== editId;
      })
      .map(function (p) {
        return (
          '<label class="checkbox-label"><input type="checkbox" name="depProject" value="' +
          p.id +
          '"> ' +
          escapeHtml(p.name) +
          " (" +
          (p.type || "code").toUpperCase() +
          ")</label>"
        );
      })
      .join("");
    if (depList.innerHTML === "") {
      depList.innerHTML =
        '<div style="font-size:11px;color:var(--text-muted);padding:4px">Aucun autre agent disponible.</div>';
    }
  }
}

async function editProject(id) {
  var p = projects.find(function (proj) {
    return proj.id === id;
  });
  if (!p) return;
  document.getElementById("modalProjectTitle").textContent = t("proj.modal.editAgent");
  document.getElementById("projName").value = p.name || "";
  document.getElementById("projType").value = p.type || "code";
  document.getElementById("projModel").value = p.model || "";
  var projReasoningEl = document.getElementById("projReasoning");
  updateReasoningOptions(projReasoningEl, p.model || "", p.reasoningEffort || "");
  document.getElementById("projInstructions").value = p.instructions || "";
  document.getElementById("projTask").value = p.task || "";
  document.getElementById("projSteps").value =
    p.steps && p.steps.length > 0 ? p.steps.join("\n---\n") : "";
  document.getElementById("chkAutoSteps").checked = p.autoSteps !== false;
  document.getElementById("projPath").value = p.path || "";
  _selectedProjectPath = p.path || "";
  document.getElementById("chkBypassMemory").checked = !!p.bypassMemory;
  if (p.type === "orchestrator" && p.orchSettings) {
    document.getElementById("chkAutoDistribute").checked =
      !!p.orchSettings.autoDistribute;
    document.getElementById("chkCheckCoherence").checked =
      !!p.orchSettings.checkCoherence;
    document.getElementById("chkRelaunchOnError").checked =
      !!p.orchSettings.relaunchOnError;
    document.getElementById("chkAdaptToWeakModel").checked =
      !!p.orchSettings.adaptToWeakModel;
    document.getElementById("inpMaxParallel").value =
      p.orchSettings.maxParallelNodes || 3;
  }
  document.getElementById("btnSaveProjectConfirm").dataset.editId = id;
  onProjectTypeChange();
  if (p.type !== "orchestrator" && p.dependencies) {
    document.querySelectorAll('input[name="depProject"]').forEach(function (chk) {
      chk.checked = p.dependencies.includes(chk.value);
    });
  }
  openModal("modalProject");
}

async function deleteProject(id) {
  return new Promise(function (resolve) {
    var modal = document.getElementById("modalConfirmDelete");
    modal.classList.add("open");
    document.getElementById("confirmDeleteBtn").onclick = async function () {
      modal.classList.remove("open");
      await window.openaxis.deleteProject(id);
      projects.forEach(async function (p) {
        if (p.type === "orchestrator" && p.linked && p.linked.includes(id)) {
          p.linked = p.linked.filter(function (lid) {
            return lid !== id;
          });
          await window.openaxis.saveProject(p);
        }
      });
      showToast(t("proj.toast.agentDeleted"), "success");
      if (selectedOrchestratorId === id) selectedOrchestratorId = null;
      await loadProjects();
      resolve();
    };
    document.getElementById("cancelDeleteBtn").onclick = function () {
      modal.classList.remove("open");
      resolve();
    };
  });
}

async function duplicateProject(id) {
  var p = projects.find(function (proj) {
    return proj.id === id;
  });
  if (!p) return null;
  var copy = Object.assign({}, p, {
    name: p.name + t("proj.duplicate.copySuffix"),
    x: (p.x || 0) + 40,
    y: (p.y || 0) + 40,
  });
  delete copy.id;
  delete copy.createdAt;
  delete copy.updatedAt;
  var saved = await window.openaxis.saveProject(copy);
  await loadProjects();
  showToast(t("proj.toast.agentDuplicated", { name: copy.name }), "success");
  return saved;
}

async function importDemoTemplate() {
  try {
    showToast(t("proj.toast.generatingDemo"), "info");
    var p1 = await window.openaxis.saveProject({
      name: "API Backend — Authentification",
      instructions:
        "You are a senior backend developer specialized in Node.js/TypeScript.\n\nSKILLS:\n- REST architecture, data validation, robust error handling\n- Jest unit tests, 80%+ coverage\n- PostgreSQL, parameterized queries, migrations\n\nRULES:\n- Strict TypeScript, no `any`\n- Functions < 50 lines, files < 400 lines\n- Explicit error handling, no hardcoded secrets\n\nOUTPUT FORMAT:\n- Complete and functional code (no placeholders)\n- Name each file with its relative path\n- Include all necessary imports",
      color: "#0d9488",
      type: "code",
      x: 420,
      y: 120,
      task: "Implement OAuth2 flow with refresh tokens.",
    });
    var p2 = await window.openaxis.saveProject({
      name: "Design System — Composants",
      instructions:
        "You are a senior UI/UX designer expert in design systems.\n\nSKILLS:\n- Design systems, tokens, reusable components\n- WCAG AA accessibility, contrasts, keyboard navigation\n- Modern CSS (variables, grid, flexbox), mobile-first responsive\n\nRULES:\n- CSS variables for colors, sizes, and spacing\n- Accessible components by default\n\nOUTPUT FORMAT:\n- Complete and functional CSS/HTML code\n- Document design tokens\n- Provide variants (hover, focus, disabled)",
      color: "#d97706",
      type: "design",
      x: 420,
      y: 280,
      task: "Create button and input components v1.0.",
    });
    var p3 = await window.openaxis.saveProject({
      name: "Pipeline CI/CD — Déploiement",
      instructions:
        "You are a senior DevOps engineer specialized in CI/CD.\n\nSKILLS:\n- GitHub Actions, YAML workflows, build matrices\n- Cache optimization, automated deployment\n\nRULES:\n- Idempotent and reproducible pipelines\n- Separate lint, test, build, deploy\n- No hardcoded secrets\n\nOUTPUT FORMAT:\n- Complete and valid YAML files\n- Name each file with its path",
      color: "#0d9488",
      type: "work",
      x: 420,
      y: 440,
      task: "Set up the GitHub Actions verification pipeline.",
    });
    var p5 = await window.openaxis.saveProject({
      name: "Tests E2E — Playwright",
      instructions:
        "You are a senior QA engineer specialized in automated testing.\n\nSKILLS:\n- E2E tests with Playwright, robust selectors, assertions\n- Critical flow coverage\n\nRULES:\n- Independent and reproducible tests\n- Stable selectors (data-testid, ARIA roles)\n- Cover happy path AND error cases\n\nOUTPUT FORMAT:\n- Complete test files with imports\n- Name tests descriptively",
      color: "#dc2626",
      type: "code",
      dependencies: [p1.id],
      x: 700,
      y: 120,
      task: "Write E2E tests for login and registration.",
    });
    var p6 = await window.openaxis.saveProject({
      name: "Vérification qualité globale",
      instructions:
        "You are a senior quality verifier.\n\nSKILLS:\n- Code review (security, performance, maintainability)\n- Visual coherence and accessibility verification\n- Specification compliance validation\n\nRULES:\n- Objective and measurable criteria, classified by severity (CRITICAL/WARNING/INFO)\n- Concrete example and proposed fix for each issue\n- Don't invent problems\n\nOUTPUT FORMAT:\n- Structured list with severity, description, and fix\n- Global score out of 100, verdict VALIDATED or REJECTED",
      color: "#0d9488",
      type: "verifier",
      dependencies: [p1.id, p2.id, p3.id, p5.id],
      x: 700,
      y: 360,
      bypassMemory: true,
      task: "Verify generated code, CSS rendering, and tests.",
    });
    var orch = await window.openaxis.saveProject({
      name: "Refonte onboarding",
      instructions: "You are an AI project manager.",
      color: "#0d9488",
      type: "orchestrator",
      linked: [p1.id, p2.id, p3.id, p5.id, p6.id],
      orchSettings: {
        autoDistribute: true,
        checkCoherence: true,
        relaunchOnError: true,
        adaptToWeakModel: false,
      },
      x: 100,
      y: 280,
      task: "Coordinate the complete onboarding redesign.",
    });
    showToast(t("proj.toast.demoCreated"), "success");
    await loadProjects();
    selectOrchestrator(orch.id);
  } catch (err) {
    showToast(t("proj.toast.importError", { msg: err.message }), "error");
  }
}

async function importWebsiteTemplate() {
  try {
    showToast(t("proj.toast.creatingWebsite"), "info");
    var p1 = await window.openaxis.saveProject({
      name: "Styles & Design CSS",
      instructions:
        "You are a senior CSS designer.\n\nSKILLS:\n- Modern CSS (variables, grid, flexbox), mobile-first responsive\n- Brand guides, color palettes, typography\n- CSS animations, smooth transitions\n\nRULES:\n- CSS variables for all design tokens\n- Mobile-first, WCAG AA accessibility\n\nOUTPUT FORMAT:\n- Complete CSS files with defined variables\n- Document the palette and typographic choices",
      color: "#d97706",
      type: "design",
      x: 420,
      y: 120,
      task: "Create a modern brand identity.",
    });
    var p2 = await window.openaxis.saveProject({
      name: "Intégration HTML/JS",
      instructions:
        "You are a senior frontend developer.\n\nSKILLS:\n- Semantic HTML5, CSS integration, JavaScript vanilla/framework\n- Responsive design, performance optimization\n- Basic SEO (meta tags, heading structure, alt text)\n\nRULES:\n- Semantic and valid HTML\n- Clean, indented code without redundancy\n- Faithful integration to designs\n\nOUTPUT FORMAT:\n- Complete and functional HTML/JS files\n- Name each file with its relative path",
      color: "#0d9488",
      type: "code",
      dependencies: [p1.id],
      x: 700,
      y: 120,
      task: "Create the HTML5 site skeleton.",
    });
    var p3 = await window.openaxis.saveProject({
      name: "Vérificateur Accessibilité & RGPD",
      instructions:
        "You are a senior web compliance expert.\n\nSKILLS:\n- WCAG 2.1 AA accessibility, audit and remediation\n- GDPR compliance (cookie banner, privacy policy)\n- HTML/CSS validation, web performance\n\nRULES:\n- Objective and measurable criteria\n- Classify by severity (CRITICAL/WARNING/INFO)\n- Propose a fix for each issue\n\nOUTPUT FORMAT:\n- Structured report with issue list\n- Compliance score, verdict COMPLIANT or NON-COMPLIANT",
      color: "#0d9488",
      type: "verifier",
      dependencies: [p2.id],
      x: 700,
      y: 360,
      bypassMemory: true,
      task: "Verify WCAG accessibility of the code.",
    });
    var orch = await window.openaxis.saveProject({
      name: "Site Web Vitrine",
      instructions:
        "You are a senior web project coordinator.\n\nSKILLS:\n- Task decomposition, inter-agent coordination\n- Dependency and priority management\n\nRULES:\n- Each subtask = one verifiable deliverable\n- Specify goal, constraints, format, and success criteria",
      color: "#0d9488",
      type: "orchestrator",
      linked: [p1.id, p2.id, p3.id],
      orchSettings: {
        autoDistribute: true,
        checkCoherence: true,
        relaunchOnError: true,
        adaptToWeakModel: false,
      },
      x: 100,
      y: 240,
      task: "Create a responsive showcase website.",
    });
    showToast(t("proj.toast.websiteCreated"), "success");
    await loadProjects();
    selectOrchestrator(orch.id);
  } catch (err) {
    showToast(t("proj.toast.importError", { msg: err.message }), "error");
  }
}

async function importSEOContentTemplate() {
  try {
    showToast(t("proj.toast.creatingSeo"), "info");
    var p1 = await window.openaxis.saveProject({
      name: "Rédaction de l'article (FR)",
      instructions:
        "You are a senior professional web copywriter.\n\nSKILLS:\n- SEO writing, H1-H6 structure, internal linking\n- Editorial tone adapted to the target audience, storytelling\n- Keyword density optimization without over-optimization\n\nRULES:\n- Structured articles (introduction, body, conclusion)\n- Short paragraphs (3-4 sentences max)\n- Include meta-title and meta-description\n\nOUTPUT FORMAT:\n- Complete article in markdown with H1-H6 markup\n- Meta-title (< 60 chars) and meta-description (< 160 chars) in header",
      color: "#0d9488",
      type: "work",
      x: 420,
      y: 120,
      task: "Rédiger un article complet d'environ 800 mots en français.",
    });
    var p2 = await window.openaxis.saveProject({
      name: "Traduction Anglaise (EN)",
      instructions:
        "You are a professional bilingual French-English translator.\n\nSKILLS:\n- Literary and technical translation, cultural adaptation\n- Tone, style, and SEO structure preservation\n- Localization (date formats, currency, idiomatic expressions)\n\nRULES:\n- Translate faithfully without reformulating the meaning\n- Preserve H1-H6 structure and markdown formatting\n- Adapt meta-title/description for the target market\n\nOUTPUT FORMAT:\n- Complete translated text in markdown\n- Translated meta-title and meta-description in header",
      color: "#0d9488",
      type: "work",
      dependencies: [p1.id],
      x: 700,
      y: 120,
      task: "Accurately translate the generated article into English.",
    });
    var p3 = await window.openaxis.saveProject({
      name: "Audit & Optimisation SEO",
      instructions:
        "You are a senior SEO expert.\n\nSKILLS:\n- On-page SEO audit (titles, metas, density, linking)\n- Keyword analysis, search intent\n- Technical optimization (speed, mobile, structured data)\n\nRULES:\n- Objective and measurable criteria\n- Actionable recommendations with priority\n- Don't over-optimize at the expense of readability\n\nOUTPUT FORMAT:\n- Structured report with per-criterion score\n- Recommendation list ranked by impact",
      color: "#0d9488",
      type: "verifier",
      dependencies: [p1.id],
      x: 700,
      y: 360,
      bypassMemory: true,
      task: "Verify strategic keyword density.",
    });
    var orch = await window.openaxis.saveProject({
      name: "Campagne Contenu SEO",
      instructions:
        "You are a senior editorial manager.\n\nSKILLS:\n- Content strategy, editorial calendar\n- Writing/translation/SEO coordination\n- Editorial quality control\n\nRULES:\n- Each subtask = one verifiable deliverable\n- Specify goal, constraints, format, and success criteria",
      color: "#0d9488",
      type: "orchestrator",
      linked: [p1.id, p2.id, p3.id],
      orchSettings: {
        autoDistribute: true,
        checkCoherence: true,
        relaunchOnError: true,
        adaptToWeakModel: false,
      },
      x: 100,
      y: 240,
      task: "Write a complete SEO-optimized blog article.",
    });
    showToast(t("proj.toast.seoCreated"), "success");
    await loadProjects();
    selectOrchestrator(orch.id);
  } catch (err) {
    showToast(t("proj.toast.importError", { msg: err.message }), "error");
  }
}

async function importSimpleOrchestrator() {
  try {
    showToast(t("proj.toast.creatingOrch"), "info");
    var orch = await window.openaxis.saveProject({
      name: "Mon Orchestrateur",
      instructions:
        "You are a senior AI project coordinator.\n\nSKILLS:\n- Breaking down complex tasks into autonomous subtasks\n- Inter-agent coordination, dependency management\n- Global deliverable coherence verification\n\nRULES:\n- Each subtask = one verifiable deliverable by a single agent\n- Specify goal, constraints, format, and success criteria\n- Detect contradictions and overlaps between agents",
      color: "#0d9488",
      type: "orchestrator",
      linked: [],
      orchSettings: {
        autoDistribute: true,
        checkCoherence: true,
        relaunchOnError: true,
        adaptToWeakModel: false,
      },
      x: 100,
      y: 240,
      task: "Define the overall workflow goal here...",
    });
    showToast(t("proj.toast.orchCreated"), "success");
    await loadProjects();
    selectOrchestrator(orch.id);
  } catch (err) {
    showToast(t("proj.toast.createError", { msg: err.message }), "error");
  }
}

async function applyTaskSuggestion(text) {
  var activeOrch = projects.find(function (p) {
    return p.id === selectedOrchestratorId;
  });
  if (!activeOrch || activeOrch.type !== "orchestrator") {
    showToast(t("proj.toast.creatingOrchForSuggestion"), "info");
    await importSimpleOrchestrator();
    activeOrch = projects.find(function (p) {
      return p.id === selectedOrchestratorId;
    });
  }
  if (activeOrch) {
    activeOrch.task = text;
    await window.openaxis.saveProject(activeOrch);
    document.getElementById("sharedTaskText").value = text;
    showToast(t("proj.toast.suggestionApplied"), "success");
    updateDetailPanel();
  }
}

function confirmLoadTemplate() {
  var activeOrch = projects.find(function (p) {
    return p.id === selectedOrchestratorId;
  });
  var hasProjects = activeOrch && (activeOrch.linked || []).length > 0;
  if (hasProjects && !confirm(t("proj.confirm.loadTemplate"))) return false;
  return true;
}

function resetProjectModal() {
  document.getElementById("modalProjectTitle").textContent = t("proj.modal.newAgent");
  document.getElementById("projName").value = "";
  document.getElementById("projType").value = "code";
  document.getElementById("projModel").value = "";
  updateReasoningOptions(document.getElementById("projReasoning"), "", "");
  document.getElementById("projInstructions").value = "";
  document.getElementById("projTask").value = "";
  document.getElementById("projSteps").value = "";
  document.getElementById("chkAutoSteps").checked = true;
  document.getElementById("projPath").value = "";
  _selectedProjectPath = "";
  document.getElementById("chkBypassMemory").checked = false;
  document.getElementById("chkAutoDistribute").checked = true;
  document.getElementById("chkCheckCoherence").checked = true;
  document.getElementById("chkRelaunchOnError").checked = true;
  document.getElementById("chkAdaptToWeakModel").checked = false;
  document.getElementById("inpMaxParallel").value = 3;
  delete document.getElementById("btnSaveProjectConfirm").dataset.editId;
  onProjectTypeChange();
}

async function runTemplateImport(importFn) {
  var grid = document.querySelector(".templates-grid");
  if (grid) grid.classList.add("loading");
  try {
    await importFn();
  } finally {
    if (grid) grid.classList.remove("loading");
  }
}

function initModals() {
  var _origImportDemo = importDemoTemplate;
  importDemoTemplate = function () {
    if (confirmLoadTemplate()) runTemplateImport(_origImportDemo);
  };
  var _origImportWebsite = importWebsiteTemplate;
  importWebsiteTemplate = function () {
    if (confirmLoadTemplate()) runTemplateImport(_origImportWebsite);
  };
  var _origImportSEO = importSEOContentTemplate;
  importSEOContentTemplate = function () {
    if (confirmLoadTemplate()) runTemplateImport(_origImportSEO);
  };
  var _origImportSimple = importSimpleOrchestrator;
  importSimpleOrchestrator = function () {
    if (confirmLoadTemplate()) runTemplateImport(_origImportSimple);
  };

  document.getElementById("btnPickPath").onclick = async function () {
    if (window.openaxis.pickProjectPath) {
      var p = await window.openaxis.pickProjectPath();
      if (p) {
        _selectedProjectPath = p;
        document.getElementById("projPath").value = p;
      }
    }
  };

  document.getElementById("projType").onchange = onProjectTypeChange;

  document.getElementById("projModel").onchange = function () {
    var rEl = document.getElementById("projReasoning");
    if (rEl) updateReasoningOptions(rEl, this.value, rEl.value);
  };

  document.getElementById("btnSaveProjectConfirm").onclick = async function () {
    if (this.disabled) return;
    var nameInput = document.getElementById("projName");
    var name = nameInput.value.trim();
    if (!name) {
      nameInput.style.borderColor = "var(--error, #ef4444)";
      nameInput.focus();
      showToast(t("proj.toast.agentNameRequired"), "error");
      return;
    }
    if (name.length > 100) {
      nameInput.style.borderColor = "var(--error, #ef4444)";
      nameInput.focus();
      showToast(t("proj.toast.agentNameTooLong"), "error");
      return;
    }
    nameInput.style.borderColor = "";
    var type = document.getElementById("projType").value;
    var model = document.getElementById("projModel").value;
    var reasoningEffort = document.getElementById("projReasoning").value;
    var instructions = document.getElementById("projInstructions").value;
    var task = document.getElementById("projTask").value;
    var stepsRaw = document.getElementById("projSteps").value.trim();
    var bypassMemory = document.getElementById("chkBypassMemory").checked;
    var editId = this.dataset.editId;
    var steps;
    var autoSteps = document.getElementById("chkAutoSteps").checked;
    if (stepsRaw) {
      var parsed = stepsRaw
        .split(/\n---\n/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      if (parsed.length > 1) steps = parsed;
    }
    var data = {
      name: name,
      type: type,
      model: model,
      reasoningEffort: reasoningEffort || undefined,
      instructions: instructions,
      task: task,
      steps: steps,
      autoSteps: autoSteps,
      path: _selectedProjectPath || undefined,
      bypassMemory: bypassMemory,
    };
    if (editId) data.id = editId;
    if (type === "orchestrator") {
      var parsedParallel = parseInt(document.getElementById("inpMaxParallel").value, 10);
      if (isNaN(parsedParallel)) parsedParallel = 3;
      var maxParallelNodes = Math.min(Math.max(parsedParallel, 1), 4);
      data.orchSettings = {
        autoDistribute: document.getElementById("chkAutoDistribute").checked,
        checkCoherence: document.getElementById("chkCheckCoherence").checked,
        relaunchOnError: document.getElementById("chkRelaunchOnError").checked,
        adaptToWeakModel: document.getElementById("chkAdaptToWeakModel").checked,
        maxParallelNodes: maxParallelNodes,
      };
    } else {
      var checkedDeps = [];
      document
        .querySelectorAll('input[name="depProject"]:checked')
        .forEach(function (chk) {
          checkedDeps.push(chk.value);
        });
      data.dependencies = checkedDeps;
    }
    var saveBtn = document.getElementById("btnSaveProjectConfirm");
    saveBtn.disabled = true;
    try {
      var saved = await window.openaxis.saveProject(data);
      if (!editId && selectedOrchestratorId && type !== "orchestrator") {
        var activeOrch = projects.find(function (p) {
          return p.id === selectedOrchestratorId;
        });
        if (activeOrch) {
          if (!activeOrch.linked) activeOrch.linked = [];
          activeOrch.linked.push(saved.id);
          await window.openaxis.saveProject(activeOrch);
        }
        var activeWf = workflows.find(function (w) {
          return w.id === activeWorkflowId;
        });
        if (activeWf) {
          if (!activeWf.linkedProjectIds) activeWf.linkedProjectIds = [];
          if (!activeWf.linkedProjectIds.includes(saved.id)) {
            activeWf.linkedProjectIds = [].concat(activeWf.linkedProjectIds, [saved.id]);
            await window.openaxis.saveWorkflow(activeWf);
          }
        }
      }
      closeModal("modalProject");
      showToast(
        editId ? t("proj.toast.agentUpdated") : t("proj.toast.agentCreated"),
        "success",
      );
      await loadProjects();
    } catch (err) {
      // Ne jamais avaler l'erreur : le modal reste ouvert et l'utilisateur est prévenu
      showToast(
        editId ? t("proj.toast.agentUpdateFailed") : t("proj.toast.agentCreateFailed"),
        "error",
      );
      console.error("saveProject failed", err);
    } finally {
      saveBtn.disabled = false;
    }
  };

  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeModal(this.dataset.closeModal);
    });
  });
}
