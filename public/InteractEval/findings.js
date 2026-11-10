'use strict';

let findingsResearch,findingsEvidence;
const findingById=id=>findingsResearch?.findings.find(f=>f.id===id);
const findingCategory=slug=>findingsResearch?.categories.find(c=>c.slug===slug);
const findingLink=f=>`./index.html#comparisons?measure=${encodeURIComponent(f.measure)}&finding=${f.id}`;
const findingCategoryLink=slug=>`./index.html#findings?category=${encodeURIComponent(slug)}`;
function activeResearchFinding(){
 const id=new URLSearchParams(location.hash.split('?')[1]||'').get('finding'),f=findingById(id);
 return f?.measure===mainComparisonMeasure?f:null;
}
function configureFindingMeasures(){
 const extra={stages:[['question-vs-agency','Clarification and initiative']],scenarios:[['gap-behavior','Unsupported factual additions'],['gap-correlation','Execution and unsupported facts']],duration:[['case-trajectories','Two interaction trajectories'],['turn-divergence','Scores at matched turns'],['termination-outcomes','Stopping outcomes'],['closure-purpose','Closure by purpose'],['stopping-ablation','Patience-budget ablation']],partners:[['partner-pressure','Pressure by capability'],['role-asymmetry','Partner effects across roles'],['simulated-user-quality','Simulated and human users']],architectures:[['architecture-headroom','Base capability and gains']],representations:[['role-probes','Role-dependent state readouts'],['shared-affection','Shared and independent states'],['shared-miscalibration','Correspondence and accuracy'],['partner-integration','Partner-conditioned computation'],['representation-control','Readouts and behavioral control']],measurement:[['weighting-sensitivity','Aggregation sensitivity'],['reconstruction-ablation','Reconstruction and probe separation'],['human-audit','Human audit'],['extractor-stability','Extraction and ranking stability'],['judge-families','Judge-family preference'],['evaluation-cost','Evaluation cost'],['scene-revision','Scene revision and static rules'],['joint-level-judging','Joint and isolated judgments'],['scenario-coverage','Observed scenario coverage'],['serialization-format','Information format']]};
 for(const [id,items] of Object.entries(extra)){
  let group=mainComparisonGroups.find(g=>g.id===id);
  if(!group){group={id,title:id==='representations'?'Internal representations':'Measurement validity',icon:id==='representations'?'theory':'repeat',items:[]};mainComparisonGroups.push(group);}
  for(const item of items)if(!mainComparisonGroups.some(g=>g.items.some(i=>i[0]===item[0])))group.items.push(item);
 }
}
function informationDefinitions(){return `<aside class="finding-data-explanation"><h4>Information conditions</h4><p><strong>Sufficient:</strong> the information needed to proceed is available.</p><p><strong>Partial:</strong> the brief provides some information but leaves a consequential gap or includes a misleading premise. The model must recognize which details remain unsupported.</p><p><strong>Insufficient:</strong> the brief makes clear that more information is needed before proceeding.</p></aside>`;}
const publishedFindings=()=> (findingsResearch.published_ids||findingsResearch.homepage_ids).map(findingById).filter(Boolean);
function findingAnchor(f,content,classes=''){
 return `<a class="${classes}" href="${findingLink(f)}" data-finding-measure="${safe(f.measure)}">${content}</a>`;
}
function findingRows(rows=publishedFindings()){
 return `<ol class="selected-findings">${rows.map((f,i)=>`<li>${findingAnchor(f,`<span class="selected-finding-number">${String(i+1).padStart(2,'0')}</span><h3>${safe(f.title_en)}</h3><span class="selected-finding-arrow" aria-hidden="true">↓</span>`,'selected-finding-link')}</li>`).join('')}</ol>`;
}
// Rows keep one category per line: a tag on the left, its findings on the right.
const findingRowTags={
 capability:{tag:'Capability',note:'What separates today’s models'},
 context:{tag:'Context',note:'When conditions change behaviour'},
 trajectory:{tag:'Trajectory',note:'Why good turns can still fail'},
 partners:{tag:'Partners',note:'Who is interacting, and how many'},
 architectures:{tag:'Architecture',note:'What an added harness changes'},
 representations:{tag:'Representation',note:'What is encoded inside'},
 measurement:{tag:'Measurement',note:'Whether the difference is real'}
};
function findingRowsByCategory(rows=publishedFindings()){
 const groups=[];
 for(const f of rows){
  let group=groups.find(g=>g.slug===f.category_slug);
  if(!group){group={slug:f.category_slug,title:f.category_en||f.category_slug,findings:[]};groups.push(group);}
  group.findings.push(f);
 }
 return groups;
}
function findingCategoryRow(group,startIndex){
 const meta=findingRowTags[group.slug]||{tag:group.title||group.slug,note:''};
 return `<section class="finding-row" data-finding-category="${safe(group.slug)}" aria-label="${safe(group.title)}"><header class="finding-row-head"><span class="finding-row-tag">${safe(meta.tag)}</span>${meta.note?`<p class="finding-row-note">${safe(meta.note)}</p>`:''}</header><ol class="finding-row-list">${group.findings.map((f,i)=>`<li>${findingAnchor(f,`<span class="finding-row-number">${String(startIndex+i+1).padStart(2,'0')}</span><h3>${safe(f.title_en)}</h3>`,'finding-row-link')}</li>`).join('')}</ol></section>`;
}
function findingColumnsMarkup(rows=publishedFindings()){
 const groups=findingRowsByCategory(rows);let offset=0;
 return `<div class="finding-rows">${groups.map(g=>{const markup=findingCategoryRow(g,offset);offset+=g.findings.length;return markup;}).join('')}</div>`;
}
function coreFindings(){
 return `<section id="key-findings" class="article-section atlas-key-findings homepage-findings"><div class="findings-section-heading"><h2>Key Findings</h2></div>${findingColumnsMarkup()}</section>`;
}

