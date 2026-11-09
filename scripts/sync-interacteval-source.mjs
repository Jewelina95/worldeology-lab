import {execFileSync} from 'node:child_process';
import {existsSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(process.env.GITHUB_ACTIONS!=='true'&&!process.argv.includes('--force')&&existsSync(path.join(root,'public','InteractionNet','index.html'))){
 console.log('Using the local InteractionNet snapshot. Publication imports the independent repository.');
}else{
 const source=path.join(root,'.interacteval-source');
 if(existsSync(source))rmSync(source,{recursive:true,force:true});
 execFileSync('git',['clone','--depth','1','--single-branch','--branch','main','https://github.com/Jewelina95/InteractEval-website.git',source],{stdio:'inherit'});
 process.env.INTERACTEVAL_REVISION=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
 await import('./import-interacteval-source.mjs');
}
