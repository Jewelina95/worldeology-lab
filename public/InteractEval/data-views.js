'use strict';

// One presentation contract for the result explorer's original and extended views.
const dataViewNotes = {
 'capability-profile':'Three-pass mean scores · 10 models · scale 0–1',
 'behavior-profile':'Share of turns · more clarification does not necessarily mean stronger initiative',
 'stage-profile':'Three-pass mean scores · 10 models · scale 0–1',
 'question-vs-agency':'Partner-substitution effects on Kimi · 95% scene-bootstrap intervals',
 'gap-behavior':'Share of turns containing unsupported factual additions, by information condition.',
 'gap-correlation':'Passive execution versus unsupported factual additions · 10 models',
 'case-trajectories':'Two reimbursement dialogues: state, interest, and outcomes across turns.',
 'turn-divergence':'Turn-level score ranges among episodes still active at each turn.',
 'termination-outcomes':'Adaptive stopping with simulated users; interest exhaustion is not human dissatisfaction.',
 'closure-purpose':'Episode closure rates, separated by interaction purpose.',
 'stopping-ablation':'Episode length when Degrade remains the dominant projected path.',
 'partner-pressure':'Score pressure relative to claude-opus-5 as the standard partner.',
 'role-asymmetry':'Variance attributed to participant identity and residual interaction effects.',
 'simulated-user-quality':'Lexical diversity and contradiction flags; source conditions differ.',
 'architecture-headroom':'Base-model proactive scores versus gains from each architecture.',
 'role-probes':'Within-dialogue interest R² · 75% model depth · held-out scenes',
 'shared-affection':'Shared state directions and participant-specific readouts · 75% model depth',
 'shared-miscalibration':'16 Gemma–Gemma dialogues · 204 aligned boundaries',
 'partner-integration':'Qwen3.8-27B · activation restoration and attention-head ablation',
 'representation-control':'Qwen3.8-27B · interventions along interest and affection directions',
 'weighting-sensitivity':'The same level scores, aggregated with reference or equal weights.',
 'reconstruction-ablation':'Controlled probes with identical dialogue evidence.',
 'human-audit':'Human endorsement of evaluator judgments, with reviewed sample sizes.',
 'extractor-stability':'Agreement of reconstructed states and stability of final model rankings.',
 'judge-families':'Relative score lift for models from the judging model’s own family.',
 'evaluation-cost':'Calls and tokens per exchange, including both participants.',
 'scene-revision':'L1 failures against outdated rules after an admitted scene revision.',
 'joint-level-judging':'Six isolated grading calls versus one joint call.',
 'scenario-coverage':'Coverage of the 27-cell scenario design in observational source pools.',
 'serialization-format':'Identical information presented as structured fields or natural-language prose.'
};

function dataViewIcon(id, fallback='overview') {
 if (id==='question-vs-agency') return 'conversation';
 if (/audit|judg|reliab|repeat|pass-sd/.test(id)) return 'rubric';
 if (/goal|closure|termination|stopping/.test(id)) return 'outcome';
 if (/probe|affection|miscalibration|integration|representation/.test(id)) return 'theory';
 if (/information|gap|serialization|coverage|scene/.test(id)) return 'scenario';
 if (/turn|length|trajector|fixed|adaptive/.test(id)) return 'duration';
 return fallback;
}

function dataIdentity(value) {
 const text=String(value), level=text.match(/^(L[1-6])(?:\s*\/\s*|\s+|$)(.*)$/);
 if(level) return `<span class="data-identity"><span class="data-level-badge">${level[1]}</span>${level[2]?`<span>${safe(level[2])}</span>`:''}</span>`;
 if(/^(claude|gpt|gemini|gemma|deepseek|qwen|kimi|glm)(?:[\s\d–-]|$)/i.test(text))
  return `<span class="data-identity"><img src="${assets(text)}" alt=""/><span>${safe(text)}</span></span>`;
 return safe(text);
}

function renderDataView() {
 const group=mainComparisonGroups.find(g=>g.id===mainComparisonGroup);
 const label=group.items.find(([id])=>id===mainComparisonMeasure)?.[1]||group.title;
 const subsection=paperSubsection(group,mainComparisonMeasure);
 let content=mainComparisonContent(), description='';
 content=content.replace(/^<header class="comparison-reading">([\s\S]*?)<\/header>/,(_,body)=>{
   description=body.match(/<p>([\s\S]*?)<\/p>/)?.[1]||'';return '';
 });
 description=dataViewNotes[mainComparisonMeasure]||description;
 const singlePlotViews=new Set(['gap-behavior','gap-correlation','stopping-ablation','partner-pressure','role-probes','human-audit','judge-families','evaluation-cost','turn-divergence','scene-revision','weighting-sensitivity','reconstruction-ablation']);
 if(singlePlotViews.has(mainComparisonMeasure)) content=content.replace('<figcaption>','<figcaption class="data-accessible-caption">');
 const singleTableViews=new Set(['role-asymmetry','simulated-user-quality','shared-miscalibration','partner-integration','representation-control','extractor-stability','scenario-coverage','serialization-format']);
 if(singleTableViews.has(mainComparisonMeasure)) content=content.replace('<caption>','<caption class="data-accessible-caption">');
 return `<header class="data-view-heading">${subsection?`<p class="paper-view-subsection">${subsection.title}</p>`:''}<h4>${navigationIcon(dataViewIcon(mainComparisonMeasure,group.icon))}<span>${safe(label)}</span></h4>${description?`<p>${description}</p>`:''}</header><div class="data-view-body">${content}</div>`;
}

function partnerClarificationView() {
 const rows=[
  {name:'Clarification frequency',icon:'conversation',value:8.5,lo:.4,hi:16.9,min:-4,max:18,unit:'percentage points',format:v=>(v>0?'+':'')+v.toFixed(1)},
  {name:'L5 · Proactive agency',icon:'stages',value:.006,lo:-.027,hi:.043,min:-.04,max:.05,unit:'score change',format:v=>(v>0?'+':'')+v.toFixed(3)}
 ];
 return `<div class="partner-change-context"><span>${dataIdentity('kimi-k3')}</span><span class="partner-change-label">Partner</span>${dataIdentity('claude-opus-5')}<span aria-hidden="true">→</span>${dataIdentity('claude-opus-5.5')}</div><div class="interval-comparison">${rows.map(r=>{
  const x=v=>55+(v-r.min)/(r.max-r.min)*490;
  return `<figure><figcaption>${navigationIcon(r.icon)}<span>${r.name}</span><strong>${r.format(r.value)}<small>${r.unit}</small></strong></figcaption><svg viewBox="0 0 600 115" role="img" aria-label="${r.name}: ${r.format(r.value)} ${r.unit}; 95% interval ${r.format(r.lo)} to ${r.format(r.hi)}"><path d="M55 68H545" stroke="#d5ded5"/><path d="M${x(0)} 12V76" stroke="#9aac9e" stroke-dasharray="3 4"/><path d="M${x(r.lo)} 40H${x(r.hi)}M${x(r.lo)} 33v14M${x(r.hi)} 33v14" stroke="#52765b" stroke-width="2"/><circle cx="${x(r.value)}" cy="40" r="5" fill="#234e3b"/>${[r.min,0,r.max].map(v=>`<text x="${x(v)}" y="97" text-anchor="middle">${r.format(v)}</text>`).join('')}</svg><p class="interval-caption">95% CI <span>${r.format(r.lo)} to ${r.format(r.hi)}</span></p></figure>`;
 }).join('')}</div>`;
}
