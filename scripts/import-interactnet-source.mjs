import {cpSync,existsSync,lstatSync,mkdirSync,readdirSync,renameSync,rmSync,statSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'.interactnet-source');
const destination=path.join(root,'public','InteractNet');
const priorBrand=path.join(root,'public','InteractionNet');
const legacy=path.join(root,'public','InteractEval');
const revision=process.env.INTERACTNET_REVISION;
if(!/^[a-f0-9]{40}$/.test(revision||''))throw new Error('An immutable source revision is required');
for(const name of ['index.html','research.html','showcase.html','results-explorer.js','motivation-figure.js'])if(!existsSync(path.join(source,name)))throw new Error(`Missing InteractNet entry: ${name}`);
function inspect(directory){
 for(const entry of readdirSync(directory,{withFileTypes:true})){
  if(entry.name==='.git'||entry.name==='.github')continue;
  const file=path.join(directory,entry.name);
  if(lstatSync(file).isSymbolicLink())throw new Error(`Symlinks are not allowed in the website source: ${entry.name}`);
  if(entry.isDirectory())inspect(file);
 }
}
inspect(source);
rmSync(destination,{recursive:true,force:true});
cpSync(source,destination,{recursive:true,filter:file=>!path.relative(source,file).split(path.sep).some(part=>['.git','.github'].includes(part))});

// The imported site is published under the InteractNet brand and URL, while the upstream
// repository keeps its own name. One ordered mapping serves both file names and file
// contents, so renamed assets and the references to them always agree. Identifiers that
// belong to other projects are masked so a brand rewrite cannot corrupt them.
const UPSTREAM='InteractEval-website';
const PROTECTED=['Xgogu/InteractEval','InteractEval-website'];
const MASK=PROTECTED.map((value,index)=>[value,`\u0000${index}\u0000`]);
const RULES=[
 ['https://worldeology.com/InteractionNet/','https://worldeology.com/InteractNet/'],
 ['https://worldeology.com/InteractEval/','https://worldeology.com/InteractNet/'],
 ['InteractionNet','InteractNet'],
 ['InteractEval','InteractNet'],
 ['interactionnet','interactnet'],
 ['interacteval','interactnet'],
 ['INTERACTIONNET','INTERACTNET'],
 ['INTERACTEVAL','INTERACTNET']
];
function brand(value){
 let out=value;
 for(const [from,to] of MASK)out=out.split(from).join(to);
 for(const [from,to] of RULES)out=out.split(from).join(to);
 for(const [from,to] of MASK)out=out.split(to).join(from);
 return out;
}
const TEXT=/\.(?:html|js|mjs|cjs|css|json|md|svg|txt|py|yml|yaml)$/i;
function walk(directory,visit){
 for(const entry of readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())walk(file,visit);else visit(file);
 }
}
// Pass 1: rename brand-named files and folders so references resolve to the new names.
function renamePass(directory){
 for(const entry of readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory()){renamePass(file);continue;}
  const renamed=path.join(directory,brand(entry.name));
  if(renamed!==file&&!existsSync(renamed))renameSync(file,renamed);
 }
}
renamePass(destination);
// Pass 2: rewrite every textual reference to the previous brand or URL.
walk(destination,file=>{
 if(!TEXT.test(file)||!statSync(file).isFile())return;
 const text=readFileSync(file,'utf8'),next=brand(text);
 if(next!==text)writeFileSync(file,next);
});
writeFileSync(path.join(destination,'deployment.json'),JSON.stringify({repository:'Jewelina95/'+UPSTREAM,revision},null,2)+'\n');

// Older entry points keep working. /InteractEval/ keeps the full asset copy, because
// direct links to its files were public for a long time. /InteractionNet/ was the most
// recent URL, so its pages redirect and nothing else is duplicated.
function redirectPage(legacyFile,legacyBase){
 const relative=path.relative(legacyBase,legacyFile).split(path.sep).join('/');
 const target=(relative==='index.html'
  ?path.relative(path.dirname(legacyFile),destination)+'/'
  :path.relative(path.dirname(legacyFile),path.join(destination,relative))).split(path.sep).join('/');
 const canonical='https://worldeology.com/InteractNet/'+(relative==='index.html'?'':relative);
 const script=`const target=new URL(${JSON.stringify(target)},location.href);target.search=location.search;target.hash=location.hash;location.replace(target.href);`;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>InteractNet</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${canonical}"><meta http-equiv="refresh" content="0;url=${target}"><script>${script}</script></head><body><a href="${target}">Continue to InteractNet</a></body></html>\n`;
}
rmSync(legacy,{recursive:true,force:true});
cpSync(destination,legacy,{recursive:true});
walk(legacy,file=>{if(file.endsWith('.html'))writeFileSync(file,redirectPage(file,legacy));});
rmSync(priorBrand,{recursive:true,force:true});
walk(destination,file=>{
 if(!file.endsWith('.html'))return;
 const relative=path.relative(destination,file);
 const target=path.join(priorBrand,relative);
 mkdirSync(path.dirname(target),{recursive:true});
 writeFileSync(target,redirectPage(target,priorBrand));
});
console.log(`Imported InteractNet ${revision} into public/InteractNet; /InteractEval/ asset copies and /InteractionNet/ page redirects preserve queries and fragments.`);
