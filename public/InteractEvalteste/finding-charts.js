'use strict';

function findingBars(rows,max,unit,format){
  return `<div class="finding-mini-bars" role="img" aria-label="${safe(unit+': '+rows.map(r=>r[0]+' '+format(r[1])).join('; '))}"><div class="finding-unit">${unit}</div>${rows.map(([label,value,highlight])=>`<div class="finding-mini-row"><span>${label}</span><div class="finding-mini-track"><i class="${highlight?'is-emphasis':''}" style="width:${value/max*100}%"></i></div><b>${format(value)}</b></div>`).join('')}<div class="finding-mini-axis"><span>0</span><span>${format(max)}</span></div></div>`;
}
function findingTrajectory(){
  const episodes=researchEvidence.trajectories.episodes;
  const path=e=>e.interest.map((v,i)=>`${i?'L':'M'}${12+i/5*296} ${10+(1-v)*160}`).join(' ');
  const description=episodes.map(e=>e.model+': '+e.interest.join(', ')).join('; ');
  return `<div class="finding-unit">User interest · 0–1</div><div class="finding-line-plot"><div class="finding-y-axis"><span>1</span><span>0.5</span><span>0</span></div><svg viewBox="0 0 320 180" preserveAspectRatio="none" role="img" aria-label="${safe(description)}"><path class="finding-grid" d="M12 10H308M12 90H308M12 170H308"/>${episodes.map((e,j)=>`<path class="finding-series series-${j}" d="${path(e)}"/>${e.interest.map((v,i)=>`<circle class="series-point series-${j}" cx="${12+i/5*296}" cy="${10+(1-v)*160}" r="3.5"><title>${safe(e.model)} · t${i+1}: ${v.toFixed(2)}</title></circle>`).join('')}`).join('')}</svg></div><div class="finding-x-axis"><span>t1</span><span>Exchange</span><span>t6</span></div><div class="finding-chart-legend">${episodes.map((e,j)=>`<div><i class="series-key series-${j}"></i><span>${safe(e.model)}</span><b>${e.interest.at(-1).toFixed(2)}</b></div>`).join('')}</div><p class="finding-one-line">Same six-level grades at t1–t2; different later courses.</p>`;
}
function findingPairing(){
  const models=['gpt-6-astra','claude-opus-5.5'].map(name=>publication.models.find(m=>m.name===name));
  const y=v=>10+(.70-v)/.20*160;
  return `<div class="finding-unit">Composite score · 0.50–0.70</div><div class="finding-line-plot finding-slope"><div class="finding-y-axis"><span>0.70</span><span>0.60</span><span>0.50</span></div><svg viewBox="0 0 320 180" preserveAspectRatio="none" role="img" aria-label="${safe(models.map(m=>m.name+': standard user '+m.composite+', self-play '+m.self_play.score).join('; '))}"><path class="finding-grid" d="M12 10H308M12 90H308M12 170H308"/>${models.map((m,j)=>`<path class="finding-series series-${j}" d="M16 ${y(m.composite)}L304 ${y(m.self_play.score)}"/><circle class="series-point series-${j}" cx="16" cy="${y(m.composite)}" r="4"/><circle class="series-point series-${j}" cx="304" cy="${y(m.self_play.score)}" r="4"/>`).join('')}</svg></div><div class="finding-x-axis"><span>Standard user</span><span>Self-play</span></div><div class="finding-chart-legend">${models.map((m,j)=>`<div><i class="series-key series-${j}"></i><span>${safe(m.name)}</span><b>${m.composite.toFixed(3)} → ${m.self_play.score.toFixed(3)}</b></div>`).join('')}</div>`;
}
function findingArchitecture(){
  const labels=['Passive','Responsive','Active'];
  return `<div class="finding-unit">Mean stage gain · score points</div><div class="finding-stage-legend">${labels.map((label,i)=>`<span><i class="stage-${i}"></i>${label}</span>`).join('')}</div><div class="finding-architecture-groups">${publication.architecture_gains.map(a=>`<div class="finding-architecture-group"><strong>${safe(a.architecture)}</strong>${a.stages.map((v,i)=>`<div class="finding-gain-row"><div><i class="stage-${i}" style="width:${v/.08*100}%"></i></div><b>+${v.toFixed(3)}</b><span class="finding-sr">${labels[i]}</span></div>`).join('')}</div>`).join('')}</div><div class="finding-gain-axis"><span>0</span><span>+0.080</span></div>`;
}
function homeFindingCards(){
  const ranges=[0,1,2].map(i=>{const v=publication.models.map(m=>m.stages[i]);return Math.max(...v)-Math.min(...v);});
  const opus=publication.models.find(m=>m.name==='claude-opus-5.5');
  const cards=[
    ['Active adaptation separates models',()=>findingBars([['Passive',ranges[0]],['Responsive',ranges[1]],['Active',ranges[2],true]],.4,'Across-model score range',v=>v.toFixed(3)),4,'Ten base models','#capability'],
    ['Similar starts, different trajectories',findingTrajectory,36,'Two episodes · not a causal pair','./research.html#temporal-records'],
    // Exact transcription of the information-facet rows in manuscript Table 8.
    ['Partial briefs elicit more fabrication',()=>findingBars([['Sufficient',.051],['Partial',.164,true],['Insufficient',.103]],.20,'Fabrication rate',v=>(v*100).toFixed(1)+'%')+'<p class="finding-one-line">Partial includes omissions and misleading premises.</p>',8,'Information conditions','./assets/Qwen_InteractEval.pdf#page=22'],
    ['Closure depends on the purpose',()=>findingBars([['Task-oriented',opus.functional_closure,true],['Open-ended',opus.nonfunctional_closure]],.25,'Successful closure rate',v=>(v*100).toFixed(1)+'%')+'<p class="finding-one-line">claude-opus-5.5 · completion is purpose-relative.</p>',9,'One model, two purposes','#process'],
    ['The partner can reverse the ranking',findingPairing,13,'Two assistants, two partner conditions','#partners'],
    ['Architecture gains favor active adaptation',findingArchitecture,17,'Mean over ten base models','#architectures']
  ];
  return `<div class="home-findings-grid">${cards.map(([title,chart,table,scope,url],i)=>`<article class="home-finding home-finding-visual"><span class="home-finding-number">0${i+1}</span><h3>${title}</h3><div class="home-finding-chart">${chart()}</div><footer><span>Table ${table} · ${scope}</span><a href="${url}" ${url.startsWith('#')?`data-research-section="${url.slice(1)}"`:''}>${i===1?'Open records':i===2?'Source table':'View results'} ↗</a></footer></article>`).join('')}</div>`;
}
