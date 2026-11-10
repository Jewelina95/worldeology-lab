import {execFileSync} from 'node:child_process';
import {appendFileSync} from 'node:fs';
export function shouldPublish(event,latest,published){return event!=='schedule'||latest!==published;}
if(process.argv.includes('--test')){
 const {strict:assert}=await import('node:assert');
 assert.equal(shouldPublish('schedule','same','same'),false);
 assert.equal(shouldPublish('schedule','new','old'),true);
 assert.equal(shouldPublish('workflow_dispatch','same','same'),true);
 console.log('Update detection: unchanged schedules skip publication; new commits and explicit publications build.');
}else{
 const latest=execFileSync('git',['ls-remote','https://github.com/Jewelina95/InteractEval-website.git','refs/heads/main'],{encoding:'utf8'}).split(/\s+/)[0];
 if(!/^[a-f0-9]{40}$/.test(latest))throw new Error('Could not resolve the InteractNet source commit');
 const response=await fetch('https://worldeology.com/InteractNet/deployment.json?check='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});
 let published='';
 if(response.ok)published=(await response.json()).revision||'';
 else if(response.status!==404)throw new Error(`Could not check published revision (${response.status})`);
 const publish=shouldPublish(process.env.GITHUB_EVENT_NAME,latest,published);
 if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`publish=${publish}\nrevision=${latest}\n`);
 console.log(JSON.stringify({latest,published,publish}));
}