function findingEvidenceTarget(){
 const content=document.querySelector('#main-comparison-body .comparison-content');
 if(!content)return document.getElementById('comparisons');
 return [...content.querySelectorAll('.finding-visual,.comparison-table-wrap,.atlas-comparison-cards,.pairing-matrix-wrap,.evidence-bars,.evidence-scatter,.evidence-intervals,.evidence-table-wrap,.architecture-comparison-grid,.comparison-bars,.finding-trajectory-pair')].find(el=>el.getBoundingClientRect().height>0)||content;
}
function findingsCategoryOverview(){return findingRows();}
function findingsCards(_category='',query=''){
 const q=query.trim().toLowerCase(),rows=publishedFindings().filter(f=>!q||`${f.id} ${f.title_en} ${f.summary_en}`.toLowerCase().includes(q));
 return rows.length?findingRows(rows):'<p class="finding-empty">No findings match this search.</p>';
}
function findingsIndex(){return coreFindings();}
function findingEvidenceIntro(){
 return '';
}
function findingEvidenceFooter(){
 const f=activeResearchFinding();if(!f)return '';
 const visible=new Set(findingsResearch.published_ids||[]),related=f.related_ids.map(findingById).filter(r=>r&&visible.has(r.id)&&r.id!==f.id),next=publishedFindings()[publishedFindings().findIndex(r=>r.id===f.id)+1];
 return `${f.evidence_summary_en?`<p class="finding-evidence-statement" data-research-finding="${f.id}">${safe(f.evidence_summary_en)}</p>`:''}${findingKeyMetrics(f)}${findingDataExplanation(f.measure)}<p class="finding-evidence-limit">${safe(f.limitation_en)}</p><nav class="finding-evidence-nav" aria-label="Related findings">${related.length?`<div><span>Related findings</span>${related.map(r=>findingAnchor(r,`${safe(r.title_en)} <i aria-hidden="true">↓</i>`)).join('')}</div>`:''}${next?`<div><span>Next finding</span>${findingAnchor(next,`${safe(next.title_en)} <i aria-hidden="true">→</i>`)}</div>`:''}<a href="./index.html#key-findings">Back to key findings ↑</a></nav>`;
}

