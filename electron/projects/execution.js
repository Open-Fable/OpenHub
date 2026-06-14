/* execution.js — Orchestration execution, status, console, progress, history */

var orchLogLines = [];
var orchUnsubscribe = null;
var orchResults = {};
var orchPrompts = {};
var orchNodeStatuses = {};
var orchStartedAt = 0;
var activityLastStatus = {};
var lastRunMeta = null;
var pendingIteration = null;
var lastWorkspaceDir = null;

function clearActivityFeed() {
  var feed = document.getElementById("activityFeed");
  if (!feed) return;
  feed.innerHTML = "";
  activityLastStatus = {};
  var empty = document.getElementById("activityEmpty");
  if (!empty) {
    empty = document.createElement("div");
    empty.className = "activity-empty";
    empty.id = "activityEmpty";
    empty.textContent = "Lance une orchestration pour suivre l'activité ici.";
    feed.appendChild(empty);
  }
}

function formatActivityTime(ts) {
  var d = new Date(ts);
  var h = String(d.getHours()).padStart(2, "0");
  var m = String(d.getMinutes()).padStart(2, "0");
  return h + ":" + m;
}

function getNodeName(projectId) {
  var node = projects.find(function (p) {
    return p.id === projectId;
  });
  return node ? node.name : projectId.substring(0, 8);
}

function buildActivityMessage(data) {
  var name = getNodeName(data.projectId);
  var isOrch = data.projectId === selectedOrchestratorId;

  if (isOrch) {
    if (data.status === "running") {
      var dir = data.workspaceDir || "";
      var dirHint = dir
        ? ' · <span class="activity-path" title="' +
          escapeHtml(dir) +
          '">' +
          escapeHtml(dir) +
          "</span>"
        : "";
      return {
        type: "running",
        text: "L'orchestrateur distribue les taches aux agents" + dirHint,
      };
    }
    if (data.status === "done") return { type: "done", text: "Orchestration terminee" };
    if (data.status === "error")
      return { type: "error", text: "L'orchestration s'est arretee sur une erreur" };
    if (data.status === "warning") {
      var warnText = data.error ? escapeHtml(data.error) : "Avertissement";
      return { type: "warning", text: warnText };
    }
    return null;
  }

  if (data.status === "running" && data.substep) {
    return {
      type: "running",
      text:
        "<strong>" +
        escapeHtml(name) +
        "</strong> — " +
        escapeHtml(data.substep.title) +
        " (" +
        data.substep.current +
        "/" +
        data.substep.total +
        ")",
    };
  }

  if (data.status === "running") {
    var prev = activityLastStatus[data.projectId];
    if (prev === "running" && !data.task && !data.substep) return null;
    var taskHint = data.task ? " — " + escapeHtml(data.task.substring(0, 80)) : "";
    return {
      type: "running",
      text: "<strong>" + escapeHtml(name) + "</strong> demarre" + taskHint,
    };
  }

  if (data.status === "done") {
    return {
      type: "done",
      text: "<strong>" + escapeHtml(name) + "</strong> a termine son travail",
    };
  }

  if (data.status === "error") {
    var errMsg = data.error ? " — " + escapeHtml(data.error.substring(0, 100)) : "";
    return {
      type: "error",
      text: "<strong>" + escapeHtml(name) + "</strong> a rencontre une erreur" + errMsg,
    };
  }

  if (data.status === "warning") {
    var warnDetail = data.error ? " — " + escapeHtml(data.error.substring(0, 160)) : "";
    return {
      type: "warning",
      text:
        "<strong>" + escapeHtml(name) + "</strong> signale un avertissement" + warnDetail,
    };
  }

  if (data.status === "skipped") {
    return {
      type: "info",
      text: "<strong>" + escapeHtml(name) + "</strong> a ete ignore",
    };
  }

  return null;
}

