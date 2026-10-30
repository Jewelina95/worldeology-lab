'use strict';

let modelCategory='All',modelFocusMetric=null,lastExplorerHash='',modelSelection=null;
let researchFocus='claude-opus-5.5',researchObserver,lastJournalAnchor='';
const evaluationGroups=[
  {id:'Overview',title:'Overview',deck:'Composite, coherence, and purpose disposition.',metrics:['composite','coherence','purpose']},
  {id:'Capabilities',title:'Capability dimensions',deck:'Six levels and the three stages of interaction.',metrics:['L1','L2','L3','L4','L5','L6','stage0','stage1','stage2']},
  {id:'Scenarios',title:'Scenario conditions',deck:'Published marginal means by interaction purpose and realism.',metrics:['functional','mixed','nonfunctional','realistic','stylized','science-fictional']},
  {id:'Behavior',title:'Behavior at information gaps',deck:'Supplying unsupported facts and requesting missing information are distinct behaviors.',metrics:['fabrication','clarification']},
  {id:'Outcomes',title:'Terminal outcomes',deck:'Closure depends on interaction purpose. Pooled rates are descriptive, rather than a general capability ranking.',metrics:['functional-closure','nonfunctional-closure','closure','exhaustion']},
  {id:'Duration',title:'Conversation length',deck:'Adaptive episode lengths and the separate fixed-length subsample.',metrics:['median-turns','adaptive-prefix','fixed8','fixed16','fixed32']},
  {id:'Partners',title:'Partners & role asymmetry',deck:'The partner role, self-play, and user-side capabilities have their own measurements.',metrics:['user-composite','user-active','probing','cooperativeness','self-play','self-gap']},
  {id:'Reliability',title:'Repeatability & judge sensitivity',deck:'Independent passes and alternative judges are reported separately.',metrics:['pass1','pass2','pass3','pass-sd','judge-astra','judge-gemini','judge-qwen']}
];

