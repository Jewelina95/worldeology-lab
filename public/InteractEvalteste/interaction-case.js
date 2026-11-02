'use strict';

// A single persistent scene, with a continuous 30-second playhead.
// Dialogue is condensed from Case 11; this is an illustration, not live scoring.
const case11Duration=30;
const case11Speech=[
  {at:0,who:'human',text:'Please handle last week’s reimbursement.'},
  {at:4,who:'ai',text:'Which dates and expenses?'},
  {at:8,who:'human',text:'Airfare: 2180.'},
  {at:12,who:'ai',text:'Please confirm the project code.'},
  {at:17,who:'human',text:'PS2024SH03. Invoices uploaded.'},
  {at:23,who:'ai',text:'Ready to submit. Confirm?'}
];
const case11Reduced=matchMedia('(prefers-reduced-motion: reduce)');
const case11Player={time:0,playing:true,visible:false,raf:null,last:null,observer:null,root:null,lastPaint:-1};
function case11Actor(who){
  const human=who==='human',view=human?'140 300 155 145':'860 343 230 104',v=view.split(' ');
  return `<svg viewBox="${view}" role="img" aria-label="${human?'Human participant':'AI assistant'}"><defs><clipPath id="case11-actor-${who}"><rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}" rx="8"/></clipPath></defs><image clip-path="url(#case11-actor-${who})" href="./assets/research/case11/actor-plate.png" width="1672" height="941"/></svg>`;
}
function reimbursementCase(){
  return `<section id="response-interaction" class="interaction-case" aria-labelledby="case11-heading">
  <header class="case11-heading"><div><span class="case11-eyebrow">Case 11 · Travel reimbursement</span><h2 id="case11-heading">A reply is a moment.<br/><em>An interaction has a course.</em></h2></div><p>Watch one conversation unfold. The participants stay in the same scene while their words, shared information, and next steps change.</p></header>
  <div class="case11-reply"><div class="case11-scope"><span>A</span><h3>Response evaluation</h3></div><div class="case11-mini-dialogue"><p>“Please handle last week’s reimbursement.”</p><span aria-hidden="true">→</span><p>“What types of expenses were incurred?”</p></div><div class="case11-local"><span>Reply judgment</span><strong>Relevant clarification</strong></div></div>
  <div class="case11-interaction"><div class="case11-stage"><div class="case11-stage-top"><div class="case11-scope"><span>B</span><h3>Interaction evaluation</h3></div><span class="case11-playing-label"><i></i>One continuous conversation</span></div>
  <div class="case11-film" aria-label="Animated conversation: a human and an AI update one shared reimbursement form">
    <div class="case11-room" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="case11-speech case11-human-speech"><span>Human</span><p data-case11-human-text>Please handle last week’s reimbursement.</p><div class="case11-typing" data-case11-human-typing aria-hidden="true"><i></i><i></i><i></i></div></div>
    <div class="case11-speech case11-ai-speech"><span>AI</span><p data-case11-ai-text></p><div class="case11-typing" data-case11-ai-typing aria-hidden="true"><i></i><i></i><i></i></div></div>
    <div class="case11-character case11-human" data-case11-actor="human">${case11Actor('human')}<span>Human</span></div>
    <div class="case11-character case11-ai" data-case11-actor="ai">${case11Actor('ai')}<span>AI</span></div>
    <svg class="case11-routes" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="case11-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 7 4-7 4" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs><path class="case11-route-human" d="M215 340Q285 365 350 330"/><path class="case11-route-ai" d="M785 340Q715 365 650 330"/></svg>
    <div class="case11-shared-form"><header><span class="case11-form-icon" aria-hidden="true">▤</span><div><span>Shared task</span><h4>Travel reimbursement</h4></div></header><dl><div data-case11-field="fare"><dt>Fare</dt><dd data-case11-fare>—</dd></div><div data-case11-field="project"><dt>Project</dt><dd data-case11-project>—</dd></div><div data-case11-field="invoices"><dt>Invoices</dt><dd data-case11-invoices>—</dd></div></dl><p class="case11-form-status" data-case11-status>Missing details</p></div>
    <span class="case11-packet" data-case11-packet aria-hidden="true"></span>
    <span class="case11-observation" data-case11-observation aria-hidden="true">Evidence retained ↗</span>
  </div>
  <div class="case11-player-controls"><button type="button" data-case11-play aria-label="Pause case animation">Ⅱ</button><button type="button" data-case11-replay aria-label="Replay case animation">↺</button><label><span class="visually-hidden">Conversation playback position</span><input type="range" data-case11-seek min="0" max="30" step="0.1" value="0" aria-valuetext="0 of 30 seconds"/></label><output aria-live="off" data-case11-clock>0:00 / 0:30</output></div>
  <div class="case11-current"><span class="case11-caption-dot" aria-hidden="true"></span><div><h4 data-case11-title>The task starts with gaps.</h4><p data-case11-evidence>The user introduces a reimbursement request.</p></div></div>
  </div><aside class="case11-record" aria-label="Interaction evidence and judgment"><header><span class="case11-eyebrow">InteractEval</span><h3>Follow the evidence.</h3></header><div class="case11-record-flow"><span>Evidence</span><i>→</i><span>Reconstruct</span><i>→</i><span>Judge</span></div><dl><div><dt><span>01</span>Scene</dt><dd>A valid project code is required.</dd></div><div><dt><span>02</span>Information available</dt><dd data-case11-information>Dates, amount, project code, and invoices are not yet specified.</dd></div><div><dt><span>03</span>Event chain</dt><dd><ol class="case11-event-trail"><li data-case11-event="0">Request → clarification</li><li data-case11-event="1">Amount supplied → entered</li><li data-case11-event="2">Code requested → supplied</li><li data-case11-event="3">Invoices received → checked</li></ol></dd></div></dl><div class="case11-judgment"><span>Interaction judgment · illustrative</span><p data-case11-judgment>A relevant question is only the beginning. Watch whether its answer changes the task.</p></div></aside></div>
  <footer class="case11-footer"><p>Local response quality does not imply trajectory quality.</p><span>Dialogue and selected fields condensed. No live scoring.</span><a href="./assets/research/case11/response-interaction.png" target="_blank" rel="noopener">View the paper figure ↗</a></footer></section>`;
}
function clearCase11Timer(){if(case11Player.raf!==null)cancelAnimationFrame(case11Player.raf);case11Player.raf=null;case11Player.last=null;}
function scheduleCase11(){
  clearCase11Timer();
  if(!case11Player.playing||!case11Player.visible||document.hidden||!case11Player.root?.isConnected)return;
  const tick=now=>{
    if(case11Player.last!==null)case11Player.time=(case11Player.time+(now-case11Player.last)/1000)%case11Duration;
    case11Player.last=now;
    if(now-case11Player.lastPaint>45){paintCase11();case11Player.lastPaint=now;}
    case11Player.raf=requestAnimationFrame(tick);
  };
  case11Player.raf=requestAnimationFrame(tick);
}
function case11Set(selector,value){const el=case11Player.root.querySelector(selector);if(el.textContent!==value)el.textContent=value;}
function paintCase11(){
  const root=case11Player.root;if(!root)return;const t=case11Player.time;
  root.dataset.playing=String(case11Player.playing);
  let current=case11Speech[0];for(const speech of case11Speech)if(speech.at<=t)current=speech;
  for(const who of ['human','ai']){
    const s=case11Speech.filter(x=>x.who===who&&x.at<=t).at(-1);
    const count=s?Math.min(s.text.length,Math.floor((t-s.at)*31)+1):0;
    case11Set(`[data-case11-${who}-text]`,s?s.text.slice(0,count):'');
    const talking=current.who===who&&t-current.at<2.5;
    root.querySelector(`[data-case11-actor="${who}"]`).classList.toggle('is-speaking',talking);
    root.querySelector(`.case11-${who}-speech`).classList.toggle('is-speaking',talking);
    root.querySelector(`[data-case11-${who}-typing]`).hidden=Boolean(s&&count===s.text.length);
  }
  const fare=t>=10.8,project=t>=20.3,invoices=t>=22;
  case11Set('[data-case11-fare]',fare?'2180':'—');case11Set('[data-case11-project]',project?'PS2024SH03':t>=12?'?':'—');case11Set('[data-case11-invoices]',invoices?'Uploaded':'—');
  for(const [field,complete,at] of [['fare',fare,10.8],['project',project,20.3],['invoices',invoices,22]]){
    const el=root.querySelector(`[data-case11-field="${field}"]`);el.classList.toggle('is-filled',complete);el.classList.toggle('just-updated',complete&&t-at<1.1);
  }
  case11Set('[data-case11-status]',invoices?'Selected fields complete':fare?'Project code missing':'Missing details');root.querySelector('[data-case11-status]').classList.toggle('is-complete',invoices);
  const packet=root.querySelector('[data-case11-packet]');let flight=null;
  for(const f of [{start:9.2,end:10.8,text:'2180',field:'fare'},{start:18.5,end:20.3,text:'PS2024SH03',field:'project'},{start:20.5,end:22,text:'Invoices',field:'invoices'}])if(t>=f.start&&t<f.end)flight=f;
  packet.hidden=!flight;
  if(flight){const q=(t-flight.start)/(flight.end-flight.start),scene=root.querySelector('.case11-film').getBoundingClientRect(),actor=root.querySelector('.case11-human').getBoundingClientRect(),target=root.querySelector(`[data-case11-field="${flight.field}"] dd`).getBoundingClientRect(),sx=actor.right-scene.left-15,sy=actor.top-scene.top+actor.height*.6,ex=target.left-scene.left+target.width/2,ey=target.top-scene.top+target.height/2;packet.textContent=flight.text;packet.style.left=(sx+(ex-sx)*q)+'px';packet.style.top=(sy+(ey-sy)*q-40*Math.sin(Math.PI*q))+'px';packet.style.opacity=String(Math.min(1,q*8,(1-q)*8));}
  const observe=(fare&&t<11.9)||(project&&t<21.4)||(invoices&&t<23.1);root.querySelector('[data-case11-observation]').classList.toggle('is-visible',observe);
  root.querySelectorAll('[data-case11-event]').forEach((el,i)=>el.classList.toggle('is-observed',t>=[4,10.8,20.3,23][i]));
  let title='The task starts with gaps.',evidence='The user introduces a reimbursement request.',info='Dates, amount, project code, and invoices are not yet specified.',judgment='A relevant question is only the beginning. Watch whether its answer changes the task.';
  if(t>=4){title='A clarification opens the next exchange.';evidence='The AI asks for dates and expenses.';}
  if(t>=8){title='The user supplies an amount.';evidence='User message: airfare 2180. The information is on its way to the shared form.';}
  if(fare){title='The amount is taken up.';evidence='User amount: 2180 → Fare: 2180.';info='Fare 2180 is recorded. The project code and invoices remain missing.';judgment='Information uptake is supported by the user’s amount appearing in the form.';}
  if(t>=12){title='The remaining gap prompts another question.';evidence='“Please confirm the project code.” The form still retains the amount.';}
  if(project){title='The code changes the shared task state.';evidence='Project: ? → PS2024SH03. Earlier information remains in the form.';info='Fare 2180 and project PS2024SH03 are recorded. The invoices follow.';}
  if(invoices){title='Later evidence completes the selected fields.';evidence='The AI asks for confirmation before formal submission.';info='The amount, project code, and invoice upload are now recorded.';judgment='The question, the user’s answer, and the update form one evidence chain. Filled fields do not establish backend submission.';}
  for(const [key,value] of Object.entries({title,evidence,information:info,judgment}))case11Set(`[data-case11-${key}]`,value);
  const seek=root.querySelector('[data-case11-seek]');if(document.activeElement!==seek)seek.value=t;seek.setAttribute('aria-valuetext',`${t.toFixed(1)} of 30 seconds`);
  case11Set('[data-case11-clock]',`0:${String(Math.floor(t)).padStart(2,'0')} / 0:30`);
  const play=root.querySelector('[data-case11-play]');play.textContent=case11Player.playing?'Ⅱ':'▷';play.setAttribute('aria-label',case11Player.playing?'Pause case animation':'Play case animation');
}
function setupCase11(){
  clearCase11Timer();case11Player.observer?.disconnect();case11Player.root=document.getElementById('response-interaction');case11Player.visible=false;if(!case11Player.root)return;
  case11Player.playing=!case11Reduced.matches;if(case11Reduced.matches)case11Player.time=27;paintCase11();
  case11Player.observer=new IntersectionObserver(entries=>{case11Player.visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.2;scheduleCase11();},{threshold:.2});case11Player.observer.observe(case11Player.root.querySelector('.case11-film'));
}
document.addEventListener('click',event=>{
  if(event.target.closest('[data-case11-play]')){case11Player.playing=!case11Player.playing;paintCase11();scheduleCase11();}
  if(event.target.closest('[data-case11-replay]')){case11Player.time=0;case11Player.playing=true;paintCase11();scheduleCase11();}
});
document.addEventListener('input',event=>{if(event.target.matches('[data-case11-seek]')){case11Player.time=Math.min(case11Duration,Number(event.target.value));case11Player.playing=false;paintCase11();scheduleCase11();}});
 document.addEventListener('visibilitychange',scheduleCase11);window.addEventListener('pagehide',clearCase11Timer);
case11Reduced.addEventListener('change',()=>{if(case11Reduced.matches){case11Player.playing=false;paintCase11();scheduleCase11();}});
