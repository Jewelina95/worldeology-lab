import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';
const root=resolve('public/InteractEvalteste');
const read=f=>readFileSync(resolve(root,f),'utf8');
const context=vm.createContext({document:{addEventListener(){}}});
vm.runInContext(read('research-showcase.js'),context);
const scores=raw=>JSON.parse(JSON.stringify(context.researchCascadeScores(raw)));
assert.deepEqual(scores([1,1,0,1,1,1]).map(d=>d.s),[1,1,0,0,0,0]);
assert.deepEqual(scores([1,.6,.4,1,1,1]).map(d=>d.s),[1,.6,.4,.4,.4,.4]);
assert.deepEqual(scores([1,.6,1,1,1,1]).map(d=>d.s),[1,.6,1,1,1,1]);
const markup=vm.runInContext('researchReferenceMarkup',context);
for(const id of ['theory','iceberg','movie','agency','framework','layer-data','layer-interaction','layer-mechanism','layer-normative','cube','rubRows'])assert.ok(markup.includes('id="'+id+'"'),id);
for(const text of ['routine clarification can remain responsive','does not assess its downstream effect','Conceptual illustration, not measured scores','Symbols in the interaction model'])assert.ok(markup.includes(text),text);
assert.ok(!markup.includes('id="L1"'));
assert.ok(read('research-features.js').includes('return researchShowcasePage()'));
for(const f of ['index.html','research.html','showcase.html']){
 const html=read(f);
 assert.ok(html.includes('https://worldeology.com/InteractEvalteste/'));
 assert.ok(html.includes('./fonts.css')&&html.includes('./readability.css'));
 assert.ok(html.indexOf('./research-showcase.js')<html.indexOf('./paper-site.js'));
 assert.ok(!html.includes('./research-methods'));
 for(const [,asset]of html.matchAll(/(?:src|href)="\.\/([^"?#]+)(?:[^" ]*)?"/g))assert.ok(existsSync(resolve(root,asset)),`${f}: ${asset}`);
}
assert.equal(JSON.parse(read('data/cases.json')).length,100);
assert.equal(readdirSync(resolve(root,'data/cases')).filter(f=>f.endsWith('.json')).length,100);
if(process.argv[2]){
 assert.deepEqual(JSON.parse(read('data/paper-results.json')),JSON.parse(readFileSync(resolve(process.argv[2],'data/paper-results.json'),'utf8')));
 for(const f of ['data/cases.json','data/research-evidence.json'])assert.equal(read(f),readFileSync(resolve(process.argv[2],f),'utf8'));
}
console.log('Verified: upstream layout assets, research diagrams, cascade rules, symbol explanations, architecture IDs, data and 100 cases.');
