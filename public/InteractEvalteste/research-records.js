'use strict';

let researchRecordView='latent',researchRecordTurn=5;

function temporalTheoryDrawing(){
  return `<svg class="temporal-theory" viewBox="0 0 490 335" role="img" aria-label="Events ordered by time: established past, current state, and conditional future paths">
  <text x="30" y="35" class="time-zone">Established past</text><text x="239" y="35" class="time-zone">Present</text><text x="353" y="35" class="time-zone">Possible futures</text>
  <path d="M35 171H271" class="time-history"/><path d="M271 171H455" class="time-future"/><path d="m447 166 9 5-9 5" class="time-future"/>
  <path d="M271 171 369 100h70M271 171l98 72h70" class="time-future"/>
  ${[[55,'t−2','Request'],[148,'t−1','Clarification'],[263,'t','Commitment']].map(([x,t,label])=>`<circle cx="${x}" cy="171" r="${t==='t'?9:6}" class="time-observed"/><text x="${x}" y="205" text-anchor="middle">${t}</text><text x="${x}" y="229" text-anchor="middle">${label}</text>`).join('')}
  <circle cx="371" cy="100" r="6" class="time-projected"/><circle cx="371" cy="243" r="6" class="time-projected"/>
  <text x="366" y="79">Progress?</text><text x="366" y="270">Stagnation?</text>
  <path d="M263 57v230" class="time-now"/><text x="30" y="307">Turn / time →</text><text x="275" y="307" class="time-qualification">Projections are not realized events.</text></svg>`;
}
function recordDownloads(name){return `<div class="record-downloads"><span>Download figure</span><a href="./assets/research/${name}-en.svg" download>SVG ↓</a><a href="./assets/research/${name}-en.png" download>PNG ↓</a></div>`;}
function recordTurnControls(max){return `<div class="record-turn-controls"><span>Exchange</span><div role="group" aria-label="Recorded exchange">${Array.from({length:max},(_,i)=>`<button data-record-turn="${i+1}" aria-pressed="${researchRecordTurn===i+1}">t${i+1}</button>`).join('')}</div></div>`;}
function recordTurnDetail(){
  const t=researchRecordTurn,index=t-1;
  if(researchRecordView==='latent'){
    const episode=researchEvidence.latent_episode;
    return `<div class="record-inspection" aria-live="polite"><div><span class="research-eyebrow">Exchange ${t}: user utterance</span><blockquote>“${safe(episode.quotes[index])}”</blockquote><p>At this turn: ${episode.path[index]} is the dominant projected path; user interest is ${episode.interest[index].toFixed(2)}.</p></div><dl>${Object.entries(episode.slots).map(([label,values])=>`<div><dt>${label}</dt><dd class="state-degree degree-${values[index].replace(' ','-')}">${values[index]}</dd></div>`).join('')}</dl></div>`;
  }
  return `<div class="trajectory-turn-detail" aria-live="polite">${researchEvidence.trajectories.episodes.map(episode=>`<article><small>${safe(episode.model)} / t${t}</small>${index<episode.turns.length?`<h4>${episode.interest[index].toFixed(2)} <span>user interest</span></h4><p>${episode.path[index]} · P(Advance) ${episode.advance_probability[index].toFixed(2)}</p><div class="turn-level-readout">${episode.levels[index].map((v,i)=>`<span>L${i+1}<b>${v.toFixed(1)}</b></span>`).join('')}</div>`:`<h4>Episode ended</h4><p>Interest exhausted at turn 5. No turn 6 was observed.</p>`}</article>`).join('')}</div>`;
}
function researchRecordsPanel(){
  const descriptions={
    latent:{name:'latent-state-over-time',width:917,height:554,title:'The state changes before the story is fully told.',copy:'Ten exchanges from one recorded conversation. State degrees, projected path, and user interest share the same time axis. The subject of the state reading is the user.'},
    trajectories:{name:'trajectories-over-time',width:838,height:607,title:'Similar early grades. Different courses of interaction.',copy:'Two reimbursement conversations share the scene and standard user. Their first two exchanges receive identical six-level grades. Later, their interest and projected paths separate.'},
    vocabulary:{name:'latent-state-vocabulary',width:690,height:748,title:'What is recorded beneath the dialogue?',copy:'Four participant-state families describe the person, relationship, world, and goals. A separate interaction record holds engagement and emergence. The sectors count vocabulary fields, not observed frequencies.'}
  };
  const d=descriptions[researchRecordView],max=researchRecordView==='latent'?10:6;
  researchRecordTurn=Math.min(researchRecordTurn,max);
  return `<div class="research-record-selector" role="group" aria-label="Research record view">${[['latent','Latent states over time'],['trajectories','Compare trajectories'],['vocabulary','State vocabulary']].map(([id,label])=>`<button data-record-view="${id}" aria-pressed="${researchRecordView===id}">${label}</button>`).join('')}</div><div class="record-figure-heading"><h3>${d.title}</h3><p>${d.copy}</p></div><figure class="paper-record-figure ${researchRecordView==='vocabulary'?'vocabulary-record':''}"><img src="./assets/research/${d.name}-en.svg" width="${d.width}" height="${d.height}" alt="${d.title}"/>${recordDownloads(d.name)}</figure>${researchRecordView==='vocabulary'?`<div class="state-reading-note"><strong>How to read the state</strong><p>Graded slots use none, low, high, and very high; uncertainty is recorded as unknown. Some goal fields are categorical or boolean. Engagement uses its own numeric scale. Descriptions, rather than slot degrees, pass to the event chain and capability judge.</p></div>`:recordTurnControls(max)+`<div id="record-turn-detail">${recordTurnDetail()}</div>`}<p class="research-small-note">${researchRecordView==='vocabulary'?'The interaction-level record is not a psychological state of either participant.':researchRecordView==='latent'?'The color of a state cell denotes degree, not quality. These are operational interpretations of one episode, not directly observed psychological facts.':'Two illustrative episodes, not a controlled causal comparison. The projected path describes a reading of the course; it does not identify which participant caused it.'}</p>`;
}
function researchFindingsPanel(){return `<div class="paper-findings">${researchEvidence.findings.map((finding,i)=>`<article><span>0${i+1}</span><div><h3>${safe(finding.en_title)}</h3><p>${safe(finding.en)}</p></div></article>`).join('')}</div><div class="research-figure-package"><span>Figure downloads</span><p>The vocabulary map and time-indexed figures are available as editable vector and high-resolution images.</p><a href="./assets/research/InteractEval-figures-en.zip" download>Download the figure kit ↓</a></div>`;}

document.addEventListener('click',event=>{
  const context=event.target.closest('[data-open-record-view]');
  if(context){event.preventDefault();researchRecordView=context.dataset.openRecordView;$('#research-records-body').innerHTML=researchRecordsPanel();$('#temporal-records').scrollIntoView({block:'start',behavior:'smooth'});}
  const view=event.target.closest('[data-record-view]');
  if(view){researchRecordView=view.dataset.recordView;$('#research-records-body').innerHTML=researchRecordsPanel();$('#research-records-body').querySelector(`[data-record-view="${researchRecordView}"]`)?.focus({preventScroll:true});}
  const turn=event.target.closest('[data-record-turn]');
  if(turn){researchRecordTurn=Number(turn.dataset.recordTurn);$('#record-turn-detail').innerHTML=recordTurnDetail();document.querySelectorAll('[data-record-turn]').forEach(button=>button.setAttribute('aria-pressed',String(button===turn)));}
});
