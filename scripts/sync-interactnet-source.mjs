import {execFileSync} from 'node:child_process';
import {existsSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const requestedRevision=process.env.INTERACTNET_SOURCE_REVISION?.trim();
if(requestedRevision&&!/^[a-f0-9]{40}$/.test(requestedRevision))throw new Error('InteractNet source revision must be a full commit SHA');
if(!requestedRevision&&process.env.GITHUB_ACTIONS!=='true'&&!process.argv.includes('--force')&&existsSync(path.join(root,'public','InteractNet','index.html'))){
 console.log('Using the local InteractNet snapshot. Publication imports the independent repository.');
}else{
 const source=path.join(root,'.interactnet-source');
 if(existsSync(source))rmSync(source,{recursive:true,force:true});
 execFileSync('git',['clone','--depth','1','--single-branch','--branch','main','https://github.com/Jewelina95/InteractEval-website.git',source],{stdio:'inherit'});
 if(requestedRevision){
  execFileSync('git',['-C',source,'fetch','--depth','1','origin',requestedRevision],{stdio:'inherit'});
  execFileSync('git',['-C',source,'checkout','--detach',requestedRevision],{stdio:'inherit'});
 }
 process.env.INTERACTNET_REVISION=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
 await import('./import-interactnet-source.mjs');
}
