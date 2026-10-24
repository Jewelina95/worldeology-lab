function homeMetricCard(id, modelGroups) {
  const metric=metrics.find((item)=>item.id===id);
  const category=metric.category==='Overview'?'Overview':metric.category;
  return `<article class="home-metric"><h3><a href="#models?category=${category}&metric=${id}"><i class="metric-square square-${id}"></i>${esc(metric.title)}<span>↗</span></a></h3><p>${esc(metric.description)} · ${esc(metric.direction)}</p>${chart(metric,modelGroups)}</article>`;
}
function homeInterestRelationship(capability, modelGroups) {
  const index=Number(capability.split('-')[1])-1,level=`L${index+1}`;
  const rows=modelGroups.map((group)=>{
    const paired=group.records.filter((record)=>Number.isFinite(number(record.capability_level_means?.[index]))&&Number.isFinite(number(record.user_interest_change)));
    return {...group,paired,score:average(paired.map((record)=>number(record.capability_level_means[index]))),change:median(paired.map((record)=>number(record.user_interest_change)))};
  }).filter((group)=>group.paired.length).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
  const count=rows.reduce((sum,row)=>sum+row.paired.length,0),excluded=modelGroups.reduce((sum,group)=>sum+group.records.length,0)-count;
  return `<article class="home-metric home-relationship" data-relationship-level="${level}"><h3><i class="metric-square"></i>${level} score &amp; interest change</h3><p>${esc(levelNames[index])} · ${count} paired cases${excluded?` · ${excluded} missing ${excluded===1?'pair':'pairs'} excluded`:''}</p>${rows.length?`<table class="relationship-summary"><caption class="sr-only">${level} mean score and median interest change by model, using the same paired cases</caption><thead><tr><th scope="col">Model</th><th scope="col">${level} score</th><th scope="col">Interest change</th><th scope="col">n</th></tr></thead><tbody>${rows.map((row)=>`<tr><th scope="row"><button type="button" data-relationship-model="${esc(row.name)}" data-relationship-capability="${capability}" aria-label="Open ${esc(row.name)} ${level} paired conversations"><img src="${providerAsset(row.name)}" alt=""/><span>${esc(row.name)}</span></button></th><td><b>${percent(row.score)}</b><i class="relationship-score-track"><em style="width:${row.score*100}%;background:${colors[row.name]}"></em></i></td><td class="${row.change<0?'negative':'positive'}"><b>${delta(row.change)}</b><i class="relationship-change-track"><em style="left:${row.change<0?50+row.change*50:50}%;width:${Math.abs(row.change)*50}%;background:${row.change<0?'#b18470':'#587666'}"></em></i></td><td>${row.paired.length}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No complete score and interest-change pairs are available.</div>'}<div class="relationship-note"><span>Mean score and median interest change use the same paired cases. Select a model to inspect its conversations.</span><a href="#models?category=Engagement&metric=interest-change">Overall interest change · Engagement ↗</a></div></article>`;
}
function homeModelGroups(){
  return state.modelNames.map((name)=>({name,records:state.cases.filter((record)=>record.assistant===name)}));
}
function openRelationshipCases(name,capability){
  const index=Number(capability.split('-')[1])-1,level=`L${index+1}`;
  const records=state.cases.filter((record)=>record.assistant===name&&Number.isFinite(number(record.capability_level_means?.[index]))&&Number.isFinite(number(record.user_interest_change))).sort((a,b)=>number(b.capability_level_means[index])-number(a.capability_level_means[index]));
  dialog(`${name} · ${level}`,'PAIRED CONVERSATIONS',`<p class="detail-subtitle">${esc(levelNames[index])} · ${records.length} paired conversations</p><div class="table-wrap"><table class="results-table"><thead><tr><th>Case</th><th>${level} score</th><th>Interest change</th><th>Outcome</th></tr></thead><tbody>${records.map((record)=>`<tr><td><button class="case-open" data-case="${esc(record.id)}">${record.id.toUpperCase()}</button><small>${esc(record.scene_id)}</small></td><td>${percent(number(record.capability_level_means[index]))}</td><td>${delta(number(record.user_interest_change))}</td><td>${outcomeLabel[outcome(record)]}</td></tr>`).join('')}</tbody></table></div>`);
}
function updateHomeOverview(){
  const tab=state.homeTab||'language';
  document.querySelectorAll('[data-home-tab]').forEach((button)=>{const active=button.dataset.homeTab===tab;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
  const grid=$('.home-overview-grid');grid.setAttribute('aria-label',`${tab==='language'?'Language models':tab} overview`);
  grid.innerHTML=homeOverviewCards(tab,homeModelGroups());bindChartActions(grid);
}
function homeOverviewCards(tab,modelGroups){
  return tab==='language'?['composite','closure','turns'].map((id)=>homeMetricCard(id,modelGroups)).join(''):[['Quality','Case records are pending'],['Interaction','Checkpoint data is pending'],['Coverage','Scenario assignments are pending']].map(([title,note])=>`<article class="home-metric home-metric-pending"><h3><i class="metric-square"></i>${tab[0].toUpperCase()+tab.slice(1)} · ${title}</h3><p>${note}</p><div><span class="pending-label">Pending</span><a href="#multimodal?modality=${tab}">View ${tab} evaluations ↗</a></div></article>`).join('');
}
function updateHomeCapability(){
  const capability=state.homeCapability||'level-1',modelGroups=homeModelGroups();
  document.querySelectorAll('[data-home-capability]').forEach((button)=>{const active=button.dataset.homeCapability===capability;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
  const grid=$('.home-capability-grid');grid.innerHTML=homeMetricCard(capability,modelGroups)+homeInterestRelationship(capability,modelGroups);bindChartActions(grid);
}
const narrativeFlowState={caseId:'case_006',raw:null,turn:0,stage:'evidence',timer:null};
const architectureFlowState={step:0,timer:null};
const demoCaseLabels={
  case_006:'Postpartum feeding consultation',
  case_015:'Low-disclosure emotional support',
  case_055:'Day-long household assistant',
  case_064:'Cross-loop memory recovery',
  case_070:'Repair under missing information',
  case_071:'Repair under missing information · contrast'
};
const demoCaseIntroductions={
  case_006:{
    situation:'A first-time mother, 18 days postpartum, is exhausted and fears that her baby is not getting enough milk.',
    task:'Use objective feeding indicators to decide what should happen next, while responding to the user’s guilt and anxiety.',
    constraint:'The assistant cannot diagnose. Signs of dehydration or persistent poor weight gain require an explicit offline referral.'
  }
};
function narrativeExcerpt(value,limit=210){
  const clean=copy(value||'').replace(/\s+/g,' ').trim();
  return clean.length>limit?`${clean.slice(0,limit).trim()}…`:clean;
}
function narrativeTheoryMarkup(){return explorerTheoryMarkup();}
function architectureFlowMarkup(){return explorerArchitectureMarkup();}
function renderArchitectureFlow(){
  const root=$('#architecture-flow');if(!root)return;
  const html=architectureFlowMarkup();
  if(root.querySelector('.layer-flow-canvas')){root.dataset.phase=narrativeFlowState.stage;const template=document.createElement('div');template.innerHTML=html;root.querySelector('.layer-flow-canvas').replaceWith(template.querySelector('.layer-flow-canvas'));root.querySelector('.layer-node-detail').replaceWith(template.querySelector('.layer-node-detail'));root.querySelector('.layer-flow-toolbar>span').textContent=template.querySelector('.layer-flow-toolbar>span').textContent;root.querySelector('[data-explorer-turn]').value=narrativeFlowState.turn;root.querySelector('[data-flow-play]').textContent=template.querySelector('[data-flow-play]').textContent;}
  else root.outerHTML=html;
}
function narrativeMessages(raw,item){
  const assistant=raw.transcript.find((message)=>message.role==='assistant'&&message.assistant_turn===item.assistant_turn);
  const user=[...raw.transcript].reverse().find((message)=>message.role==='user'&&message.index<(assistant?.index??Infinity));
  return {assistant,user};
}
function latentReading(value){return copy(value?.degree||value?.value||'recorded').replaceAll('_',' ');}
function readableStateName(name){return ({anxiety:'Anxiety',trust:'Trust',desperation:'Urgency',emotional_stability:'Emotional stability',mechanism_awareness:'Situation understanding',primary_goal:'Current goal',vigilance:'Vigilance'})[name]||name.replaceAll('_',' ');}
function latentScalar(value){const label=latentReading(value).toLowerCase();return label.includes('very high')?100:label.includes('high')?80:label.includes('medium')||label.includes('moderate')?55:label.includes('low')?30:label.includes('none')?5:45;}
function flowExplanation(stage){
  return ({
    evidence:['What was said','Dₜ ≜ (Cᵉᵛᵃˡ, O₁:ₜ)','The case specification and the recorded conversation are the evidence available at this turn.'],
    state:['What changed','Ψₜ ≜ ΦΨ(Dₜ)','The evaluator reconstructs only the interaction-relevant state. Later evidence can maintain, strengthen, or revise it.'],
    event:['Where it may lead','Eₜ ≜ (Pₜ, Cₜ, Fₜ)','The event chain separates what has happened from several conditional continuations.'],
    judgment:['What the turn demonstrates','(Jₜ, Vₜ, hₜ) = φN(Wₜ, Dₜ)','The normative layer assigns L1–L6 capability scores and a stopping decision without changing the reconstructed world.']
  })[stage];
}
function narrativeDataStream(item,raw,index){return explorerCaseMarkup(item,raw,index);}
function renderNarrativeFlow(){explorerRenderCase();}
async function loadNarrativeCase(id){
  narrativeFlowState.caseId=id;narrativeFlowState.turn=0;narrativeFlowState.stage='evidence';
  const root=$('#narrative-flow');if(root)root.innerHTML='<div class="flow-loading">Loading the recorded trajectory…</div>';
  try{narrativeFlowState.raw=await window.InteractEvalData.caseRecord(id);renderNarrativeFlow();}
  catch(error){if(root)root.innerHTML=`<div class="flow-loading">${esc(error.message)}</div>`;}
}
function bindNarrativeReadingMap(){
  const links=[...document.querySelectorAll('.reading-map [data-story-target]')],sections=links.map((link)=>document.querySelector(`#${link.dataset.storyTarget}`)).filter(Boolean);if(!links.length)return;
  const observer=new IntersectionObserver((entries)=>{const visible=entries.filter((entry)=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;links.forEach((link)=>link.classList.toggle('active',link.dataset.storyTarget===visible.target.id));},{rootMargin:'-22% 0px -58%',threshold:[0,.2,.6]});sections.forEach((section)=>observer.observe(section));
}
function homeResultsMarkup(modelGroups){return explorerResultsMarkup(modelGroups);}
function renderHome() {
  const modelGroups=homeModelGroups(),total=state.cases.length,scenes=new Set(state.cases.map((record)=>record.scene_id)).size;
  const demoCases=state.cases.filter((record)=>demoCaseLabels[record.id]);
  const contents=[['story-demo','01','Case'],['story-theory','02','Theoretical foundations'],['story-measurement','03','Measurement architecture'],['story-levels','04','Capability adjudication'],['story-results','05','Experiments and results'],['story-reveals','06','Findings'],['story-paper','07','Other resources']];
  $('#page-count').textContent='';
  $('#page-content').innerHTML=`<section class="project-cover" aria-labelledby="project-title"><span class="cover-kicker">INTERACTEVAL · RESEARCH</span><h1 id="project-title">InteractEval</h1><p class="cover-statement">As AI systems increasingly operate through extended interactions, their capabilities cannot be adequately characterized by isolated responses or a single holistic score.</p><nav class="cover-contents" aria-label="Project contents"><span>CONTENTS</span><div>${contents.map(([id,n,title])=>`<button type="button" data-story-target="${id}"><b>${n}</b><span>${title}</span></button>`).join('')}</div></nav></section><div class="narrative-layout"><aside class="reading-map" aria-label="On this page"><span>ON THIS PAGE</span>${contents.map(([id,n,title],index)=>`<button type="button" data-story-target="${id}" class="${index===0?'active':''}"><b>${n}</b><span>${title}</span></button>`).join('')}</aside><main class="narrative-main">
  <section class="story-section trace-section demo-first" id="story-demo"><div class="story-heading trace-heading"><div><span>01 · CASE</span><h1>Case</h1></div><label class="case-trace-select"><span>RECORDED CASE</span><select id="narrative-case">${demoCases.map((record)=>`<option value="${esc(record.id)}" ${record.id===narrativeFlowState.caseId?'selected':''}>${esc(record.id.replace('_',' ').toUpperCase())} · ${esc(demoCaseLabels[record.id])}</option>`).join('')}</select></label></div><div id="narrative-flow" class="interaction-lab"><div class="flow-loading">Loading the recorded trajectory…</div></div><div class="scale-note"><span><i></i>Archived case replay · drag the turn slider.</span><span>State degrees are ordinal estimates, not measured probabilities.</span></div></section>
  <section class="story-section theory-section" id="story-theory"><div class="story-heading"><span>02 · THEORETICAL FOUNDATIONS</span><h2>Theoretical foundations</h2><p>World state, temporal development, and each participant’s contribution.</p></div>${narrativeTheoryMarkup()}</section>
  <section class="story-section measurement-section" id="story-measurement"><div class="story-heading"><span>03 · MEASUREMENT ARCHITECTURE</span><h2>Four-layer architecture</h2><p>Follow one recorded exchange through the layers. Select a node to inspect its data.</p></div>${architectureFlowMarkup()}</section>
  <section class="story-section capability-section" id="story-levels"><div class="story-heading"><span>04 · CAPABILITY ADJUDICATION</span><h2>A six-level<br>measurement hierarchy</h2><p>L1–L2 measure passive execution, L3–L4 responsive adaptation, and L5–L6 active adaptation. Dependencies among levels constrain the scores.</p></div><div class="capability-groups"><article><span>PASSIVE EXECUTION</span><div><b>L1</b><strong>Goal preservation</strong></div><div><b>L2</b><strong>Information uptake</strong></div></article><article><span>RESPONSIVE ADAPTATION</span><div><b>L3</b><strong>State progression</strong></div><div><b>L4</b><strong>Contextual expression</strong></div></article><article><span>ACTIVE ADAPTATION</span><div><b>L5</b><strong>Proactive agency</strong></div><div><b>L6</b><strong>Long-horizon coherence</strong></div></article></div><div class="capability-dependency"><span>L1</span><i>→</i><span>L2</span><i>→</i><span>L3</span><i>→</i><span>L4</span><i>→</i><span>L5</span><i>→</i><span>L6</span><p>The dependency cascade prevents a high-level capability from remaining high when a prerequisite level fails.</p></div></section>
  <section class="story-section results-intro" id="story-results"><div class="story-heading"><span>05 · EXPERIMENTS AND RESULTS</span><h2>Results</h2><p>${total} archived cases · ${scenes} scenes · ${state.modelNames.length} systems.</p></div>${homeResultsMarkup(modelGroups)}<div class="result-actions result-actions-primary"><a href="#models">Full results dashboard <b>↗</b></a><a href="#leaderboards">Leaderboard <b>↗</b></a><a href="#architecture?section=cases">Case records <b>↗</b></a></div></section>
  <section class="story-section reveal-section" id="story-reveals"><div class="story-heading"><span>06 · FINDINGS</span><h2>Three patterns in<br>the results</h2><p>These comparisons are reported in the paper. The labels below state what each number measures.</p></div><div class="reveal-grid"><article><div class="range-visual"><span style="--value:9%"><b>Passive</b><i></i><em>0.035</em></span><span style="--value:28%"><b>Responsive</b><i></i><em>0.111</em></span><span style="--value:93%"><b>Active</b><i></i><em>0.370</em></span></div><strong>System differences widen by stage</strong><p>Range across ten systems: 0.035 for passive execution, 0.111 for responsive adaptation, and 0.370 for active adaptation.</p></article><article><div class="profile-contrast"><span><b>deepseek-v4-pro</b><i style="--value:17%"></i><em>0.170</em></span><span><b>kimi-k3</b><i style="--value:21.2%"></i><em>0.212</em></span><span><b>glm-5.3-flash</b><i style="--value:19.7%"></i><em>0.197</em></span></div><strong>Close composites hide different profiles</strong><p>The three systems are within 0.016 on the composite; the bars show their active-adaptation means.</p></article><article><div class="pairing-visual"><i></i><b>9.9%</b><span>pairing share</span></div><strong>Partner choice changes the score</strong><p>System-by-partner pairing accounts for 9.9% of the variance attributed jointly to system, partner, and pairing in the two-sided setting.</p></article></div></section>
  <section class="story-section evidence-section" id="story-paper"><div class="story-heading"><span>07 · OTHER RESOURCES</span><h2>Paper, methods,<br>cases, and source</h2><p>Open the structured records to trace a model-level result back to its cases.</p></div><div class="evidence-links"><a href="./assets/Qwen_InteractEval.pdf"><span>Paper</span><strong>Read the manuscript</strong><i>PDF ↗</i></a><a href="#architecture?section=cases"><span>Casebook</span><strong>Open recorded case evidence</strong><i>${total} cases ↗</i></a><a href="./research.html"><span>Methods</span><strong>Measures and definitions</strong><i>Research ↗</i></a><a href="https://github.com/Jewelina95/worldeology-lab/tree/main/public/interactive-evo-analysis" target="_blank" rel="noreferrer"><span>Source</span><strong>Website source</strong><i>GitHub ↗</i></a></div><p class="evidence-note">Homepage charts are computed from the ${total} archived case records shipped with this site.</p></section></main></div>`;
  bindNarrativeReadingMap();bindChartActions($('#home-results-visual'));loadNarrativeCase(narrativeFlowState.caseId);
}
function renderComparison() {
  const allGroups=groups(state.cases.filter((record)=>(state.setting==='all'||record.realism===state.setting)&&(state.information==='all'||record.information===state.information)&&(state.purpose==='all'||record.purpose===state.purpose)&&(state.scene==='all'||record.scene_id===state.scene)&&(state.partner==='all'||record.partner===state.partner)));
  const names=allGroups.map((group)=>group.name);
  const first=names.includes(state.compareA)?state.compareA:names[0];
  const second=names.includes(state.compareB)&&state.compareB!==first?state.compareB:names.find((name)=>name!==first);
  if(!first||!second){$('#page-content').innerHTML='<section class="section-panel"><h2>Choose a wider case selection</h2><p>Two models with assigned cases are needed for this comparison.</p><a class="solid-button" href="#models">Adjust comparison conditions</a></section>';return;}
  state.compareA=first;state.compareB=second;
  const chosen=[first,second].map((name)=>allGroups.find((group)=>group.name===name));
  $('#page-count').textContent=chosen.reduce((count,group)=>count+group.records.length,0)+' cases · 2 models';
  $('#page-content').innerHTML=`<section class="section-panel comparison-panel"><h2>Two models, one view</h2><p>Compare recorded outcomes and capabilities within the current case conditions. Sample counts remain attached to each model.</p><div class="comparison-selectors">${[['compare-a',first],['compare-b',second]].map(([id,value])=>`<label><span>${id==='compare-a'?'FIRST MODEL':'SECOND MODEL'}</span><select id="${id}">${names.map((name)=>`<option value="${esc(name)}" ${name===value?'selected':''}>${esc(name)}</option>`).join('')}</select></label>`).join('<span class="comparison-vs">vs.</span>')}</div><div class="comparison-summary">${chosen.map((group)=>`<article><div><img src="${providerAsset(group.name)}" alt=""/><h3>${esc(group.name)}</h3><span>n=${group.records.length}</span></div><dl>${['composite','closure','turns','interest-change'].map((id)=>{const metric=metrics.find((item)=>item.id===id);return `<div><dt>${metric.title}</dt><dd>${metric.format(metric.get(group.records))}</dd></div>`;}).join('')}</dl><a href="#model/${encodeURIComponent(group.name)}">Model profile ↗</a></article>`).join('')}</div><h3>Six capability dimensions</h3><div class="comparison-capabilities">${metrics.filter((metric)=>metric.category==='Capabilities').map((metric)=>`<div><h4>${esc(metric.title)}</h4>${chosen.map((group)=>`<div><span>${esc(group.name)}</span><i><em style="width:${metric.get(group.records)*100}%;background:${colors[group.name]}"></em></i><b>${percent(metric.get(group.records))}</b></div>`).join('')}</div>`).join('')}</div><h3>Complete metric readout</h3>${renderTable(metrics,chosen)}</section>`;
  bindChartActions($('#page-content'));
}
document.addEventListener('click',(event)=>{
  const storyTarget=event.target.closest('[data-story-target]');if(storyTarget){document.querySelector(`#${storyTarget.dataset.storyTarget}`)?.scrollIntoView({behavior:'smooth',block:'start'});}
  const flowStage=event.target.closest('[data-flow-stage]');if(flowStage){narrativeFlowState.stage=flowStage.dataset.flowStage;renderNarrativeFlow();}
  const flowTurn=event.target.closest('[data-flow-turn]');if(flowTurn){narrativeFlowState.turn=Number(flowTurn.dataset.flowTurn);renderNarrativeFlow();}
  const play=event.target.closest('[data-flow-play]');if(play){
    if(narrativeFlowState.timer){clearInterval(narrativeFlowState.timer);narrativeFlowState.timer=null;renderNarrativeFlow();}
    else if(narrativeFlowState.raw){narrativeFlowState.timer=setInterval(()=>{if(!$('#narrative-flow')){clearInterval(narrativeFlowState.timer);narrativeFlowState.timer=null;return;}const length=narrativeFlowState.raw.evaluation_record.length,sequence=['evidence','state','event','judgment'],next=(sequence.indexOf(narrativeFlowState.stage)+1)%sequence.length;narrativeFlowState.stage=sequence[next];if(next===0)narrativeFlowState.turn=(narrativeFlowState.turn+1)%length;renderNarrativeFlow();},950);renderNarrativeFlow();}
  }
  const architectureStep=event.target.closest('[data-architecture-step]');if(architectureStep){architectureFlowState.step=Number(architectureStep.dataset.architectureStep);renderArchitectureFlow();}
  const architecturePlay=event.target.closest('[data-architecture-play]');if(architecturePlay){
    if(architectureFlowState.timer){clearInterval(architectureFlowState.timer);architectureFlowState.timer=null;renderArchitectureFlow();}
    else{architectureFlowState.timer=setInterval(()=>{if(!$('#architecture-flow')){clearInterval(architectureFlowState.timer);architectureFlowState.timer=null;return;}architectureFlowState.step=(architectureFlowState.step+1)%4;renderArchitectureFlow();},1900);renderArchitectureFlow();}
  }
  const tab=event.target.closest('[data-home-tab]');if(tab){state.homeTab=tab.dataset.homeTab;updateHomeOverview();}
  const capability=event.target.closest('[data-home-capability]');if(capability){state.homeCapability=capability.dataset.homeCapability;updateHomeCapability();}
  const paired=event.target.closest('[data-relationship-model]');if(paired)openRelationshipCases(paired.dataset.relationshipModel,paired.dataset.relationshipCapability);
});
document.addEventListener('change',(event)=>{if(event.target.id==='compare-a'||event.target.id==='compare-b'){state[event.target.id==='compare-a'?'compareA':'compareB']=event.target.value;renderComparison();}if(event.target.id==='narrative-case'){if(narrativeFlowState.timer){clearInterval(narrativeFlowState.timer);narrativeFlowState.timer=null;}loadNarrativeCase(event.target.value);}});
document.addEventListener('input',(event)=>{if(event.target.id==='trajectory-turn'){narrativeFlowState.turn=Number(event.target.value);renderNarrativeFlow();}});
