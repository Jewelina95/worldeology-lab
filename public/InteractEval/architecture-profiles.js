'use strict';

// Purpose gains are the published means in Table 17, rather than case aggregates.
const architecturePurposeDescriptions = {
  MetaMind: {
    heading: 'Relational & open-ended',
    copy: 'The largest mean open-ended gain among these three architectures.'
  },
  Cognizer: {
    heading: 'Task-oriented & mixed',
    copy: 'Gains are concentrated in practical tasks and mixed-purpose settings.'
  },
  'Claude Code': {
    heading: 'Task-oriented execution',
    copy: 'The largest purpose gain is in practical tasks.'
  }
};
const architecturePurposeLabels = [
  ['functional', 'Task-oriented'],
  ['mixed', 'Mixed purpose'],
  ['nonfunctional', 'Open-ended']
];

function architecturePurposeCard(a) {
  const profile=architecturePurposeDescriptions[a.architecture];
  const maxGain=Math.max(...Object.values(a.purpose_gains));
  return `<article class="purpose-profile-card"><header>${agentIcon(a.architecture)}<h3>${safe(a.architecture)}</h3></header><div class="purpose-profile-intro"><h4>${profile.heading}</h4><p>${profile.copy}</p></div><div class="purpose-profile-bars" aria-label="${safe(a.architecture)} mean gain by interaction purpose">${architecturePurposeLabels.map(([id,label])=>`<div class="purpose-profile-row ${a.purpose_gains[id]===maxGain?'purpose-profile-strongest':''}"><span>${label}</span><strong>${signed(a.purpose_gains[id])}</strong><i><b style="width:${a.purpose_gains[id]/.07*100}%"></b></i></div>`).join('')}</div><div class="purpose-profile-balance"><span>Purpose contrast</span><p>${a.purpose_delta>0?`Open-ended gain exceeds task-oriented gain by <strong>${number(a.purpose_delta)}</strong>.`:`Task-oriented gain exceeds open-ended gain by <strong>${number(-a.purpose_delta)}</strong>.`}</p></div><footer><span>Mean overall score gain</span><strong>${signed(a.composite)}</strong></footer><a href="./index.html#agents?architecture=${encodeURIComponent(a.architecture)}">Explore its ten model configurations <span>↗</span></a></article>`;
}

function architecturePurposeProfiles() {
  return `<div class="architecture-purpose-profiles"><div class="purpose-profile-grid">${publication.architecture_gains.map(architecturePurposeCard).join('')}</div><div class="purpose-condition-guide"><div><strong>Task-oriented</strong><span>A concrete objective to complete.</span></div><div><strong>Mixed purpose</strong><span>Practical progress and the relationship both matter.</span></div><div><strong>Open-ended · nonfunctional</strong><span>Conversation, companionship, or relational continuation is the objective.</span></div></div><details class="architecture-stage-details"><summary>Capability-stage gains and overall score <span>+</span></summary><p>All three architectures show their largest mean stage gain in taking the lead and following through.</p><div class="paper-table-wrap"><table class="paper-table"><thead><tr><th>Architecture</th><th>Follow the brief<br/><small>L1–L2</small></th><th>Adapt to changes<br/><small>L3–L4</small></th><th>Lead &amp; sustain<br/><small>L5–L6</small></th><th>Overall score</th></tr></thead><tbody>${publication.architecture_gains.map(a=>`<tr><th>${safe(a.architecture)}</th>${a.stages.map(v=>`<td>${signed(v)}</td>`).join('')}<td>${signed(a.composite)}</td></tr>`).join('')}</tbody></table></div></details><p class="architecture-purpose-caption">All purpose bars share the same scale.</p></div>`;
}
