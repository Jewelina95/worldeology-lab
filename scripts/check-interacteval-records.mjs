import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root='public/InteractEvalteste/';
const read=f=>readFileSync(root+f,'utf8');
const data=JSON.parse(read('data/research-evidence.json'));
const context=vm.createContext({document:{addEventListener(){}},safe:s=>String(s),researchEvidence:data});
for(const file of ['research-upgrade.js','research-records.js','case-reader.js'])vm.runInContext(read(file),context);
const guide=context.frameRecordGuide();
assert.ok(guide.includes('W<sub>t</sub> = (S'));
assert.ok(guide.includes('R<sub>t</sub> = (Ψ'));
assert.ok(guide.includes('no capability grades'));
for(const view of ['latent','trajectories','vocabulary']){
 vm.runInContext(`researchRecordView='${view}'`,context);
 const html=context.researchRecordsPanel();
 assert.ok(!html.includes('undefined')&&!html.includes('NaN'));
 if(view!=='vocabulary')assert.ok(html.includes('record-live-chart'));
 for(let t=1;t<=(view==='latent'?10:6)&&view!=='vocabulary';t++){
  vm.runInContext(`researchRecordTurn=${t}`,context);
  const detail=context.recordTurnDetail();
  if(view==='latent')assert.ok(detail.includes(data.latent_episode.quotes[t-1]));
  if(view==='trajectories'&&t===6)assert.ok(detail.includes('No turn 6 was observed'));
 }
}
const record=JSON.parse(read('data/cases/case_001.json'));
vm.runInContext(`readerRecord=${JSON.stringify(record)};readerTurn=0;readerLevel='L1'`,context);
const quote={quote:'Original archived quotation',turn:1,verified:true};
assert.ok(context.readerEvidenceQuote(quote,0).includes('Utterance 1 · assistant'));
assert.ok(context.readerEvidenceQuote({...quote,turn:null,verified:false},1).includes('Unverified quotation'));
assert.ok(context.readerEvaluation().includes('case-evidence-quote'));
assert.ok(read('research-features.js').includes('./index.html#key-findings'));
for(const file of ['index.html','research.html','showcase.html'])assert.ok(read(file).includes('./research-upgrade.js'));
console.log('Records verified: manuscript equations, aligned evidence at every exchange, honest trajectory endpoints, source quotations, and Main results link.');