function setupExplorer(){
  metrics.push(
    {id:'fabrication',label:'Fabrication rate',table:'behavior',get:m=>m.behavior.fabrication,percent:true},
    {id:'clarification',label:'Clarification rate',table:'behavior',get:m=>m.behavior.clarification,percent:true},
    {id:'functional-closure',label:'Functional closure',table:'outcomes',get:m=>m.functional_closure,percent:true},
    {id:'nonfunctional-closure',label:'Nonfunctional closure',table:'outcomes',get:m=>m.nonfunctional_closure,percent:true},
    {id:'median-turns',label:'Median assistant turns',table:'duration',get:m=>m.duration.median,max:20,decimals:0},
    {id:'adaptive-prefix',label:'Adaptive prefix · subsample',table:'duration',get:m=>m.duration.adaptive},
    ...[8,16,32].map((n,i)=>({id:'fixed'+n,label:n+'-turn fixed episode',table:'duration',get:m=>m.duration.fixed[i]})),
    {id:'user-composite',label:'User-side composite',table:'user_role',get:m=>m.user_role.composite},
    {id:'user-active',label:'User-side active adaptation',table:'user_role',get:m=>m.user_role.stages[2]},
    {id:'probing',label:'Partner probing intensity',table:'partners',get:m=>m.partner.probing},
    {id:'cooperativeness',label:'Partner cooperativeness',table:'partners',get:m=>m.partner.cooperativeness},
    {id:'self-play',label:'Self-play composite',table:'self_play',get:m=>m.self_play.score},
    {id:'self-gap',label:'Standard-user minus self-play',table:'self_play',get:m=>m.self_play.gap,signed:true},
    ...[1,2,3].map((n,i)=>({id:'pass'+n,label:'Independent pass '+n,table:'reliability',get:m=>m.reliability.passes[i]})),
    {id:'pass-sd',label:'Between-pass standard deviation',table:'reliability',get:m=>m.reliability.sd,max:.004,decimals:4},
    ...['astra','gemini','qwen'].map((n,i)=>({id:'judge-'+n,label:'Judge · '+['gpt-6-astra','gemini-3.8-pro','qwen3.8-max'][i],table:'judges',get:m=>m.reliability.judges[i+1]}))
  );
}
const publishedFormat=(value,m)=>m.decimals!==undefined?value.toFixed(m.decimals):format(value,m);
function selectedPublicationModels(){return publication.models.filter(m=>!modelSelection||modelSelection.has(m.name));}
function publishedColumns(id,rows=publication.models,follow=false){
  const m=metricOf(id),ordered=[...rows].sort((a,b)=>m.get(b)-m.get(a));
  if(!ordered.length)return '<p class="explorer-empty">Select at least one model to display results.</p>';
  const width=520,height=330,left=32,right=12,top=25,bottom=115,ph=height-top-bottom,step=(width-left-right)/ordered.length;
  const max=m.signed?Math.max(.05,Math.ceil(Math.max(...publication.models.map(r=>Math.abs(m.get(r))))*20)/20):(m.max||1);
  const y=v=>top+(m.signed?(max-v)/(2*max):1-v/max)*ph,zero=y(0);
  const ticks=m.signed?[-max,-max/2,0,max/2,max]:[0,.25,.5,.75,1].map(v=>v*max);
  return `<svg class="published-columns" viewBox="0 0 ${width} ${height}" role="group" aria-label="${safe(m.label)} by model">${ticks.map(t=>`<line x1="${left}" x2="${width-right}" y1="${y(t)}" y2="${y(t)}" class="${t===0?'agent-zero':'agent-gridline'}"/><text x="${left-7}" y="${y(t)+3}" class="agent-axis">${m.percent?(t*100).toFixed(0)+'%':m.decimals===4?t.toFixed(3):Number(t.toFixed(2))}</text>`).join('')}${ordered.map((r,i)=>{const cx=left+(i+.5)*step,value=m.get(r),py=y(value);return `<a class="agent-chart-entry" href="#model/${encodeURIComponent(r.name)}" ${follow?`data-follow-model="${safe(r.name)}"`:''} aria-label="${safe(r.name)}: ${publishedFormat(value,m)}"><title>${safe(r.name)} · ${safe(m.label)}: ${publishedFormat(value,m)}</title><rect x="${cx-step*.32}" y="${Math.min(py,zero)}" width="${step*.64}" height="${Math.max(1,Math.abs(py-zero))}" rx="2" fill="${color(r.name)}"/><text x="${cx}" y="${value<0?py+13:py-7}" class="agent-chart-value">${publishedFormat(value,m)}</text><image href="${assets(r.name)}" x="${cx-7}" y="${height-bottom+12}" width="14" height="14" aria-hidden="true"/><text class="agent-chart-label" transform="translate(${cx+3} ${height-bottom+40}) rotate(-56)">${safe(r.name)}</text></a>`;}).join('')}</svg>`;
}
function publishedMetricCard(id,rows=selectedPublicationModels()){
  const m=metricOf(id);return `<article class="explorer-metric-card"><header><div><h3>${safe(measureGuide(id).title)}</h3><span class="formal-metric-name">${safe(m.label)}</span></div><button data-expand-measure="${id}" aria-label="Expand ${safe(m.label)}">↗</button></header>${measureExplanation(id,true)}<div class="explorer-chart-meta"><span>${m.percent?'Reported rate':m.decimals===0?'Assistant turns':m.id==='pass-sd'?'Sample SD · three passes':m.signed?'Zero-centered contrast':'Published score · 0–1'}</span><span>InteractEval</span></div>${publishedColumns(id,rows)}<p class="metric-reading-note">${safe(measureGuide(id).reading)}</p></article>`;
}
function modelExplorer(){
  if(lastExplorerHash!==location.hash){lastExplorerHash=location.hash;const query=new URLSearchParams(location.hash.split('?')[1]||'');modelFocusMetric=query.get('metric');if(evaluationGroups.some(g=>g.id===query.get('category')))modelCategory=query.get('category');}
  if(route==='leaderboards')return legacyLeaderboard();
  const groups=modelFocusMetric?[{id:'Selected',title:metricOf(modelFocusMetric).label,deck:'',metrics:[modelFocusMetric]}]:evaluationGroups.filter(g=>modelCategory==='All'||modelCategory===g.id);
  const rows=selectedPublicationModels(),ids=groups.flatMap(g=>g.metrics);
  return `<div class="section-top"><h1>Cognition & interaction</h1></div><p class="page-deck">Explore the published evaluation across capabilities, scenarios, behavior, outcomes, duration, and participant roles.</p><div class="models-workspace"><aside class="explorer-sidebar"><small>Evaluation index</small><button data-model-category="All" class="${modelCategory==='All'&&!modelFocusMetric?'active':''}">All evaluations <span>${evaluationGroups.flatMap(g=>g.metrics).length}</span></button>${evaluationGroups.map(g=>`<button data-model-category="${g.id}" class="${!modelFocusMetric&&modelCategory===g.id?'active':''}">${g.title}<span>${g.metrics.length}</span></button>`).join('')}<div class="explorer-sidebar-links"><a href="#agents">Agent systems ↗</a><a href="#cases">Inside the interaction ↗</a><a href="./research.html">Research journal ↗</a></div></aside><div class="explorer-content"><section class="explorer-controls"><div><h2>Evaluations</h2><p>${ids.length} measures · ${rows.length} of 10 models</p></div><div class="explorer-control-actions"><details class="model-picker"><summary>${rows.length} models <span>⌄</span></summary><div>${publication.models.map(m=>`<label><input type="checkbox" data-model-selection="${m.name}" ${!modelSelection||modelSelection.has(m.name)?'checked':''}/><img src="${assets(m.name)}" alt=""/>${m.name}</label>`).join('')}<button data-reset-models>Reset selection</button></div></details><button id="paper-view">${view==='chart'?'Table view':'Chart view'}</button><button data-download-models title="Download the displayed published values">CSV ↓</button></div></section><div class="explorer-category-pills"><button data-model-category="All" class="${modelCategory==='All'&&!modelFocusMetric?'active':''}">All evaluations</button>${evaluationGroups.map(g=>`<button data-model-category="${g.id}" class="${modelCategory===g.id&&!modelFocusMetric?'active':''}">${g.id}</button>`).join('')}</div><div class="explorer-source-strip"><span><i></i> 27 scenario cells · 3 passes · 2,430 episodes per base model</span></div>${view==='table'?explorerTable(rows,ids):groups.map(g=>`<section class="explorer-group"><div class="explorer-group-heading"><h2>${g.title}</h2><p>${g.deck}</p></div><div class="explorer-chart-grid ${g.metrics.length===1?'one-measure':''}">${g.metrics.map(id=>publishedMetricCard(id,rows)).join('')}</div></section>`).join('')}<p class="paper-footnote">Values reproduce the paper tables, at their reported precision. Scenario charts are marginal means; they do not imply unreported combinations of conditions. Examples are available in the separate case library.</p></div></div>`;
}
function explorerTable(rows,ids){return `<div class="paper-table-wrap"><table class="paper-table explorer-wide-table"><thead><tr><th>Model</th>${ids.map(id=>`<th>${safe(metricOf(id).label)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th><a href="#model/${r.name}"><img src="${assets(r.name)}" alt=""/>${r.name}</a></th>${ids.map(id=>`<td>${publishedFormat(metricOf(id).get(r),metricOf(id))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function expandedModelDiagnostics(m){return `<section class="paper-card"><h2>Behavior & conversation length</h2><div class="profile-diagnostic-grid">${[['Fabrication rate',number(m.behavior.fabrication,true),'behavior'],['Clarification rate',number(m.behavior.clarification,true),'behavior'],['Median assistant turns',m.duration.median+' · IQR '+m.duration.q1+'–'+m.duration.q3,'duration'],['User-side composite',number(m.user_role.composite),'user_role']].map(([label,value,table])=>`<article><span>${label}</span><b>${value}</b></article>`).join('')}</div></section><section class="paper-card"><h2>Scenario profile</h2><div class="profile-diagnostic-grid">${['functional','mixed','nonfunctional','realistic','stylized','science-fictional'].map(id=>`<article><span>${metricOf(id).label}</span><b>${number(m.facets[id])}</b></article>`).join('')}</div></section><section class="paper-card"><h2>Independent passes</h2><div class="profile-diagnostic-grid">${m.reliability.passes.map((v,i)=>`<article><span>Pass ${i+1}</span><b>${number(v)}</b></article>`).join('')}<article><span>Between-pass sample SD</span><b>${m.reliability.sd.toFixed(4)}</b></article></div></section>`;}

function richMasthead(){renderPageNavigation();}
function focusModel(){return publication.models.find(m=>m.name===researchFocus)||publication.models[0];}
function researchHeatmap(){return `<div class="heatmap-wrap"><table class="capability-heatmap"><thead><tr><th>Assistant</th>${levelNames.map((n,i)=>`<th>L${i+1}<br/><small>${n}</small></th>`).join('')}</tr></thead><tbody>${publication.models.map(m=>`<tr class="${m.name===researchFocus?'is-focused':''}"><th><button data-follow-model="${m.name}"><img src="${assets(m.name)}" alt=""/>${m.name}</button></th>${m.levels.map(v=>`<td style="background:rgba(91,139,105,${.07+v*.48})">${number(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function researchRanges(){return `<div class="journal-range-axis"><span>0</span><span>0.25</span><span>0.50</span><span>0.75</span><span>1</span></div><div class="journal-range-list">${publication.models.map((m,i)=>{const low=Math.min(...m.reliability.passes),high=Math.max(...m.reliability.passes);return `<button data-follow-model="${m.name}" class="${m.name===researchFocus?'is-focused':''}"><span class="range-model"><small>${String(i+1).padStart(2,'0')}</small><img src="${assets(m.name)}" alt=""/>${m.name}</span><span class="journal-range-track"><i style="left:${low*100}%;width:${Math.max(.4,(high-low)*100)}%"></i><b style="left:${m.composite*100}%"></b></span><strong>${number(m.composite)}</strong><small>3 passes</small></button>`;}).join('')}</div>`;}
function researchFocusCard(){const m=focusModel();return `<div class="journal-focus-card"><div><small>Selected model</small><h3><img src="${assets(m.name)}" alt=""/>${m.name}</h3><a href="./index.html#model/${m.name}">Full model profile ↗</a></div><div><span>Composite</span><b>${number(m.composite)}</b></div><div><span>Active adaptation</span><b>${number(m.stages[2])}</b></div><div><span>Median turns</span><b>${m.duration.median}</b></div><div><span>Between-pass SD</span><b>${m.reliability.sd.toFixed(4)}</b></div></div>`;}
function researchOutcomes(){return `<div class="journal-outcome-head"><span>Model</span><span>Task-oriented scenes</span><span>Open-ended scenes</span></div>${publication.models.map(m=>`<button class="journal-purpose-row ${m.name===researchFocus?'is-focused':''}" data-follow-model="${m.name}"><span><img src="${assets(m.name)}" alt=""/>${m.name}</span>${[m.functional_closure,m.nonfunctional_closure].map(v=>`<span><i style="width:${v/.25*100}%"></i><b>${number(v,true)}</b></span>`).join('')}</button>`).join('')}`;}
function researchPairings(){return `<div class="paper-table-wrap"><table class="journal-pairing-table"><thead><tr><th>Partner ↓ · scored assistant →</th>${publication.models.map(m=>`<th title="${safe(m.name)}"><img src="${assets(m.name)}" alt=""/>${safe(m.name)}</th>`).join('')}</tr></thead><tbody>${publication.interaction_matrix.map(r=>`<tr><th>${r.partner}</th>${r.scores.map((v,i)=>`<td><button data-follow-model="${publication.models[i].name}" style="background:rgba(91,139,105,${.05+v*.55})" title="${safe(r.partner)} as partner; ${safe(publication.models[i].name)} as assistant">${number(v)}${r.partner===publication.models[i].name?' ◇':''}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function journalSection(id,index,kicker,title,deck,body){return `<section id="${id}" class="article-section" aria-labelledby="${id}-heading"><header class="section-head-row journal-section-heading"><div><h2 id="${id}-heading">${title}</h2><p>${deck}</p></div></header>${body}</section>`;}
function researchArticle(){return researchIntroduction();}

function afterExplorerRender(){
  syncEditorialHeader();
  $('#app').classList.toggle('journal-app',route==='research'||route==='home');
  setupIntroductoryPlayer();
  if(researchObserver)researchObserver.disconnect();
  if(route==='research'||route==='home'){
    researchObserver=new IntersectionObserver(()=>syncArticleNavigation(),{rootMargin:'-90px 0px -55% 0px'});
    document.querySelectorAll('.article-section').forEach(s=>researchObserver.observe(s));
    const requested=location.hash.slice(1),aliases=route==='research'?{architecture:'framework',components:'layer-mechanism','scenario-space':'layer-data',rubric:'layer-normative',evidence:'layer-normative',method:'layer-normative','measurement-model':'theory','update-control':'layer-interaction'}:{outcomes:'process',coverage:'partners',method:'evidence',notes:'takeaways'},target=aliases[requested]||requested;
    if(lastJournalAnchor!==location.pathname+location.hash){lastJournalAnchor=location.pathname+location.hash;if(document.getElementById(target))requestAnimationFrame(()=>document.getElementById(target)?.scrollIntoView({block:'start',behavior:'instant'}));}
    syncArticleNavigation();
  }
}
function syncArticleNavigation(){
  const links=Array.from(document.querySelectorAll('.article-rail [data-research-section]'));
  if(!links.length)return;
  const offset=(document.querySelector('.masthead')?.getBoundingClientRect().height||80)+24;
  const anchorTop=offset+(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)+40;
  const home=document.querySelector('.results-page');if(home)home.style.setProperty('--home-nav-offset',offset+'px');
  let current=links[0];
  for(const link of links){const section=document.getElementById(link.dataset.researchSection);if(section&&section.getBoundingClientRect().top<=anchorTop)current=link;}
  for(const link of links){const active=link===current;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
}
let articleNavigationFrame=0;
function scheduleArticleNavigation(){if(articleNavigationFrame)return;articleNavigationFrame=requestAnimationFrame(()=>{articleNavigationFrame=0;syncArticleNavigation();});}
window.addEventListener('scroll',scheduleArticleNavigation,{passive:true});
window.addEventListener('resize',scheduleArticleNavigation,{passive:true});
document.addEventListener('click',event=>{
  const category=event.target.closest('[data-model-category]');if(category){modelCategory=category.dataset.modelCategory;modelFocusMetric=null;render();document.querySelector('.explorer-controls')?.scrollIntoView({block:'start',behavior:'smooth'});}
  if(event.target.closest('[data-reset-models]')){modelSelection=null;render();}
  const nav=event.target.closest('[data-nav-menu]');
  if(nav){const id=nav.dataset.navMenu,panel=document.getElementById('nav-'+id),opening=panel.hidden;document.querySelectorAll('.restored-nav-menu').forEach(p=>p.hidden=true);document.querySelectorAll('[data-nav-menu]').forEach(b=>b.setAttribute('aria-expanded','false'));panel.hidden=!opening;nav.setAttribute('aria-expanded',String(opening));}
  else if(!event.target.closest('.restored-nav-item')||event.target.closest('.nav-destination')){document.querySelectorAll('.restored-nav-menu').forEach(p=>p.hidden=true);document.querySelectorAll('[data-nav-menu]').forEach(b=>b.setAttribute('aria-expanded','false'));}
  const section=event.target.closest('[data-research-section]');if(section){event.preventDefault();document.getElementById(section.dataset.researchSection)?.scrollIntoView({behavior:'smooth',block:'start'});}
  const focus=event.target.closest('[data-follow-model]');if(focus){event.preventDefault();researchFocus=focus.dataset.followModel;render();}
  const expand=event.target.closest('[data-expand-measure]');if(expand){const id=expand.dataset.expandMeasure,m=metricOf(id),dialog=$('#measure-dialog');$('#measure-body').innerHTML=`<h2>${safe(measureGuide(id).title)}</h2><p>${safe(m.label)}</p>${measureExplanation(id)}${publishedColumns(id,selectedPublicationModels())}<p>Published table values. The example library does not contribute to this comparison.</p>`;dialog.showModal();}
  if(event.target.closest('[data-close-measure]'))$('#measure-dialog').close();
  if(event.target.closest('[data-download-models]')){const groups=modelFocusMetric?[{metrics:[modelFocusMetric]}]:evaluationGroups.filter(g=>modelCategory==='All'||g.id===modelCategory),ids=groups.flatMap(g=>g.metrics),csv=[['Model',...ids.map(id=>metricOf(id).label)],...selectedPublicationModels().map(m=>[m.name,...ids.map(id=>metricOf(id).get(m))])].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='InteractEval-published-measures.csv';a.click();URL.revokeObjectURL(url);}
});
document.addEventListener('change',event=>{
  const name=event.target.dataset.modelSelection;if(name){if(!modelSelection)modelSelection=new Set(publication.models.map(m=>m.name));if(event.target.checked)modelSelection.add(name);else modelSelection.delete(name);render();const picker=document.querySelector('.model-picker');if(picker)picker.open=true;}
  if(event.target.id==='journal-focus-model'){researchFocus=event.target.value;render();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelectorAll('.restored-nav-menu').forEach(p=>p.hidden=true);document.querySelectorAll('[data-nav-menu]').forEach(b=>b.setAttribute('aria-expanded','false'));}});
