'use strict';

// Historical framing: Wooldridge & Jennings (1995), Intelligent Agents: Theory
// and Practice, section 2.1, "A Weak Notion of Agency".
// https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/ker95.pdf
// Evaluation context: ProactiveEval (2025), https://arxiv.org/abs/2508.20973.
// These authored vignettes illustrate uncertainty; they are not scored episodes.
const introductoryDialogues = [
  {
    name: 'Before a release', context: 'A team is preparing a software release.',
    lesson: 'The value of the intervention depends on when it happens and whether the compatibility issue is followed through to a check.',
    stages: [
      {title: 'Tests passed', copy: 'The team has evidence about the tested setup. Coverage of existing installations is still unknown.', next: 'Check what the tests covered', turns: [['Engineer', 'The patch passes all the tests.'], ['Reviewer', "Great. Let's get the release ready."]]},
      {title: 'A coverage gap', copy: 'A targeted question exposes a gap in the evidence. The release decision now depends on the older configuration.', next: 'Act on the new information', turns: [['Reviewer', 'Did we test an upgraded project as well as a new one?'], ['Engineer', 'Only a new one. Older projects use a different configuration.']]},
      {title: 'A changed plan', copy: 'The check happens before publication and finds a failure. A proposed fix creates a new obligation: confirm that it works.', next: 'Follow the change through', turns: [['Reviewer', "Let's try an upgraded project before we publish."], ['Engineer', "It fails. I'll add a migration for the old configuration."]]},
      {title: 'Compatibility checked', copy: 'The final exchange supplies evidence that the compatibility issue was addressed. The useful contribution spans several turns: notice, check, act, and verify.', turns: [['Reviewer', 'Does the upgraded project pass with the migration?'], ['Engineer', 'Yes. Both the old and new configurations pass now.']]}
    ]
  },
  {
    name: 'Helping a learner', context: 'A learner has just heard an explanation of fractions.',
    lesson: 'Understanding is an estimate revised from the answers. Correcting an answer with a hint and applying the idea independently provide different evidence.',
    stages: [
      {title: 'A claim to check', copy: 'The learner says the explanation makes sense. Their ability to use it has not yet been demonstrated.', next: 'Try a concrete comparison', turns: [['Tutor', 'Does that explanation make sense?'], ['Learner', 'Yes, I think so.']]},
      {title: 'A misconception', copy: 'The answer suggests that the learner is comparing the denominators as whole numbers. Repeating the same explanation may leave that difficulty unresolved.', next: 'Change the explanation', turns: [['Tutor', 'Which is larger: one third or one quarter?'], ['Learner', 'One quarter. Four is bigger than three.']]},
      {title: 'A revised answer', copy: 'A different representation helps with the original comparison. A fresh example can show whether the reasoning transfers.', next: 'Check a fresh example', turns: [['Tutor', 'Imagine the same cake cut into three equal pieces, then four. Which pieces are larger?'], ['Learner', 'The thirds. So one third is larger.']]},
      {title: 'Independent use', copy: 'The learner explains a new comparison without the cake prompt. This supports understanding of this idea; it does not establish broader mastery of fractions.', turns: [['Tutor', 'And one fifth or one sixth? How would you decide?'], ['Learner', 'One fifth. Fewer pieces means each piece is larger.']]}
    ]
  },
  {
    name: 'Finding the right support', context: 'Two friends meet after a difficult meeting.',
    lesson: 'The purpose of an interaction and the participant’s willingness can change. Useful initiative includes offering a choice, respecting the answer, and allowing the pace to change.',
    stages: [
      {title: 'Support needs', copy: 'Advice may be welcome, but the person has not yet said what they need from this conversation.', next: 'Hear the response', turns: [['Person', 'That meeting went badly.'], ['Friend', 'Want to work out what to say next time?']]},
      {title: 'A clear boundary', copy: 'The person declines a detailed discussion tonight. The next offer gives them a choice about how to continue.', next: 'Follow their preference', turns: [['Person', "I can't go through it all again tonight."], ['Friend', 'Would you prefer some company, without talking through it?']]},
      {title: 'Time together', copy: 'Both people agree to a walk. Pushing for a solution at this point would disregard the preference just expressed.', next: 'Continue to the end of the walk', turns: [['Person', "Yes. Let's just take a walk."], ['Friend', 'Okay. We can leave the meeting alone.']]},
      {title: 'Readiness changes', copy: 'At the end of the walk, the person asks for help tomorrow. The friend leaves the timing with them rather than treating the earlier boundary as permanent.', time: 'At the end of the walk', turns: [['Person', 'Could we look at what happened tomorrow?'], ['Friend', "Of course. Let me know when you're ready."]]}
    ]
  }
];
let introductoryDialogue = 0;
let introductoryStep = 0;

