import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('public/InteractEvalteste/results-explorer.js','utf8');
const start=source.indexOf('function resultsHomeV2()');
const end=source.indexOf('function comparisonDataTable(',start);
const makeContext=()=>{
 const c={location:{hash:''},selectedMainLevel:null,lastMainComparisonHash:'',mainComparisonGroups:[],mainComparisonGroup:'',mainCurrentPanel:'response-interaction',document:{addEventListener(){}},window:{addEventListener(){}},console};
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

for (const selected of ['response-interaction','system-overview','key-findings','model-readout','process','comparisons','illustrations']){
 c.location.hash='#'+selected;
 const output=vm.runInContext('resultsHomeV2()',c);
 const panels=[...output.matchAll(/data-main-panel="([^"]+)" ([^>]*)>/g)];
 assert.equal(panels.length,7);
 assert.deepEqual(panels.filter(p=>!p[2].includes('hidden')).map(p=>p[1]),[selected]);
}
console.log('Each Main section selects exactly one right-hand panel; the shared sidebar stays outside every panel.');