function evidenceTable(headers,rows,caption='Published evidence'){
 return `<div class="evidence-table-wrap" role="region" aria-label="${safe(caption)}" tabindex="0"><table class="evidence-data-table"><caption>${safe(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${safe(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((v,i)=>i===0?`<th scope="row">${safe(v)}</th>`:`<td>${safe(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function evidenceBars(rows,{label='Published values',format=v=>number(v),min=0,max}={}){
 const low=Math.min(min,...rows.map(r=>r[1])),high=max??Math.max(...rows.map(r=>r[1]),.01),span=high-low||1;
 return `<figure class="evidence-bars"><figcaption>${safe(label)}</figcaption><div class="evidence-bar-axis"><span>${safe(format(low))}</span><span>${low<0?'0':''}</span><span>${safe(format(high))}</span></div>${rows.map(([name,value,focus])=>{const zero=(0-low)/span*100,end=(value-low)/span*100;return `<div class="evidence-bar-row ${focus?'is-evidence-focus':''}"><span>${safe(name)}</span><i><em style="left:${Math.min(zero,end)}%;width:${Math.abs(end-zero)}%"></em>${low<0?`<b style="left:${zero}%"></b>`:''}</i><strong>${safe(format(value))}</strong></div>`;}).join('')}</figure>`;
}
function evidenceScatter(rows,{xLabel,yLabel,xMin=0,yMin=0,xMax=1,yMax=1,caption=''}){
 const x=v=>80+(v-xMin)/(xMax-xMin)*570,y=v=>300-(v-yMin)/(yMax-yMin)*250;
 return `<figure class="evidence-scatter"><figcaption>${safe(caption||`${xLabel} and ${yLabel}`)}</figcaption><svg viewBox="0 0 740 390" role="img" aria-label="${safe(caption||`${xLabel} versus ${yLabel}`)}"><path d="M80 50V300H650" fill="none" stroke="#aebdb2"/>${[0,.5,1].map(t=>{const xv=xMin+t*(xMax-xMin),yv=yMin+t*(yMax-yMin);return `<path d="M${x(xv)} 300v5M75 ${y(yv)}H650" stroke="#dbe3dc" fill="none"/><text x="${x(xv)}" y="326" text-anchor="middle">${xv.toFixed(2)}</text><text x="68" y="${y(yv)+5}" text-anchor="end">${yv.toFixed(2)}</text>`;}).join('')}${rows.map(([name,xv,yv,focus],i)=>`<g><circle cx="${x(xv)}" cy="${y(yv)}" r="${focus?7:5}" fill="${focus?'#a8791e':'#537563'}" opacity=".85"><title>${safe(name)}: ${safe(xLabel)} ${number(xv)}, ${safe(yLabel)} ${number(yv)}</title></circle>${focus?`<text x="${Math.min(620,Math.max(120,x(xv)))}" y="${y(yv)+(i%2?22:-15)}" text-anchor="middle" class="evidence-point-label">${safe(name)}</text>`:''}</g>`).join('')}<text x="365" y="363" text-anchor="middle">${safe(xLabel)}</text><text transform="translate(20 175) rotate(-90)" text-anchor="middle">${safe(yLabel)}</text></svg></figure>${evidenceTable(['System',xLabel,yLabel],rows.map(r=>[r[0],number(r[1]),number(r[2])]),'Exact plotted values')}`;
}
function findingStageSupplement(){
 const f=activeResearchFinding();if(!f)return '';
 if(f.id==='F01')return evidenceTable(['Grades','Passive range','Responsive range','Proactive range'],[['After cascade','0.035','0.111','0.370'],['Raw, before cascade',...findingsEvidence.raw_ranges.map(v=>number(v))]],'Score ranges before and after the cascade');
 if(['F02','F03'].includes(f.id)){
  const names=f.id==='F02'?['deepseek-v4-pro','claude-opus-5.5']:['deepseek-v4-pro','kimi-k3'];
  return evidenceTable(['Model','Composite','Passive','Proactive','L6 / L5'],names.map(n=>{const m=publication.models.find(m=>m.name===n);return [n,m.composite,m.stages[0],m.stages[2],m.coherence_ratio].map((v,i)=>i?number(v):v)}),'Focused capability contrast')+comparisonDataTable(['L1','L2','L3','L4','L5','L6'],levelNames,names.map(n=>publication.models.find(m=>m.name===n)));
 }
 return '';
}
function evidenceIntervals(){
 const rows=[['Clarification frequency',.085,.004,.169],['L5 grade',.006,-.027,.043]],x=v=>180+(v+.04)/.22*440;
 return `<figure class="evidence-intervals"><figcaption>Kimi partner change · estimate and 95% scene-bootstrap interval</figcaption><svg viewBox="0 0 740 220" role="img" aria-label="Clarification increases, while the L5 interval includes zero"><path d="M${x(0)} 20V170" stroke="#8c9f91" stroke-dasharray="4 4"/>${rows.map((r,i)=>`<text x="12" y="${63+i*65}">${r[0]}</text><path d="M${x(r[2])} ${58+i*65}H${x(r[3])}" stroke="#426650" stroke-width="3"/><circle cx="${x(r[1])}" cy="${58+i*65}" r="6" fill="#a8791e"/>`).join('')}<text x="${x(0)}" y="200" text-anchor="middle">0</text><text x="${x(.16)}" y="200" text-anchor="middle">+0.16</text></svg></figure>`+evidenceTable(['Measure','Change','95% interval'],rows.map(r=>[r[0],signed(r[1]),`${signed(r[2])} to ${signed(r[3])}`]),'Partner: Claude Opus 5.5 versus Claude Opus 5');
}
function findingTrajectories(){
 return `<div class="finding-trajectory-pair">${researchEvidence.trajectories.episodes.map((ep,i)=>`<article><h4>Case ${i+1} / ${safe(ep.model)}</h4>${findingInterestLine(ep)}<p class="finding-case-ending">${safe(ep.outcome)} · turn ${ep.turns.length} · composite ${number(ep.composite)}</p>${evidenceTable(['Turn','L1','L2','L3','L4','L5','L6','P(Advance)','Interest'],ep.turns.map((t,j)=>[t,...ep.levels[j].map(v=>number(v)),number(ep.advance_probability[j]),number(ep.interest[j])]),'Turn-indexed evidence')}</article>`).join('')}</div><p class="comparison-reading-note">Case 1 repeatedly returns to missing receipts while the user asks for estimated amounts; Case 2 proceeds after the user retrieves the receipts. The record describes the joint course of the exchange.</p>`;
}
function findingInformationLines(){
 const rows=[['Astra',[.662,.592,.603],'#416b54'],['Sol',[.557,.466,.484],'#b08a2f'],['Gemini',[.483,.393,.440],'#8a5c57']],xs=[120,390,660],y=v=>280-(v-.35)/.35*220;
 return `<figure class="finding-visual finding-information-lines"><figcaption>Partial information is the lowest-scoring condition in all three matched models</figcaption><svg viewBox="0 0 780 350" role="img" aria-label="Three models score lowest with partial information"><rect x="325" y="38" width="130" height="255" rx="8" fill="#fff3d1"/>${['Sufficient','Partial','Insufficient'].map((label,i)=>`<text x="${xs[i]}" y="330" text-anchor="middle">${label}</text>`).join('')}${rows.map(([label,values,c])=>`<path class="finding-draw-path" pathLength="1" d="${values.map((v,i)=>`${i?'L':'M'}${xs[i]} ${y(v)}`).join(' ')}" fill="none" stroke="${c}" stroke-width="3"/>${values.map((v,i)=>`<circle cx="${xs[i]}" cy="${y(v)}" r="${i===1?7:4}" fill="${c}"/><text x="${xs[i]}" y="${y(v)-13}" text-anchor="middle">${i===0?label+' ':''}${number(v)}</text>`).join('')}`).join('')}</svg></figure>`;
}
function findingGroupDeclines(){
 return `<figure class="finding-visual finding-group-declines"><figcaption>Two to four participants: a larger absolute decline in proactive coordination</figcaption>${evidenceBars([['L1–L4 / two participants',.722],['L1–L4 / four participants',.692]],{label:'Basic responsiveness · decline 0.030',max:.8})}${evidenceBars([['L5–L6 / two participants',.348],['L5–L6 / four participants',.243,true]],{label:'Proactive coordination · decline 0.105',max:.8})}</figure>${evidenceTable(['Mean score','Two participants','Four participants','Absolute decline'],[['L1–L4','0.722','0.692','0.030'],['L5–L6','0.348','0.243','0.105']],'The same score scale; simulated participants')}`;
}
function findingInterestLine(ep){
 const x=t=>65+(t-1)/5*385,y=v=>205-v*160;
 return `<figure class="finding-visual"><figcaption>User interest across turns</figcaption><svg viewBox="0 0 500 265" role="img" aria-label="User interest and ending for Case ${ep.id||''}"><path d="M65 30V215H460" stroke="#c8d7c8" fill="none"/><path class="finding-draw-path" pathLength="1" d="${ep.turns.map((t,i)=>`${i?'L':'M'}${x(t)} ${y(ep.interest[i])}`).join(' ')}" stroke="#567d60" stroke-width="3" fill="none"/>${ep.turns.map((t,i)=>`<circle cx="${x(t)}" cy="${y(ep.interest[i])}" r="${i===ep.turns.length-1?7:4}" fill="${i===ep.turns.length-1?'#b08a2f':'#567d60'}"/><text x="${x(t)}" y="240" text-anchor="middle">${t}</text>`).join('')}<text x="15" y="52">1.0</text><text x="15" y="210">0.0</text><text x="260" y="263" text-anchor="middle">Turn</text></svg></figure>`;
}
function findingRankingReversal(){
 const names=['gpt-5.6-sol','qwen3.8-max'],partners=['claude-opus-5','deepseek-v4-pro'],colors=['#416b54','#b08a2f'];
 const rows=names.map(name=>({name,values:partners.map(partner=>publication.interaction_matrix.find(r=>r.partner===partner).scores[publication.models.findIndex(m=>m.name===name)])}));
 const y=v=>265-(v-.35)/.20*205;
 return `<figure class="finding-visual finding-reversal"><figcaption>The same two assistants, two different partners</figcaption><svg viewBox="0 0 760 330" role="img" aria-label="Sol leads Qwen with the standard partner; Qwen leads Sol with the DeepSeek partner"><text x="170" y="25" text-anchor="middle">Standard partner</text><text x="590" y="25" text-anchor="middle">DeepSeek partner</text><path d="M170 50V280M590 50V280" stroke="#d4dfd2"/>${rows.map((r,i)=>`<path class="finding-draw-path" pathLength="1" d="M170 ${y(r.values[0])}L590 ${y(r.values[1])}" stroke="${colors[i]}" stroke-width="4" fill="none"/>${r.values.map((v,j)=>`<circle cx="${j?590:170}" cy="${y(v)}" r="6" fill="${colors[i]}"/><text x="${j?610:150}" y="${y(v)+(i?20:-12)}" text-anchor="${j?'start':'end'}">${i?'Qwen':'Sol'} ${number(v)}</text>`).join('')}`).join('')}</svg></figure>${evidenceTable(['Assistant','Standard partner','DeepSeek partner'],rows.map(r=>[r.name,...r.values.map(v=>number(v))]),'Descriptive pairing comparison')}`;
}
function findingFrontierContrast(){
 return `<section class="finding-frontier finding-visual"><h4>Gain and frontier-level contribution tell different stories</h4>${evidenceTable(['Observation','Weaker bases','Stronger bases'],[['Proactive capability gain','Larger marginal gains','Smaller marginal gains'],['Bases with nonzero Frontier Emergence','0','4'],['Architectures with nonzero Frontier Emergence','None in these weaker bases','Cognizer / Claude Code']],'Different outcomes under architectural augmentation')}<p class="comparison-reading-note">Frontier Emergence is the study’s stringent contribution criterion, not independent validation of a scientific breakthrough. The count describes base models, not the number of discoveries.</p></section>`;
}
function findingIntervention(){
 return `<figure class="finding-visual finding-intervention"><figcaption>Read a direction, intervene, test its behavioral effect</figcaption><div class="finding-intervention-steps"><div><span>Fit directions</span><strong>297 dialogues</strong><p>Interest and affection readouts</p></div><span aria-hidden="true">→</span><div><span>Intervene</span><strong>60 contexts</strong><p>Qwen3.8-27B, with random-direction controls</p></div><span aria-hidden="true">→</span><div class="finding-intervention-result"><span>Observed result</span><strong>No reliable signed effect</strong><p>Beyond the random-direction controls</p></div></div></figure>`;
}
function findingsMeasureContent(measure){
 const m=publication.models,percent=v=>(v*100).toFixed(1)+'%',finding=activeResearchFinding();
 if(finding?.id==='F01')return evidenceBars([['Passive execution / L1–L2',.035],['Responsive adaptation / L3–L4',.111],['Proactive promotion / L5–L6',.370,true]],{label:'Across-model score ranges · ten tested models',max:.4})+comparisonDataTable(['stage0','stage1','stage2'],['Passive execution','Responsive adaptation','Proactive promotion'])+evidenceTable(['System','Composite','Proactive','L6 / L5'],['deepseek-v4-pro','kimi-k3'].map(name=>{const x=m.find(x=>x.name===name);return [name,number(x.composite),number(x.stages[2]),number(x.coherence_ratio)]}),'Similar composites, different capability profiles');
 if(finding?.id==='F07')return findingInformationLines()+informationComparison()+evidenceBars([['Sufficient',.051],['Partial',.164,true],['Insufficient',.103]],{label:'Unsupported factual additions · share of turns',format:percent,max:.20})+evidenceTable(['Information condition','Unsupported factual additions','Clarification'],[['Sufficient','5.1%','7.0%'],['Partial','16.4%','20.3%'],['Insufficient','10.3%','37.4%']],'Behavior under the three information conditions');
 if(finding?.id==='F28')return findingGroupDeclines();
 if(finding?.id==='F19')return findingRankingReversal()+pairingMatrix();
 if(finding?.id==='F35')return findingIntervention()+evidenceTable(['Test','Reported result'],[['Direction fitting','297 dialogues'],['Intervention sample','60 contexts'],['Beyond random-direction controls','No reliable signed effect']],'Reading and controlling are separate tests');
 if(measure==='coherence'&&finding?.id==='F04')return comparisonDataTable(['L5','L6','coherence'],['L5 / Initiative','L6 / Coherence','L6 / L5'],[...m].sort((a,b)=>a.coherence_ratio-b.coherence_ratio));
 if(measure==='purpose'&&finding?.id==='F05')return comparisonDataTable(['functional','mixed','nonfunctional'],['Task-oriented','Mixed purpose','Open-ended']);
 if(measure==='self-gap'&&finding?.id==='F22')return evidenceScatter(m.map(x=>[x.name,x.self_play.similarity,x.self_play.standard_user-x.self_play.score,['deepseek-v4-pro','gemini-3.8-flash','gpt-6-astra'].includes(x.name)]),{xLabel:'Interaction-pattern similarity across roles',yLabel:'Standard-user minus self-play score',xMax:1,yMax:.13,yMin:-.09,caption:'Role similarity and pairing difference · reported r = −0.65'})+evidenceTable(['System','Standard-user score','Self-play score','Self-play minus standard'],m.map(x=>[x.name,number(x.self_play.standard_user),number(x.self_play.score),signed(x.self_play.score-x.self_play.standard_user)]),'Self-play contrast')+evidenceBars(m.map(x=>[x.name,x.self_play.score-x.self_play.standard_user,['deepseek-v4-pro','gemini-3.8-flash'].includes(x.name)]),{label:'Self-play minus standard-user composite',format:signed,min:-.13,max:.08});
 if(measure==='fixed32'&&finding?.id==='F47')return evidenceBars([['Adaptive / matched subsample',.223],['Fixed 32 turns / matched subsample',.267,true]],{label:'Across-model composite range · matched subsample',max:.30})+evidenceTable(['Model','Adaptive prefix','Fixed 32 turns'],m.map(x=>[x.name,number(x.duration.adaptive),number(x.duration.fixed[2])]),'Scores on the same fixed-length subsample');
 switch(measure){
  case 'scene-revision':return evidenceBars([['After admitted rule revision',.229,true]],{label:'Old-rule L1 failures when scene revision is disabled',format:percent,max:.30})+evidenceTable(['Condition','Observation','Denominator'],[['No scene revision','22.9% old-rule L1 failures','Turns after an admitted revision']],'Legitimate rule changes and static evaluation');
  case 'joint-level-judging':return evidenceBars([['Six isolated calls',.90],['One joint call',.61,true]],{label:'Single-level probe separation',format:percent,max:1})+evidenceBars([['Six isolated calls',.871],['One joint call',.833,true]],{label:'Agreement between independent grading runs',max:1});
  case 'scenario-coverage':return evidenceTable(['Observed source quantity','Reported value','Scope'],[['Functional task share','≈2.6%','Original role-play material'],['Empty designed cells','10–13 of 27','Audited observational source pools before correction'],['Designed scenario space','3 × 3 × 3 = 27','Realism × information × purpose']],'Coverage of the declared scenario space');
  case 'simulated-user-quality':return evidenceTable(['User source','Lexical diversity / MTLD','Flagged user contradictions'],findingsEvidence.simulated_users.map(([name,mtld,rate])=>[name,mtld.toFixed(1),percent(rate)]),'Lexical diversity and contradiction flags · check conditions differ');
  case 'serialization-format':return evidenceTable(['Model','Structured reference','Natural-language prose','Prose minus reference'],m.map((x,i)=>[x.name,number(x.composite),number(findingsEvidence.prose_scores[i]),signed(findingsEvidence.prose_scores[i]-x.composite)]),'Identical information in structured fields and prose');

  case 'weighting-sensitivity':return evidenceBars([['Reference level weights',.222,true],['Equal level weights',.163,true]],{label:'Across-model composite range',max:.25})+evidenceTable(['Variant','Composite range','Ranking ρ','Largest rank change'],[['Reference','0.222','1.000','0'],['Equal level weights','0.163','0.988','1']],'Aggregation comparison');
  case 'gap-behavior':return evidenceBars([['Sufficient',.051],['Partial',.164,true],['Insufficient',.103]],{label:'Unsupported factual additions · share of turns',format:percent,max:.20});
  case 'gap-correlation':return evidenceScatter(m.map(x=>[x.name,x.stages[0],x.behavior.fabrication,['claude-opus-5.5','gpt-6-astra'].includes(x.name)]),{xLabel:'Passive execution',yLabel:'Fabrication rate',xMin:.74,xMax:.80,yMax:.20,caption:'Execution and unsupported factual additions · Spearman ρ = +0.77 · n = 10'});
  case 'question-vs-agency':return evidenceIntervals();
  case 'case-trajectories':return findingTrajectories();
  case 'turn-divergence':return evidenceBars(findingsEvidence.turns.map((t,i)=>['Turn '+t,Math.max(...findingsEvidence.turn_rows.map(r=>r.scores[i]))-Math.min(...findingsEvidence.turn_rows.map(r=>r.scores[i])),i===0||i===4]),{label:'Across-model turn-score range',max:.25})+evidenceTable(['System',...findingsEvidence.turns.map(t=>'Turn '+t+' score (reached)')],findingsEvidence.turn_rows.map(r=>[r.name,...r.scores.map((s,i)=>`${number(s)} (${r.reached[i]}%)`)]),'Matched turn scores with the percentage of episodes reaching each turn');
  case 'termination-outcomes':return comparisonDataTable(['closure','exhaustion'],['Successful closure','Interest exhaustion'])+'<p class="comparison-reading-note">Simulated partners; adaptive stopping. Interest exhaustion is a stopping classification and does not directly measure human satisfaction.</p>';
  case 'closure-purpose':return comparisonDataTable(['functional-closure','nonfunctional-closure'],['Task-oriented closure','Open-ended closure']);
  case 'stopping-ablation':return evidenceBars([['Full instrument',6.2],['Without patience budget',13.7,true]],{label:'Length of episodes with persistently dominant Degrade',max:15,format:v=>v.toFixed(1)+' turns'});
  case 'partner-pressure':return evidenceScatter(m.map(x=>[x.name,x.partner.uptake_pressure,x.partner.active_pressure,['gemini-3.8-flash','claude-fable-5.1'].includes(x.name)]),{xLabel:'Extra L2–L3 pressure',yLabel:'Extra L5–L6 pressure',xMin:-.05,xMax:.27,yMin:-.06,yMax:.06,caption:'Pressure relative to Claude Opus 5 as the standard partner'});
  case 'role-asymmetry':return evidenceTable(['Quantity','User-side matrix','Assistant-side matrix'],[['Variance attributed to user identity','94.4%','See Table 11'],['Residual after row and column main effects','2.0%','10.9%']],'Role-dependent variance decomposition · Tables 11 and 15');
  case 'architecture-headroom':return ['MetaMind','Cognizer','Claude Code'].map(a=>evidenceScatter(m.map(x=>{const agent=publication.agents.find(r=>r.architecture===a&&r.base_model===x.name);return [x.name,x.stages[2],agent.active_adaptation-x.stages[2],['deepseek-v4-pro','claude-opus-5.5'].includes(x.name)]}),{xLabel:'Base proactive score',yLabel:'Proactive gain',xMax:.6,yMax:.11,caption:a+' · base capability and architecture gain'})).join('')+(finding?.id==='F30'?findingFrontierContrast():'');
  case 'role-probes':return evidenceBars(findingsEvidence.within_interest.flatMap(r=>[[r[0]+' / assistant',r[1],r[0]==='Qwen3.8-27B'],[r[0]+' / user',r[2],r[0]==='Qwen3.8-27B']]),{label:'Within-dialogue interest R² at 75% depth',min:-.25,max:.20})+'<p class="comparison-reading-note">Entire scenes are held out. Each row in Table 17 covers 81 dialogues; within-dialogue R² removes each dialogue’s mean from labels and predictions.</p>';
  case 'shared-affection':return evidenceTable(['Assistant model','Affection-direction cosine','Residual user affection R²','Residual user anxiety R²'],findingsEvidence.participant_states.map(r=>r.map((v,i)=>i?number(v):v)),'Shared versus participant-specific state readouts at 75% depth')+evidenceBars(findingsEvidence.participant_states.map(r=>[r[0],r[2],true]),{label:'Residual user-affection R²',min:-.3,max:.05});
  case 'shared-miscalibration':return evidenceTable(['Statistic','Value','What it compares'],[['Interest-change correlation','0.264','Two participants’ readouts'],['Assistant within-dialogue R²','−0.374','Assistant readout versus annotated interest'],['User within-dialogue R²','−0.246','User readout versus annotated interest']],'16 Gemma–Gemma dialogues · 204 aligned boundaries');
  case 'partner-integration':return evidenceTable(['Position / intervention','Value','Quantity'],[['Utterance positions / layer 32','0.860','Recovery'],['Utterance positions / layer 40','0.664','Recovery'],['Utterance positions / layer 48','0.285','Recovery'],['Final position / layer 48','0.435','Recovery'],['Final position / layer 52','0.777','Recovery'],['Remove 8 selected heads','0.928','Sensitivity retention'],['Remove 40 selected heads','0.941','Sensitivity retention']],'Qwen3.8-27B · restoration and ablation')+'<p class="comparison-reading-note">Only reported points are shown. No values are interpolated for unreported layers. Recovery and sensitivity retention use different KL-based denominators.</p>';
  case 'representation-control':return evidenceTable(['Design or observation','Reported result'],[['Model','Qwen3.8-27B'],['Direction-fitting corpus','297 transcripts'],['Intervention sample','60 contexts'],['Interest / affection intervention layers','44 / 28'],['Magnitudes','±16 or ±32 projected standard deviations'],['Random-direction comparison','No consistent signed change beyond the control'],['Larger magnitudes','Persona fit deteriorates; interest intervention also reduces coherence']],'Relational-direction intervention · §4.7.3 and Appendix A.13');
  case 'reconstruction-ablation':return evidenceBars([['State / transcript + scene',.64],['State / full reconstruction',.91,true],['Recurrence / transcript + scene',.49],['Recurrence / full reconstruction',.89,true]],{label:'Controlled probe pairs separated',format:percent,max:1})+evidenceTable(['Probe family','Transcript + scene','Full reconstruction','Absolute gain'],[['State','64%','91%','27 percentage points'],['Recurrence','49%','89%','40 percentage points']],'Both conditions receive the full multi-turn transcript');
  case 'human-audit':return evidenceBars([['L1 / Goal preservation',.988,true],['L2 / Information uptake',.951],['L3 / State progression',.940],['L4 / Contextual expression',.923],['L5 / Proactive agency',.789,true],['L6 / Long-horizon coherence',.740,true]],{label:'Human endorsement under audit',format:percent,max:1})+evidenceTable(['Level','Reviewed records'],[['L1','246'],['L2','247'],['L3','248'],['L4','247'],['L5','246'],['L6','246']],'Denominators differ by reviewed level');
  case 'extractor-stability':return evidenceTable(['Alternative extractor','Latent-record agreement','Ranking Spearman ρ'],[['Qwen3.8 Max','0.806','0.988'],['Gemini 3.8 Pro','0.816','0.988']],'Extraction substitution');
  case 'judge-families':return evidenceBars([['GPT-6 Astra → own model',.013,true],['Qwen3.8 Max → own model',.011,true],['Gemini 3.8 Pro → Gemini Flash',.017,true]],{label:'Own-family relative composite lift',format:signed,max:.02})+comparisonDataTable(['composite','judge-astra','judge-gemini','judge-qwen'],['Reference judge','GPT-6 Astra','Gemini 3.8 Pro','Qwen3.8 Max']);
  case 'evaluation-cost':return evidenceBars([['Generation / both participants',9510],['Evaluation / all components',159680,true]],{label:'Input + output tokens per exchange',format:v=>Math.round(v).toLocaleString('en-GB'),max:160000})+evidenceTable(['Component','Calls','Input + output tokens / exchange'],[['Generation / both participants','2','9,510'],['Latent passes','4','54,640'],['Event-chain updates','2','30,780'],['Six level calls','6','60,120'],['Closure query','1','5,240'],['Red-line screen','1','4,570'],['Gap annotation','1','4,330'],['Evaluation total','15','159,680']],'Table 35 · per-call token counts multiplied by calls per exchange');
  default:return null;
 }
}
function applyResearchFindingFocus(panel){
 // The finding link scrolls to the evidence; it does not restyle the figures.
 const f=activeResearchFinding();if(!f||!panel)return;
 panel.dataset.researchFinding=f.id;
}
document.addEventListener('input',event=>{
 if(!['finding-search','home-finding-search'].includes(event.target.id))return;
 const q=event.target.value,category=event.target.dataset.findingCategory;
 const home=event.target.id==='home-finding-search';
 document.getElementById(home?'home-finding-catalog-results':'finding-catalog-results').innerHTML=findingsCards(category,q);
 const params=new URLSearchParams();if(category)params.set('category',category);if(q)params.set('q',q);
 history.replaceState(null,'','./index.html#'+(home?'key-findings':'findings')+(params.size?'?'+params:''));
});

const primaryFindingMetrics={
 F43:[['Old-rule failures after revision','22.9%']],
 F44:[['Single-level probe separation','90% → 61%'],['Repeated-grading agreement','0.871 → 0.833']],
 F45:[['Functional role-play cases','≈2.6%'],['Empty designed cells','10–13 / 27']],
 F46:[['MTLD / simulated users','79.8–95.5'],['MTLD / human logs','60.1'],['Contradictions / simulated vs human','7.1%–18.1% / 4.6%']],
 F47:[['Matched adaptive / range','0.223'],['Matched fixed 32 / range','0.267'],['Full-design adaptive / range','0.222']],
 F48:[['Models with lower scores','9 / 10'],['Mean absolute score change','≈0.012']],
 F01:[['Passive score range','0.035'],['Proactive score range','0.370'],['Difference in separation','10.6×']],
 F02:[['Same passive score','0.787'],['DeepSeek proactive score','0.170'],['Opus proactive score','0.540']],
 F03:[['Composite / DeepSeek & Kimi','0.430 / 0.425'],['Proactive / DeepSeek & Kimi','0.170 / 0.212'],['L6/L5 / DeepSeek & Kimi','0.832 / 0.965']],
 F04:[['Models with L6 below L5','10 / 10'],['L6 / L5 ratio','0.832–0.965']],
 F05:[['Claude / task-oriented','0.600'],['Claude / open-ended','0.454'],['GLM / task vs open-ended','0.403 / 0.421']],
 F06:[['Reference composite range','0.222'],['Equal-weight range','0.163'],['Reduction in range','26.6%']],
 F07:[['GPT / sufficient','0.662'],['GPT / partial','0.592'],['GPT / insufficient','0.603']],
 F08:[['Sufficient / fabrication','5.1%'],['Partial / fabrication','16.4%'],['Insufficient / fabrication','10.3%']],
 F09:[['Spearman correlation','+0.77'],['Models compared','10'],['Fabrication / Opus vs GLM','16.8% / 2.7%']],
 F11:[['Clarification change','+0.085'],['L5 change','+0.006'],['L5 / 95% interval','−0.027 to +0.043']],
 F13:[['Case 1 / interest at ending','0.20'],['Case 1 / exhaustion','Turn 5'],['Case 2 / successful closure','Turn 6']],
 F14:[['Range at turn 1','0.109'],['Range at turn 16','0.204']],
 F16:[['Interest-exhaustion endings','87.6%–99.0%']],
 F17:[['Gemini / task closure','4.3%'],['Gemini / open-ended closure','0.2%']],
 F18:[['Full patience mechanism','6.2 turns'],['Without patience budget','13.7 turns']],
 F19:[['Sol / standard → DeepSeek partner','0.515 → 0.394'],['Qwen / standard → DeepSeek partner','0.482 → 0.510']],
 F21:[['Gemini / mean & range','0.392 / 0.209'],['DeepSeek / mean & range','0.490 / 0.425']],
 F22:[['Self-pairing excess','+0.020'],['95% interval','+0.012 to +0.028'],['Similarity vs standard minus self','r = −0.65']],
 F23:[['Gemini / L2–L3 pressure','+0.249'],['Fable / L5–L6 pressure','+0.044']],
 F24:[['User-identity main effect','94.4%'],['User-side residual','2.0%'],['Assistant-side residual','10.9%']],
 F25:[['Cognizer / passive gain','+0.012'],['Cognizer / proactive gain','+0.066'],['Ratio of gains','5.5×']],
 F26:[['MetaMind / task vs open-ended','+0.021 / +0.046'],['Cognizer / task vs open-ended','+0.061 / +0.032']],
 F28:[['L1–L4 absolute decline','0.030'],['L5–L6 absolute decline','0.105'],['Ratio of absolute declines','3.5×']],
 F30:[['Base score vs proactive gain','r ≤ −0.99'],['Stronger bases with nonzero FE','4'],['Weaker bases with nonzero FE','0']],
 F31:[['Qwen3.8 / assistant R²','−0.082'],['Qwen3.8 / user-role R²','+0.168']],
 F32:[['Affection-direction cosine','0.620–0.737'],['Residual user-affection R²','−0.225 / −0.182 / −0.248']],
 F33:[['Interest-change correlation','0.264'],['Assistant within-dialogue R²','−0.374'],['User within-dialogue R²','−0.246']],
 F34:[['Layer 52 / final-position recovery','0.777'],['40-head ablation / retained sensitivity','0.941']],
 F35:[['Direction fitting','297 dialogues'],['Intervention sample','60 contexts'],['Beyond random controls','No reliable signed effect']],
 F36:[['State-probe separation','64% → 91%'],['Recurrence-probe separation','49% → 89%'],['Absolute gains','27 / 40 percentage points']],
 F37:[['L1 / human endorsement','98.8%'],['L5 / human endorsement','78.9%'],['L6 / human endorsement','74.0%']],
 F40:[['Latent-state agreement','0.806 / 0.816'],['Ranking Spearman ρ','0.988']],
 F41:[['GPT / own-family lift','+0.013'],['Qwen / own-family lift','+0.011'],['Gemini / own-family lift','+0.017']],
 F42:[['Generation / tokens per exchange','9,510'],['Evaluation / tokens per exchange','159,680'],['Evaluation / generation','16.8×']]
};
const normalizeMetricValue=value=>String(value).trim().replace(/[−–]/g,'-').replace(/[,+\s]/g,'');
function findingKeyMetrics(f){return `<section class="finding-key-metrics" data-research-finding="${f.id}" aria-label="Key evidence metrics">${primaryFindingMetrics[f.id].map(([label,value])=>`<div><span>${safe(label)}</span><strong>${safe(value)}</strong></div>`).join('')}</section>`;}
const findingDataDefinitions={
 "scene-revision":"An admitted revision is a rule change accepted under the scene-revision criteria. L1 grades goal preservation under the effective scene. The 22.9% rate counts old-rule failures only among turns after admitted revisions when revision is disabled; it is not an overall error rate.",
 "joint-level-judging":"Single-level probes vary one capability while holding the others fixed. Separation is the share graded in the direction required by the definitions. Reliability is agreement of level grades across two independent grading runs. These two quantities have separate denominators.",
 "scenario-coverage":"Each cell combines one of three realism conditions, three information conditions and three purposes. Empty cells mean no observed source cases in those designed conditions. Functional cases aim to complete a practical task. The final evaluation corpus corrects coverage with conditional generation; the source audit describes the pools before that correction.",
 "simulated-user-quality":"MTLD measures lexical diversity at threshold 0.72. Contradictions are utterances flagged with probability above 0.9 against a speaker\u2019s preceding ten utterances or role view. Human logs lack a role view, so their checks use preceding utterances only. A higher MTLD does not by itself establish realism or better simulation.",
 "fixed32":"Range is the maximum composite minus the minimum across ten systems. The matched subsample compares the adaptive prefix with the full fixed 32-turn episode using the same turn weights. The full-design adaptive range, 0.222, is shown separately from the matched baseline, 0.223. Forced continuation can include turns after successful closure.",
 "serialization-format":"The reference is a fixed-order set of structured key\u2013value fields. Prose preserves the information while changing its presentation wherever scenes and profiles enter. Mean absolute change averages |prose minus reference| across the ten systems, approximately 0.012; the signs remain visible in the table.",
 'stage-profile':'Passive execution is the mean of L1–L2, responsive adaptation of L3–L4, and proactive promotion of L5–L6. A score range is the maximum minus the minimum across the ten models; it does not describe improvement within one model.',
 coherence:'L5 measures useful initiative; L6 measures follow-through across the interaction. L6/L5 expresses coherence relative to initiative. Higher levels are constrained by the dependency cascade, so a lower L6 partly reflects the scoring construction.',
 purpose:'Task-oriented interactions aim to complete a practical objective. Open-ended interactions can aim to sustain conversation or a relationship. The scores measure capability within each purpose, rather than how often an episode ends.',
 'weighting-sensitivity':'Both conditions reuse the same interaction records. The reference gives higher capability levels more weight; equal weighting gives each of the six levels the same weight. The smaller range is an aggregation effect.',
 'gap-correlation':'Fabrication means stating an absent, task-relevant fact as known. Spearman ρ measures association between rankings across the ten models. A positive correlation does not establish a causal link.',
 'question-vs-agency':'When the partner changes from Claude Opus 5 to Claude Opus 5.5, Kimi asks for missing information more often: clarification frequency rises by 8.5 percentage points. Its initiative grade (L5) changes by only +0.006. The 95% uncertainty interval runs from −0.027 to +0.043, including zero, so these results do not establish an improvement in useful initiative. Conversation length was not held constant. Asking more questions should therefore not be read as evidence of becoming more proactive.',
 'case-trajectories':'User interest is the evaluator’s operational reading of a simulated participant’s willingness to continue. P(Advance) is the projected probability of a productive next course. These readings describe the joint trajectory, not which participant caused it.',
 'turn-divergence':'Each score averages only episodes that reach that turn. The percentage in parentheses is the share that reaches it; later-turn comparisons therefore have survivor selection.',
 'termination-outcomes':'Successful closure means the objective is judged complete under the protocol. Interest exhaustion means the simulated user’s interest or accumulated patience reaches the stopping threshold. An open-ended episode can be valuable without closing a task.',
 'closure-purpose':'Closure is the share of episodes judged to have completed an objective. Open-ended conversations often have no concrete task to close, so their closure rate should not be treated as a failure rate.',
 'stopping-ablation':'The patience budget accumulates the cost of an unproductive exchange. Degrade is a projected course in which interaction value declines. The comparison changes the stopping rule for these trajectories, rather than training the model.',
 pairings:'The 9.9% pairing component uses the combined variance of scored model, partner and pairing as its denominator. The 10.9% matrix residual is a different statistic: variation left after row and column effects, including self-play and noise.',
 'pairing-summary':'Mean assistant score describes how hard a partner is on average. Across-assistant range describes how much it separates assistants. A partner that lowers every score equally need not distinguish capabilities well.',
 'self-gap':'Self-play uses the same model for both participants. The plotted difference is self-play minus the standard-user score: positive values favor self-play; negative values favor the standard user.',
 'partner-pressure':'Positive extra pressure means the assistant scores lower than it does with the standard partner. L2–L3 concern uptake and progress; L5–L6 concern initiative and follow-through. This is the effect on the assistant, not the partner’s own score.',
 'role-asymmetry':'A main effect is variation attributed to one participant’s identity. The residual is what remains after both identities’ main effects are removed. Assistant and user roles have different rubrics, so their decompositions must be read within role.',
 'architecture-stages':'An architecture gain is its score minus the score of the same base model, averaged over ten bases. Passive and proactive gains use the same score scale; additional calls and compute are not controlled.',
 'architecture-purpose':'Each gain compares an architecture with its own base model under the same interaction purpose. Task-oriented and open-ended gains describe different demands; they are not direct measures of human psychological skills.',
 'group-size':'The reported declines compare two with four participants. The 3.5× figure divides the absolute score declines, 0.105 by 0.030; it is not a 350% decline in capability. All other seats use the standard partner.',
 'architecture-headroom':'Proactive gain is the architecture’s L5–L6 score minus the base score. A negative r means weaker bases tend to gain more. Score ceilings and available headroom can contribute to that relationship.',
 'role-probes':'R² compares a linear probe’s prediction with a mean baseline. A negative within-dialogue R² means it tracks changes worse than that baseline. These probes hold out complete scenes; decodability alone does not establish understanding.',
 'shared-affection':'Affection is an annotated positive attitude toward the partner. Cosine similarity compares fitted readout directions. Residual R² asks whether the other participant’s state can be predicted after removing variation shared with the model’s own state; negative values do not support reliable independent readout.',
 'shared-miscalibration':'Correlation compares whether two readouts vary together. R² compares a readout with the annotated target. Two readouts can agree with each other while both track the target poorly.',
 'partner-integration':'Recovery is the fraction of a next-token distribution change reversed by restoring clean activations. Sensitivity retention is the fraction remaining after ablation. The two ratios have different denominators; neither is general task accuracy.',
 'representation-control':'Reading a state from a representation and controlling behavior by changing that representation are separate tests. “No consistent signed effect” means the fitted directions did not reliably move behavior in the intended direction beyond random-direction controls under this intervention.',
 'reconstruction-ablation':'A probe pairs transcripts that differ in one controlled respect. Separation means the grades change in the direction required by the definitions. Both conditions read the complete transcript; the full instrument also receives reconstructed states and event chains.',
 'human-audit':'Endorsement is the share of reviewed judgments accepted by human auditors with the full record available. It is not independent objective accuracy. Each capability level has its own review denominator.',
 'extractor-stability':'Latent-record agreement compares reconstructed state entries. Ranking Spearman ρ compares the final model order. Stable ranking can coexist with disagreement about the states behind the scores.',
 'judge-families':'Own-family lift is the judge’s relative additional score for a model from its own family, compared with the remaining models. The reported shifts are small; evidence of an equivalent preference by the reference judge is weak.',
 'evaluation-cost':'Tokens include both input and output. Generation includes the two participants; evaluation includes all fifteen calls per exchange. Parallel execution can reduce latency but does not remove these token counts.'
};
function findingDataExplanation(measure){
 if(measure==='information'||measure==='gap-behavior')return informationDefinitions();
 const text=findingDataDefinitions[measure];
 return text?`<aside class="finding-data-explanation"><h4>Terms & measures</h4><p>${safe(text)}</p></aside>`:'';
}
