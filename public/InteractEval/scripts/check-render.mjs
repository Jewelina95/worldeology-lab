import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('results-explorer.js','utf8');
const start=source.indexOf('function resultsHomeV2()');
const end=source.indexOf('function comparisonDataTable(',start);
const makeContext=()=>{
 const c={location:{hash:''},selectedMainLevel:null,lastMainComparisonHash:'',mainComparisonGroups:[],mainComparisonGroup:'',URLSearchParams,console};
 for(const name of ['atlasHero','motivationFigure','mainRail','atlasKeyFindings','capabilityMatrix','mainBehaviorSection','mainComparisonPanel','proactivityOpening'])c[name]=()=>`<p>${name}</p>`;
 c.interactionFigure=kind=>kind==='motivation'?'<p>motivationFigure</p>':'<p>theory-v5.png</p>';
 c.journalSection=(id,index,kicker,title,deck,body)=>`<section id="${id}"><h2>${title}</h2>${body}</section>`;
 c.navigationIcon=()=>'';return vm.createContext(c);
};
const c=makeContext();
const fallback=source.indexOf('function renderSystemOverview(');
if(fallback>=0)vm.runInContext(source.slice(fallback,source.indexOf('function resultsHomeV2()',fallback)),c);
vm.runInContext(source.slice(start,end),c);
const html=vm.runInContext('resultsHomeV2()',c);
assert.match(html,/atlasHero/);assert.match(html,/atlasKeyFindings/);assert.ok(!html.includes('theory-v5.png'), 'Removed theory illustration must stay absent');
c.systemFigure=()=>'<section>animated-system</section>';
if(!source.includes("${interactionFigure("))assert.ok(!vm.runInContext('resultsHomeV2()',c).includes('animated-system'));
console.log('Main orchestration renders the figures and core content with the current figure renderer.');

const order=['atlasHero','mainRail','motivationFigure','atlasKeyFindings'];
for(let i=1;i<order.length;i++)assert.ok(html.indexOf(order[i-1])<html.indexOf(order[i]),`${order[i-1]} must precede ${order[i]}`);
assert.ok(!html.includes('data-main-panel'));
console.log('Original opening precedes the shared sidebar, response figure, and findings.');

// Finding links must select their evidence on reload as well as on click.
c.mainComparisonGroups=[
 {id:'stages',items:[['stage-profile','All three stages']]},
 {id:'scenarios',items:[['information','Information gaps']]},
 {id:'partners',items:[['pairings','All 100 pairings']]}
];
for(const [measure,group] of [['stage-profile','stages'],['information','scenarios'],['pairings','partners']]){
 c.location.hash='#comparisons?measure='+measure;
 vm.runInContext('resultsHomeV2()',c);
 assert.equal(c.mainComparisonGroup,group);
 assert.equal(c.mainComparisonMeasure,measure);
}
console.log('All three finding deep links select the corresponding evidence.');