function proactivityHero() {
  const stages = [
    ['Follow the brief', 'L1\u2013L2'],
    ['Adapt as things change', 'L3\u2013L4'],
    ['Take the lead & follow through', 'L5\u2013L6']
  ];
  const ranges = stages.map((_, i) => {
    const scores = publication.models.map(model => model.stages[i]);
    return { low: Math.min(...scores), high: Math.max(...scores) };
  });
  return editorialHero({
    body: `<p class="hero-method-summary">The framework follows participant states and event trajectories across turns, then evaluates six levels of interaction capability.</p><div class="hero-entry-links"><a href="#model-readout">Explore the results <span aria-hidden="true">&#8595;</span></a><a href="./research.html">How evaluation works <span aria-hidden="true">&#8599;</span></a></div>`,
    title: 'Can a model<br/><em>take the next step?</em>',
    deck: 'InteractEval is a benchmark and evaluation framework for multi-turn interaction. It measures how models understand changing situations, take useful initiative, and follow through.',
    aside: `<figure class="hero-finding" aria-labelledby="hero-finding-title"><figcaption><h2 id="hero-finding-title">The gap grows with initiative.</h2><p>Models cluster when following a brief. Their scores spread out when they must take the lead.</p></figcaption><div class="hero-finding-axis"><span>Score (0 to 1)</span><span>Gap between models</span></div>${stages.map(([label,levels],i)=>{const r=ranges[i];return `<div class="hero-finding-row ${i===2?'is-active-stage':''}"><div class="hero-finding-label"><h3>${label}</h3><span>${levels}</span></div><div class="hero-finding-measure"><div class="hero-finding-track" role="img" aria-label="${label}: model scores range from ${r.low.toFixed(3)} to ${r.high.toFixed(3)}"><i style="left:${r.low*100}%;width:${(r.high-r.low)*100}%"></i><b style="left:${r.low*100}%"></b><b style="left:${r.high*100}%"></b></div><strong>${(r.high-r.low).toFixed(3)}</strong></div></div>`;}).join('')}<div class="hero-finding-scale" aria-hidden="true"><span>0</span><span>0.5</span><span>1</span></div><p class="hero-finding-note">Each band spans the lowest to highest score across ten base models. All three use the same scale.</p><a href="#capability">Explore the six capability levels <span aria-hidden="true">&#8595;</span></a></figure>`
  });
}

const introductoryStageLabels=['First exchange','New evidence','Action','Follow-through'];
const introductorySummaries=[
  ['The tests cover one setup. Compatibility with existing projects is still unknown.','A follow-up reveals that older configurations were never checked.','Checking before publication finds a failure and changes the release plan.','The team checks both configurations, closing the issue raised earlier.'],
  ['Agreement gives little evidence that the learner can use the idea.','The comparison reveals a specific misconception about denominators.','A different explanation helps the learner correct the original answer.','A fresh comparison shows the learner applying the reasoning independently.'],
  ['The person has not yet said which kind of support would help.','An explicit boundary makes room for a different kind of support.','The agreed goal is companionship. Advice can wait.','Readiness changes, and the person chooses when to continue.']
];
const introductoryTakeaways=[
  'Useful initiative connects evidence, timing, action, and a later check.',
  'Understanding is an estimate revised as the learner responds.',
  'Useful initiative follows changing goals and respects the participant’s pace.'
];
let introductoryVisibleTurns=2;
const introductoryPlayback={timer:null,observer:null,playing:false,visible:false,started:false,remaining:0,deadline:0,pointerHeld:false,focusHeld:false,historyHeld:false};
const introductoryReducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const introductoryHeld=()=>introductoryPlayback.focusHeld||introductoryPlayback.historyHeld||(introductoryPlayback.pointerHeld&&introductoryVisibleTurns===2);

