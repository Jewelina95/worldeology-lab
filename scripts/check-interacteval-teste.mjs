import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';
const root=resolve('public/InteractEvalteste');
const read=f=>readFileSync(resolve(root,f),'utf8');
const context=vm.createContext({document:{addEventListener(){}},safe:s=>String(s),navigationIcon:()=>'<svg></svg>',levelNames:['L1','L2','L3','L4','L5','L6'],measureGuide:id=>({title:id,meaning:'Criterion',reading:'Reading'}),researchRecordsPanel:()=>'<div>Recorded evidence</div>',journalSection:(id,n,k,title,deck,body)=>`<section id="${id}">${body}</section>`});
for(const f of ['site-pages.js','research-details.js','research-features.js'])vm.runInContext(read(f),context);
for(const id of ['iceberg','movie','agency']){
 vm.runInContext(`theoryPrinciple='${id}'`,context);
 const html=context.researchTheoryPanel();
 assert.ok(html.includes('<img')&&html.includes('<details'));
 assert.ok(html.includes('research-rule-formula')&&html.includes('<dd>'));
 assert.ok(!/<details[^>]*\bopen\b/.test(html));
 const visible=html.replace(/<details[\s\S]*?<\/details>/g,'').replace(/<[^>]+>/g,' ');
 assert.ok(visible.split(/\s+/).length<220,'Default theory view must remain concise');
}
assert.ok(context.theoryRule('agency').includes('do not identify downstream causal benefit'));
assert.ok(context.theoryRule('movie').includes('not necessarily beneficial'));
for(let i=0;i<4;i++){vm.runInContext(`instrumentStage=${i}`,context);assert.ok(context.researchInstrumentPanel().includes('<details'));}
vm.runInContext("worldComponent='scene'",context);
assert.equal((context.researchComponentPanel().match(/<dt>/g)||[]).length,6);
assert.ok(context.componentRule('scene').includes('Verified source spans'));
assert.ok(context.componentRule('latent').includes('at most one degree'));
assert.ok(context.rubricRule().includes('eₜ ≤ 0.20'));
assert.ok(context.rubricRule().includes('does not directly end'));
const markup=context.researchFeaturePage();
for(const id of ['theory','architecture','components','temporal-records','scenario-space','rubric','evidence'])assert.ok(markup.includes('id="'+id+'"'),id);
assert.ok(markup.includes('Three principles'));
assert.ok(!markup.includes('researchReferenceMarkup'));
vm.runInContext('cascadeValues=[1,1,0,1,1,1]',context);
assert.equal((context.cascadeDemo().match(/class="capped"/g)||[]).length,3);
for(const f of ['index.html','research.html','showcase.html']){
 const html=read(f);
 assert.ok(html.includes('https://worldeology.com/InteractEvalteste/'));
 assert.ok(html.includes('./fonts.css')&&html.includes('./readability.css'));
 assert.ok(html.indexOf('./research-details.js')<html.indexOf('./paper-site.js'));
 assert.ok(!html.includes('./research-methods')&&!html.includes('./research-showcase'));
 for(const [,asset]of html.matchAll(/(?:src|href)="\.\/([^"?#]+)(?:[^" ]*)?"/g))assert.ok(existsSync(resolve(root,asset)),`${f}: ${asset}`);
}
assert.equal(JSON.parse(read('data/cases.json')).length,100);
assert.equal(readdirSync(resolve(root,'data/cases')).filter(f=>f.endsWith('.json')).length,100);
if(process.argv[2]){
 assert.deepEqual(JSON.parse(read('data/paper-results.json')),JSON.parse(readFileSync(resolve(process.argv[2],'data/paper-results.json'),'utf8')));
 for(const f of ['data/cases.json','data/research-evidence.json'])assert.equal(read(f),readFileSync(resolve(process.argv[2],f),'utf8'));
}
console.log('Verified: compact reference layout, principle tabs, collapsed algorithm details, layer interfaces, scoring controls, assets and 100 cases.');
