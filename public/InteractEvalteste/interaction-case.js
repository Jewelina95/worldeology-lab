'use strict';

// Case 11: selected turns and fields condensed from the manuscript illustration.
// The player changes the evidence view; it does not run the evaluator or infer scores.
const reimbursementSteps = [
  {name:'A missing brief',time:'t1',view:'115 278 990 175',
   title:'The task starts with gaps.',
   information:'Dates, amount, project code, and invoices are not yet specified.',
   event:'An incomplete request prompts a clarification.',
   judgment:'The question is relevant. Its effect still depends on what happens next.',
   evidence:'“Please handle this.” → “Which dates and expenses?”'},
  {name:'Information arrives',time:'t2',view:'100 460 1010 175',
   title:'New information changes the shared form.',
   information:'The user supplies 2180. The assistant records it; the project code is still missing.',
   event:'Amount supplied → amount entered → remaining gap identified.',
   judgment:'Information uptake is supported by the link between the user’s amount and the updated field.',
   evidence:'User amount: 2180 → Fare: 2180'},
  {name:'The gap is resolved',time:'t3',view:'65 640 1070 190',
   title:'A question leads to a later update.',
   information:'The project code PS2024SH03 is supplied and invoices are uploaded.',
   event:'Code requested → code supplied → form updated.',
   judgment:'The record connects a targeted question to later evidence and task progress. Filled fields alone do not establish submission.',
   evidence:'Project: ? → PS2024SH03 · Invoices: uploaded'}
];
let case11Player = {step:0,playing:true,visible:false,timer:null,observer:null,root:null};
const case11Reduced = matchMedia('(prefers-reduced-motion: reduce)');

function reimbursementCase(){
  return `<section id="response-interaction" class="interaction-case" aria-labelledby="case11-heading">
    <header class="case11-heading"><div><span class="case11-eyebrow">Case 11 · Travel reimbursement</span><h2 id="case11-heading">A reply is a moment.<br/><em>An interaction has a course.</em></h2></div><p>The same task, viewed at two scales. Follow what the participants exchange, what changes, and what the evaluator can support.</p></header>
    <div class="case11-reply"><div class="case11-scope"><span>A</span><h3>Response evaluation</h3></div><div class="case11-mini-dialogue"><p>“Please handle last week’s reimbursement.”</p><span aria-hidden="true">→</span><p>“What types of expenses were incurred?”</p></div><div class="case11-local"><span>Reply judgment</span><strong>Relevant clarification</strong></div></div>
    <div class="case11-interaction"><div class="case11-stage"><div class="case11-stage-top"><div class="case11-scope"><span>B</span><h3>Interaction evaluation</h3></div><button type="button" data-case11-play aria-label="Pause case animation">Pause <span aria-hidden="true">Ⅱ</span></button></div>
      <nav class="case11-timeline" aria-label="Case 11 stages">${reimbursementSteps.map((s,i)=>`<button type="button" data-case11-step="${i}" aria-pressed="${i===0}" ${i===0?'aria-current="step"':''}><span>${s.time}</span><b>${s.name}</b><i aria-hidden="true"></i></button>`).join('')}</nav>
      <div class="case11-scene" role="img" aria-label="Human and AI update a shared reimbursement form over three stages">${reimbursementSteps.map((s,i)=>`<svg class="case11-frame ${i===0?'is-current':''}" data-case11-frame="${i}" viewBox="${s.view}" aria-hidden="true"><defs><clipPath id="case11-crop-${i}"><rect x="${s.view.split(' ')[0]}" y="${s.view.split(' ')[1]}" width="${s.view.split(' ')[2]}" height="${s.view.split(' ')[3]}"/></clipPath></defs><image clip-path="url(#case11-crop-${i})" href="./assets/research/case11/response-interaction.png" x="0" y="0" width="1672" height="941"/></svg>`).join('')}</div>
      <div class="case11-roles"><span>Human</span><i aria-hidden="true">↔</i><strong>Shared task</strong><i aria-hidden="true">↔</i><span>AI</span></div>
      <div class="case11-current"><span data-case11-time>t1</span><div><h4 data-case11-title>${reimbursementSteps[0].title}</h4><p data-case11-evidence>${reimbursementSteps[0].evidence}</p></div></div>
    </div><aside class="case11-record" aria-label="Interaction evidence and judgment"><header><span class="case11-eyebrow">InteractEval</span><h3>Follow the evidence.</h3></header><div class="case11-record-flow"><span>Evidence</span><i>→</i><span>Reconstruct</span><i>→</i><span>Judge</span></div><dl><div><dt><span>01</span>Scene</dt><dd>A valid project code is required.</dd></div><div><dt><span>02</span>Information available</dt><dd data-case11-information>${reimbursementSteps[0].information}</dd></div><div><dt><span>03</span>Event chain</dt><dd data-case11-event>${reimbursementSteps[0].event}</dd></div></dl><div class="case11-judgment"><span>Interaction judgment · illustrative</span><p data-case11-judgment>${reimbursementSteps[0].judgment}</p></div></aside></div>
    <footer class="case11-footer"><p>Local response quality does not imply trajectory quality.</p><span>Selected stages and fields condensed. No live scoring.</span><a href="./assets/research/case11/response-interaction.png" target="_blank" rel="noopener">View the paper figure ↗</a></footer>
  </section>`;
}

