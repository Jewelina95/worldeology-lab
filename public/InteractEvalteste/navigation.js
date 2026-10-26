'use strict';

const navigationIcons={
  overview:'<path d="M4 17V9m8 8V4m8 13v-6M3 21h18"/>',
  capability:'<path d="m12 3 8 5v8l-8 5-8-5V8Z"/><path d="m4 8 8 5 8-5m-8 5v8"/>',
  scenario:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  behavior:'<path d="M4 7h10m-3-3 3 3-3 3M20 17H10m3-3-3 3 3 3M4 17h2M18 7h2"/>',
  outcome:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  duration:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  partner:'<circle cx="8" cy="8" r="3"/><path d="M2 20v-2a6 6 0 0 1 12 0v2m2-15a3 3 0 0 1 0 6m2 3a6 6 0 0 1 4 6"/>',
  repeat:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 12-2l2 3M4 16l2 3a7 7 0 0 0 12-2"/>',
  agent:'<rect x="5" y="7" width="14" height="14" rx="3"/><path d="M12 3v4M3 12h2m14 0h2M9 12h.01M15 12h.01M9 17h6"/>',
  media:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
  conversation:'<path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1 7-13h2a8 8 0 0 1 8 8Z"/><path d="M8 9h8M8 13h5"/>',
  theory:'<path d="M3 5c4-2 6-2 9 0 3-2 5-2 9 0v15c-4-2-6-2-9 0-3-2-5-2-9 0Z"/><path d="M12 5v15"/>',
  rubric:'<path d="M5 20h14M7 16h10M9 12h6M11 8h2M12 3v2"/>',
};
function navigationIcon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${navigationIcons[name]||navigationIcons.overview}</svg>`;}

function renderEditorialNavigation(){
  const base='./index.html#',groups={
    models:{label:'Models',title:'Understand the whole profile.',intro:'42 measures, with a guide to what each one tells you.',href:base+'models',items:[
      ['All evaluations','Every measure in one workspace.','models','overview'],
      ['Capabilities','Six levels, from goals to sustained initiative.','models?category=Capabilities','capability'],
      ['Scenario conditions','Purpose, information, and world setting.','models?category=Scenarios','scenario'],
      ['Behavior','How systems handle missing information.','models?category=Behavior','behavior'],
      ['Outcomes','Completion and interest exhaustion.','models?category=Outcomes','outcome'],
      ['Conversation length','Typical duration and longer runs.','models?category=Duration','duration'],
      ['Partners & roles','Pairings, self-play, and the user role.','models?category=Partners','partner'],
      ['Repeatability','Independent passes and judge changes.','models?category=Reliability','repeat']
    ]},
    agents:{label:'Agents',title:'A model, with a way to work.',intro:'Compare three architectures across the same ten base models.',href:base+'agents',items:[
      ['Compare architectures','Explore all configurations side by side.','agents','agent'],
      ...['MetaMind','Cognizer','Claude Code'].map(name=>[name,({MetaMind:'Explore MetaMind across ten base models.',Cognizer:'Explore Cognizer across ten base models.','Claude Code':'Explore Claude Code across ten base models.'})[name],'agents?architecture='+encodeURIComponent(name),name])
    ]},
    multimodal:{label:'Image, Speech, Video',title:'More ways to interact.',intro:'Multimodal evaluation is in preparation.',href:base+'multimodal',items:[['Multimodal evaluations','Image, speech, and video · Pending','multimodal','media']]},
    showcase:{label:'Showcase',title:'Follow an interaction.',intro:'Read the dialogue, then inspect the evidence at each turn.',href:'./showcase.html',items:[
      ['All conversations','Explore the complete example library.','./showcase.html','conversation'],
      ['Task-oriented','Follow a concrete objective to its ending.','./showcase.html#cases?purpose=functional','outcome'],
      ['Open-ended','See how a conversation sustains its value.','./showcase.html#cases?purpose=nonfunctional','partner']
    ]},
    leaderboards:{label:'Leaderboards',title:'Compare, then look closer.',intro:'Start with the ranking. Explore the capabilities behind it.',href:base+'leaderboards',items:[
      ['Overall ranking','Compare scores on the same scale.','leaderboards','overview'],
      ['Capability profiles','See where the differences emerge.','models?category=Capabilities','capability']
    ]},
    research:{label:'Research',title:'Inside the framework.',intro:'The ideas, components, and rules behind InteractEval.',href:'./research.html',items:[
      ['Three theoretical ideas','State, trajectory, and initiative.','./research.html#theory','theory'],
      ['Symbols and measurement','Observed world, evidence, reconstruction, and score.','./research.html#measurement-model','theory'],
      ['Instrument architecture','Four stages with distinct responsibilities.','./research.html#architecture','agent'],
      ['World components','Scene, latent state, and event chain.','./research.html#components','scenario'],
      ['Update and control','Subturn order, revision gates, and stopping.','./research.html#update-control','repeat'],
      ['Time-indexed records','Follow real states and paths across turns.','./research.html#temporal-records','duration'],
      ['Key findings','What the interaction record reveals.','./research.html#discoveries','overview'],
      ['Scenario design','Three questions define the situation.','./research.html#scenario-space','capability'],
      ['Capability rubric','Six levels and their dependency rules.','./research.html#rubric','rubric'],
      ['Evidence rules','Verified quotations and separated judgments.','./research.html#evidence','conversation']
    ]}
  };
  const item=(id,g)=>`<div class="restored-nav-item"><a href="${g.href}" ${route===id||(id==='showcase'&&route==='cases')?'aria-current="page"':''}>${g.label}</a><button data-nav-menu="${id}" aria-label="Open ${g.label} menu" aria-expanded="false" aria-controls="nav-${id}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></button><div class="restored-nav-menu" id="nav-${id}" hidden><header><span>EXPLORE ${g.label.toUpperCase()}</span><h2>${g.title}</h2><p>${g.intro}</p></header><div class="nav-card-grid">${g.items.map(([title,copy,url,icon])=>`<a class="nav-destination" href="${url.startsWith('./')?url:base+url}"><i>${agentIdentity[icon]?agentIcon(icon):navigationIcon(icon)}</i><span><strong>${title}</strong><small>${copy}</small></span><b aria-hidden="true">&#8599;</b></a>`).join('')}</div></div></div>`;
  $('.primary-nav').innerHTML=`<a class="results-nav-link" href="./index.html" ${route==='home'?'aria-current="page"':''}>Results</a>`+Object.entries(groups).map(([id,g])=>item(id,g)).join('');
  $('.wordmark').href='./index.html';
}

