'use strict';

// The two main result sections share one level. Protocol comparisons sit below them.
const mainComparisonGroups=[
  {id:'stages',title:'Interaction stages',icon:'stages',items:[['stage-profile','All three stages'],['stage0','Passive execution'],['stage1','Responsive adaptation'],['stage2','Proactive promotion'],['coherence','L6 / L5']]},
  {id:'scenarios',title:'Scenarios',icon:'scenario',items:[['functional','Task-oriented'],['mixed','Mixed purpose'],['nonfunctional','Open-ended'],['purpose','Purpose contrast'],['realistic','Realistic worlds'],['stylized','Stylized worlds'],['science-fictional','Science-fictional worlds'],['information','Information gaps']]},
  {id:'duration',title:'Conversation length',icon:'duration',items:[['median-turns','Typical length'],['adaptive-prefix','Natural stopping'],['fixed8','8-turn episodes'],['fixed16','16-turn episodes'],['fixed32','32-turn episodes']]},
  {id:'architectures',title:'Architectures',icon:'architecture',items:[['architecture-purpose','Gains by purpose'],['architecture-stages','Gains by stage']]},
  {id:'partners',title:'Partners',icon:'partner',items:[['pairings','All 100 pairings'],['pairing-summary','Partner comparison'],['self-play','Self-play score'],['self-gap','Self-play contrast'],['self-similarity','Self-similarity'],['user-composite','User-role capability'],['user-active','User-role initiative'],['probing','Probing'],['cooperativeness','Cooperativeness'],['uptake-pressure','Uptake pressure'],['active-pressure','Initiative pressure'],['pressure-difference','Pressure contrast'],['group-size','Group size']]},
  {id:'reliability',title:'Repeatability',icon:'repeat',items:[['repeats','Independent passes'],['pass-sd','Between-pass variation'],['judges','Judge comparison']]}
];
let mainComparisonGroup='partners',mainComparisonMeasure='pairings';
let mainInformationView='conditions',mainGroupMeasure='active';
let pairingSelection={partner:'claude-5-opus',assistant:'claude-opus-5.5'};
let selectedMainLevel=null;
let lastMainComparisonHash='';
const readMainLevels=new Set();

