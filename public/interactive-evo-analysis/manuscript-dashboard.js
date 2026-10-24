(() => {
  const dataset = window.INTERACTEVAL_MANUSCRIPT;
  if (!dataset) return;

  const $ = (selector) => document.querySelector(selector);
  const esc = (value = "") =>
    String(value).replace(/[&<>'"]/g, (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char],
    );
  const pct = (value) => `${(Number(value) * 100).toFixed(1)}%`;
  const score = (value) => Number(value).toFixed(3);
  const signed = (value) => `${Number(value) >= 0 ? "+" : ""}${Number(value).toFixed(3)}`;
  const providerClass = (provider) =>
    `provider-${String(provider).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const metrics = {
    composite: {
      label: "Interaction capability composite",
      short: "Composite",
      description:
        "Level-weighted, trajectory-level composite over the full 27-cell cube · higher is better",
      value: (model) => model.composite,
      format: score,
    },
    passive: {
      label: "Passive execution",
      short: "Passive · L1–L2",
      description: "Goal preservation and information uptake · higher is better",
      value: (model) => model.stages.passive,
      format: score,
    },
    responsive: {
      label: "Responsive adaptation",
      short: "Responsive · L3–L4",
      description: "State progression and contextual expression · higher is better",
      value: (model) => model.stages.responsive,
      format: score,
    },
    active: {
      label: "Active adaptation",
      short: "Active · L5–L6",
      description: "Proactive agency and long-horizon coherence · higher is better",
      value: (model) => model.stages.active,
      format: score,
    },
    closure: {
      label: "Successful closure",
      short: "Closure",
      description:
        "Share of episodes ending after the objective is met · compare within interaction purpose",
      value: (model) => model.closure.overall,
      format: pct,
    },
  };

  const state = {
    metric: "composite",
    query: "",
    limit: "all",
    selected: dataset.models[0].id,
  };

  function ordered(metricKey = state.metric) {
    const metric = metrics[metricKey];
    return dataset.models
      .filter((model) => model.id.toLowerCase().includes(state.query))
      .slice()
      .sort((a, b) => metric.value(b) - metric.value(a));
  }

  function miniRows(metricKey, count = 5) {
    const metric = metrics[metricKey];
    return dataset.models
      .slice()
      .sort((a, b) => metric.value(b) - metric.value(a))
      .slice(0, count)
      .map(
        (model, index) => `
          <button class="paper-mini-row ${providerClass(model.provider)}" data-paper-model="${esc(model.id)}" type="button">
            <span>${index + 1}</span>
            <b>${esc(model.id)}</b>
            <i><em style="width:${Math.max(2, metric.value(model) * 100)}%"></em></i>
            <strong>${metric.format(metric.value(model))}</strong>
          </button>`,
      )
      .join("");
  }

  function renderSummaryCards() {
    const cards = [
      ["composite", "Composite", "Trajectory capability across all six levels"],
      ["active", "Active adaptation", "Where current systems differ most"],
      ["closure", "Successful closure", "Outcome, not a standalone quality score"],
    ];
    const host = $("#paper-summary-cards");
    if (!host) return;
    host.innerHTML = cards
      .map(
        ([key, title, description]) => `
          <article class="paper-summary-card">
            <header><span class="paper-metric-swatch metric-${key}"></span><h3>${title}</h3></header>
            <p>${description}</p>
            <div class="paper-mini-chart">${miniRows(key)}</div>
            <button class="paper-card-link" data-paper-metric-jump="${key}" type="button">Open full comparison <span>↘</span></button>
          </article>`,
      )
      .join("");
  }

  function renderLeaderboard() {
    const host = $("#paper-leaderboard-chart");
    if (!host) return;
    const metric = metrics[state.metric];
    let models = ordered();
    if (state.limit === "top5") models = models.slice(0, 5);
    $("#paper-index-title").textContent = metric.label;
    $("#paper-index-description").textContent = metric.description;
    $("#paper-model-count").textContent = `${models.length} of ${dataset.models.length} models`;
    host.setAttribute(
      "aria-label",
      `${metric.label}. ${models.map((model) => `${model.id} ${metric.format(metric.value(model))}`).join(", ")}`,
    );
    host.innerHTML = models
      .map((model, index) => {
        const value = metric.value(model);
        const selected = model.id === state.selected;
        return `
          <button class="paper-column ${providerClass(model.provider)}${selected ? " selected" : ""}" data-paper-model="${esc(model.id)}" type="button" style="--bar:${Math.max(1, value * 100)}%">
            <span class="paper-column-rank">${String(index + 1).padStart(2, "0")}</span>
            <span class="paper-column-bar"><i></i><b>${metric.format(value)}</b></span>
            <span class="paper-column-label"><strong>${esc(model.id)}</strong><small>${esc(model.provider)}</small></span>
          </button>`;
      })
      .join("");
    renderSelectedModel();
  }

  function renderSelectedModel() {
    const model = dataset.models.find((item) => item.id === state.selected) || dataset.models[0];
    const host = $("#paper-model-detail");
    if (!host) return;
    const passMean = model.passes.reduce((sum, value) => sum + value, 0) / model.passes.length;
    const maxPassShift = Math.max(...model.passes.map((value) => Math.abs(value - passMean)));
    host.innerHTML = `
      <div class="paper-detail-head">
        <div><span>MODEL IN FOCUS</span><h3>${esc(model.id)}</h3><small>${esc(model.provider)} · full-cube means of three passes</small></div>
        <b>${score(model.composite)}</b>
      </div>
      <div class="paper-detail-stats">
        <div><span>PASSIVE</span><b>${score(model.stages.passive)}</b></div>
        <div><span>RESPONSIVE</span><b>${score(model.stages.responsive)}</b></div>
        <div><span>ACTIVE</span><b>${score(model.stages.active)}</b></div>
        <div><span>CLOSURE</span><b>${pct(model.closure.overall)}</b></div>
        <div><span>L6 / L5</span><b>${score(model.l6l5)}</b></div>
        <div><span>Δ PURPOSE</span><b>${signed(model.purposeDelta)}</b></div>
      </div>
      <div class="paper-detail-levels">
        ${model.levels
          .map(
            (value, index) => `<div><span><b>L${index + 1}</b>${dataset.levelNames[index]}</span><i><em style="width:${value * 100}%"></em></i><strong>${score(value)}</strong></div>`,
          )
          .join("")}
      </div>
      <p class="paper-detail-note">Passes ${model.passes.map(score).join(" · ")} · maximum pass deviation from the mean ${score(maxPassShift)}. Select another bar to carry the same model through the dashboard.</p>`;
  }

  function renderCapabilityMatrix() {
    const host = $("#paper-capability-body");
    if (!host) return;
    host.innerHTML = dataset.models
      .slice()
      .sort((a, b) => b.composite - a.composite)
      .map(
        (model) => `
          <tr data-paper-model="${esc(model.id)}" class="${model.id === state.selected ? "selected" : ""}">
            <th><button data-paper-model="${esc(model.id)}" type="button">${esc(model.id)}</button><small>${score(model.composite)}</small></th>
            ${model.levels.map((value) => `<td><span style="--value:${value * 100}%"><b>${score(value)}</b></span></td>`).join("")}
          </tr>`,
      )
      .join("");
  }

  function renderAgents() {
    const host = $("#agent-architecture-grid");
    if (!host) return;
    const architectures = [
      ["MetaMind", dataset.architectureAverages.metamind, "metamind"],
      ["Cognizer", dataset.architectureAverages.cognizer, "cognizer"],
    ];
    host.innerHTML = architectures
      .map(
        ([name, gains, key]) => `
          <article class="agent-card">
            <div class="agent-card-title"><span>COGNITIVE ARCHITECTURE</span><h3>${name}</h3><b>+${score(gains.compositeGain)}</b></div>
            <p>Mean gain over the same ten base systems. The largest lift occurs at the active end.</p>
            <div class="agent-stage-gains">
              <div><span>Passive</span><i><em style="width:${gains.passiveGain * 1000}%"></em></i><b>+${score(gains.passiveGain)}</b></div>
              <div><span>Responsive</span><i><em style="width:${gains.responsiveGain * 1000}%"></em></i><b>+${score(gains.responsiveGain)}</b></div>
              <div><span>Active</span><i><em style="width:${gains.activeGain * 1000}%"></em></i><b>+${score(gains.activeGain)}</b></div>
            </div>
            <div class="agent-model-list">
              ${dataset.models
                .map((model) => `<span><b>${esc(model.id)}</b><i>${score(model.composite)} → ${score(model.agents[key].composite)}</i></span>`)
                .join("")}
            </div>
          </article>`,
      )
      .join("");
  }

  function selectModel(modelId) {
    if (!dataset.models.some((model) => model.id === modelId)) return;
    state.selected = modelId;
    renderLeaderboard();
    renderCapabilityMatrix();
  }

  function selectMetric(metricKey) {
    if (!metrics[metricKey]) return;
    state.metric = metricKey;
    document.querySelectorAll("[data-paper-metric]").forEach((button) => {
      const selected = button.dataset.paperMetric === metricKey;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    renderLeaderboard();
  }

  function downloadCsv() {
    const header = ["model", "provider", "composite", ...dataset.levelNames, "passive", "responsive", "active", "closure", "l6_l5", "purpose_delta"];
    const rows = dataset.models.map((model) => [
      model.id,
      model.provider,
      model.composite,
      ...model.levels,
      model.stages.passive,
      model.stages.responsive,
      model.stages.active,
      model.closure.overall,
      model.l6l5,
      model.purposeDelta,
    ]);
    const blob = new Blob([[header, ...rows].map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `interacteval-manuscript-${dataset.version}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  renderSummaryCards();
  renderLeaderboard();
  renderCapabilityMatrix();
  renderAgents();

  document.addEventListener("click", (event) => {
    const modelButton = event.target.closest("[data-paper-model]");
    if (modelButton) selectModel(modelButton.dataset.paperModel);
    const metricButton = event.target.closest("[data-paper-metric]");
    if (metricButton) selectMetric(metricButton.dataset.paperMetric);
    const jumpButton = event.target.closest("[data-paper-metric-jump]");
    if (jumpButton) {
      selectMetric(jumpButton.dataset.paperMetricJump);
      $("#leaderboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  $("#paper-model-search")?.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderLeaderboard();
  });
  $("#paper-model-limit")?.addEventListener("change", (event) => {
    state.limit = event.target.value;
    renderLeaderboard();
  });
  $("#paper-download-data")?.addEventListener("click", downloadCsv);
  $("#paper-copy-link")?.addEventListener("click", async (event) => {
    const url = `${location.href.split("#")[0]}#leaderboard`;
    try {
      await navigator.clipboard.writeText(url);
      event.currentTarget.textContent = "Copied";
    } catch {
      event.currentTarget.textContent = "#leaderboard";
    }
    window.setTimeout(() => (event.currentTarget.textContent = "Copy link"), 1400);
  });
})();
