/* execution.js — Orchestration execution, status, console, progress */

var orchLogLines = [];
var orchUnsubscribe = null;
var orchResults = {};

function clearOrchConsole() {
  orchLogLines = [];
  var el = document.getElementById("orchConsole");
  el.innerHTML = '<span class="console-info">Console d\'orchestration prête.</span>';
}

function appendOrchLog(text, type) {
  var el = document.getElementById("orchConsole");
  var line = document.createElement("div");
  line.className = "console-" + (type || "chunk");
  line.textContent = text;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

function showNodeResult() {
  var viewer = document.getElementById("orchResultViewer");
  if (!selectedNodeId || !orchResults[selectedNodeId]) {
    viewer.innerHTML =
      '<div class="orch-result-empty">Aucun résultat pour le moment.</div>';
    return;
  }
  viewer.textContent = orchResults[selectedNodeId];
}

function showTopbarProgress(show) {
  document.getElementById("topbarProgress").style.display = show ? "flex" : "none";
}

function updateTopbarProgress(current, total) {
  document.getElementById("topbarProgressText").textContent = current + "/" + total;
  document.getElementById("topbarProgressFill").style.width =
    (current / total) * 100 + "%";
}

function startOrchestration() {
  var activeOrch = projects.find(function (p) {
    return p.id === selectedOrchestratorId;
  });
  if (!activeOrch) {
    showToast("Aucun orchestrateur sélectionné.", "error");
    return;
  }
  var task = document.getElementById("sharedTaskText")
    ? document.getElementById("sharedTaskText").value.trim()
    : (activeOrch.task || "").trim();
  if (!task) {
    showToast("Définis d'abord une tâche globale.", "error");
    return;
  }
  var linked = projects.filter(function (p) {
    return (activeOrch.linked || []).includes(p.id);
  });
  if (linked.length === 0) {
    showToast("Aucun agent lié au workflow.", "error");
    return;
  }
  var emptyTask = linked.filter(function (p) {
    return (
      !(p.task || "").trim() &&
      !(activeOrch.orchSettings && activeOrch.orchSettings.autoDistribute)
    );
  });
  if (emptyTask.length > 0) {
    showToast(
      "Agents sans tâche : " +
        emptyTask
          .map(function (p) {
            return p.name;
          })
          .join(", "),
      "warning",
    );
    return;
  }
  var noModel = linked.filter(function (p) {
    return !p.model && !activeOrch.model;
  });
  if (noModel.length > 0) {
    showToast(
      "Aucun modèle défini pour : " +
        noModel
          .map(function (p) {
            return p.name;
          })
          .join(", "),
      "error",
    );
    return;
  }
  clearOrchConsole();
  orchResults = {};
  showTopbarProgress(true);
  document.getElementById("btnExecuteOrch").style.display = "none";
  document.getElementById("btnStopOrch").style.display = "inline-flex";
  appendOrchLog("Lancement de l'orchestration...", "info");
  openDetailWorkflow();
  var consoleAcc = document.getElementById("consoleAccordion");
  if (consoleAcc) consoleAcc.open = true;
  if (orchUnsubscribe) orchUnsubscribe();
  orchUnsubscribe = window.openhub.onOrchestrationStatus(function (data) {
    if (data.chunk) appendOrchLog(data.chunk);
    if (data.result) orchResults[data.projectId] = data.result;
    if (data.progress) {
      updateTopbarProgress(data.progress.current, data.progress.total);
    }
    if (data.status === "done") appendOrchLog("✓ " + (data.task || "Terminé"), "done");
    if (data.status === "error") appendOrchLog("✗ " + (data.error || "Erreur"), "error");
    if (data.status === "skipped") appendOrchLog("— Ignoré", "skip");
    if (
      data.projectId === selectedOrchestratorId &&
      (data.status === "done" || data.status === "error")
    ) {
      showTopbarProgress(false);
      document.getElementById("btnExecuteOrch").style.display = "inline-flex";
      document.getElementById("btnStopOrch").style.display = "none";
      if (data.status === "done")
        appendOrchLog("✓ Orchestration terminée avec succès !", "done");
      else appendOrchLog("✗ Orchestration terminée sur erreur.", "error");
    }
  });
  window.openhub.executeOrchestration(selectedOrchestratorId, task).catch(function () {
    showTopbarProgress(false);
    document.getElementById("btnExecuteOrch").style.display = "inline-flex";
    document.getElementById("btnStopOrch").style.display = "none";
  });
}

function initExecution() {
  document.getElementById("btnExecuteOrch").onclick = startOrchestration;

  document.getElementById("btnStopOrch").onclick = function () {
    if (window.openhub.cancelOrchestration) {
      window.openhub.cancelOrchestration();
      appendOrchLog("Orchestration arrêtée par l'utilisateur.", "error");
      showTopbarProgress(false);
      document.getElementById("btnExecuteOrch").style.display = "inline-flex";
      document.getElementById("btnStopOrch").style.display = "none";
    }
  };

  if (window.openhub.onOrchestrationStatus) {
    window.openhub.onOrchestrationStatus(function (data) {
      var node = projects.find(function (p) {
        return p.id === data.projectId;
      });
      if (node) {
        node.status = data.status;
        if (data.task) node.task = data.task;
        var nodeCard = document.querySelector('.node-card[data-id="' + node.id + '"]');
        if (nodeCard) {
          nodeCard.className =
            "node-card " +
            (node.id === selectedNodeId ? "node-card--selected" : "") +
            " node-card--" +
            data.status;
          var statusLabel = "En attente";
          var statusClass = "status-dot--idle";
          if (data.status === "running") {
            statusLabel = "En cours";
            statusClass = "status-dot--running";
          } else if (data.status === "done") {
            statusLabel = "Terminé";
            statusClass = "status-dot--done";
          } else if (data.status === "error") {
            statusLabel = "Erreur";
            statusClass = "status-dot--error";
          } else if (data.status === "warning") {
            statusLabel = "Attention";
            statusClass = "status-dot--warning";
          } else if (data.status === "skipped") {
            statusLabel = "Ignoré";
            statusClass = "status-dot--skipped";
          }
          nodeCard.querySelector(".node-card-status span:last-child").textContent =
            statusLabel;
          nodeCard.querySelector(".status-dot").className = "status-dot " + statusClass;
        }
        drawConnections();
      }
      if (
        data.projectId === selectedOrchestratorId &&
        (data.status === "done" || data.status === "error")
      ) {
        document.getElementById("btnExecuteOrch").disabled = false;
        isExecuting = false;
        showToast(
          data.status === "done"
            ? "Orchestration terminée avec succès"
            : "Orchestration arrêtée sur erreur",
          data.status === "done" ? "success" : "error",
        );
      }
    });
  }
}
