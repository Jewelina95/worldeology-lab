import {build} from 'esbuild';
import {readFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
const repo=process.argv[2]||path.resolve(process.cwd(),'..');
const destination=path.join(repo,'assets/motion');
await mkdir(destination,{recursive:true});
await mkdir(path.join(repo,'motion'),{recursive:true});
await build({entryPoints:['player.jsx'],bundle:true,minify:true,format:'iife',target:['es2020'],outfile:path.join(destination,'charts.js'),define:{'process.env.NODE_ENV':'"production"',__PAPER__:await readFile(path.join(repo,'data/paper-results.json'),'utf8')}});
for(const file of ['Charts.jsx','Mechanisms.jsx','VisualMechanisms.jsx','player.jsx','build.mjs','package.json','package-lock.json']){const target=path.join(repo,'motion',file);if(path.resolve(file)!==path.resolve(target))await copyFile(file,target);}
console.log('Built Remotion Player charts for website previews.');
