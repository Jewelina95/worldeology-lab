'use strict';

let researchWorld='realistic',researchPurpose='functional',researchInformation='partial',researchLevel=4;

function theoryDrawing(id){
  const figures={
    iceberg:['state','An iceberg separates the words of a reply from goals, beliefs, and constraints that remain uncertain.'],
    movie:['trajectory','A turn axis orders observed events before the present and conditional paths after it.'],
    agency:['initiative','Notice a missing detail, propose a check, and follow through by updating the plan.']
  };
  const [name,description]=figures[id];
  return `<img src="./assets/research/concepts/${name}.svg?v=20261029a" width="640" height="440" alt="${description}"/>`;
}
function researchTheoryPanel(){
  const p=principleContent[theoryPrinciple];
  const labels={iceberg:['State','Observed words and inferred context.','Reading the situation'],movie:['Trajectory','Solid paths are observed; dashed paths are conditional.','Following the exchange in time'],agency:['Initiative','A direction is proposed, then sustained.','Choosing and sustaining a direction']};
  const [label,caption,title]=labels[theoryPrinciple];
  return `<figure class="theory-artboard"><div class="theory-art-top"><span>${label}</span><small>Conceptual illustration</small></div>${theoryDrawing(theoryPrinciple)}<figcaption class="theory-art-caption">${caption}</figcaption></figure><div class="theory-essay"><span class="research-eyebrow">${p.name}</span><h3>${title}</h3><p>${p.copy}</p><p class="theory-reading-note">${p.example}</p>${theoryPrinciple==='movie'?'<a class="record-context-link" href="#temporal-records" data-open-record-view="trajectories">View recorded trajectories &#8599;</a>':''}</div>`;
}
function researchInstrumentPanel(){
  const stage=instrumentContent[instrumentStage];
  return `<div class="instrument-detail-heading"><span class="large-step">0${instrumentStage+1}</span><div><span class="research-eyebrow">${stage.name}</span><h3>${stage.verb}</h3></div></div><p>${stage.copy}</p><div class="instrument-io"><section><small>Input</small><p>${stage.input}</p></section><span aria-hidden="true">→</span><section><small>Output</small><p>${stage.output}</p></section></div><div class="instrument-boundary">${navigationIcon('scenario')}<p><strong>Information boundary</strong>${stage.boundary}</p></div>`;
}
const componentFields={
  scene:[['Objective','The practical or relational purpose of the interaction.'],['World rules','Mechanisms, shared facts, and operative constraints.'],['Boundaries','Conditions that remain binding as the conversation develops.'],['Revision','An admitted change supported by a realized event.']],
  latent:[['Observation','A quotation or action visible in the source dialogue.'],['Interpretation','What that evidence suggests about a participant.'],['Uncertainty','Unresolved alternatives, rather than a claim of certainty.'],['Update','A revision when later evidence changes the reading.']],
  events:[['Past','Events already established in the interaction.'],['Present','What has just changed, held, or deteriorated.'],['Future','Conditional continuations that have not yet occurred.'],['Movement','Advance, maintain, degrade, or collapse.']]
};
function researchComponentPanel(){
  const c=componentContent[worldComponent];
  return `<header><span class="research-eyebrow">Reconstruction record: ${c.title}</span><h3>${c.question}</h3><p>${c.copy}</p></header><dl>${componentFields[worldComponent].map(([name,text],i)=>`<div><dt>${name}</dt><dd>${text}</dd></div>`).join('')}</dl><footer>Records describe the evolving situation. Capability scores are assigned separately.${worldComponent==='latent'?'<a class="record-context-link" href="#temporal-records" data-open-record-view="latent">Read latent states over time &#8599;</a>':''}</footer>`;
}
function researchScenarioPanel(){
  const purposes=['functional','mixed','nonfunctional'],information=['sufficient','partial','insufficient'],worlds=['realistic','stylized','science-fictional'];
  const purposeLabels=['Task-oriented','Mixed purpose','Open-ended'],informationLabels=['Sufficient','Partial','Insufficient'];
  const wi=worlds.indexOf(researchWorld),pi=purposes.indexOf(researchPurpose),ii=information.indexOf(researchInformation);
  return `<div class="scenario-map-heading"><div><span class="research-eyebrow">Scenario design</span><h3>Purpose and information</h3></div><span class="scenario-total"><b>27</b> scenario cells</span></div><div class="world-switch" role="group" aria-label="World setting">${worlds.map((id,i)=>`<button data-research-world="${id}" aria-pressed="${researchWorld===id}"><span>0${i+1}</span>${facetContent.realism.items[i][0]}</button>`).join('')}</div><div class="scenario-map-layout"><div class="scenario-matrix"><span class="matrix-axis">Information available →</span><div class="scenario-matrix-grid"><span></span>${informationLabels.map(t=>`<span class="matrix-column">${t}</span>`).join('')}${purposes.map((purpose,p)=>`<span class="matrix-row">${purposeLabels[p]}</span>${information.map((info,i)=>`<button data-scenario-cell="${purpose}/${info}" aria-label="${purposeLabels[p]}, ${informationLabels[i]}, ${facetContent.realism.items[wi][0]}" aria-pressed="${purpose===researchPurpose&&info===researchInformation}"><span>${navigationIcon(p===0?'outcome':p===1?'behavior':'conversation')}</span><small>${purpose===researchPurpose&&info===researchInformation?'Selected':'Explore'}</small></button>`).join('')}`).join('')}</div></div><aside class="scenario-selection" aria-live="polite"><span class="research-eyebrow">Selected scenario</span><h4>${purposeLabels[pi]}<br/><em>${facetContent.realism.items[wi][0].toLowerCase()} setting</em></h4><dl><div><dt>Purpose</dt><dd>${facetContent.purpose.items[pi][1]}</dd></div><div><dt>Information</dt><dd>${facetContent.information.items[ii][1]}</dd></div><div><dt>World rules</dt><dd>${facetContent.realism.items[wi][1]}</dd></div></dl></aside></div><p class="research-small-note">Three world settings × three purposes × three information conditions. This map explores the design; it does not display scores for individual cells.</p>`;
}
function researchRubricPanel(){
  const id='L'+(researchLevel+1),g=measureGuide(id);
  return `<div class="rubric-ladder" role="group" aria-label="Capability levels">${levelNames.map((name,i)=>`<button data-research-level="${i}" aria-pressed="${researchLevel===i}" style="--level:${i}"><span>L${i+1}</span><strong>${measureGuide('L'+(i+1)).title}</strong><i aria-hidden="true">↗</i></button>`).join('')}</div><aside class="rubric-reading" aria-live="polite"><span class="rubric-level">${id}</span><small>${['Passive execution','Responsive adaptation','Active adaptation'][Math.floor(researchLevel/2)]}</small><h3>${g.title}</h3><p>${g.meaning}</p><div><span>Reading the measure</span><p>${g.reading}</p></div><small class="formal-level-name">${levelNames[researchLevel]}</small></aside>`;
}
function researchFeaturePage(){ return researchShowcasePage(); }

