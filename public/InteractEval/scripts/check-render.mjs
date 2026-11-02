import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('results-explorer.js','utf8');
const start=source.indexOf('function resultsHomeV2()');
const end=source.indexOf('function comparisonDataTable(',start);
const makeContext=()=>{
 const c={location:{hash:''},selectedMainLevel:null,lastMainComparisonHash:'',mainComparisonGroups:[],mainComparisonGroup:'',console};
 for(const name of ['atlasHero','motivationFigure','mainRail','atlasKeyFindings','capabilityMatrix','mainBehaviorSection','mainComparisonPanel','proactivityOpening'])c[name]=()=>`<p>${name}</p>`;
 c.journalSection=(id,index,kicker,title,deck,body)=>`<section id="${id}"><h2>${title}</h2>${body}</section>`;
 c.navigationIcon=()=>'';return vm.createContext(c);
};
const c=makeContext();
const fallback=source.indexOf('function renderSystemOverview(');
if(fallback>=0)vm.runInContext(source.slice(fallback,source.indexOf('function resultsHomeV2()',fallback)),c);
vm.runInContext(source.slice(start,end),c);
const html=vm.runInContext('resultsHomeV2()',c);
assert.match(html,/atlasHero/);assert.match(html,/atlasKeyFindings/);assert.match(html,/theory-v5.png/);
c.systemFigure=()=>'<section>animated-system</section>';
assert.match(vm.runInContext('resultsHomeV2()',c),/animated-system/);
console.log('Main renders content and static Figure 5 without the animation module; animated version renders when available.');

const order=['atlasHero','mainRail','motivationFigure','theory-v5.png','atlasKeyFindings'];
for(let i=1;i<order.length;i++)assert.ok(html.indexOf(order[i-1])<html.indexOf(order[i]),`${order[i-1]} must precede ${order[i]}`);
assert.ok(!html.includes('data-main-panel'));
console.log('Original opening precedes the shared sidebar and continuous response, system, and findings content.');
