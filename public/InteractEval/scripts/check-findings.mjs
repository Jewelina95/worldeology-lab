import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const data=JSON.parse(fs.readFileSync('data/findings-v5.json','utf8'));
assert.equal(data.findings.length,40);
assert.equal(data.categories.length,7);
assert.equal(data.homepage_ids.length,8);
const ids=new Set(data.findings.map(f=>f.id));
assert.equal(ids.size,40);
const categorized=data.categories.flatMap(c=>c.finding_ids);
assert.equal(categorized.length,40);
assert.equal(new Set(categorized).size,40);
for(const f of data.findings){
 assert.ok(data.categories.find(c=>c.slug===f.category_slug)?.finding_ids.includes(f.id));
 assert.ok(f.summary_en&&f.limitation_en);
 for(const id of [...f.related_ids,f.next_finding].filter(Boolean))assert.ok(ids.has(id),`${f.id}: unknown related finding ${id}`);
 for(const page of f.verified_pages)assert.ok(page>=1&&page<=data.paper.pages);
}
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(data.paper.path.replace('./',''))).digest('hex'),data.paper.sha256);
const noop=()=>{};
const c=vm.createContext({console,URLSearchParams,URL,location:{hash:'',pathname:'/index.html'},CSS:{supports:()=>false},document:{addEventListener:noop,querySelector:()=>null},window:{addEventListener:noop},IntersectionObserver:class{observe(){}disconnect(){}},history:{},matchMedia:()=>({matches:true}),setTimeout:noop});
for(const file of ['explorer.js','navigation.js','metric-guide.js','results-explorer.js','findings.js','paper-site.js']){
 let source=fs.readFileSync(file,'utf8');
 if(file==='paper-site.js')source=source.slice(0,source.indexOf("Promise.all(['paper-results.json'"));
 vm.runInContext(source,c,{filename:file});
}
c.catalog=data;c.extra=JSON.parse(fs.readFileSync('data/findings-evidence.json','utf8'));c.published=JSON.parse(fs.readFileSync('data/paper-results.json','utf8'));c.research=JSON.parse(fs.readFileSync('data/research-evidence.json','utf8'));
vm.runInContext('findingsResearch=catalog;findingsEvidence=extra;publication=published;researchEvidence=research;configureFindingMeasures();',c);
for(const f of data.findings){
 c.location.hash=`#comparisons?measure=${f.measure}&finding=${f.id}`;
 c.selected=f;
 vm.runInContext('mainComparisonMeasure=selected.measure;mainComparisonGroup=mainComparisonGroups.find(g=>g.items.some(i=>i[0]===selected.measure)).id;',c);
 const html=vm.runInContext('findingEvidenceIntro()+mainComparisonContent()+findingEvidenceFooter()',c);
 assert.ok(html.includes('finding-key-metrics'),f.id+' missing key metrics');
 assert.ok(html.includes('finding-data-explanation'),f.id+' missing below-data explanation');
 assert.ok(html.includes(`data-research-finding="${f.id}"`),f.id+' missing context');
 assert.ok(!html.includes('finding-source-links'),f.id+' source chips remain');
 assert.ok(!html.includes('How to read'),f.id+' tutorial heading remains');
 assert.ok(html.includes(f.limitation_en),f.id+' missing limitation');
 assert.ok(html.indexOf('finding-key-metrics')>html.indexOf('</header>'),f.id+' metrics must follow the evidence');
 if(f.id==='F11')assert.ok(html.includes('8.5 percentage points'));
 assert.ok(!/\bNaN\b|undefined|Infinity/.test(html),f.id+' invalid rendered value');
 assert.ok(/<table|evidence-bars|comparison-bars|architecture-comparison-grid/.test(html),f.id+' missing evidence');
}
c.location.hash='#key-findings';
const homepage=vm.runInContext('coreFindings()',c);
assert.equal((homepage.match(/class="finding-row-link/g)||[]).length,8);
assert.equal((homepage.match(/class="finding-row"/g)||[]).length,5);
assert.ok(homepage.includes('finding-row-tag'),'rows must carry a category tag');
for(const tag of ['Capability','Context','Trajectory','Partners','Architecture'])assert.ok(homepage.includes('>'+tag+'<'),'missing row tag '+tag);
for(const tag of ['Representation','Measurement'])assert.ok(!homepage.includes('>'+tag+'<'),'a category with no published finding must not render a row');
assert.ok(!homepage.includes('All findings'));
assert.ok(!homepage.includes('home-finding-search'));
for(const id of data.homepage_ids)assert.ok(homepage.includes('finding='+id));
assert.ok(homepage.includes('data-finding-measure="stage-profile"'));
assert.ok(!homepage.includes('class="finding-category-tag"'));
assert.ok(!homepage.includes('finding-category-nav'));
assert.ok(!homepage.includes('finding-data-explanation'));
assert.ok(!homepage.includes('finding-information-definitions'));
assert.ok(!fs.existsSync('key-findings-zh.html'),'the Chinese companion page must stay removed');
assert.match(homepage,/measure=stage-profile&finding=F01/);
assert.match(homepage,/measure=information&finding=F07/);
assert.ok(homepage.indexOf('finding=F01')<homepage.indexOf('finding=F07'));
const approved=['F01','F07','F09','F14','F19','F28','F26','F30'];
assert.deepEqual(data.published_ids,approved);
assert.deepEqual(data.homepage_ids,approved);
for(const id of ['F03','F05','F24','F25','F33','F36','F43','F13','F22','F35','F16','F17','F32'])assert.ok(!homepage.includes('finding='+id));
assert.ok(!homepage.includes('Judging six capabilities'),'F44 must stay unpublished');
assert.ok(homepage.includes('widen as the interaction continues'),'F14 must render');
assert.equal(vm.runInContext('findingsIndex()',c),homepage);
assert.match(vm.runInContext("findingsCards('', 'F19')",c),/interaction partner/);
assert.match(vm.runInContext("findingsCards('', 'no matching phrase xyz')",c),/No findings match/);
for(const id of ['F43','F44','F45','F46','F47','F48'])assert.ok(ids.has(id));
assert.equal(c.extra.simulated_users.length,11);
assert.equal(c.extra.prose_scores.length,10);

const deltas=c.extra.prose_scores.map((v,i)=>v-c.published.models[i].composite);
assert.equal(deltas.filter(v=>v<0).length,9);
assert.ok(Math.abs(deltas.reduce((sum,v)=>sum+Math.abs(v),0)/10-0.0124)<1e-10);
const span=values=>Math.max(...values)-Math.min(...values);
assert.ok(Math.abs(span(c.published.models.map(m=>m.duration.adaptive))-0.223)<1e-10);
assert.ok(Math.abs(span(c.published.models.map(m=>m.duration.fixed[2]))-0.267)<1e-10);

assert.ok(data.homepage_ids.indexOf('F28')<data.homepage_ids.indexOf('F26'));
console.log('8 latest reviewed findings render without categories; 40 archived evidence routes remain valid; list order, review states, key metrics and original destinations verified.');

c.location.hash='#comparisons?measure=pairings&finding=F19';
vm.runInContext("mainComparisonMeasure='pairings'",c);
const reversal=vm.runInContext('findingsMeasureContent(mainComparisonMeasure)',c);
assert.ok(reversal.includes('0.394')&&reversal.includes('0.510'));
assert.ok(!reversal.includes('39.4%')&&!reversal.includes('51.0%'));

// Every evidence panel has one manuscript destination, including archived links.
const groups=vm.runInContext('mainComparisonGroups',c);
assert.deepEqual(Array.from(groups,g=>g.number),['4.2','4.3','4.4','4.5','4.5.1','4.5.2','5.1','5.2','5.3','5.4','5.5','5.6']);
const measures=Array.from(groups,g=>Array.from(g.items,i=>i[0])).flat();
assert.equal(new Set(measures).size,measures.length,'Each measure belongs to exactly one section');
const destination=id=>groups.find(g=>g.items.some(i=>i[0]===id));
for(const id of ['weighting-sensitivity','adaptive-prefix','fixed8','fixed16','fixed32'])assert.equal(destination(id).number,'4.2');
assert.equal(destination('group-size').number,'4.4');
assert.equal(destination('human-audit').number,'4.5.2');
assert.equal(destination('evaluation-cost').number,'5.6');
assert.equal(destination('reconstruction-ablation').parent,'reliability');
assert.equal(destination('human-audit').parent,'reliability');
c.atlasMobileScores=()=>'';
for(const group of groups){
 for(const [id] of group.items){
  c.location.hash='#comparisons?measure='+id;
  c.measureToTest=id;
  vm.runInContext('mainComparisonMeasure=measureToTest',c);
  const panel=vm.runInContext('mainComparisonContent()',c);
  assert.ok(panel.length>0,id+' empty panel');
  assert.ok(!/\bNaN\b|undefined|Infinity/.test(panel),id+' invalid panel');
 }
}
console.log(`${measures.length} measures render in the requested paper hierarchy; main-result sensitivity and nested robustness destinations verified.`);