document.addEventListener('click',event=>{
  const theory=event.target.closest('[data-feature-theory]');
  if(theory){theoryPrinciple=theory.dataset.featureTheory;$('#feature-theory-panel').innerHTML=researchTheoryPanel();document.querySelectorAll('[data-feature-theory]').forEach(b=>b.setAttribute('aria-pressed',String(b===theory)));}
  const stage=event.target.closest('[data-feature-stage]');
  if(stage){instrumentStage=Number(stage.dataset.featureStage);$('#feature-instrument-panel').innerHTML=researchInstrumentPanel();document.querySelectorAll('[data-feature-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.featureStage)===instrumentStage)));}
  const component=event.target.closest('[data-feature-component]');
  if(component){worldComponent=component.dataset.featureComponent;$('#feature-component-panel').innerHTML=researchComponentPanel();document.querySelectorAll('[data-feature-component]').forEach(b=>b.setAttribute('aria-pressed',String(b===component)));}
  const world=event.target.closest('[data-research-world]'),cell=event.target.closest('[data-scenario-cell]');
  if(world||cell){if(world)researchWorld=world.dataset.researchWorld;else [researchPurpose,researchInformation]=cell.dataset.scenarioCell.split('/');$('#feature-scenario-panel').innerHTML=researchScenarioPanel();const selector=world?`[data-research-world="${researchWorld}"]`:`[data-scenario-cell="${researchPurpose}/${researchInformation}"]`;$('#feature-scenario-panel').querySelector(selector)?.focus({preventScroll:true});}
  const level=event.target.closest('[data-research-level]');
  if(level){researchLevel=Number(level.dataset.researchLevel);$('#feature-rubric-panel').innerHTML=researchRubricPanel();$('#feature-rubric-panel').querySelector(`[data-research-level="${researchLevel}"]`)?.focus({preventScroll:true});}
});