const leaderboardGroups=[
  {title:'Overall & stages',items:['composite','stage0','stage1','stage2','coherence']},
  {title:'Interaction purpose',items:['functional','mixed','nonfunctional']},
  {title:'World setting',items:['realistic','stylized','science-fictional']},
  {title:'Partner role',items:['user-composite','user-active']}
];
const leaderboardIds=()=>leaderboardGroups.flatMap(group=>group.items);
function modelNameMarkup(name){return safe(name).replace(/-/g,'-<wbr>');}
function modelIdentity(name){return `<span class="model-identity"><img src="${assets(name)}" alt=""/><span>${modelNameMarkup(name)}</span></span>`;}
function mainRail(){
  return `<aside class="article-rail main-results-rail" aria-label="Section navigation"><button type="button" class="main-rail-toggle" data-atlas-contents aria-expanded="false" aria-controls="main-rail-content">Contents <span aria-hidden="true">⌄</span></button><div id="main-rail-content" class="main-rail-content"><a href="#response-interaction" data-research-section="response-interaction">${navigationIcon('conversation')}<span>Why interact</span></a><a href="#key-findings" data-research-section="key-findings" class="active">${navigationIcon('theory')}<span>Key Findings</span></a><a href="#model-readout" data-research-section="model-readout">${navigationIcon('overview')}<span>Model performance</span></a><a href="#process" data-research-section="process">${navigationIcon('behavior')}<span>Behavior & outcomes</span></a><a class="main-mobile-compare-link" href="#comparisons" data-research-section="comparisons">Measures</a><div class="main-rail-comparisons">${mainComparisonGroups.map(group=>`<details class="main-rail-group" name="main-measure-groups" data-main-rail-group="${group.id}" ${group.id===mainComparisonGroup&&['comparisons','partners','duration','architectures','scenarios','stages','reliability'].includes(location.hash.slice(1))?'open':''}><summary><span class="main-rail-family-label">${navigationIcon(group.icon)}<span>${group.title}</span></span></summary><div>${group.items.map(([id,label])=>`<button type="button" data-main-comparison="${id}" ${mainComparisonMeasure===id?'aria-current="true"':''}>${railMeasureLabel(id,label)}</button>`).join('')}</div></details>`).join('')}</div><a href="#illustrations" data-research-section="illustrations">${navigationIcon('conversation')}<span>Conversations</span></a></div></aside>`;
}
function capabilityMatrix(){
  const columns=['composite',...levelNames.map((_,index)=>'L'+(index+1))];
  return `<div class="matrix-toolbar"><p>Scores · 0–1</p><span><i class="level-hint-dot" aria-hidden="true"></i> Select a level</span></div><div id="main-level-note" class="main-level-note" role="region" aria-label="Capability explanation" aria-live="polite" hidden></div><div class="heatmap-wrap main-capability-wrap" role="region" aria-label="Model performance matrix" tabindex="0"><table class="capability-heatmap main-capability-table"><thead><tr><th scope="col">Model</th>${columns.map((id,index)=>`<th scope="col" class="${index>4?'active-level-column':''}"><button type="button" data-main-level="${id}" aria-expanded="false" aria-controls="main-level-note"><strong>${index===0?'Overall':id}</strong><span>${['Composite','Goal','Uptake','Progression','Expression','Initiative','Coherence'][index]}</span><i class="level-hint-dot ${readMainLevels.has(id)?'is-read':''}" aria-hidden="true"></i></button></th>`).join('')}</tr></thead><tbody>${publication.models.map(model=>`<tr><th scope="row"><a href="#model/${encodeURIComponent(model.name)}">${modelIdentity(model.name)}</a></th>${[model.composite,...model.levels].map((value,index)=>`<td data-score-level="${columns[index]}" class="${index>4?'active-level-column':''}" style="--score-fill:${.06+value*.5}">${number(value)}</td>`).join('')}</tr>`).join('')}</tbody><tfoot><tr><th scope="row">Across-model range</th>${columns.map((id,index)=>{const values=publication.models.map(model=>metricOf(id).get(model));return `<td class="${index>4?'active-level-column':''}">${number(Math.max(...values)-Math.min(...values))}</td>`;}).join('')}</tr></tfoot></table></div><div class="atlas-mobile-scores">${atlasMobileScores()}</div>`;
}

const levelExamples={
 composite:'Read all six levels together to see what an overall score combines.',
 L1:'Keep a travel plan anchored to the traveller’s arrival deadline.',
 L2:'Use the newly mentioned fact that the first train is cancelled.',
 L3:'Turn that disruption into a workable alternative route.',
 L4:'Explain the alternative in a way that fits the traveller’s uncertainty.',
 L5:'Check the last connection before anyone asks about it.',
 L6:'Carry that revised plan through to a confirmed arrival.'
};
function mainLevelExplanation(id){
 const guide=measureGuide(id),index=id==='composite'?-1:Number(id.slice(1))-1;
 const stage=index<0?'All six levels':index<2?'Follow the brief':index<4?'Adapt to change':'Take initiative';
 const values=publication.models.map(m=>metricOf(id).get(m)),lo=Math.min(...values),hi=Math.max(...values);
 return `<div class="level-explanation-head"><span>${stage}</span><button type="button" data-close-main-level aria-label="Close level explanation">&times;</button></div><nav class="level-explanation-tabs" aria-label="Capability levels">${['composite','L1','L2','L3','L4','L5','L6'].map(key=>`<button type="button" data-main-level="${key}" aria-pressed="${key===id}">${key==='composite'?'Overall':key}</button>`).join('')}</nav><div class="level-explanation-body"><div><h3>${safe(guide.title)}</h3><p>${safe(guide.meaning)}</p></div><div class="level-example"><span>In practice</span><p>${levelExamples[id]}</p></div><div class="level-score-span"><span>Model range</span><strong>${number(lo)} <i>&ndash;</i> ${number(hi)}</strong><div><b style="left:${lo*100}%;width:${(hi-lo)*100}%"></b></div><small>Score &middot; 0&ndash;1</small></div></div>`;
}