function syncIntroductoryCases(){
  document.querySelectorAll('[data-intro-case]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.introCase)===introductoryDialogue)));
}

function introductoryDialoguePanel() {
  const c=introductoryDialogues[introductoryDialogue],stage=c.stages[introductoryStep];
  const complete=introductoryVisibleTurns===2,readingStep=complete?introductoryStep:introductoryStep-1;
  const reading=readingStep>=0?c.stages[readingStep]:null;
  const turns=stage.turns.slice(0,introductoryVisibleTurns).map(([speaker,text],j)=>`<li class="is-current ${j===1?'intro-reply':''}" style="--turn-order:${j}"><div class="intro-turn-speaker"><span>${String(introductoryStep*2+j+1).padStart(2,'0')}</span>${speaker}</div><blockquote>${safe(text)}</blockquote></li>`).join('');
  const pendingReply=!complete?`<li class="is-current intro-reply intro-turn-placeholder" aria-hidden="true"><div class="intro-turn-speaker"><span>${introductoryStep*2+2}</span>${stage.turns[1][0]}</div><blockquote>${safe(stage.turns[1][1])}</blockquote><div class="intro-reply-cue"><span>${stage.turns[1][0]}</span><i></i><i></i><i></i></div></li>`:'';
  const history=c.stages.slice(0,introductoryStep).map((s,i)=>`<div><span>${introductoryStageLabels[i]}</span>${s.turns.map(([speaker,text])=>`<p><b>${speaker}</b> ${safe(text)}</p>`).join('')}</div>`).join('');
  return `<nav class="intro-story-progress" aria-label="Conversation stages">${introductoryStageLabels.map((label,i)=>`<button type="button" data-intro-step="${i}" aria-pressed="${i===introductoryStep}" ${i===introductoryStep?'aria-current="step"':''}><span aria-hidden="true">${i<introductoryStep?'&#10003;':String(i+1)}</span>${label}<i aria-hidden="true" style="transform:scaleX(${i<introductoryStep?1:i===introductoryStep?introductoryVisibleTurns/2:0})"></i></button>`).join('')}</nav><div class="intro-dialogue-record intro-motion-scene" tabindex="0" aria-label="Conversation. Focus here to hold the current exchange."><div class="intro-record-heading"><span>${c.context}</span><span>Turn ${introductoryStep*2+introductoryVisibleTurns} of 8</span></div><div class="intro-active-exchange" data-exchange-key="${introductoryDialogue}-${introductoryStep}" data-visible-turns="${introductoryVisibleTurns}">${stage.time?`<p class="intro-scene-time">${stage.time}</p>`:''}<ol class="intro-turns">${turns}${pendingReply}</ol></div>${history?`<details class="intro-conversation-history"><summary>Earlier exchanges (${introductoryStep*2} turns)</summary>${history}</details>`:''}</div><aside class="intro-dialogue-reading" aria-live="off"><div class="intro-reading-content" data-reading-key="${introductoryDialogue}-${readingStep}"><span>${reading?introductoryStageLabels[readingStep]:'First exchange'}</span><h3>${reading?reading.title:'The first exchange'}</h3><p>${reading?introductorySummaries[introductoryDialogue][readingStep]:'The next reply reveals what the participants know or need.'}</p>${complete&&introductoryStep===c.stages.length-1?`<div class="intro-story-lesson"><h4>What this illustrates</h4><p>${introductoryTakeaways[introductoryDialogue]}</p><a href="./research.html#theory">State, trajectory, and initiative &#8599;</a></div>`:''}</div></aside>`;
}

function proactivityOpening() {
  return `<section id="beneath-the-words" class="proactivity-opening" aria-labelledby="proactivity-heading"><div class="intro-history"><span class="intro-eyebrow">Proactiveness</span><div><p>In their 1995 account of agency, Michael Wooldridge and Nicholas R. Jennings included taking initiative toward a goal. In conversation, that may begin with checking an assumption the other person has left unstated.</p></div></div><div class="intro-section-heading"><div><span class="intro-eyebrow">Examples</span><h2 id="proactivity-heading">What happens<br/><em>after the reply?</em></h2></div><p>Three authored examples on a continuous loop. Select a stage or hover over the dialogue to read at your own pace.</p></div><div class="intro-case-selector" role="group" aria-label="Choose a conversation">${introductoryDialogues.map((c,i)=>`<button data-intro-case="${i}" aria-pressed="${i===introductoryDialogue}"><span>0${i+1}</span>${c.name}<b aria-hidden="true">&#8599;</b></button>`).join('')}</div><div id="intro-dialogue-panel" class="intro-dialogue-panel">${introductoryDialoguePanel()}</div></section>`;
}

function updateIntroductoryPanel(focusSelector=''){
  const panel=document.getElementById('intro-dialogue-panel');
  if(!panel)return;
  const active=document.activeElement;
  if(!focusSelector&&panel.contains(active)){
    if(active.matches('.intro-motion-scene'))focusSelector='.intro-motion-scene';
    else if(active.matches('.intro-conversation-history>summary'))focusSelector='.intro-conversation-history>summary';
    else if(active.matches('[data-intro-step]'))focusSelector=`[data-intro-step="${active.dataset.introStep}"]`;
  }
  const oldReading=panel.querySelector('[data-reading-key]')?.dataset.readingKey;
  const oldExchange=panel.querySelector('[data-exchange-key]')?.dataset.exchangeKey;
  const oldCount=Number(panel.querySelector('[data-visible-turns]')?.dataset.visibleTurns||0);
  const historyOpen=oldExchange?.split('-')[0]===String(introductoryDialogue)&&panel.querySelector('.intro-conversation-history')?.open;
  panel.innerHTML=introductoryDialoguePanel();
  const exchangeChanged=oldExchange!==`${introductoryDialogue}-${introductoryStep}`;
  panel.querySelectorAll('.intro-turns li:not(.intro-turn-placeholder)').forEach((turn,i)=>turn.classList.toggle('intro-turn-enter',exchangeChanged||introductoryVisibleTurns<oldCount||i>=oldCount));
  const newReading=panel.querySelector('[data-reading-key]');
  if(newReading&&oldReading!==newReading.dataset.readingKey)newReading.classList.add('intro-reading-enter');
  if(historyOpen){const history=panel.querySelector('.intro-conversation-history');if(history)history.open=true;}
  if(focusSelector)panel.querySelector(focusSelector)?.focus({preventScroll:true});
  introductoryPlayback.pointerHeld=Boolean(panel.querySelector('.intro-motion-scene:hover,.intro-dialogue-reading:hover'));
  introductoryPlayback.focusHeld=panel.contains(document.activeElement);
  introductoryPlayback.historyHeld=Boolean(panel.querySelector('.intro-conversation-history[open]'));
  syncIntroductoryCases();
}

function clearIntroductoryTimer(preserve=false){
  if(introductoryPlayback.timer!==null){
    if(preserve)introductoryPlayback.remaining=Math.max(0,introductoryPlayback.deadline-performance.now());
    clearTimeout(introductoryPlayback.timer);
    introductoryPlayback.timer=null;
  }
  if(!preserve)introductoryPlayback.remaining=0;
}

function introductoryReadingTime(){
  const stage=introductoryDialogues[introductoryDialogue].stages[introductoryStep];
  const text=introductoryVisibleTurns===1?stage.turns[0][1]:stage.turns[1][1]+' '+introductorySummaries[introductoryDialogue][introductoryStep]+(introductoryStep===3?' '+introductoryTakeaways[introductoryDialogue]:'');
  const words=text.trim().split(/\s+/).length;
  return introductoryVisibleTurns===1?Math.min(1400,Math.max(850,words*65+350)):Math.min(4800,Math.max(3400,words*90+700));
}

function scheduleIntroductoryPlayback(){
  if(introductoryPlayback.timer!==null||!introductoryPlayback.playing||!introductoryPlayback.visible||introductoryHeld()||introductoryReducedMotion()||document.hidden||!document.getElementById('intro-dialogue-panel'))return;
  const delay=introductoryPlayback.remaining||introductoryReadingTime();
  introductoryPlayback.deadline=performance.now()+delay;
  introductoryPlayback.remaining=0;
  introductoryPlayback.timer=setTimeout(()=>{
    introductoryPlayback.timer=null;
    if(!introductoryPlayback.playing)return;
    if(introductoryVisibleTurns===1)introductoryVisibleTurns=2;
    else if(introductoryStep<3){introductoryStep++;introductoryVisibleTurns=1;}
    else{introductoryDialogue=(introductoryDialogue+1)%introductoryDialogues.length;introductoryStep=0;introductoryVisibleTurns=1;}
    updateIntroductoryPanel();
    scheduleIntroductoryPlayback();
  },delay);
}

function startIntroductoryPlayback(restart=false){
  const remaining=restart?0:introductoryPlayback.remaining;
  clearIntroductoryTimer();
  if(restart||!introductoryPlayback.started){introductoryStep=0;introductoryVisibleTurns=introductoryReducedMotion()?2:1;}
  introductoryPlayback.started=true;
  introductoryPlayback.playing=true;
  introductoryPlayback.remaining=remaining;
  updateIntroductoryPanel();
  scheduleIntroductoryPlayback();
}

function setupIntroductoryPlayer(){
  clearIntroductoryTimer(true);
  introductoryPlayback.observer?.disconnect();
  introductoryPlayback.visible=false;
  const panel=document.getElementById('intro-dialogue-panel');
  if(!panel)return;
  introductoryPlayback.observer=new IntersectionObserver(entries=>{
    const entry=entries[0],visible=entry.isIntersecting&&entry.intersectionRatio>=.35;
    if(visible===introductoryPlayback.visible)return;
    introductoryPlayback.visible=visible;
    if(!visible){clearIntroductoryTimer(true);return;}
    if(!introductoryPlayback.started)startIntroductoryPlayback(true);
    else{updateIntroductoryPanel();scheduleIntroductoryPlayback();}
  },{threshold:[0,.35],rootMargin:'-100px 0px -30px 0px'});
  introductoryPlayback.observer.observe(panel);
}

document.addEventListener('visibilitychange',()=>{
  if(document.hidden)clearIntroductoryTimer(true);
  else scheduleIntroductoryPlayback();
});
window.addEventListener('pagehide',()=>clearIntroductoryTimer(true));

document.addEventListener('click',event=>{
  const choose=event.target.closest('[data-intro-case]');
  if(choose){introductoryDialogue=Number(choose.dataset.introCase);startIntroductoryPlayback(true);}
  const step=event.target.closest('[data-intro-step]');
  if(step){
    clearIntroductoryTimer();
    introductoryPlayback.playing=true;
    introductoryPlayback.started=true;
    introductoryStep=Number(step.dataset.introStep);
    introductoryVisibleTurns=2;
    updateIntroductoryPanel(`[data-intro-step="${introductoryStep}"]`);
    scheduleIntroductoryPlayback();
  }
});

function introductoryHoverTarget(node){
  return node instanceof Element&&node.closest('#intro-dialogue-panel .intro-motion-scene,#intro-dialogue-panel .intro-dialogue-reading');
}
document.addEventListener('pointerover',event=>{
  if(event.pointerType!=='mouse'||!introductoryHoverTarget(event.target))return;
  introductoryPlayback.pointerHeld=true;
  if(introductoryHeld())clearIntroductoryTimer(true);
});
document.addEventListener('pointerout',event=>{
  if(event.pointerType!=='mouse'||!introductoryHoverTarget(event.target)||introductoryHoverTarget(event.relatedTarget))return;
  introductoryPlayback.pointerHeld=false;
  scheduleIntroductoryPlayback();
});
document.addEventListener('focusin',event=>{
  const panel=document.getElementById('intro-dialogue-panel');
  introductoryPlayback.focusHeld=Boolean(panel?.contains(event.target));
  if(introductoryPlayback.focusHeld)clearIntroductoryTimer(true);
  else scheduleIntroductoryPlayback();
});
document.addEventListener('focusout',event=>{
  const panel=document.getElementById('intro-dialogue-panel');
  if(!panel?.contains(event.target)||panel.contains(event.relatedTarget))return;
  introductoryPlayback.focusHeld=false;
  scheduleIntroductoryPlayback();
});
document.addEventListener('toggle',event=>{
  if(!event.target.matches('.intro-conversation-history'))return;
  introductoryPlayback.historyHeld=event.target.open;
  if(event.target.open)clearIntroductoryTimer(true);
  else scheduleIntroductoryPlayback();
},true);
