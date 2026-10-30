'use strict';

// Conceptual illustration of §§2.1–2.3, not a plot of measured episode values.
let heroInteractionTime=1;
const heroInteractionPlayer={timer:null,observer:null,visible:false,playing:true,held:false};
function heroInteractionDrawing(step=heroInteractionTime){
  const xs=[90,204,318,432],ys=[341,330,319,308],x=xs[step],y=ys[step];
  const bubble=(bx,by,reply=false)=>`<g transform="translate(${bx} ${by})"><path d="M-21-13h42v26H-8l-9 7v-7h-4Z" class="${reply?'hi-reply':'hi-utterance'}"/><path d="M-12-4H12M-12 3H5" class="hi-words"/></g>`;
  return `<svg class="hi-drawing" viewBox="0 0 560 490" role="group" aria-label="Response is one selected exchange; interaction includes its history, evolving state, and conditional continuations. Schematic, not measured data."><defs><linearGradient id="hi-world" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#729a7b" stop-opacity=".16"/><stop offset="1" stop-color="#729a7b" stop-opacity=".02"/></linearGradient></defs>
  <text x="30" y="37" class="hi-label">Response</text><text x="526" y="37" text-anchor="end" class="hi-time-label">t${step+1}</text>
  <g class="hi-response-crop"><rect x="125" y="62" width="310" height="100" rx="16"/>${bubble(208,111)}<path d="M239 111H296" class="hi-reply-arrow"/><path d="m289 106 8 5-8 5" class="hi-reply-arrow"/>${bubble(350,111,true)}</g>
  <path d="M147 165 ${x-26} ${y-71}M413 165 ${x+26} ${y-80}" class="hi-crop-guide"/>
  <text x="30" y="229" class="hi-interaction-label">Interaction</text>
  <path d="M29 288 463 251 531 290 97 332Z" fill="url(#hi-world)" class="hi-world-edge"/><path d="M29 288v128l68 39 434-43V290M97 332v123" class="hi-world-edge"/><path d="m29 416 434-42 68 38" class="hi-world-edge"/>
  <path d="M${xs.map((v,i)=>`${v} ${ys[i]}`).join(' L')}" class="hi-event-path"/>
  <path d="M432 308Q473 305 511 269M432 308Q478 322 515 328M432 308Q471 349 501 379" class="hi-futures"/>
  <circle cx="511" cy="269" r="5" class="hi-future-node"/><circle cx="515" cy="328" r="5" class="hi-future-node"/><circle cx="501" cy="379" r="5" class="hi-future-node"/>
  <g class="hi-slice" transform="translate(${x} ${y})"><path d="M-34-73 34-80V105l-68 7Z"/><path d="M-34-73V112M34-80V105"/><text x="0" y="-89" text-anchor="middle">t${step+1}</text></g>
  ${xs.map((cx,i)=>`<a href="#home" data-hero-time="${i}" aria-label="Select exchange ${i+1}" aria-current="${i===step?'step':'false'}" class="hi-exchange ${i===step?'is-current':''} ${i<step?'is-past':''}"><path d="M${cx} ${ys[i]+4}v66" class="hi-state-link"/>${bubble(cx-17,ys[i]-39)}${bubble(cx+16,ys[i]-1,true)}<circle cx="${cx}" cy="${ys[i]+79}" r="14" class="hi-state-node"/><text x="${cx}" y="${ys[i]+84}" text-anchor="middle" class="hi-psi">Ψ</text><text x="${cx}" y="${ys[i]+116}" text-anchor="middle" class="hi-exchange-label">t${i+1}</text><rect x="${cx-36}" y="${ys[i]-58}" width="72" height="160" fill="transparent"/><title>Exchange ${i+1}: observable dialogue and a carried state estimate</title></a>`).join('')}
  <text x="29" y="481" class="hi-axis-label">Past</text><path d="M78 477H443" class="hi-axis"/><path d="m437 473 7 4-7 4" class="hi-axis"/><text x="531" y="481" text-anchor="end" class="hi-axis-label">Future</text></svg>`;
}
function heroInteractionFigure(){
  return `<figure class="hero-interaction" aria-label="Response and interaction: an interactive conceptual figure"><div id="hero-interaction-drawing">${heroInteractionDrawing()}</div><div class="hi-controls"><button type="button" data-hero-play aria-label="Pause interaction animation" aria-pressed="false"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4v12M13 4v12"/></svg></button><label class="hi-scrubber"><span class="visually-hidden">Choose an exchange</span><input type="range" data-hero-scrub min="0" max="3" step="1" value="${heroInteractionTime}" aria-valuetext="Exchange ${heroInteractionTime+1} of 4"/></label><output id="hi-current-turn">t${heroInteractionTime+1} / t4</output></div><div class="hi-key"><span><i class="hi-solid"></i>Observed</span><span><i class="hi-dashed"></i>Possible</span><span>Ψ · State</span></div></figure>`;
}
function clearHeroInteractionTimer(){if(heroInteractionPlayer.timer!==null)clearTimeout(heroInteractionPlayer.timer);heroInteractionPlayer.timer=null;}
function paintHeroInteraction(){
  const figure=document.querySelector('.hero-interaction');if(!figure)return;
  figure.querySelector('#hero-interaction-drawing').innerHTML=heroInteractionDrawing();
  const scrub=figure.querySelector('[data-hero-scrub]');scrub.value=heroInteractionTime;scrub.setAttribute('aria-valuetext',`Exchange ${heroInteractionTime+1} of 4`);
  figure.querySelector('#hi-current-turn').textContent=`t${heroInteractionTime+1} / t4`;
  const play=figure.querySelector('[data-hero-play]');play.setAttribute('aria-label',heroInteractionPlayer.playing?'Pause interaction animation':'Play interaction animation');play.setAttribute('aria-pressed',String(!heroInteractionPlayer.playing));play.innerHTML=`<svg viewBox="0 0 20 20" aria-hidden="true"><path d="${heroInteractionPlayer.playing?'M7 4v12M13 4v12':'m7 4 8 6-8 6Z'}"/></svg>`;
}
function scheduleHeroInteraction(){
  clearHeroInteractionTimer();
  if(!heroInteractionPlayer.visible||!heroInteractionPlayer.playing||heroInteractionPlayer.held||document.hidden)return;
  heroInteractionPlayer.timer=setTimeout(()=>{heroInteractionTime=(heroInteractionTime+1)%4;paintHeroInteraction();scheduleHeroInteraction();},2600);
}
function setupHeroInteraction(){
  clearHeroInteractionTimer();heroInteractionPlayer.observer?.disconnect();heroInteractionPlayer.visible=false;heroInteractionPlayer.held=false;
  const figure=document.querySelector('.hero-interaction');if(!figure)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)heroInteractionPlayer.playing=false;
  paintHeroInteraction();
  heroInteractionPlayer.observer=new IntersectionObserver(entries=>{heroInteractionPlayer.visible=entries[0].isIntersecting;scheduleHeroInteraction();},{threshold:.15});heroInteractionPlayer.observer.observe(figure);
}
document.addEventListener('input',event=>{if(!event.target.matches('[data-hero-scrub]'))return;heroInteractionTime=Number(event.target.value);heroInteractionPlayer.playing=false;clearHeroInteractionTimer();paintHeroInteraction();});
document.addEventListener('click',event=>{
  const step=event.target.closest('[data-hero-time]');if(step){event.preventDefault();heroInteractionTime=Number(step.dataset.heroTime);heroInteractionPlayer.playing=false;clearHeroInteractionTimer();paintHeroInteraction();document.querySelector('[data-hero-scrub]')?.focus({preventScroll:true});}
  if(event.target.closest('[data-hero-play]')){heroInteractionPlayer.playing=!heroInteractionPlayer.playing;paintHeroInteraction();scheduleHeroInteraction();}
});
document.addEventListener('visibilitychange',scheduleHeroInteraction);
window.addEventListener('pagehide',clearHeroInteractionTimer);
