/* InteractEval · approved conceptual Figure 1. No live evaluation or empirical result is simulated. */
(()=>{'use strict';
 const script=document.currentScript,base=new URL('.',script.src);
 const image=new URL('assets/research/figure1/figure1.png',base).href;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const cues=[
  {at:0,end:3,label:'Shared request',caption:'The same request starts both situations: “How do I make a bomb?”',boxes:[[290,30,1000,73]]},
  {at:3,end:7,label:'t₁ · Scene',caption:'The scene differs: an ordinary room in A; visible alien ships in B. The request alone does not establish intent.',boxes:[[383,335,100,95],[383,680,100,95],[491,310,302,183],[491,626,302,195]],slice:0},
  {at:7,end:10,label:'Response slice',caption:'The response view extracts one exchange from Situation A. It omits the surrounding world and its continuation.',boxes:[[491,310,302,183],[28,720,314,182]],slice:0,mapping:true},
  {at:10,end:14,label:'t₂ · Evidence',caption:'A says “Just curious.” B says “I’m afraid” and states an intention to attack. These utterances provide observable evidence.',boxes:[[909,315,110,82],[909,633,115,85],[885,282,100,30],[885,609,100,30]],slice:1},
  {at:14,end:18,label:'t₂ · Latent State',caption:'Evidence supports different participant-state estimates: curiosity in A; fear and an attack intention in B. These estimates describe the human participant and remain constrained by evidence.',boxes:[[578,495,175,42],[578,823,175,42],[916,823,175,42],[1256,823,240,42]],slice:1,latent:true},
  {at:18,end:23,label:'t₃ · Event Chain',caption:'A develops toward an explanation. In B, landing is observed, hostile intent remains unknown, and the AI asks for further evidence. Fear persists.',boxes:[[1197,310,311,183],[1197,626,311,195],[509,547,955,32],[509,875,955,32]],slice:2,chain:true},
  {at:23,end:28,label:'Interaction world',caption:'Scene, Latent State and Event Chain give the exchange its meaning over time. This is a conceptual illustration, not an experimental result.',boxes:[],complete:true}
 ];
 window.whyInteractionFigure=()=>`<section id="response-interaction" class="article-section interaction-opening" aria-labelledby="response-interaction-heading"><header class="interaction-heading"><h2 id="response-interaction-heading">Why interact</h2><p>One response is a slice. Interaction unfolds through a world, participant states and events.</p></header><figure class="why-motion" data-why-motion><div class="why-art-wrap"><svg class="why-art" viewBox="0 0 1586 992" role="img" aria-labelledby="why-art-title why-art-desc"><title id="why-art-title">Response and interaction intelligence across three time slices</title><desc id="why-art-desc">The same request appears in two fictional situations. A participant is curious in an ordinary room; another is afraid of arriving aliens. Evidence supports different latent-state estimates and event chains. A response is extracted from the first slice of Situation A.</desc><defs><filter id="why-grey"><feColorMatrix type="saturate" values="0"/></filter><filter id="why-glow"><feGaussianBlur stdDeviation="4"/></filter><mask id="why-focus"><rect width="1586" height="992" fill="white"/><g data-why-holes fill="black"></g></mask><linearGradient id="why-scan-fill"><stop stop-color="#4ab6df" stop-opacity="0"/><stop offset=".5" stop-color="#4ab6df" stop-opacity=".12"/><stop offset="1" stop-color="#4ab6df" stop-opacity="0"/></linearGradient></defs><image href="${image}" width="1586" height="992"/><g data-why-dimmer mask="url(#why-focus)"><image href="${image}" width="1586" height="992" filter="url(#why-grey)" opacity=".2"/><rect width="1586" height="992" fill="white" opacity=".56"/></g><g data-why-scan><rect x="487" y="266" width="310" height="602" rx="4" fill="url(#why-scan-fill)" stroke="#28a6d1" stroke-width="2.5"/><path d="M487 266l28 -16h310l-28 16 M797 266v602l28 -16V250" fill="none" stroke="#28a6d1" stroke-width="1.4" opacity=".6"/></g><path data-why-mapping d="M491 310L28 720M491 493L342 902" fill="none" stroke="#148bad" stroke-width="3" stroke-dasharray="9 7" opacity="0"/><g data-why-rings fill="none" stroke="#208fb1" stroke-width="3"></g></svg></div><figcaption><div class="why-controls"><button type="button" data-why-play aria-label="Pause animation">Pause</button><button type="button" data-why-replay>Replay</button><div class="why-times" role="group" aria-label="Select time slice"><button type="button" data-why-step="3">t₁</button><button type="button" data-why-step="10">t₂</button><button type="button" data-why-step="18">t₃</button></div><label class="why-seek"><span class="why-sr">Animation position</span><input data-why-seek type="range" min="0" max="28" step=".1" value="0"/></label><output data-why-clock>0:00 / 0:28</output><a href="./response-interaction.html" target="_blank" rel="noopener">View full figure ↗</a></div><p class="why-stage" data-why-label></p><p class="why-caption" data-why-caption></p></figcaption></figure></section>`;
 const players=new Set();
 function setup(root){
  if(root.dataset.ready)return;root.dataset.ready='true';
  const q=s=>root.querySelector(s);let time=reduced.matches?27:0,playing=!reduced.matches,visible=false,last=null,raf=null;
  const play=q('[data-why-play]'),seek=q('[data-why-seek]');
  const rect=([x,y,w,h],pad=0)=>`<rect x="${x-pad}" y="${y-pad}" width="${w+pad*2}" height="${h+pad*2}" rx="8"/>`;
  function paint(){
   const cue=cues.find(c=>time>=c.at&&time<c.end)||cues.at(-1);
   q('[data-why-dimmer]').setAttribute('opacity',cue.complete?'0':'1');
   q('[data-why-holes]').innerHTML=cue.boxes.map(b=>rect(b,5)).join('');
   q('[data-why-rings]').innerHTML=cue.boxes.map(b=>rect(b,5)).join('');
   q('[data-why-rings]').setAttribute('stroke',cue.latent?'#b87336':cue.chain?'#377f68':'#208fb1');
   const scan=q('[data-why-scan]');scan.setAttribute('opacity',cue.slice===undefined?'0':'.9');
   if(cue.slice!==undefined){const xs=[0,361,706];scan.setAttribute('transform',`translate(${xs[cue.slice]} 0)`);}
   q('[data-why-mapping]').setAttribute('opacity',cue.mapping?'1':'0');
   q('[data-why-mapping]').setAttribute('stroke-dashoffset',String(-time*17));
   q('[data-why-label]').textContent=cue.label;
   q('[data-why-caption]').textContent=cue.caption;
   q('[data-why-clock]').textContent=`0:${String(Math.floor(time)).padStart(2,'0')} / 0:28`;
   seek.value=time;
   play.textContent=playing?'Pause':'Play';play.setAttribute('aria-label',playing?'Pause animation':'Play animation');
   root.querySelectorAll('[data-why-step]').forEach(b=>b.setAttribute('aria-pressed',String(cue.slice===[3,10,18].indexOf(Number(b.dataset.whyStep)))));
  }
  function stop(){if(raf!==null)cancelAnimationFrame(raf);raf=null;last=null;}
  function schedule(){stop();if(!playing||!visible||document.hidden||!root.isConnected)return;
   const tick=now=>{if(!root.isConnected){stop();observer.disconnect();players.delete(api);return;}if(last!==null)time=(time+Math.min(.2,(now-last)/1000))%28;last=now;paint();raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);
  }
  play.addEventListener('click',()=>{playing=!playing;paint();schedule();});
  q('[data-why-replay]').addEventListener('click',()=>{time=0;playing=true;paint();schedule();});
  seek.addEventListener('input',()=>{time=Number(seek.value);playing=false;paint();schedule();});
  root.querySelectorAll('[data-why-step]').forEach(b=>b.addEventListener('click',()=>{time=Number(b.dataset.whyStep);playing=false;paint();schedule();}));
  const observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;schedule();},{threshold:.05});
  const api={root,schedule,pause:stop,reduce(){if(reduced.matches){time=27;playing=false;}paint();schedule();},seek(t){time=t;playing=false;paint();schedule();},destroy(){stop();observer.disconnect();}};
  root.whyPlayer=api;players.add(api);observer.observe(root);paint();
 }
 window.setupWhyInteractionFigures=()=>{for(const p of players){if(!p.root.isConnected){p.destroy();players.delete(p);}else p.schedule();}document.querySelectorAll('[data-why-motion]').forEach(setup);};
 document.addEventListener('visibilitychange',()=>players.forEach(p=>p.schedule()));
 window.addEventListener('pagehide',()=>players.forEach(p=>p.pause()));
 window.addEventListener('pageshow',()=>players.forEach(p=>p.schedule()));
 reduced.addEventListener('change',()=>players.forEach(p=>p.reduce()));
 if(document.body.hasAttribute('data-why-only')){document.getElementById('why-app').innerHTML=window.whyInteractionFigure();window.setupWhyInteractionFigures();}
})();
