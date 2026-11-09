import {cpSync,existsSync,lstatSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'.interacteval-source');
const destination=path.join(root,'public','InteractionNet');
const legacy=path.join(root,'public','InteractEval');
const revision=process.env.INTERACTEVAL_REVISION;
if(!/^[a-f0-9]{40}$/.test(revision||''))throw new Error('An immutable source revision is required');
for(const name of ['index.html','research.html','showcase.html','results-explorer.js','motivation-figure.js'])if(!existsSync(path.join(source,name)))throw new Error(`Missing InteractEval entry: ${name}`);
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
writeFileSync(path.join(destination,'deployment.json'),JSON.stringify({repository:'Jewelina95/InteractEval-website',revision},null,2)+'\n');
// Keep direct legacy asset links working; HTML entry points move to the new URL.
rmSync(legacy,{recursive:true,force:true});
cpSync(destination,legacy,{recursive:true});
function redirectPages(directory){
 for(const entry of readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory()){redirectPages(file);continue;}
  if(!entry.name.endsWith('.html'))continue;
  const relative=path.relative(destination,file);
  const oldFile=path.join(legacy,relative);
  const target=(relative==='index.html'?path.relative(path.dirname(oldFile),destination)+'/':path.relative(path.dirname(oldFile),file)).split(path.sep).join('/');
  const canonical='https://worldeology.com/InteractionNet/'+(relative==='index.html'?'':relative.split(path.sep).join('/'));
  const script=`const target=new URL(${JSON.stringify(target)},location.href);target.search=location.search;target.hash=location.hash;location.replace(target.href);`;
  writeFileSync(oldFile,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>InteractionNet</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${canonical}"><meta http-equiv="refresh" content="0;url=${target}"><script>${script}</script></head><body><a href="${target}">Continue to InteractionNet</a></body></html>\n`);
 }
}
redirectPages(destination);
console.log(`Imported InteractionNet ${revision} into public/InteractionNet; legacy HTML redirects preserve query strings and fragments.`);