function appendActivityItem(data) {
  var msg = buildActivityMessage(data);
  if (!msg) return;

  var feed = document.getElementById("activityFeed");
  if (!feed) return;
  var empty = document.getElementById("activityEmpty");
  if (empty) empty.remove();

  var item = document.createElement("div");
  item.className = "activity-item activity-item--" + msg.type;

  var icon = "";
  if (msg.type === "running") {
    icon =
      '<svg class="activity-icon activity-icon--spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
  } else if (msg.type === "done") {
    icon =
      '<svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (msg.type === "error") {
    icon =
      '<svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  } else if (msg.type === "warning") {
    icon =
      '<svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  } else {
    icon =
      '<svg class="activity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }

  item.innerHTML =
    '<span class="activity-time">' +
    formatActivityTime(Date.now()) +
    "</span>" +
    icon +
    '<span class="activity-text">' +
    msg.text +
    "</span>";

  feed.appendChild(item);
  activityLastStatus[data.projectId] = data.status;

  var isNearBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 80;
  if (isNearBottom) feed.scrollTop = feed.scrollHeight;
}

function clearOrchConsole() {
  orchLogLines = [];
  var el = document.getElementById("orchConsole");
  el.innerHTML = '<span class="console-info">Console d\'orchestration prête.</span>';
}

function appendOrchLog(text, type) {
  orchLogLines.push(text);
  var el = document.getElementById("orchConsole");
  var line = document.createElement("div");
  line.className = "console-" + (type || "chunk");
  line.textContent = text;
  el.appendChild(line);
  var isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  if (isNearBottom) el.scrollTop = el.scrollHeight;
}

function showNodeResult() {
  var viewer = document.getElementById("orchResultViewer");
  if (!selectedNodeId || !orchResults[selectedNodeId]) {
    viewer.innerHTML =
      "<div class=\"orch-result-empty\">Le résultat s'affichera ici après l'exécution.</div>";
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
    showToast("Crée d'abord un workflow pour lancer une orchestration.", "error");
    return;
  }
  var missionEl = document.getElementById("taskCardText");
  var taskEl = document.getElementById("sharedTaskText");
  var task =
    (missionEl ? missionEl.value.trim() : "") ||
    (taskEl ? taskEl.value.trim() : "") ||
    (activeOrch.task || "").trim();
  if (!task) {
    showToast("Définis d'abord une tâche globale.", "error");
    return;
  }
  var linked = projects.filter(function (p) {
    return (activeOrch.linked || []).includes(p.id);
  });
  if (linked.length === 0) {
    showToast("Lie au moins un agent au workflow avant de lancer.", "error");
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
  clearActivityFeed();
  orchResults = {};
  orchPrompts = {};
  orchNodeStatuses = {};
  orchStartedAt = Date.now();
  showTopbarProgress(true);
  document.getElementById("btnExecuteOrch").style.display = "none";
  document.getElementById("btnStopOrch").style.display = "inline-flex";
  appendOrchLog("Lancement de l'orchestration...", "info");
  switchPanelTab("activity");
  openDetailWorkflow();
  var consoleAcc = document.getElementById("consoleAccordion");
  if (consoleAcc) consoleAcc.open = true;
  if (orchUnsubscribe) orchUnsubscribe();
  orchUnsubscribe = window.openhub.onOrchestrationStatus(function (data) {
    appendActivityItem(data);
    if (data.chunk) appendOrchLog(data.chunk);
    if (data.workspaceDir && data.projectId === selectedOrchestratorId) {
      lastWorkspaceDir = data.workspaceDir;
    }
    if (data.result) orchResults[data.projectId] = data.result;
    if (data.systemPrompt || data.userPrompt) {
      orchPrompts[data.projectId] = {
        system: data.systemPrompt || (orchPrompts[data.projectId] || {}).system || "",
        user: data.userPrompt || (orchPrompts[data.projectId] || {}).user || "",
      };
    }
    if (data.progress) {
      updateTopbarProgress(data.progress.current, data.progress.total);
    }
    updateNodeSubsteps(data.projectId, data.substep, data.status);
    if (
      data.status === "done" ||
      data.status === "error" ||
      data.status === "skipped" ||
      data.status === "warning"
    ) {
      if (data.projectId !== selectedOrchestratorId) {
        orchNodeStatuses[data.projectId] = data.status;
      }
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
      saveOrchRun(data.status);
    }
  });
  var activeWf = workflows.find(function (w) {
    return w.id === activeWorkflowId;
  });
  var workDir = activeWf ? activeWf.workDir || "" : "";
  var wfName = activeWf ? activeWf.name || "" : "";
  window.openhub
    .executeOrchestration(selectedOrchestratorId, task, workDir, wfName)
    .catch(function () {
      showTopbarProgress(false);
      document.getElementById("btnExecuteOrch").style.display = "inline-flex";
      document.getElementById("btnStopOrch").style.display = "none";
    });
}

function saveOrchRun(finalStatus) {
  if (!selectedOrchestratorId || !activeWorkflowId) return;
  var activeOrch = projects.find(function (p) {
    return p.id === selectedOrchestratorId;
  });
  var finishedAt = Date.now();
  var nodeResults = [];
  var linked = activeOrch ? activeOrch.linked || [] : [];
  linked.forEach(function (pid) {
    var node = projects.find(function (p) {
      return p.id === pid;
    });
    if (!node) return;
    nodeResults.push({
      projectId: pid,
      name: node.name,
      status: orchNodeStatuses[pid] || "skipped",
      result: orchResults[pid] || undefined,
    });
  });
  var run = {
    workflowId: activeWorkflowId,
    orchProjectId: selectedOrchestratorId,
    task: (activeOrch && activeOrch.task) || "",
    status:
      finalStatus === "done"
        ? "done"
        : finalStatus === "cancelled"
          ? "cancelled"
          : "error",
    nodeResults: nodeResults,
    logs: orchLogLines.slice(),
    startedAt: orchStartedAt,
    finishedAt: finishedAt,
    duration: finishedAt - orchStartedAt,
    workspaceDir: lastWorkspaceDir || undefined,
  };
  if (pendingIteration) {
    run.parentRunId = pendingIteration.parentRunId;
    run.feedback = pendingIteration.feedback;
    run.iteration = pendingIteration.iteration;
  }
  window.openhub.saveOrchRun(run).then(function (created) {
    var iter =
      (pendingIteration && pendingIteration.iteration) ||
      (created && created.iteration) ||
      1;
    lastRunMeta = { runId: (created && created.id) || null, iteration: iter };
    pendingIteration = null;
    updateIterateBar();
    loadOrchHistory();
  });
}

function loadOrchHistory() {
  if (!activeWorkflowId || !window.openhub.getOrchRuns) return;
  window.openhub.getOrchRuns(activeWorkflowId).then(function (runs) {
    var list = runs || [];
    renderOrchHistory(list);
    if (list.length > 0) {
      lastRunMeta = { runId: list[0].id, iteration: list[0].iteration || 1 };
    } else {
      lastRunMeta = null;
    }
    updateIterateBar();
  });
}

function formatDuration(ms) {
  if (ms < 1000) return ms + "ms";
  var s = Math.floor(ms / 1000);
  if (s < 60) return s + "s";
  var m = Math.floor(s / 60);
  s = s % 60;
  return m + "m " + s + "s";
}

function formatDate(ts) {
  var d = new Date(ts);
  var pad = function (n) {
    return n < 10 ? "0" + n : "" + n;
  };
  return (
    pad(d.getDate()) +
    "/" +
    pad(d.getMonth() + 1) +
    "/" +
    d.getFullYear() +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
}

function renderOrchHistory(runs) {
  var container = document.getElementById("orchHistoryList");
  if (!container) return;
  if (runs.length === 0) {
    container.innerHTML =
      '<div class="history-empty">Tes exécutions passées s\'afficheront ici.</div>';
    return;
  }
  container.innerHTML = "";
  runs.forEach(function (run) {
    var item = document.createElement("div");
    item.className = "history-item";
    item.onclick = function () {
      showRunDetail(run);
    };

    var statusIcon = run.status === "done" ? "✓" : "✗";
    var statusClass =
      run.status === "done" ? "history-status--done" : "history-status--error";
    var nodeCount = run.nodeResults ? run.nodeResults.length : 0;
    var doneCount = run.nodeResults
      ? run.nodeResults.filter(function (n) {
          return n.status === "done";
        }).length
      : 0;

    var iterBadge =
      run.parentRunId && run.iteration
        ? '<span class="history-badge--iteration">Itération ' + run.iteration + "</span> "
        : "";

    item.innerHTML =
      '<div class="history-item-left">' +
      '<span class="history-status ' +
      statusClass +
      '">' +
      statusIcon +
      "</span>" +
      '<div class="history-item-info">' +
      '<span class="history-item-task">' +
      iterBadge +
      escapeHtml((run.task || "").substring(0, 60)) +
      "</span>" +
      '<span class="history-item-meta">' +
      formatDate(run.startedAt) +
      " · " +
      formatDuration(run.duration) +
      " · " +
      doneCount +
      "/" +
      nodeCount +
      " agents</span>" +
      "</div>" +
      "</div>" +
      '<svg class="history-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';

    container.appendChild(item);
  });
}

function showRunDetail(run) {
  var container = document.getElementById("orchHistoryList");
  if (!container) return;
  container.innerHTML = "";

  var back = document.createElement("button");
  back.className = "history-back-btn";
  back.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg> Retour';
  back.onclick = function () {
    loadOrchHistory();
  };
  container.appendChild(back);

  var header = document.createElement("div");
  header.className = "history-detail-header";
  var statusLabel =
    run.status === "done" ? "Succès" : run.status === "cancelled" ? "Annulée" : "Erreur";
  var statusClass =
    run.status === "done" ? "history-status--done" : "history-status--error";
  var statusIcon = run.status === "done" ? "✓" : run.status === "cancelled" ? "—" : "✗";
  header.innerHTML =
    '<span class="history-status ' +
    statusClass +
    '" style="font-size:14px;">' +
    statusIcon +
    "</span>" +
    "<div>" +
    '<div class="history-detail-task">' +
    escapeHtml(run.task || "") +
    "</div>" +
    '<div class="history-detail-meta">' +
    statusLabel +
    " · " +
    formatDate(run.startedAt) +
    " · " +
    formatDuration(run.duration) +
    "</div>" +
    "</div>";
  container.appendChild(header);

  if (run.feedback) {
    var feedbackEl = document.createElement("div");
    feedbackEl.className = "history-detail-feedback";
    feedbackEl.innerHTML = "<strong>Feedback :</strong> " + escapeHtml(run.feedback);
    container.appendChild(feedbackEl);
  }

  if (run.nodeResults && run.nodeResults.length > 0) {
    var nodesTitle = document.createElement("div");
    nodesTitle.className = "history-section-title";
    nodesTitle.textContent = "Résultats par agent";
    container.appendChild(nodesTitle);

    run.nodeResults.forEach(function (nr) {
      var nodeEl = document.createElement("details");
      nodeEl.className = "history-node";
      var icon = nr.status === "done" ? "✓" : nr.status === "error" ? "✗" : "—";
      var nodeClass = "history-status--" + nr.status;
      nodeEl.innerHTML =
        '<summary class="history-node-summary">' +
        '<span class="history-status ' +
        nodeClass +
        '">' +
        icon +
        "</span>" +
        "<span>" +
        escapeHtml(nr.name) +
        "</span>" +
        "</summary>";
      if (nr.result) {
        var resultDiv = document.createElement("div");
        resultDiv.className = "history-node-result";
        resultDiv.textContent = nr.result;
        nodeEl.appendChild(resultDiv);
      }
      container.appendChild(nodeEl);
    });
  }

  if (run.logs && run.logs.length > 0) {
    var logsTitle = document.createElement("div");
    logsTitle.className = "history-section-title";
    logsTitle.textContent = "Logs";
    container.appendChild(logsTitle);

    var logsEl = document.createElement("div");
    logsEl.className = "history-logs";
    logsEl.textContent = run.logs.join("\n");
    container.appendChild(logsEl);
  }

  var delBtn = document.createElement("button");
  delBtn.className = "btn btn--ghost history-delete-btn";
  delBtn.textContent = "Supprimer cette exécution";
  delBtn.onclick = function () {
    window.openhub.deleteOrchRun(run.id).then(function () {
      loadOrchHistory();
    });
  };
  container.appendChild(delBtn);
}

function updateNodeSubsteps(projectId, substep, status) {
  var container = document.querySelector(
    '.node-card-substeps[data-substep-id="' + projectId + '"]',
  );
  if (!container) return;
  if (!substep || status === "done" || status === "error" || status === "skipped") {
    container.style.display = "none";
    return;
  }
  container.style.display = "flex";
  var fill = container.querySelector(".substep-bar-fill");
  var label = container.querySelector(".substep-label");
  var pct = (substep.current / substep.total) * 100;
  fill.style.width = pct + "%";
  label.textContent = substep.current + "/" + substep.total + " — " + substep.title;
}

function updateIterateBar() {
  var bar = document.getElementById("iterateBar");
  if (!bar) return;
  var stopBtn = document.getElementById("btnStopOrch");
  var running = stopBtn && stopBtn.style.display !== "none";
  var visible = !running && lastRunMeta && activeWorkflowId && selectedOrchestratorId;
  bar.style.display = visible ? "flex" : "none";
}

function startIteration() {
  var input = document.getElementById("feedbackInput");
  var feedback = input ? input.value.trim() : "";
  if (!feedback) {
    showToast("Écris d'abord un feedback.", "error");
    return;
  }
  if (!lastRunMeta || !activeWorkflowId || !selectedOrchestratorId) {
    showToast("Aucun run précédent trouvé.", "error");
    return;
  }

  var iteration = (lastRunMeta.iteration || 1) + 1;
  pendingIteration = {
    parentRunId: lastRunMeta.runId,
    feedback: feedback,
    iteration: iteration,
  };

  orchStartedAt = Date.now();
  showTopbarProgress(true);
  document.getElementById("btnExecuteOrch").style.display = "none";
  document.getElementById("btnStopOrch").style.display = "inline-flex";
  appendOrchLog("Itération " + iteration + " — feedback : " + feedback, "info");
  switchPanelTab("activity");
  updateIterateBar();

  if (orchUnsubscribe) orchUnsubscribe();
  orchUnsubscribe = window.openhub.onOrchestrationStatus(function (data) {
    appendActivityItem(data);
    if (data.chunk) appendOrchLog(data.chunk);
    if (data.workspaceDir && data.projectId === selectedOrchestratorId) {
      lastWorkspaceDir = data.workspaceDir;
    }
    if (data.result) orchResults[data.projectId] = data.result;
    if (data.systemPrompt || data.userPrompt) {
      orchPrompts[data.projectId] = {
        system: data.systemPrompt || (orchPrompts[data.projectId] || {}).system || "",
        user: data.userPrompt || (orchPrompts[data.projectId] || {}).user || "",
      };
    }
    if (data.progress) {
      updateTopbarProgress(data.progress.current, data.progress.total);
    }
    updateNodeSubsteps(data.projectId, data.substep, data.status);
    if (
      data.status === "done" ||
      data.status === "error" ||
      data.status === "skipped" ||
      data.status === "warning"
    ) {
      if (data.projectId !== selectedOrchestratorId) {
        orchNodeStatuses[data.projectId] = data.status;
      }
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
        appendOrchLog("✓ Itération terminée avec succès !", "done");
      else appendOrchLog("✗ Itération terminée sur erreur.", "error");
      saveOrchRun(data.status);
    }
  });

  window.openhub
    .iterateOrchestration(selectedOrchestratorId, feedback, activeWorkflowId)
    .catch(function (err) {
      showTopbarProgress(false);
      document.getElementById("btnExecuteOrch").style.display = "inline-flex";
      document.getElementById("btnStopOrch").style.display = "none";
      pendingIteration = null;
      updateIterateBar();
      showToast(
        err && err.message ? err.message : "Erreur lors de l'itération.",
        "error",
      );
    });

  if (input) input.value = "";
}

function initExecution() {
  var copyBtn = document.getElementById("consoleCopyBtn");
  if (copyBtn) {
    copyBtn.onclick = function () {
      var console = document.getElementById("orchConsole");
      var text = console ? console.innerText : "";
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.classList.add("copied");
        copyBtn.title = "Copié !";
        setTimeout(function () {
          copyBtn.classList.remove("copied");
          copyBtn.title = "Copier la console";
        }, 1500);
      });
    };
  }

  document.getElementById("btnExecuteOrch").onclick = startOrchestration;

  var iterBtn = document.getElementById("btnIterateOrch");
  if (iterBtn) iterBtn.onclick = startIteration;

  document.getElementById("btnStopOrch").onclick = function () {
    if (window.openhub.cancelOrchestration) {
      window.openhub.cancelOrchestration();
      appendOrchLog("Orchestration arrêtée par l'utilisateur.", "error");
      showTopbarProgress(false);
      document.getElementById("btnExecuteOrch").style.display = "inline-flex";
      document.getElementById("btnStopOrch").style.display = "none";
      saveOrchRun("cancelled");
    }
  };

  if (window.openhub.onOrchestrationStatus) {
    window.openhub.onOrchestrationStatus(function (data) {
      applyNodeStatus(data);
    });
  }

  replayStatusBuffer();
}

function applyNodeStatus(data) {
  var node = projects.find(function (p) {
    return p.id === data.projectId;
  });
  if (data.result) orchResults[data.projectId] = data.result;
  if (data.systemPrompt || data.userPrompt) {
    orchPrompts[data.projectId] = {
      system: data.systemPrompt || (orchPrompts[data.projectId] || {}).system || "",
      user: data.userPrompt || (orchPrompts[data.projectId] || {}).user || "",
    };
  }
  if (node) {
    node.status = data.status;
    if (data.task && data.projectId !== selectedOrchestratorId) node.task = data.task;
    if (data.dependencies) node.dependencies = data.dependencies;
    updateNodeSubsteps(data.projectId, data.substep, data.status);
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
  if (data.projectId === selectedNodeId) {
    updateDetailPanel();
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
}

function replayStatusBuffer() {
  if (!window.openhub.getOrchStatusBuffer) return;
  window.openhub.getOrchStatusBuffer().then(function (buf) {
    if (!buf) return;
    var statuses = buf.statuses || {};
    Object.keys(statuses).forEach(function (pid) {
      applyNodeStatus(statuses[pid]);
    });
    var activity = buf.activity || [];
    activity.forEach(function (entry) {
      appendActivityItem({
        projectId: entry.projectId,
        status: entry.status,
        task: entry.label,
      });
    });
  });
}
