'use strict';
// Adapted from Jewelina95/InteractEval-website (MIT); see THIRD_PARTY_NOTICES.md.

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

const systemCues=[{"at": 0.3, "end": 2.3, "label": "Data Iceberg Theory: visible words and actions require a grounded interaction state.", "rects": [[13, 101, 564, 502]], "glow": [13, 101, 564, 502]}, {"at": 2.5, "end": 4.5, "label": "Movie Evaluation Theory: judge the developing state-and-event trajectory.", "rects": [[589, 101, 622, 502]], "glow": [589, 101, 622, 502]}, {"at": 4.7, "end": 6.7, "label": "Agency Principle: identify a warranted direction and follow its contribution over time.", "rects": [[1224, 101, 492, 502]], "glow": [1224, 101, 492, 502]}, {"at": 6.8, "end": 8, "label": "Ground the state: what is known, missing, or unconfirmed?", "rects": [[15, 680, 500, 230]], "path": "M307 604L307 644", "glow": [15, 680, 500, 230]}, {"at": 8, "end": 9.4, "label": "Track the trajectory: what changed, and what can follow?", "rects": [[619, 680, 520, 230]], "path": "M516 839L620 839", "glow": [619, 680, 520, 230]}, {"at": 8, "end": 9.4, "label": "Track the trajectory: what changed, and what can follow?", "path": "M864 604L864 644"}, {"at": 9.4, "end": 10.8, "label": "Appraise directional contribution: why this proposal, and how did it develop?", "rects": [[1240, 680, 470, 230]], "path": "M1139 839L1238 839", "glow": [1240, 680, 470, 230]}, {"at": 9.4, "end": 10.8, "label": "Appraise directional contribution: why this proposal, and how did it develop?", "path": "M1440 605L1440 645"}, {"at": 11, "end": 12.8, "label": "Set the conditions: case goals, rules, and role views.", "rects": [[17, 984, 403, 284]], "glow": [17, 984, 403, 284], "stage": 0}, {"at": 12.8, "end": 14.6, "label": "Observe the exchange: dialogue and visible actions supply the interaction evidence.", "rects": [[431, 984, 404, 284]], "path": "M410 1117L441 1117", "glow": [431, 984, 404, 284], "stage": 1}, {"at": 14.6, "end": 16.4, "label": "Reconstruct the interaction: scene, state estimates, and events.", "rects": [[846, 984, 420, 284]], "path": "M829 1117L859 1117", "glow": [846, 984, 420, 284], "stage": 2}, {"at": 14.6, "end": 16.4, "label": "Reconstruct the interaction: scene, state estimates, and events.", "path": "M1054 912L1054 984"}, {"at": 16.4, "end": 17.8, "label": "State and trajectory requirements jointly inform reconstruction.", "path": "M499 912L499 927L995 927L995 983"}, {"at": 17.8, "end": 19.4, "label": "Judge capability against the reconstructed context and the original evidence.", "rects": [[1278, 984, 431, 284]], "path": "M1256 1117L1293 1117", "glow": [1278, 984, 431, 284], "stage": 3}, {"at": 19.4, "end": 21, "label": "Both reconstruction and adjudication check claims against the same source record.", "rects": [[500, 1254, 290, 64]], "path": "M794 1288L1318 1288L1318 1260"}, {"at": 19.4, "end": 21, "label": "Both reconstruction and adjudication check claims against the same source record.", "path": "M794 1288L1067 1288L1067 1260"}, {"at": 21, "end": 23, "label": "Keep the trace: retain state changes, events, judgments, and cited evidence before aggregation.", "rects": [[19, 1324, 1690, 90]], "path": "M1556 1269L1556 1314L1479 1314L1479 1357L1406 1357", "glow": [19, 1324, 1690, 90]}, {"at": 22.4, "end": 24.2, "label": "The retained diagnostic trace comes before the reporting summary.", "path": "M1398 1373L1488 1373"}];

