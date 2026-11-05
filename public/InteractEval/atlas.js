'use strict';

const atlasFindings=[
  {id:'initiative',measure:'stage-profile',title:"What separates today's models is their ability to proactively advance an interaction.",description:'Across ten systems, the score range widens from 0.035 in passive execution to 0.370 in proactive promotion — a 10.6-fold difference in separation.',source:'Table 5 · Figure 7',destination:'Compare the three capability stages'},
  {id:'information',measure:'information',title:'More information can make a model perform worse.',description:'All three matched models score lower with partial than insufficient information. One possible explanation is that an obvious gap prompts clarification, while a partial specification invites unsupported assumptions.',source:'Tables 7–8 · Figures 8 and 10',destination:'Compare information conditions'},
  {id:'partners',measure:'pairings',title:"An AI's interactive performance depends on both its own capabilities and its ability to understand and adapt to its partner.",description:'The same assistant performs differently across partners. The 10 × 10 evaluation reveals a pairing effect beyond the separate effects of assistant and partner identity.',source:'Tables 11 and 29 · Figure 11',destination:'Explore all 100 pairings'}
];
let atlasMobileGroup=0;
const atlasSymbols={
  mind:'<path d="M12 57V38a19 19 0 0 1 38 0v19M30 64V48m19-23a17 17 0 0 1 19 17v20H50" stroke="currentColor" stroke-width="3"/><circle cx="31" cy="34" r="7" fill="currentColor" opacity=".4"/><path d="M43 34h17m-5-5 5 5-5 5" stroke="currentColor" stroke-width="3"/>',
  grounding:'<circle cx="29" cy="39" r="23" fill="currentColor" opacity=".18"/><circle cx="51" cy="39" r="23" fill="currentColor" opacity=".18"/><path d="m28 40 8 8 17-19" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
  awareness:'<circle cx="28" cy="48" r="17" stroke="currentColor" stroke-width="3"/><circle cx="28" cy="48" r="6" fill="currentColor"/><path d="M28 48 57 19m-18 0h18v18M50 56h18M59 47v18" stroke="currentColor" stroke-width="3"/>',
  information:'<rect x="12" y="15" width="23" height="50" rx="3" fill="currentColor" opacity=".2"/><path d="M19 28h9m-9 12h9m-9 12h9M45 24h22M45 40h9M45 56h22" stroke="currentColor" stroke-width="5"/>',
  partner:'<circle cx="23" cy="25" r="10" fill="currentColor"/><circle cx="57" cy="55" r="10" fill="currentColor" opacity=".45"/><path d="M12 57V45h23M68 23v12H45M35 51l10-22" stroke="currentColor" stroke-width="4"/>',
  architecture:'<path d="M12 15h22v22H12zM46 43h22v22H46z" fill="currentColor" opacity=".3"/><path d="M12 43h22v22H12zM46 15h22v22H46zM34 26h12M34 54h12" stroke="currentColor" stroke-width="3"/>',
  iceberg:'<path d="m17 32 20-25 18 25Z" fill="currentColor"/><path d="m10 39 19 30 23-4 17-26Z" fill="currentColor" opacity=".27"/><path d="M6 35h68" stroke="currentColor" stroke-width="3"/><path d="m37 39-8 30 23-4Z" fill="currentColor" opacity=".28"/>',
  movie:'<path d="M12 19h56v42H12Z" fill="currentColor" opacity=".15"/><path d="M12 19h56v42H12Z" stroke="currentColor" stroke-width="3"/><path d="m34 29 17 11-17 11Z" fill="currentColor"/><path d="M19 13v12m14-12v12m14-12v12m14-12v12M19 55v12m14-12v12m14-12v12m14-12v12" stroke="currentColor" stroke-width="3"/>',
  agency:'<path d="M12 61V42h18V27h18V12h19v12H58v15H40v15H22v7Z" fill="currentColor" opacity=".22"/><path d="M12 61h12V49h18V34h18V19h7" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/><circle cx="65" cy="18" r="7" fill="currentColor"/>'
};
function atlasSymbol(name){return `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">${atlasSymbols[name]}</svg>`;}
function atlasHero(){return `<section class="atlas-hero"><div><h1>A response is not<br/>an interaction.</h1><p>Interaction is what unfolds between replies. InteractEval measures how models understand changing situations, take initiative, and follow through across a conversation.</p><a href="#response-interaction" data-research-section="response-interaction">Why interact <span aria-hidden="true">&#8595;</span></a></div><figure><img src="./assets/brand/iceberg.svg" width="405" height="365" alt="An iceberg separates spoken words from a participant’s uncertain understanding, trust, and goals."/></figure></section>`;}
function atlasKeyFindings(){return `<section id="key-findings" class="article-section atlas-key-findings"><h2>Key Findings</h2><ol class="atlas-findings-list">${atlasFindings.map((f,index)=>`<li><a class="atlas-finding-link" href="#comparisons?measure=${f.measure}" data-finding-measure="${f.measure}"><span class="atlas-finding-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><div class="atlas-finding-text"><h3>${f.title}</h3></div></a>${f.id==='information'?`<div class="finding-information-definitions"><table><caption>Information conditions</caption><thead><tr><th scope="col">Sufficient</th><th scope="col">Partial</th><th scope="col">Insufficient</th></tr></thead><tbody><tr><td>The information needed to proceed is available.</td><td>The brief is incomplete, with a consequential information gap or a misleading premise.</td><td>The brief makes clear that more information is needed.</td></tr></tbody></table></div>`:''}</li>`).join('')}</ol></section>`;}

function atlasMobileScores(){
 const columns=[[0,5,6],[1,2,3],[4,5,6]][atlasMobileGroup],names=['Overall','L1','L2','L3','L4','L5','L6'];
 return `<div class="atlas-mobile-switch" role="group" aria-label="Displayed capability levels">${['Overview','L1–L3','L4–L6'].map((label,i)=>`<button type="button" data-atlas-mobile="${i}" aria-pressed="${atlasMobileGroup===i}">${label}</button>`).join('')}</div><div>${publication.models.map(m=>`<div class="atlas-mobile-model"><a href="#model/${encodeURIComponent(m.name)}">${modelIdentity(m.name)}</a><div>${columns.map(i=>{const v=[m.composite,...m.levels][i];return `<button type="button" data-main-level="${i?'L'+i:'composite'}" style="--score-fill:${.06+v*.4}"><span>${names[i]}</span><b>${number(v)}</b></button>`;}).join('')}</div></div>`).join('')}</div>`;
}
function syncAtlasLayout(){
 setupInteractionFigures();
 window.InteractEvalMotion?.unmountAll();window.InteractEvalMotion?.scan();
 const header=document.querySelector('.masthead');
 if(header){const size=()=>document.documentElement.style.setProperty('--header-height',Math.ceil(header.getBoundingClientRect().height)+'px');size();if(!header.atlasResize){header.atlasResize=new ResizeObserver(size);header.atlasResize.observe(header);}}
 syncAtlasActiveSection();
 atlasResponsiveTables();
 atlasDataMotion();
 window.InteractEvalFindingFocus?.fromLocation();
}
function atlasResponsiveTables(){
 document.querySelectorAll('.comparison-data-table,.agent-results-table').forEach(table=>{
   const wrap=table.parentElement;if(wrap.dataset.atlasCards==='true')return;
   const headerNodes=[...table.querySelectorAll('thead th')],heads=headerNodes.map(th=>th.textContent.trim());
   if(heads.length<2)return;
   const cards=document.createElement('div');cards.className='atlas-comparison-cards';
   for(const row of table.querySelectorAll('tbody tr')){
     const cells=[...row.children];if(cells.length!==heads.length)continue;
     const card=document.createElement('article'),name=document.createElement('div'),list=document.createElement('dl');
     if(row.dataset.comparisonModel)card.dataset.comparisonModel=row.dataset.comparisonModel;
     name.className='atlas-comparison-identity';name.innerHTML=cells[0].innerHTML;card.append(name);
     cells.slice(1).forEach((cell,i)=>{const item=document.createElement('div'),term=document.createElement('dt'),value=document.createElement('dd');const identity=headerNodes[i+1].querySelector('.model-identity');if(identity)term.append(identity.cloneNode(true));else term.textContent=heads[i+1];value.innerHTML=cell.innerHTML;if(cell.dataset.comparisonMetric)item.dataset.comparisonMetric=cell.dataset.comparisonMetric;item.append(term,value);list.append(item)});
     card.append(list);cards.append(card);
   }
   wrap.dataset.atlasCards='true';wrap.classList.add('has-atlas-cards');wrap.after(cards);
 });
}
function atlasScrollTo(element){
 if(!element)return;
 const instant=document.documentElement.dataset.uiInput==='keyboard'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 element.scrollIntoView({behavior:instant?'instant':'smooth',block:'start'});
}
document.addEventListener('keydown',()=>{document.documentElement.dataset.uiInput='keyboard'},{capture:true});
document.addEventListener('pointerdown',()=>{document.documentElement.dataset.uiInput='pointer'},{capture:true,passive:true});
function syncAtlasActiveSection(){
 const sections=[...document.querySelectorAll('.results-page .article-body>.article-section')];if(!sections.length)return;
 const edge=(document.querySelector('.masthead')?.getBoundingClientRect().bottom||0)+85;
 let current=sections[0];for(const section of sections)if(section.getBoundingClientRect().top<=edge)current=section;
 document.querySelectorAll('.main-rail-content [data-research-section]').forEach(a=>a.classList.toggle('active',a.dataset.researchSection===current.id));
}
let atlasScrollPending=false;
window.addEventListener('scroll',()=>{if(!atlasScrollPending){atlasScrollPending=true;requestAnimationFrame(()=>{atlasScrollPending=false;syncAtlasActiveSection()});}},{passive:true});
document.addEventListener('click',event=>{
 const finding=event.target.closest('[data-finding-measure]');
 if(finding&&!event.defaultPrevented&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){
  event.preventDefault();
  if(finding.dataset.findingMeasure==='information')mainInformationView='conditions';
  selectMainComparison(finding.dataset.findingMeasure);
  if(location.hash!==finding.getAttribute('href'))history.pushState(null,'',finding.getAttribute('href'));
  lastMainComparisonHash=location.hash;
  document.getElementById('main-comparison-body')?.focus({preventScroll:true});
  window.InteractEvalFindingFocus?.show(finding.dataset.findingMeasure);
  atlasScrollTo(document.querySelector('#main-comparison-body .comparison-content')||document.getElementById('comparisons'));
 }
 const toggle=event.target.closest('[data-atlas-contents]');
 if(toggle){const expanded=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(expanded));document.querySelector('.main-results-rail').classList.toggle('is-open',expanded);}
 const group=event.target.closest('[data-atlas-mobile]');if(group){atlasMobileGroup=Number(group.dataset.atlasMobile);document.querySelector('.atlas-mobile-scores').innerHTML=atlasMobileScores();}
 if(event.target.closest('.main-rail-content [data-research-section],.main-rail-content [data-main-comparison]')){document.querySelector('.main-results-rail')?.classList.remove('is-open');document.querySelector('[data-atlas-contents]')?.setAttribute('aria-expanded','false');}
});


const atlasMotionSeen=new WeakSet();
const atlasMotionObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){
  if(!entry.isIntersecting)continue;
  atlasMotionObserver.unobserve(entry.target);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.uiInput==='keyboard')continue;
  const bars=entry.target.querySelectorAll('.comparison-bar-track>b,.architecture-gain-row>i>b,.journal-purpose-row>span>i');
  if(bars.length){bars.forEach((bar,i)=>{bar.style.transformOrigin=bar.closest('.is-signed')&&parseFloat(bar.style.left)<50?'right center':'left center';bar.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:420,delay:Math.min(i*25,200),easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'});});}
  else entry.target.querySelectorAll('tbody tr').forEach((row,i)=>row.animate([{opacity:.35},{opacity:1}],{duration:220,delay:i*18,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'}));
 }
},{threshold:.15});
function atlasDataMotion(){
 document.querySelectorAll('.comparison-bars,.main-capability-wrap,.architecture-comparison-grid,.main-outcome-wrap,.comparison-table-wrap').forEach(el=>{if(!atlasMotionSeen.has(el)){atlasMotionSeen.add(el);atlasMotionObserver.observe(el);}});
}