let headerHeroObserver;
function syncEditorialHeader(){
  if(headerHeroObserver)headerHeroObserver.disconnect();
  const hero=document.querySelector('.journal-hero'),header=document.querySelector('.masthead');
  if(!hero){document.body.classList.remove('nav-on-hero');return;}
  const height=header.offsetHeight;
  const update=()=>document.body.classList.toggle('nav-on-hero',hero.getBoundingClientRect().bottom>height);
  update();
  headerHeroObserver=new IntersectionObserver(update,{rootMargin:`-${height}px 0px 0px 0px`,threshold:0});
  headerHeroObserver.observe(hero);
}

document.addEventListener('keydown',event=>{
  const trigger=event.target.closest('[data-nav-menu]');
  if(trigger&&event.key==='ArrowDown'){
    event.preventDefault();
    if(trigger.getAttribute('aria-expanded')!=='true')trigger.click();
    document.getElementById(trigger.getAttribute('aria-controls'))?.querySelector('a')?.focus();
  }
  const panel=event.target.closest('.restored-nav-menu');
  if(!panel)return;
  if(event.key==='Escape')document.querySelector(`[aria-controls="${panel.id}"]`)?.focus();
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
    event.preventDefault();
    const links=[...panel.querySelectorAll('a')],index=links.indexOf(event.target.closest('a'));
    links[(index+(event.key==='ArrowDown'?1:-1)+links.length)%links.length]?.focus();
  }
});
document.addEventListener('focusin',event=>{
  if(event.target.closest('.restored-nav-item'))return;
  document.querySelectorAll('.restored-nav-menu').forEach(panel=>panel.hidden=true);
  document.querySelectorAll('[data-nav-menu]').forEach(button=>button.setAttribute('aria-expanded','false'));
});
