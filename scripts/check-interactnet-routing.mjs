import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve('dist');
const pages=['index.html','research.html','showcase.html','response-interaction.html','assets/research/findings-bilingual.html'];
for(const page of pages){
 const current=readFileSync(resolve(root,'InteractNet',page),'utf8');
 assert.ok(current.includes('InteractNet'),page+' is missing the new brand');
 assert.ok(!current.includes('https://worldeology.com/InteractEval/'),page+' retains an old canonical link');
 assert.ok(!current.includes('https://worldeology.com/InteractionNet/'),page+' retains the superseded canonical link');
 for(const legacyRoot of ['InteractEval','InteractionNet']){
  const legacy=readFileSync(resolve(root,legacyRoot,page),'utf8');
  assert.ok(legacy.includes('noindex,follow'),`${legacyRoot}/${page} legacy route must not compete in search`);
  const script=legacy.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script,`${legacyRoot}/${page} legacy redirect is missing`);
  let redirected;
  const from='https://worldeology.com/'+legacyRoot+'/'+page+'?measure=stage-profile#response-interaction';
  const location={href:from,search:'?measure=stage-profile',hash:'#response-interaction',replace(value){redirected=value;}};
  vm.runInNewContext(script,{URL,location});
  assert.equal(redirected,'https://worldeology.com/InteractNet/'+(page==='index.html'?'':page)+'?measure=stage-profile#response-interaction',`${legacyRoot}/${page} must preserve the page, query and fragment`);
 }
}
for(const prefix of ['InteractNet','InteractEval']){
 for(const file of ['assets/research/figure1/figure1.png','data/cases.json','assets/Qwen_InteractNet.pdf']){
  assert.ok(existsSync(resolve(root,prefix,file)),prefix+'/'+file+' is missing');
 }
}
const home=readFileSync(resolve(root,'index.html'),'utf8');
assert.ok(home.includes('/InteractNet/'),'Lab home must point to the new URL');
const sitemap=readFileSync(resolve(root,'sitemap.xml'),'utf8');
assert.ok(sitemap.includes('/InteractNet/'));
assert.ok(!sitemap.includes('/InteractEval/'));
assert.ok(!sitemap.includes('/InteractionNet/'));
assert.equal(readFileSync(resolve(root,'InteractNet/deployment.json'),'utf8'),readFileSync(resolve(root,'InteractEval/deployment.json'),'utf8'));
console.log('InteractNet routes verified: legacy InteractEval and InteractionNet page redirects preserve queries/fragments; assets remain available; Lab link, sitemap and revision metadata agree.');