const systemImage='./assets/research/figure5/theory-v5.png';

function systemArtwork(){
 const rects=cue=>(cue.rects||[]).map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`).join('');
 return `<svg class="motivation-art" viewBox="0 0 1728 1440" role="img" aria-labelledby="system-art-title system-art-description"><title id="system-art-title">Figure 5: From three theoretical foundations to a stateful measurement instrument</title><desc id="system-art-description">The original Figure 5. Three theoretical lenses connect to measurement requirements, then to case construction, interaction, reconstruction, capability adjudication, and retained evidence. Original arrows carry the animated information flow.</desc><defs>
 <filter id="system-grey" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".27" intercept=".70"/><feFuncG type="linear" slope=".27" intercept=".70"/><feFuncB type="linear" slope=".27" intercept=".70"/></feComponentTransfer></filter>
 <clipPath id="system-b"><rect x="12" y="100" width="1704" height="1316" rx="5"/></clipPath>
 ${systemCues.map((cue,i)=>`${cue.rects?`<clipPath id="system-area-${i}">${rects(cue)}</clipPath>`:''}${cue.path?`<mask id="system-path-${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="1728" height="1440"><path data-system-path="${i}" d="${cue.path}" fill="none" stroke="white" stroke-width="19" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></mask>`:''}`).join('')}</defs>
 <image href="${systemImage}" width="1728" height="1440"/>
 <g data-system-grey><image href="${systemImage}" width="1728" height="1440" filter="url(#system-grey)" clip-path="url(#system-b)"/></g>
 ${systemCues.map((cue,i)=>`${cue.rects?`<image data-system-reveal="${i}" opacity="0" href="${systemImage}" width="1728" height="1440" clip-path="url(#system-area-${i})"/>`:''}${cue.path?`<image href="${systemImage}" width="1728" height="1440" mask="url(#system-path-${i})"/><circle data-system-dot="${i}" r="5.5" fill="${i===8?'#bd784c':'#66859a'}" opacity="0"/>`:''}${cue.glow?`<rect data-system-glow="${i}" x="${cue.glow[0]}" y="${cue.glow[1]}" width="${cue.glow[2]}" height="${cue.glow[3]}" rx="7" fill="none" stroke="${i===0||i===4||i===10?'#bd784c':'#66859a'}" stroke-width="3" opacity="0"/>`:''}`).join('')}</svg>`;
}


function interactionFigure(kind){
 if(kind==='motivation'&&window.whyInteractionFigure)return window.whyInteractionFigure();
 const why=kind==='motivation',id=why?'response-interaction':'system-overview';
 const title=why?'Why interact':'How we extract';
 const description=why?'A relevant reply can leave the task unresolved. Follow what changes across the conversation.':'We reconstruct participant states and event trajectories, then evaluate each contribution in context.';
 const file=why?'response-interaction.html':'system-overview.html';
 return `<section id="${id}" class="article-section interaction-opening" aria-labelledby="${id}-heading"><header class="interaction-heading"><h2 id="${id}-heading">${title}</h2><p>${description}</p></header><figure class="interaction-figure"><div class="interaction-picture" data-interaction-figure="${kind}">${why?motivationArtwork():systemArtwork()}</div><figcaption><p data-interaction-caption>${why?'The user begins a reimbursement request.':'Three complementary lenses guide reconstruction.'}</p><a href="./${file}" target="_blank" rel="noopener" aria-label="View full figure: ${title}">View full figure &#8599;</a></figcaption></figure></section>`;
}
const interactionPlayers=[];
const interactionReduced=matchMedia('(prefers-reduced-motion: reduce)');
function stopInteractionPlayer(player){
 if(player.raf!==null)cancelAnimationFrame(player.raf);
 player.raf=null;player.last=null;
}
function paintInteractionPlayer(player){
 const {kind,time,root}=player,why=kind==='motivation';
 const finished=Math.max(0,Math.min(1,(time-(why?23:24.2))/1.2));
 player.grey.setAttribute('opacity',1-finished);
 let caption=why?'The user begins a reimbursement request.':'Three complementary lenses guide reconstruction.';
 for(const cue of player.cues){
  const progress=Math.max(0,Math.min(1,(time-cue.at)/.85));
  cue.reveal?.setAttribute('opacity',progress);
  if(cue.path){
   const travel=Math.max(0,Math.min(1,(time-cue.at)/1.25));
   cue.path.setAttribute('stroke-dashoffset',1-travel);
   if(travel>0&&travel<1){const point=cue.path.getPointAtLength(cue.length*travel);cue.dot.setAttribute('cx',point.x);cue.dot.setAttribute('cy',point.y);}
   cue.dot.setAttribute('opacity',travel>0&&travel<1?Math.sin(Math.PI*travel):0);
  }
  cue.glowNode?.setAttribute('opacity',time>=cue.at&&time<cue.end?Math.min(1,(time-cue.at)*3,(cue.end-time)*3)*.8:0);
  if(time>=cue.at)caption=cue.label;
 }
 if(finished===1)caption=why?'A reply answers a moment. An interaction carries the task forward.':'States, events, and source evidence are retained alongside each judgment.';
 if(player.caption.textContent!==caption)player.caption.textContent=caption;
}
function scheduleInteractionPlayer(player){
 stopInteractionPlayer(player);
 if(!player.visible||document.hidden||interactionReduced.matches||!player.root.isConnected)return;
 const tick=now=>{
  if(!player.root.isConnected){stopInteractionPlayer(player);return;}
  if(player.last!==null)player.time=(player.time+(now-player.last)/1000)%28;
  player.last=now;
  if(now-player.painted>=50){paintInteractionPlayer(player);player.painted=now;}
  player.raf=requestAnimationFrame(tick);
 };
 player.raf=requestAnimationFrame(tick);
}
function setupInteractionFigures(){
 window.setupWhyInteractionFigures?.();
 window.setupTheoryProcessFigures?.();
 for(const player of interactionPlayers){stopInteractionPlayer(player);player.observer.disconnect();}
 interactionPlayers.length=0;
 for(const root of document.querySelectorAll('[data-interaction-figure]')){
  const kind=root.dataset.interactionFigure,raw=kind==='motivation'?motivationCues:systemCues;
  const player={kind,root,time:interactionReduced.matches?27:0,visible:false,raf:null,last:null,painted:-1,
   grey:root.querySelector(`[data-${kind}-grey]`),caption:root.closest('figure').querySelector('[data-interaction-caption]')};
  player.cues=raw.map((cue,i)=>{const path=root.querySelector(`[data-${kind}-path="${i}"]`);return {...cue,path,length:path?.getTotalLength(),reveal:root.querySelector(`[data-${kind}-reveal="${i}"]`),dot:root.querySelector(`[data-${kind}-dot="${i}"]`),glowNode:root.querySelector(`[data-${kind}-glow="${i}"]`)};});
  player.observer=new IntersectionObserver(entries=>{player.visible=entries[0].isIntersecting;scheduleInteractionPlayer(player);},{threshold:0});
  interactionPlayers.push(player);paintInteractionPlayer(player);player.observer.observe(root);
 }
}
document.addEventListener('visibilitychange',()=>interactionPlayers.forEach(scheduleInteractionPlayer));
window.addEventListener('pagehide',()=>interactionPlayers.forEach(stopInteractionPlayer));
window.addEventListener('pageshow',()=>interactionPlayers.forEach(scheduleInteractionPlayer));
interactionReduced.addEventListener('change',()=>interactionPlayers.forEach(player=>{if(interactionReduced.matches)player.time=27;paintInteractionPlayer(player);scheduleInteractionPlayer(player);}));
if(document.body.dataset.interactionOnly){document.getElementById('interaction-app').innerHTML=interactionFigure(document.body.dataset.interactionOnly);setupInteractionFigures();}