function clearCase11Timer(){clearTimeout(case11Player.timer);case11Player.timer=null;}
function scheduleCase11(){
  clearCase11Timer();
  if(!case11Player.playing||!case11Player.visible||document.hidden||case11Reduced.matches||!case11Player.root?.isConnected)return;
  case11Player.timer=setTimeout(()=>{case11Player.step=(case11Player.step+1)%3;paintCase11();scheduleCase11();},6500);
}
function paintCase11(){
  const root=case11Player.root;if(!root)return;
  const s=reimbursementSteps[case11Player.step];
  root.querySelectorAll('[data-case11-step]').forEach((button,i)=>{
    button.setAttribute('aria-pressed',String(i===case11Player.step));
    if(i===case11Player.step)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    button.classList.toggle('is-complete',i<case11Player.step);
  });
  root.querySelectorAll('[data-case11-frame]').forEach((frame,i)=>frame.classList.toggle('is-current',i===case11Player.step));
  for(const key of ['title','information','event','judgment','evidence','time'])root.querySelector(`[data-case11-${key}]`).textContent=s[key];
  const button=root.querySelector('[data-case11-play]');
  button.innerHTML=case11Player.playing?'Pause <span aria-hidden="true">Ⅱ</span>':'Play <span aria-hidden="true">▷</span>';
  button.setAttribute('aria-label',case11Player.playing?'Pause case animation':'Play case animation');
  root.querySelector('.case11-record').classList.remove('case11-update');
  requestAnimationFrame(()=>{if(root.isConnected)root.querySelector('.case11-record').classList.add('case11-update');});
}
function setupCase11(){
  clearCase11Timer();case11Player.observer?.disconnect();
  case11Player.root=document.getElementById('response-interaction');case11Player.visible=false;
  if(!case11Player.root)return;
  case11Player.playing=!case11Reduced.matches;paintCase11();
  case11Player.observer=new IntersectionObserver(entries=>{
    case11Player.visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.2;scheduleCase11();
  },{threshold:.2});
  case11Player.observer.observe(case11Player.root);
}
document.addEventListener('click',event=>{
  const step=event.target.closest('[data-case11-step]');
  if(step){case11Player.step=Number(step.dataset.case11Step);case11Player.playing=false;paintCase11();scheduleCase11();}
  if(event.target.closest('[data-case11-play]')){case11Player.playing=!case11Player.playing;paintCase11();scheduleCase11();}
});
document.addEventListener('visibilitychange',scheduleCase11);
window.addEventListener('pagehide',clearCase11Timer);
case11Reduced.addEventListener('change',()=>{if(case11Reduced.matches){case11Player.playing=false;paintCase11();}scheduleCase11();});
