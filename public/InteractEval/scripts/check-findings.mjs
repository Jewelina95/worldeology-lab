import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const data=JSON.parse(fs.readFileSync('data/findings-v5.json','utf8'));
assert.equal(data.findings.length,34);
assert.equal(data.categories.length,7);
assert.equal(data.homepage_ids.length,12);
const ids=new Set(data.findings.map(f=>f.id));
assert.equal(ids.size,34);
const categorized=data.categories.flatMap(c=>c.finding_ids);
assert.equal(categorized.length,34);
assert.equal(new Set(categorized).size,34);
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
 assert.ok(html.includes(`data-research-finding="${f.id}"`),f.id+' missing context');
 assert.ok(html.includes('Scope of the evidence'),f.id+' missing limitation');
 assert.ok(html.includes('InteractEval_research_v5.pdf#page='),f.id+' missing paper');
 assert.ok(!/\bNaN\b|undefined|Infinity/.test(html),f.id+' invalid rendered value');
 assert.ok(/<table|evidence-bars|comparison-bars|architecture-comparison-grid/.test(html),f.id+' missing evidence');
}
const homepage=vm.runInContext('coreFindings()',c);
assert.equal((homepage.match(/data-finding-measure=/g)||[]).length,12);
assert.match(homepage,/measure=stage-profile&finding=F01/);
assert.match(homepage,/measure=information&finding=F07/);
assert.ok(homepage.indexOf('finding=F01')<homepage.indexOf('finding=F07'));
for(const category of data.categories){
 c.location.hash='#findings?category='+category.slug;
 const html=vm.runInContext('findingsIndex()',c);
 assert.equal((html.match(/class="finding-catalog-card/g)||[]).length,category.finding_ids.length);
}
assert.match(vm.runInContext("findingsCards('', 'F42')",c),/1 finding/);
assert.match(vm.runInContext("findingsCards('', 'no matching phrase xyz')",c),/No findings match/);
console.log('34 evidence views render with source links, caveats and valid values; 7 exclusive categories, 12 homepage claims, search and original finding routes verified.');
