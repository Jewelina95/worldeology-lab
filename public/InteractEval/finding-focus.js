'use strict';

// Emphasis stays on the existing table cells; no extra panels or controls.
window.InteractEvalFindingFocus=(()=>{
 let panel=null,observer=null;
 const mark=(selector,kind)=>panel.querySelectorAll(selector).forEach(node=>node.dataset.findingHighlight=kind);
 function clear(){
  observer?.disconnect();observer=null;
  if(!panel)return;
  panel.classList.remove('finding-focus','is-finding-playing');
  delete panel.dataset.findingFocus;
  panel.querySelectorAll('[data-finding-highlight]').forEach(node=>delete node.dataset.findingHighlight);
  panel.querySelectorAll('[data-finding-row]').forEach(node=>delete node.dataset.findingRow);
  panel=null;
 }
 function play(){
  const target=panel;if(!target)return;
  target.classList.remove('is-finding-playing');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  requestAnimationFrame(()=>{if(panel===target&&target.isConnected)target.classList.add('is-finding-playing');});
 }
 function partner(assistant){
  if(!panel||panel.dataset.findingFocus!=='pairings')return;
  const index=publication.models.findIndex(model=>model.name===assistant);if(index<0)return;
  const values=publication.interaction_matrix.map(row=>row.scores[index]);
  const lo=Math.min(...values),hi=Math.max(...values);
  panel.querySelectorAll('[data-finding-highlight]').forEach(node=>delete node.dataset.findingHighlight);
  panel.querySelectorAll('[data-pairing-assistant]').forEach(button=>{
   if(button.dataset.pairingAssistant!==assistant)return;
   const row=publication.interaction_matrix.find(row=>row.partner===button.dataset.pairingPartner);
   button.dataset.findingHighlight=row.scores[index]===lo?'partner-low':row.scores[index]===hi?'partner-high':'partner';
  });
  panel.querySelector(`.pairing-matrix thead th:nth-child(${index+2})`).dataset.findingHighlight='partner';
 }
 function show(measure){
  clear();
  const finding=atlasFindings.find(finding=>finding.measure===measure);
  const body=document.getElementById('main-comparison-body');
  if(!finding||!body||measure!==mainComparisonMeasure)return;
  if(measure==='information'&&mainInformationView!=='conditions')return;
  panel=body;panel.classList.add('finding-focus');panel.dataset.findingFocus=measure;
  if(measure==='stage-profile'){
   mark('[data-comparison-metric="stage0"]','passive');
   mark('[data-comparison-metric="stage2"]','proactive');
   for(const name of ['claude-opus-5.5','deepseek-v4-pro'])panel.querySelectorAll(`[data-comparison-model="${name}"]`).forEach(row=>row.dataset.findingRow='true');
   mark('.finding-stage-ranges>span:first-child','passive');
   mark('.finding-stage-ranges>span:last-child','proactive');
  }else if(measure==='information'){
   mark('[data-comparison-metric="partial"]','proactive');
   mark('[data-comparison-metric="insufficient"]','passive');
  }else partner(pairingSelection.assistant);
  const visibleTable=[...panel.querySelectorAll('.comparison-data-table,.pairing-matrix,.atlas-comparison-cards')].find(node=>node.getBoundingClientRect().height>0);
  const target=visibleTable?.querySelector('thead,article')||visibleTable;
  if(!target)return;
  observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){observer?.disconnect();observer=null;play();}
  },{threshold:.6,rootMargin:'-90px 0px 0px'});
  observer.observe(target);
 }
 document.addEventListener('click',event=>{
  const cell=event.target.closest('[data-pairing-assistant]');
  if(cell)partner(cell.dataset.pairingAssistant);
 });
 return {show,clear,fromLocation(){show(new URLSearchParams(location.hash.split('?')[1]||'').get('measure'));}};
})();
