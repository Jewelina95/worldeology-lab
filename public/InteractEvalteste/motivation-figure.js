'use strict';

// The approved paper figure is never rearranged or redrawn. Only B's central
// evidence is revealed over time. A and the entire right-hand column stay fixed.
const motivationCues=[
 {at:.5,end:2.6,label:'The user asks: “Please handle this.”',rects:[[140,298,157,149],[294,298,166,60]],glow:[294,298,166,60]},
 {at:2.8,end:4.8,label:'The AI asks which dates and expenses are involved.',rects:[[887,279,167,82],[857,340,238,108]],glow:[887,279,167,82]},
 {at:4.8,end:6.3,label:'The shared task still has missing details.',rects:[[466,283,344,156]],glow:[473,394,328,38]},
 {at:6.4,end:7.6,label:'The clarification leads to another exchange.',path:'M891 421C883 463 740 452 615 452S350 446 280 485'},
 {at:7.3,end:9,label:'The user returns with new information.',rects:[[143,472,154,149],[296,485,67,64],[294,542,153,78]],glow:[296,485,67,64]},
 {at:8.4,end:10,label:'The information is carried into the shared task.',rects:[[465,465,344,74],[700,538,100,34]],path:'M413 544L466 544'},
 {at:9.4,end:11,label:'The supplied amount, 2180, is entered in the form.',rects:[[481,538,95,36]],glow:[481,538,95,36]},
 {at:10.8,end:12,label:'The project code is still missing.',rects:[[587,537,108,37],[474,575,331,36]],glow:[587,537,108,37]},
 {at:11.8,end:13.3,label:'The AI asks: “Please confirm the project code.”',rects:[[887,463,167,81],[866,523,229,104]],glow:[887,463,167,81],path:'M696 557L859 525'},
 {at:13.5,end:15,label:'The next exchange follows the unresolved gap.',path:'M888 600C879 640 748 625 628 627S354 622 269 664'},
 {at:14.9,end:17,label:'The user supplies the missing information and uploads invoices.',rects:[[141,644,135,166],[270,665,180,68],[292,729,155,87]],glow:[270,665,180,68]},
 {at:17,end:18.8,label:'The form retains the amount and gains the project code.',rects:[[462,643,348,78],[476,720,102,44],[584,720,111,44]],glow:[584,720,111,44]},
 {at:18.8,end:20.5,label:'Invoices are recorded; the selected fields are complete.',rects:[[698,708,111,63],[472,774,340,40]],glow:[472,774,340,40]},
 {at:20.8,end:23,label:'The AI asks for confirmation before submission.',rects:[[894,647,163,81],[902,690,206,128]],glow:[894,647,163,81]}
];
const motivationDuration=28;
const motivationPlayer={time:0,playing:true,visible:false,raf:null,last:null,painted:-1,observer:null,root:null};
const motivationReduced=matchMedia('(prefers-reduced-motion: reduce)');
const motivationImage='./assets/research/case11/response-interaction.png';
function motivationArtwork(){
 const rects=cue=>(cue.rects||[]).map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`).join('');
 return `<svg class="motivation-art" viewBox="0 0 1672 941" role="img" aria-labelledby="motivation-art-title motivation-art-description"><title id="motivation-art-title">Response evaluation and interaction evaluation</title><desc id="motivation-art-description">The paper's complete Case 11 figure. The A panel and right column remain static. In B, words, emails, arrows, and shared-form updates light up in the order of the interaction.</desc><defs>
 <filter id="motivation-grey" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".27" intercept=".70"/><feFuncG type="linear" slope=".27" intercept=".70"/><feFuncB type="linear" slope=".27" intercept=".70"/></feComponentTransfer></filter>
 <clipPath id="motivation-b"><rect x="128" y="278" width="983" height="541" rx="5"/></clipPath>
 ${motivationCues.map((cue,i)=>`${cue.rects?`<clipPath id="motivation-area-${i}">${rects(cue)}</clipPath>`:''}${cue.path?`<mask id="motivation-path-${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="941"><path data-motivation-path="${i}" d="${cue.path}" fill="none" stroke="white" stroke-width="19" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></mask>`:''}`).join('')}</defs>
 <image href="${motivationImage}" width="1672" height="941"/>
 <g data-motivation-grey><image href="${motivationImage}" width="1672" height="941" filter="url(#motivation-grey)" clip-path="url(#motivation-b)"/></g>
 ${motivationCues.map((cue,i)=>`${cue.rects?`<image data-motivation-reveal="${i}" opacity="0" href="${motivationImage}" width="1672" height="941" clip-path="url(#motivation-area-${i})"/>`:''}${cue.path?`<image href="${motivationImage}" width="1672" height="941" mask="url(#motivation-path-${i})"/><circle data-motivation-dot="${i}" r="5.5" fill="${i===8?'#bd784c':'#66859a'}" opacity="0"/>`:''}${cue.glow?`<rect data-motivation-glow="${i}" x="${cue.glow[0]}" y="${cue.glow[1]}" width="${cue.glow[2]}" height="${cue.glow[3]}" rx="7" fill="none" stroke="${i===0||i===4||i===10?'#bd784c':'#66859a'}" stroke-width="3" opacity="0"/>`:''}`).join('')}</svg>`;
}
function motivationFigure(standalone=false){
 return `<section id="response-interaction" class="motivation-section ${standalone?'motivation-standalone':''}" aria-label="Response versus interaction">
 ${standalone?'':`<header class="motivation-heading"><h2>From a reply to an interaction.</h2><p>A judges the relevance of one reply. B follows the exchanges, information uptake, and changes to the shared task.</p></header>`}
 <figure class="motivation-figure"><div class="motivation-picture">${motivationArtwork()}</div><figcaption><div class="motivation-controls"><button type="button" data-motivation-play aria-label="Pause figure animation">Ⅱ</button><button type="button" data-motivation-replay aria-label="Replay figure animation">↺</button><label><span class="motivation-sr">Figure playback position</span><input data-motivation-seek type="range" min="0" max="28" step="0.1" value="0"/></label><output aria-live="off" data-motivation-clock>0:00 / 0:28</output>${standalone?'':`<a href="./response-interaction.html" target="_blank" rel="noopener">Open figure ↗</a>`}</div><p data-motivation-caption>The user begins a reimbursement request.</p></figcaption></figure>
 </section>`;
}
function clearMotivation(){if(motivationPlayer.raf!==null)cancelAnimationFrame(motivationPlayer.raf);motivationPlayer.raf=null;motivationPlayer.last=null;}
function paintMotivation(){
 const root=motivationPlayer.root;if(!root)return;const t=motivationPlayer.time;
 const setOpacity=(el,v)=>{if(el)el.setAttribute('opacity',String(Math.max(0,Math.min(1,v))));};
 // At the end of the sequence, remove every overlay: exactly the original image.
 const finished=Math.max(0,Math.min(1,(t-23)/1.2));setOpacity(root.querySelector('[data-motivation-grey]'),1-finished);
 let caption='The user begins a reimbursement request.';
 motivationCues.forEach((cue,i)=>{
   const progress=Math.max(0,Math.min(1,(t-cue.at)/.85));
   setOpacity(root.querySelector(`[data-motivation-reveal="${i}"]`),progress);
   const path=root.querySelector(`[data-motivation-path="${i}"]`);
   if(path){const travel=Math.max(0,Math.min(1,(t-cue.at)/1.25));path.setAttribute('stroke-dashoffset',String(1-travel));const dot=root.querySelector(`[data-motivation-dot="${i}"]`),point=path.getPointAtLength(path.getTotalLength()*travel);dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);setOpacity(dot,travel>0&&travel<1?Math.sin(Math.PI*travel):0);}
   setOpacity(root.querySelector(`[data-motivation-glow="${i}"]`),t>=cue.at&&t<cue.end?Math.min(1,(t-cue.at)*3,(cue.end-t)*3)*.8:0);
   if(t>=cue.at)caption=cue.label;
 });
 if(t>=23)caption='One relevant reply is a local judgment. Interaction evaluation connects evidence and task changes across turns.';
 root.querySelector('[data-motivation-caption]').textContent=caption;
 const seek=root.querySelector('[data-motivation-seek]');if(document.activeElement!==seek)seek.value=t;seek.setAttribute('aria-valuetext',`${t.toFixed(1)} of 28 seconds`);
 root.querySelector('[data-motivation-clock]').textContent=`0:${String(Math.floor(t)).padStart(2,'0')} / 0:28`;
 const button=root.querySelector('[data-motivation-play]');button.textContent=motivationPlayer.playing?'Ⅱ':'▷';button.setAttribute('aria-label',motivationPlayer.playing?'Pause figure animation':'Play figure animation');
}
function scheduleMotivation(){
 clearMotivation();if(!motivationPlayer.playing||!motivationPlayer.visible||document.hidden||!motivationPlayer.root?.isConnected)return;
 const tick=now=>{if(motivationPlayer.last!==null)motivationPlayer.time=(motivationPlayer.time+(now-motivationPlayer.last)/1000)%motivationDuration;motivationPlayer.last=now;if(now-motivationPlayer.painted>45){paintMotivation();motivationPlayer.painted=now;}motivationPlayer.raf=requestAnimationFrame(tick);};motivationPlayer.raf=requestAnimationFrame(tick);
}
function setupMotivationFigure(){
 clearMotivation();motivationPlayer.observer?.disconnect();motivationPlayer.root=document.getElementById('response-interaction');motivationPlayer.visible=false;if(!motivationPlayer.root)return;
 motivationPlayer.playing=!motivationReduced.matches;if(motivationReduced.matches)motivationPlayer.time=27;paintMotivation();
 motivationPlayer.observer=new IntersectionObserver(entries=>{motivationPlayer.visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.15;scheduleMotivation();},{threshold:.15});motivationPlayer.observer.observe(motivationPlayer.root.querySelector('.motivation-picture'));
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-motivation-play]')){motivationPlayer.playing=!motivationPlayer.playing;paintMotivation();scheduleMotivation();}
 if(event.target.closest('[data-motivation-replay]')){motivationPlayer.time=0;motivationPlayer.playing=true;paintMotivation();scheduleMotivation();}
});
document.addEventListener('input',event=>{if(event.target.matches('[data-motivation-seek]')){motivationPlayer.time=Number(event.target.value);motivationPlayer.playing=false;paintMotivation();scheduleMotivation();}});
document.addEventListener('visibilitychange',scheduleMotivation);window.addEventListener('pagehide',clearMotivation);
motivationReduced.addEventListener('change',()=>{if(motivationReduced.matches){motivationPlayer.playing=false;paintMotivation();scheduleMotivation();}});
if(document.body.hasAttribute('data-motivation-only')){document.getElementById('motivation-app').innerHTML=motivationFigure(true);setupMotivationFigure();}
