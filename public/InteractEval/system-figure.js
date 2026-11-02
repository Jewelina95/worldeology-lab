(function(){
'use strict';
if(typeof window.systemFigure==='function')return;
'use strict';

// Preserve the original Figure 5. Animate its existing regions and evidence paths.
const systemCues=[{"at": 0.3, "end": 2.3, "label": "Data Iceberg Theory: visible words and actions require a grounded interaction state.", "rects": [[13, 101, 564, 502]], "glow": [13, 101, 564, 502]}, {"at": 2.5, "end": 4.5, "label": "Movie Evaluation Theory: judge the developing state-and-event trajectory.", "rects": [[589, 101, 622, 502]], "glow": [589, 101, 622, 502]}, {"at": 4.7, "end": 6.7, "label": "Agency Principle: identify a warranted direction and follow its contribution over time.", "rects": [[1224, 101, 492, 502]], "glow": [1224, 101, 492, 502]}, {"at": 6.8, "end": 8, "label": "Ground the state: what is known, missing, or unconfirmed?", "rects": [[15, 680, 500, 230]], "path": "M307 604L307 644", "glow": [15, 680, 500, 230]}, {"at": 8, "end": 9.4, "label": "Track the trajectory: what changed, and what can follow?", "rects": [[619, 680, 520, 230]], "path": "M516 839L620 839", "glow": [619, 680, 520, 230]}, {"at": 8, "end": 9.4, "label": "Track the trajectory: what changed, and what can follow?", "path": "M864 604L864 644"}, {"at": 9.4, "end": 10.8, "label": "Appraise directional contribution: why this proposal, and how did it develop?", "rects": [[1240, 680, 470, 230]], "path": "M1139 839L1238 839", "glow": [1240, 680, 470, 230]}, {"at": 9.4, "end": 10.8, "label": "Appraise directional contribution: why this proposal, and how did it develop?", "path": "M1440 605L1440 645"}, {"at": 11, "end": 12.8, "label": "Set the conditions: case goals, rules, and role views.", "rects": [[17, 984, 403, 284]], "glow": [17, 984, 403, 284], "stage": 0}, {"at": 12.8, "end": 14.6, "label": "Observe the exchange: dialogue and visible actions supply the interaction evidence.", "rects": [[431, 984, 404, 284]], "path": "M410 1117L441 1117", "glow": [431, 984, 404, 284], "stage": 1}, {"at": 14.6, "end": 16.4, "label": "Reconstruct the interaction: scene, state estimates, and events.", "rects": [[846, 984, 420, 284]], "path": "M829 1117L859 1117", "glow": [846, 984, 420, 284], "stage": 2}, {"at": 14.6, "end": 16.4, "label": "Reconstruct the interaction: scene, state estimates, and events.", "path": "M1054 912L1054 984"}, {"at": 16.4, "end": 17.8, "label": "State and trajectory requirements jointly inform reconstruction.", "path": "M499 912L499 927L995 927L995 983"}, {"at": 17.8, "end": 19.4, "label": "Judge capability against the reconstructed context and the original evidence.", "rects": [[1278, 984, 431, 284]], "path": "M1256 1117L1293 1117", "glow": [1278, 984, 431, 284], "stage": 3}, {"at": 19.4, "end": 21, "label": "Both reconstruction and adjudication check claims against the same source record.", "rects": [[500, 1254, 290, 64]], "path": "M794 1288L1318 1288L1318 1260"}, {"at": 19.4, "end": 21, "label": "Both reconstruction and adjudication check claims against the same source record.", "path": "M794 1288L1067 1288L1067 1260"}, {"at": 21, "end": 23, "label": "Keep the trace: retain state changes, events, judgments, and cited evidence before aggregation.", "rects": [[19, 1324, 1690, 90]], "path": "M1556 1269L1556 1314L1479 1314L1479 1357L1406 1357", "glow": [19, 1324, 1690, 90]}, {"at": 22.4, "end": 24.2, "label": "The retained diagnostic trace comes before the reporting summary.", "path": "M1398 1373L1488 1373"}];
const systemDuration=28;
const systemPlayer={time:0,playing:true,visible:false,raf:null,last:null,painted:-1,observer:null,root:null};
const systemReduced=matchMedia('(prefers-reduced-motion: reduce)');
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
function systemStageIcons(){
 const paths=[
 '<path d="M3 7h7l2 3h9v10H3z"/><path d="M3 7V4h7l2 3"/>',
 '<path d="M3 4h13v10H9l-4 3v-3H3z"/><path d="M18 9h3v11h-4l-3 2v-4"/>',
 '<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
 '<path d="M9 4H5v17h15V4h-4M9 3h7v4H9zM8 14l3 3 6-7"/>'
 ];
 return `<ol class="system-stage-icons" aria-label="Instrument responsibilities">${['Set the conditions','Observe the exchange','Reconstruct the interaction','Judge capability'].map((name,i)=>`<li data-system-stage="${i}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${paths[i]}</svg><span>${name}</span></li>`).join('')}</ol>`;
}
function systemFigure(standalone=false){
 return `<section id="system-overview" class="motivation-section ${standalone?'motivation-standalone':''}" aria-label="System overview">
 ${standalone?'':`<header class="motivation-heading"><h2>System Overview</h2><p>From reply to judgment. Figure 5 connects the three theoretical foundations to the instrument that reconstructs and evaluates an interaction.</p></header>${systemStageIcons()}`}
 <figure class="motivation-figure"><div class="motivation-picture">${systemArtwork()}</div><figcaption><div class="motivation-controls"><button type="button" data-system-play aria-label="Pause system animation">Ⅱ</button><button type="button" data-system-replay aria-label="Replay system animation">↺</button><label><span class="motivation-sr">System playback position</span><input data-system-seek type="range" min="0" max="28" step="0.1" value="0"/></label><output aria-live="off" data-system-clock>0:00 / 0:28</output>${standalone?'':`<a href="./system-overview.html" target="_blank" rel="noopener">Open Figure 5 ↗</a>`}</div><p data-system-caption>Three theoretical lenses specify what the instrument must measure.</p><p class="system-source-note">Figure 5 · Illustrative reimbursement scenario. State and event reconstruction jointly inform capability adjudication; diagnostic records are retained before aggregation.</p></figcaption></figure>
 </section>`;
}
function clearSystem(){if(systemPlayer.raf!==null)cancelAnimationFrame(systemPlayer.raf);systemPlayer.raf=null;systemPlayer.last=null;}
function paintSystem(){
 const root=systemPlayer.root;if(!root)return;const t=systemPlayer.time;
 const setOpacity=(el,v)=>{if(el)el.setAttribute('opacity',String(Math.max(0,Math.min(1,v))));};
 // At the end of the sequence, remove every overlay: exactly the original image.
 const finished=Math.max(0,Math.min(1,(t-24.2)/1.2));setOpacity(root.querySelector('[data-system-grey]'),1-finished);
 let caption='Three theoretical lenses specify what the instrument must measure.';
 systemCues.forEach((cue,i)=>{
   const progress=Math.max(0,Math.min(1,(t-cue.at)/.85));
   setOpacity(root.querySelector(`[data-system-reveal="${i}"]`),progress);
   const path=root.querySelector(`[data-system-path="${i}"]`);
   if(path){const travel=Math.max(0,Math.min(1,(t-cue.at)/1.25));path.setAttribute('stroke-dashoffset',String(1-travel));const dot=root.querySelector(`[data-system-dot="${i}"]`),point=path.getPointAtLength(path.getTotalLength()*travel);dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);setOpacity(dot,travel>0&&travel<1?Math.sin(Math.PI*travel):0);}
   setOpacity(root.querySelector(`[data-system-glow="${i}"]`),t>=cue.at&&t<cue.end?Math.min(1,(t-cue.at)*3,(cue.end-t)*3)*.8:0);
   if(t>=cue.at)caption=cue.label;
 });
 if(t>=24.2)caption='Reconstruct the interaction before assigning capability judgments. Retain the diagnostic record before aggregation.';
 const currentStage=systemCues.filter(cue=>cue.stage!==undefined&&t>=cue.at).at(-1)?.stage;
 root.querySelectorAll('[data-system-stage]').forEach(el=>el.classList.toggle('is-active',Number(el.dataset.systemStage)===currentStage&&t<24.2));
 root.querySelector('[data-system-caption]').textContent=caption;
 const seek=root.querySelector('[data-system-seek]');if(document.activeElement!==seek)seek.value=t;seek.setAttribute('aria-valuetext',`${t.toFixed(1)} of 28 seconds`);
 root.querySelector('[data-system-clock]').textContent=`0:${String(Math.floor(t)).padStart(2,'0')} / 0:28`;
 const button=root.querySelector('[data-system-play]');button.textContent=systemPlayer.playing?'Ⅱ':'▷';button.setAttribute('aria-label',systemPlayer.playing?'Pause system animation':'Play system animation');
}
function scheduleSystem(){
 clearSystem();if(!systemPlayer.playing||!systemPlayer.visible||document.hidden||!systemPlayer.root?.isConnected)return;
 const tick=now=>{if(systemPlayer.last!==null)systemPlayer.time=(systemPlayer.time+(now-systemPlayer.last)/1000)%systemDuration;systemPlayer.last=now;if(now-systemPlayer.painted>45){paintSystem();systemPlayer.painted=now;}systemPlayer.raf=requestAnimationFrame(tick);};systemPlayer.raf=requestAnimationFrame(tick);
}
function setupSystemFigure(){
 clearSystem();systemPlayer.observer?.disconnect();systemPlayer.root=document.getElementById('system-overview');systemPlayer.visible=false;if(!systemPlayer.root)return;
 systemPlayer.playing=!systemReduced.matches;if(systemReduced.matches)systemPlayer.time=27;paintSystem();
 systemPlayer.observer=new IntersectionObserver(entries=>{systemPlayer.visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.08;scheduleSystem();},{threshold:.08});systemPlayer.observer.observe(systemPlayer.root.querySelector('.motivation-picture'));
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-system-play]')){systemPlayer.playing=!systemPlayer.playing;paintSystem();scheduleSystem();}
 if(event.target.closest('[data-system-replay]')){systemPlayer.time=0;systemPlayer.playing=true;paintSystem();scheduleSystem();}
});
document.addEventListener('input',event=>{if(event.target.matches('[data-system-seek]')){systemPlayer.time=Number(event.target.value);systemPlayer.playing=false;paintSystem();scheduleSystem();}});
document.addEventListener('visibilitychange',scheduleSystem);window.addEventListener('pagehide',clearSystem);
systemReduced.addEventListener('change',()=>{if(systemReduced.matches){systemPlayer.playing=false;paintSystem();scheduleSystem();}});
if(document.body.hasAttribute('data-system-only')){document.getElementById('system-app').innerHTML=systemFigure(true);setupSystemFigure();}

window.systemFigure=systemFigure;
window.setupSystemFigure=setupSystemFigure;
})();
