import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../public/InteractEval/',import.meta.url)));
await import('../public/InteractEval/scripts/check-findings.mjs');
