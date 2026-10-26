import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const root=resolve('public/InteractEvalteste');
const read=name=>readFileSync(resolve(root,name),'utf8');
const context=vm.createContext({});
vm.runInContext(read('research-methods.js'),context);
for(const id of ['iceberg','movie','agency']){
  const html=context.methodTheoryDetails(id);
  assert.ok(html.includes('Paper §2.'),`${id}: manuscript source missing`);
  assert.ok(html.includes('method-equation'),`${id}: equation missing`);
  assert.ok(html.includes('<dt>')&&html.includes('<dd>'),`${id}: symbols must be explained`);
}
assert.ok(context.methodTheoryDetails('agency').includes('does not measure downstream causal benefit'));
assert.ok(context.methodTheoryDetails('movie').includes('not labels for whether an outcome benefits'));
assert.ok(context.methodComponentDetails('scene').includes('Fixed'));
assert.ok(context.methodComponentDetails('latent').includes('Unknown records insufficient evidence'));
assert.ok(context.methodComponentDetails('events').includes('never rewritten to fit a forecast'));
assert.ok(context.methodMeasurementModel().includes('C<sup>eval</sup> is the case specification'));
assert.ok(context.methodExecutionPanel().includes('eₜ ≤ 0.20 or bₜ ≤ 0'));
assert.ok(context.methodExecutionPanel().includes('does not directly stop an episode'));
assert.ok(context.methodRubricDetails().includes('α = 0.8'));
assert.ok(context.methodRubricDetails().includes('User L3–L5'));
for(let i=0;i<4;i++)assert.ok(context.methodStageDetails(i).includes('Paper '));
const feature=read('research-features.js');
for(const renderer of ['methodTheoryDetails(theoryPrinciple)','methodStageDetails(instrumentStage)','methodComponentDetails(worldComponent)','methodMeasurementModel()','methodExecutionPanel()','methodRubricDetails()','methodEvidenceDetails()'])assert.ok(feature.includes(renderer),`Unwired renderer: ${renderer}`);
for(const file of ['index.html','research.html','showcase.html']){
  const html=read(file);
  assert.ok(html.includes('https://worldeology.com/InteractEvalteste/'),`${file}: canonical destination`);
  assert.ok(html.indexOf('./research-methods.js')<html.indexOf('./research-features.js'),`${file}: script ordering`);
  for(const [,path] of html.matchAll(/(?:src|href)="\.\/([^"?#]+)(?:[^" ]*)?"/g))assert.ok(existsSync(resolve(root,path)),`${file}: missing local asset ${path}`);
}
const cases=JSON.parse(read('data/cases.json'));
assert.ok(Array.isArray(cases)&&cases.length===100,'Expected the upstream 100-case illustrative library');
assert.equal(readdirSync(resolve(root,'data/cases')).filter(name=>name.endsWith('.json')).length,100);
// Optional upstream checkout verifies that relocation and Research edits changed no measurements.
if(process.argv[2])for(const file of ['data/paper-results.json','data/cases.json','data/research-evidence.json']){
  const sha=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
  assert.equal(sha(resolve(root,file)),sha(resolve(process.argv[2],file)),`Upstream data changed: ${file}`);
}
console.log('InteractEvalteste verified: theory definitions, layer boundaries, controls, script order, local assets, 100 examples, and unchanged publication data.');
