import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const read=f=>readFileSync('public/InteractEvalteste/'+f,'utf8');
const context=vm.createContext({document:{addEventListener(){}},window:{addEventListener(){}}});
vm.runInContext(read('hero-interaction.js'),context);
for(let t=0;t<4;t++){
 const svg=context.heroInteractionDrawing(t);
 assert.ok(svg.includes('Response')&&svg.includes('Interaction'));
 assert.ok(svg.includes('Schematic, not measured data'));
 assert.equal((svg.match(/data-hero-time=/g)||[]).length,4);
 assert.equal((svg.match(/aria-current="step"/g)||[]).length,1);
 assert.ok(svg.includes('class="hi-futures"'));
 assert.ok(!svg.includes('NaN')&&!svg.includes('undefined'));
}
const figure=context.heroInteractionFigure();
assert.ok(figure.includes('type="range"'));
assert.ok(figure.includes('data-hero-play'));
assert.ok(!figure.includes('<p>')&&!figure.includes('score'));
const source=read('hero-interaction.js'),css=read('hero-interaction.css');
assert.ok(source.includes('document.hidden'));
assert.ok(source.includes('IntersectionObserver'));
assert.ok(source.includes('prefers-reduced-motion: reduce'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
assert.ok(read('index.html').indexOf('./hero-interaction.js')<read('index.html').indexOf('./proactivity-intro.js'));
console.log('Hero verified: response slice, full interaction, conditional futures, no invented scores, scrubber, pause and reduced-motion support.');