function mainBehaviorSection(){
  return journalSection('process','02','','Behavior & outcomes','',`<div class="journal-chart-pair main-behavior-charts"><figure class="research-figure"><div class="chart-topline"><strong>Fabrication</strong></div><p class="chart-reader-help">How often a model supplies information absent from the specification.</p>${comparisonBars('fabrication')}</figure><figure class="research-figure"><div class="chart-topline"><strong>Clarification</strong></div><p class="chart-reader-help">How often a model asks for information it needs. More questions are not automatically better.</p>${comparisonBars('clarification')}</figure></div><figure class="research-figure"><div class="chart-topline"><strong>Successful closure</strong></div><p class="chart-reader-help">The share of episodes judged to have completed their objective, compared within the same purpose.</p><div class="main-outcome-wrap" role="region" aria-label="Closure rates by interaction purpose" tabindex="0">${researchOutcomes()}</div><p class="figure-caption">Open-ended interactions can value continued conversation. Low closure alone does not indicate weak capability.</p></figure><details class="main-endings"><summary>All stopping outcomes</summary>${comparisonDataTable(['closure','exhaustion'],['Successful closure','Interest exhaustion'])}<p>These two outcomes account for all episodes. They describe the stopping rule, rather than human satisfaction.</p></details>`);
}
function resultsHomeV2(){
  selectedMainLevel=null;
  if(lastMainComparisonHash!==location.hash){
    lastMainComparisonHash=location.hash;
    const aliases={duration:'duration',architectures:'architectures',partners:'partners',coverage:'partners',stages:'stages',scenarios:'scenarios',reliability:'reliability'};
    const group=mainComparisonGroups.find(group=>group.id===aliases[location.hash.slice(1).split('?')[0]]);
    if(group){mainComparisonGroup=group.id;mainComparisonMeasure=group.items[0][0];}
    const measure=new URLSearchParams(location.hash.split('?')[1]||'').get('measure');
    const requestedGroup=mainComparisonGroups.find(group=>group.items.some(item=>item[0]===measure));
    if(requestedGroup){mainComparisonGroup=requestedGroup.id;mainComparisonMeasure=measure;if(measure==='information')mainInformationView='conditions';}
  }
  return `<div class="research-restored results-page">${atlasHero()}<div class="article-shell">${mainRail()}<article class="article-body">${interactionFigure('motivation')}${atlasKeyFindings()}${journalSection('model-readout','01','','Model performance','Six levels, from following a brief to sustaining a new direction.',capabilityMatrix())}${mainBehaviorSection()}${journalSection('comparisons','03','','Measures','',`<div class="main-comparison-tabs" role="group" aria-label="Comparison families">${mainComparisonGroups.map(group=>`<button type="button" data-main-family="${group.id}" aria-pressed="${group.id===mainComparisonGroup}">${navigationIcon(group.icon)}${group.title}</button>`).join('')}</div><div id="main-comparison-body" tabindex="-1" role="region" aria-label="Selected comparison">${mainComparisonPanel()}</div>`)}${journalSection('illustrations','04','','Conversations','',`<div class="atlas-examples">${proactivityOpening()}</div>`)}<nav class="result-next-links" aria-label="Explore InteractEval"><a href="#leaderboards"><b>Leaderboards</b></a><a href="./research.html"><b>Research</b></a><a href="./showcase.html"><b>Showcase</b></a></nav></article></div></div>`;
}
function comparisonDataTable(ids,labels=ids.map(id=>metricOf(id).label),rows=publication.models,headerModels=[]){
  return `<div class="comparison-table-wrap" role="region" aria-label="Published comparison values" tabindex="0"><table class="comparison-data-table"><thead><tr><th scope="col">Model</th>${labels.map((label,index)=>`<th scope="col" data-comparison-metric="${ids[index]}">${headerModels[index]?modelIdentity(headerModels[index]):safe(label)}</th>`).join('')}</tr></thead><tbody>${rows.map(model=>`<tr data-comparison-model="${model.name}"><th scope="row"><a href="#model/${encodeURIComponent(model.name)}">${modelIdentity(model.name)}</a></th>${ids.map(id=>`<td data-comparison-metric="${id}">${publishedFormat(metricOf(id).get(model),metricOf(id))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function comparisonBars(id,rows=publication.models,ranked=false,descending=true){
  const measure=metricOf(id),ordered=ranked?[...rows].sort((a,b)=>(measure.get(b)-measure.get(a))*(descending?1:-1)):[...rows];
  const max=measure.signed?Math.max(.05,Math.ceil(Math.max(...rows.map(model=>Math.abs(measure.get(model))))*20)/20):(measure.max||1);
  const ticks=measure.signed?[-max,0,max]:[0,max/2,max];
  const tick=value=>measure.percent?`${Math.round(value*100)}%`:measure.decimals===4?value.toFixed(3):Number(value.toFixed(2));
  return `<div class="comparison-bars ${measure.signed?'is-signed':''}" role="group" aria-label="${safe(measure.label)} by model"><div class="comparison-bar-axis" aria-hidden="true">${ticks.map(value=>`<span>${tick(value)}</span>`).join('')}</div>${ordered.map((model,index)=>{const value=measure.get(model),width=Math.abs(value)/max*(measure.signed?50:100),left=measure.signed?(value<0?50-width:50):0;return `<a class="comparison-bar-row" href="#model/${encodeURIComponent(model.name)}" aria-label="${safe(model.name)}: ${publishedFormat(value,measure)}"><span class="comparison-model">${ranked?`<small>${String(index+1).padStart(2,'0')}</small>`:''}<img src="${assets(model.name)}" alt=""/><span>${modelNameMarkup(model.name)}</span></span><i class="comparison-bar-track"><b style="left:${left}%;width:${width}%;background:${color(model.name)}"></b></i><strong>${publishedFormat(value,measure)}</strong></a>`;}).join('')}</div>`;
}
function metricComparison(id){
  const measure=metricOf(id),guide=measureGuide(id);
  return `<header class="comparison-reading"><h4>${safe(measure.label)}</h4><p>${safe(guide.meaning)}</p></header>${comparisonBars(id)}<p class="comparison-reading-note">${safe(guide.reading)}</p>`;
}
const stageCodes={stage0:'L1&ndash;L2',stage1:'L3&ndash;L4',stage2:'L5&ndash;L6',coherence:'Ratio'};
const measureHints={stage0:'Keep the goal and use available information',stage1:'Make progress and respond in context',stage2:'Choose a direction and sustain it',coherence:'Follow-through relative to initiative',pairings:'Inspect every assistant and partner combination','pairing-summary':'Compare the mean and spread across assistants','architecture-purpose':'Task-oriented, mixed and open-ended settings','architecture-stages':'Compare gains across the three stages',information:'Sufficient, partial and insufficient information',repeats:'The same study repeated three times',judges:'The same interactions, different judges'};
function railMeasureLabel(id,label){return `<span class="rail-measure-marker ${stageCodes[id]?'has-code':''}" aria-hidden="true">${stageCodes[id]||''}</span><span class="rail-measure-name">${label}</span>`;}
function mainComparisonPanel(){
  const group=mainComparisonGroups.find(group=>group.id===mainComparisonGroup),rich=CSS.supports('appearance','base-select');
  return `<div class="main-measure-selector"><h3>${navigationIcon(group.icon)}<span>${group.title}</span></h3><label class="measure-select-field"><span class="atlas-visually-hidden">Select a measure</span><select class="atlas-rich-select" id="main-comparison-select" aria-label="Select a measure">${rich?'<button type="button"><selectedcontent></selectedcontent></button>':''}${group.items.map(([id,label])=>`<option value="${id}" aria-label="${safe(label)}" ${id===mainComparisonMeasure?'selected':''}>${rich?`<span class="measure-option-icon ${stageCodes[id]?'has-code':''}" aria-hidden="true">${stageCodes[id]||navigationIcon(group.icon)}</span><span class="measure-option-copy"><span>${label}</span>${measureHints[id]?`<small>${measureHints[id]}</small>`:''}</span>`:label}</option>`).join('')}</select></label></div><div class="comparison-content">${mainComparisonContent()}</div>`;
}

function mainComparisonContent(){
  switch(mainComparisonMeasure){
    case 'stage-profile':return `<header class="comparison-reading"><h4>Model differences widen at the proactive stage</h4><p>The same ten systems are compared across all three stages. Scores are three-pass means on a 0–1 scale.</p></header>${comparisonDataTable(['stage0','stage1','stage2'],['Passive execution · L1–L2','Interactive adaptation · L3–L4','Proactive promotion · L5–L6'])}<div class="finding-stage-ranges" aria-label="Across-model score ranges">${['Passive execution','Interactive adaptation','Proactive promotion'].map((label,index)=>{const values=publication.models.map(model=>model.stages[index]);return `<span>${label}<strong>${number(Math.max(...values)-Math.min(...values))}</strong></span>`;}).join('')}</div><p class="comparison-reading-note">Across-model ranges (maximum minus minimum). The 10.6× comparison describes the widening score range, not a tenfold ratio between individual models. Source: Table 5 and Figure 7.</p>`;
    case 'pairings':return pairingMatrix();
    case 'pairing-summary':return `<header class="comparison-reading"><h4>Partner comparison</h4><p>Each partner interacts with all ten assistants. Read the resulting average and spread together.</p></header><div class="comparison-table-wrap"><table class="comparison-data-table"><thead><tr><th scope="col">Partner</th><th scope="col">Mean assistant score</th><th scope="col">Across-assistant range</th></tr></thead><tbody>${publication.interaction_matrix.map(row=>`<tr><th scope="row">${modelIdentity(row.partner)}</th><td>${number(row.mean)}</td><td>${number(row.span)}</td></tr>`).join('')}</tbody></table></div><p class="comparison-reading-note">These values describe the assistants interacting with each partner. The partner’s own capability is reported under User-role capability.</p>`;
    case 'architecture-purpose':return architectureComparison('purpose');
    case 'architecture-stages':return architectureComparison('stages');
    case 'repeats':return `<header class="comparison-reading"><h4>Independent passes</h4><p>Three repetitions of the same design. Read the scores and their variation together.</p></header>${comparisonDataTable(['pass1','pass2','pass3','pass-sd'],['Pass 1','Pass 2','Pass 3','Sample SD'])}`;
    case 'judges':return `<header class="comparison-reading"><h4>Changing the judge</h4><p>The recorded interactions stay fixed while the scoring judge changes.</p></header>${comparisonDataTable(['composite','judge-astra','judge-gemini','judge-qwen'],['Claude Opus 5','gpt-6-astra','gemini-3.8-pro','qwen3.8-max'],publication.models,['Claude Opus 5','gpt-6-astra','gemini-3.8-pro','qwen3.8-max'])}`;
    case 'information':return informationComparison();
    case 'group-size':return groupSizeComparison();
    default:return metricComparison(mainComparisonMeasure);
  }
}
function pairingReadout(){
  const row=publication.interaction_matrix.find(row=>row.partner===pairingSelection.partner),value=row.scores[publication.models.findIndex(model=>model.name===pairingSelection.assistant)];
  return `<div><span>Partner</span><strong>${modelIdentity(pairingSelection.partner)}</strong></div><span class="pairing-readout-arrow" aria-hidden="true">→</span><div><span>Scored assistant</span><strong>${modelIdentity(pairingSelection.assistant)}</strong></div><b>${number(value)}</b>`;
}
function pairingMatrix(){
  return `<header class="comparison-reading"><h4>All 100 pairings</h4><p>Rows are partners; columns are the assistants being scored. Select a cell to inspect a pairing.</p></header><div id="pairing-readout" class="pairing-readout" aria-live="polite">${pairingReadout()}</div><div class="pairing-matrix-wrap" tabindex="0" role="region" aria-label="All 100 assistant and partner scores"><table class="pairing-matrix"><thead><tr><th scope="col">Partner ↓<br/>Scored assistant →</th>${publication.models.map(model=>`<th scope="col"><div class="pairing-column-identity"><img src="${assets(model.name)}" alt=""/><span>${modelNameMarkup(model.name)}</span></div></th>`).join('')}</tr></thead><tbody>${publication.interaction_matrix.map(row=>`<tr class="${row.partner==='claude-5-opus'?'is-standard-partner':''}"><th scope="row">${modelIdentity(row.partner)}${row.partner==='claude-5-opus'?'<small>Standard partner</small>':''}</th>${row.scores.map((value,index)=>{const assistant=publication.models[index].name,self=row.partner===assistant;return `<td><button type="button" data-pairing-partner="${row.partner}" data-pairing-assistant="${assistant}" aria-pressed="${row.partner===pairingSelection.partner&&assistant===pairingSelection.assistant}" aria-label="${safe(row.partner)} as partner; ${safe(assistant)} as assistant: ${number(value)}${self?'; self-play':''}" style="--pair-fill:${.06+value*.65}">${number(value)}${self?'<span aria-hidden="true">◇</span>':''}</button></td>`;}).join('')}</tr>`).join('')}</tbody></table></div><p class="comparison-reading-note">◇ marks self-play. The standard-partner row matches the main model comparison. On a narrow screen, scroll the matrix horizontally.</p>`;
}
function architectureComparison(type){
  const labels=type==='purpose'?['Task-oriented','Mixed purpose','Open-ended']:['Passive · L1–L2','Responsive · L3–L4','Active · L5–L6'];
  const max=.08;
  return `<header class="comparison-reading"><h4>${type==='purpose'?'Gains by interaction purpose':'Gains by capability stage'}</h4><p>Each gain compares an architecture with the same base model, averaged over ten models.</p></header><div class="architecture-comparison-grid">${publication.architecture_gains.map(gain=>{const values=type==='purpose'?['functional','mixed','nonfunctional'].map(key=>gain.purpose_gains[key]):gain.stages;return `<article><h4>${agentIcon(gain.architecture)}${gain.architecture}</h4>${values.map((value,index)=>`<div class="architecture-gain-row"><span>${labels[index]}</span><strong>${signed(value)}</strong><i><b style="width:${value/max*100}%"></b></i></div>`).join('')}<p>Overall gain <b>${signed(gain.composite)}</b></p><a href="#agents?architecture=${encodeURIComponent(gain.architecture)}">Explore configurations ↗</a></article>`;}).join('')}</div><p class="comparison-reading-note">All gain bars share the same 0–0.08 scale.</p>`;
}
function informationComparison(){
  const labels=mainInformationView==='conditions'?['Sufficient','Partial','Insufficient']:['Explicit gap','Concealed gap','Concealed + false premise'];
  const columns=mainInformationView==='conditions'?['sufficient','partial','insufficient']:['explicit','concealed','false-premise'];
  return `<header class="comparison-reading"><h4>Information gaps</h4><p>A matched-scenario comparison reported for three models.</p></header><div class="comparison-switch" role="group" aria-label="Information comparison"><button data-information-view="conditions" aria-pressed="${mainInformationView==='conditions'}">Information available</button><button data-information-view="variants" aria-pressed="${mainInformationView==='variants'}">Inside partial information</button></div><div class="comparison-table-wrap"><table class="comparison-data-table"><thead><tr><th scope="col">Model</th>${labels.map((label,index)=>`<th scope="col" data-comparison-metric="${columns[index]}">${label}</th>`).join('')}</tr></thead><tbody>${publication.matched_information.map(model=>`<tr data-comparison-model="${model.name}"><th scope="row"><a href="#model/${encodeURIComponent(model.name)}">${modelIdentity(model.name)}</a></th>${model[mainInformationView].map((value,index)=>`<td data-comparison-metric="${columns[index]}">${number(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="comparison-reading-note">These matched scenarios are a separate comparison from the full-roster purpose and world-setting means.</p>`;
}
function groupSizeComparison(){
  const labels={active:'Proactive promotion · L5–L6',coherence:'L6 / L5',passive_responsive:'Passive & responsive · L1–L4'};
  return `<header class="comparison-reading"><h4>More participants</h4><p>Each model is scored in a group; all other participants are played by claude-5-opus.</p></header><div class="comparison-switch" role="group" aria-label="Group-size measure">${Object.entries(labels).map(([id,label])=>`<button data-group-size-measure="${id}" aria-pressed="${mainGroupMeasure===id}">${label}</button>`).join('')}</div><div class="comparison-table-wrap"><table class="comparison-data-table"><thead><tr><th scope="col">Scored model</th>${[2,3,4].map(size=>`<th scope="col">${size} participants</th>`).join('')}</tr></thead><tbody>${publication.models.map(model=>`<tr><th scope="row">${modelIdentity(model.name)}</th>${model.group_size[mainGroupMeasure].map(value=>`<td>${number(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function refreshMainComparison(scroll=false){
  const body=document.getElementById('main-comparison-body');if(!body)return;
  window.InteractEvalFindingFocus?.clear();
  const previousFocus=document.activeElement?.id;
  body.innerHTML=mainComparisonPanel();
  if(previousFocus==='main-comparison-select')document.getElementById('main-comparison-select')?.focus({preventScroll:true});
  if(document.documentElement.dataset.uiInput!=='keyboard'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)body.querySelector('.comparison-content')?.animate([{opacity:.4},{opacity:1}],{duration:180,easing:'cubic-bezier(.23,1,.32,1)'});
  document.querySelectorAll('[data-main-family]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mainFamily===mainComparisonGroup)));
  document.querySelectorAll('[data-main-comparison]').forEach(button=>{if(button.dataset.mainComparison===mainComparisonMeasure)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
  document.querySelectorAll('[data-main-rail-group]').forEach(detail=>detail.open=detail.dataset.mainRailGroup===mainComparisonGroup);
  atlasResponsiveTables();atlasDataMotion();
  if(scroll)atlasScrollTo(document.getElementById('comparisons'));
}
function selectMainComparison(id,scroll=false){
  const group=mainComparisonGroups.find(group=>group.items.some(item=>item[0]===id));if(!group)return;
  mainComparisonGroup=group.id;mainComparisonMeasure=id;refreshMainComparison(scroll);
}
function leaderboardMetricSelect(){
 const rich=CSS.supports('appearance','base-select'),icons=['stages','scenario','scenario','partner'];
 return `<label class="leaderboard-measure-field"><span>Compare by</span><select class="atlas-rich-select" id="leaderboard-measure" aria-label="Compare by">${rich?'<button type="button"><selectedcontent></selectedcontent></button>':''}${leaderboardGroups.map((group,index)=>`<optgroup label="${group.title}">${group.items.map(id=>`<option value="${id}" aria-label="${safe(metricOf(id).label)}" ${metric===id?'selected':''}>${rich?`<span class="measure-option-icon ${stageCodes[id]?'has-code':''}" aria-hidden="true">${stageCodes[id]||navigationIcon(id==='composite'?'overview':icons[index])}</span><span class="measure-option-copy"><span>${safe(metricOf(id).label)}</span>${measureHints[id]?`<small>${measureHints[id]}</small>`:''}</span>`:safe(metricOf(id).label)}</option>`).join('')}</optgroup>`).join('')}</select></label>`;
}
function curatedLeaderboard(){
  if(!leaderboardIds().includes(metric))metric='composite';
  const measure=metricOf(metric),guide=measureGuide(metric);
  return `<div class="curated-leaderboard"><header class="leaderboard-intro"><h1>Leaderboards</h1><p>Compare overall capability, the three interaction stages, and performance in specific settings.</p></header><div class="leaderboard-selection">${leaderboardMetricSelect()}<div class="comparison-switch" role="group" aria-label="Leaderboard view"><button data-leaderboard-view="chart" aria-pressed="${view==='chart'}">Chart</button><button data-leaderboard-view="table" aria-pressed="${view==='table'}">Table</button></div></div><section class="leaderboard-comparison"><header class="comparison-reading"><h2>${safe(measure.label)}</h2><p>${safe(guide.meaning)}</p></header>${view==='chart'?comparisonBars(metric,publication.models,true):comparisonDataTable([metric],[measure.label],[...publication.models].sort((a,b)=>measure.get(b)-measure.get(a)))}<p class="comparison-reading-note">${safe(guide.reading)}</p></section><a class="leaderboard-main-link" href="./index.html#model-readout">Explore all six capability levels on Main ↗</a></div>`;
}

document.addEventListener('click',event=>{
  const level=event.target.closest('[data-main-level]');

  if(level){const id=level.dataset.mainLevel,note=document.getElementById('main-level-note');selectedMainLevel=selectedMainLevel===id?null:id;readMainLevels.add(id);document.querySelectorAll('[data-main-level]').forEach(button=>{button.setAttribute('aria-expanded',String(button.dataset.mainLevel===selectedMainLevel));button.querySelector('i')?.classList.toggle('is-read',readMainLevels.has(button.dataset.mainLevel));});note.hidden=!selectedMainLevel;document.querySelectorAll('.main-capability-table [data-score-level]').forEach(cell=>cell.classList.toggle('is-level-selected',cell.dataset.scoreLevel===selectedMainLevel));if(selectedMainLevel){note.innerHTML=mainLevelExplanation(id);if(level.closest('.level-explanation-tabs'))note.querySelector(`[data-main-level="${id}"]`)?.focus();if(matchMedia('(max-width:600px)').matches&&note.getBoundingClientRect().top<document.querySelector('.masthead').getBoundingClientRect().bottom)atlasScrollTo(note);}}
  if(event.target.closest('[data-close-main-level]')){selectedMainLevel=null;document.querySelectorAll('.is-level-selected').forEach(cell=>cell.classList.remove('is-level-selected'));document.getElementById('main-level-note').hidden=true;document.querySelectorAll('[data-main-level]').forEach(button=>button.setAttribute('aria-expanded','false'));}
  const family=event.target.closest('[data-main-family]');if(family){const group=mainComparisonGroups.find(group=>group.id===family.dataset.mainFamily);selectMainComparison(group.items[0][0]);}
  const item=event.target.closest('[data-main-comparison]');if(item)selectMainComparison(item.dataset.mainComparison,true);
  const pair=event.target.closest('[data-pairing-partner]');if(pair){pairingSelection={partner:pair.dataset.pairingPartner,assistant:pair.dataset.pairingAssistant};document.getElementById('pairing-readout').innerHTML=pairingReadout();document.querySelectorAll('[data-pairing-partner]').forEach(button=>button.setAttribute('aria-pressed',String(button===pair)));}
  const information=event.target.closest('[data-information-view]');if(information){mainInformationView=information.dataset.informationView;refreshMainComparison();}
  const group=event.target.closest('[data-group-size-measure]');if(group){mainGroupMeasure=group.dataset.groupSizeMeasure;refreshMainComparison();}
  const board=event.target.closest('[data-leaderboard-view]');if(board){view=board.dataset.leaderboardView;render();}
});
document.addEventListener('change',event=>{
  if(event.target.id==='main-comparison-select'){selectMainComparison(event.target.value);document.getElementById('main-comparison-select')?.focus({preventScroll:true});}
  if(event.target.id==='leaderboard-measure'){metric=event.target.value;render();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&selectedMainLevel){selectedMainLevel=null;document.querySelectorAll('.is-level-selected').forEach(cell=>cell.classList.remove('is-level-selected'));document.getElementById('main-level-note')?.setAttribute('hidden','');document.querySelectorAll('[data-main-level]').forEach(button=>button.setAttribute('aria-expanded','false'));}});
