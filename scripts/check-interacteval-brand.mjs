import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='public/InteractEvalteste/';
for(const name of ['index.html','research.html','showcase.html']){
 const html=readFileSync(root+name,'utf8');
 const favicon=html.match(/rel="icon"[^>]+href="([^"]+)"/)[1];
 const wordmark=html.match(/class="wordmark"[^>]*><img src="([^"]+)"/)[1];
 assert.equal(wordmark,favicon,'Header and favicon must use the same SVG and revision');
 assert.ok(html.includes('./brand.css?v=brand-loop-20261030i'));
 assert.ok(html.includes('apple-touch-icon'));
}
const ico=readFileSync(root+'assets/brand/interacteval.ico');
assert.equal(ico.readUInt16LE(2),1);
assert.equal(ico.readUInt16LE(4),4);
for(const [i,size]of [16,32,48,64].entries()){
 const at=6+16*i;
 assert.equal(ico[at],size);
 const offset=ico.readUInt32LE(at+12),length=ico.readUInt32LE(at+8);
 assert.ok(offset+length<=ico.length);
 assert.equal(ico.subarray(offset+1,offset+4).toString(),'PNG');
}
console.log('Brand verified: one shared SVG on all three pages; valid 16/32/48/64px ICO and mobile icon wiring.');
