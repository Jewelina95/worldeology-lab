import {cpSync,existsSync,lstatSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'.interacteval-source');
const destination=path.join(root,'public','InteractEval');
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
console.log(`Imported InteractEval ${revision} into public/InteractEval only.`);
