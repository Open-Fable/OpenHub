/* detail.js — Contextual detail panel with accordion views */

var _taskSaveTimer = null;
var _instructionsSaveTimer = null;
var _nodeTaskSaveTimer = null;

function openDetailWorkflow() {
  var detail = document.getElementById("orchestrationDetail");
  var active = projects.find(function (p) {
    return p.id === selectedOrchestratorId;
  });
  if (!active) return;
  detail.style.display = "flex";
  document.getElementById("detailTitle").textContent = "Workflow";
  document.getElementById("detailViewWorkflow").style.display = "flex";
  document.getElementById("detailViewAgent").style.display = "none";
  document.getElementById("sharedTaskText").value = active.task || "";
  document.getElementById("systemInstructionsText").value = active.instructions || "";
  var workdirPath = document.getElementById("orchWorkdirPath");
  if (active.path) {
    workdirPath.textContent = active.path;
    workdirPath.title = active.path;
  } else {
    workdirPath.textContent = "—";
    workdirPath.title = "Aucun dossier défini";
  }
}

function openDetailAgent(nodeId) {
  var node = projects.find(function (p) {
    return p.id === nodeId;
  });
  if (!node) return;
  selectedNodeId = nodeId;
  var detail = document.getElementById("orchestrationDetail");
  detail.style.display = "flex";
  document.getElementById("detailTitle").textContent = node.name || "Agent";
  document.getElementById("detailViewWorkflow").style.display = "none";
  document.getElementById("detailViewAgent").style.display = "flex";
  document.getElementById("lblSelectedNodeTask").textContent = "Tâche : " + node.name;
  document.getElementById("selectedNodeTaskText").value = node.task || "";
  document.getElementById("selectedNodeInstructionsText").value = node.instructions || "";
  if (node.status && node.status !== "idle") {
    document.getElementById("agentStatusSection").style.display = "";
    var statusLabels = {
      running: "En cours",
      done: "Terminé",
      error: "Erreur",
      warning: "Attention",
      skipped: "Ignoré",
    };
    document.getElementById("agentStatusRow").innerHTML =
      '<span class="status-dot status-dot--' +
      node.status +
      '"></span> ' +
      "<span>" +
      (statusLabels[node.status] || node.status) +
      "</span>";
  } else {
    document.getElementById("agentStatusSection").style.display = "none";
  }
  if (orchResults[nodeId]) {
    document.getElementById("orchResultViewer").textContent = orchResults[nodeId];
    document.getElementById("resultAccordion").open = true;
  } else {
    document.getElementById("orchResultViewer").innerHTML =
      '<div class="orch-result-empty">Aucun résultat pour le moment.</div>';
  }
}

function closeDetail() {
  document.getElementById("orchestrationDetail").style.display = "none";
  selectedNodeId = null;
  renderCanvas();
}

function updateDetailPanel() {
  var active = projects.find(function (p) {
    return p.id === selectedOrchestratorId;
  });
  if (!active || active.type !== "orchestrator") {
    document.getElementById("orchestrationDetail").style.display = "none";
    return;
  }
  if (selectedNodeId) {
    openDetailAgent(selectedNodeId);
  }
}

function updateTaskCard() {
  var active = projects.find(function (p) {
    return p.id === selectedOrchestratorId;
  });
  var el = document.getElementById("taskCardText");
  if (!el) return;
  if (active && active.task && active.task.trim()) {
    el.textContent = active.task.trim().substring(0, 120);
  } else {
    el.textContent = "Définis la tâche globale…";
  }
}

function initDetailPanel() {
  document.getElementById("sharedTaskText").oninput = function () {
    var self = this;
    clearTimeout(_taskSaveTimer);
    _taskSaveTimer = setTimeout(function () {
      var active = projects.find(function (p) {
        return p.id === selectedOrchestratorId;
      });
      if (active) {
        active.task = self.value;
        window.openhub.saveProject(active);
        updateTaskCard();
      }
    }, 400);
  };

  document.getElementById("systemInstructionsText").oninput = function () {
    var self = this;
    clearTimeout(_instructionsSaveTimer);
    _instructionsSaveTimer = setTimeout(function () {
      var active = projects.find(function (p) {
        return p.id === selectedOrchestratorId;
      });
      if (active) {
        active.instructions = self.value;
        window.openhub.saveProject(active);
      }
    }, 400);
  };

  document.getElementById("selectedNodeTaskText").oninput = function () {
    var self = this;
    clearTimeout(_nodeTaskSaveTimer);
    _nodeTaskSaveTimer = setTimeout(function () {
      var node = projects.find(function (p) {
        return p.id === selectedNodeId;
      });
      if (node) {
        node.task = self.value;
        window.openhub.saveProject(node);
      }
    }, 400);
  };

  document.getElementById("btnEditSelectedNode").onclick = function () {
    if (selectedNodeId) editProject(selectedNodeId);
  };

  document.getElementById("btnCloseDetail").onclick = closeDetail;

  document.getElementById("btnPickOrchWorkdir").onclick = async function () {
    if (!window.openhub.pickProjectPath) return;
    var p = await window.openhub.pickProjectPath();
    if (!p || !selectedOrchestratorId) return;
    var active = projects.find(function (proj) {
      return proj.id === selectedOrchestratorId;
    });
    if (!active) return;
    active.path = p;
    await window.openhub.saveProject(active);
    document.getElementById("orchWorkdirPath").textContent = p;
    document.getElementById("orchWorkdirPath").title = p;
    showToast("Dossier de travail mis à jour", "success");
  };
}
