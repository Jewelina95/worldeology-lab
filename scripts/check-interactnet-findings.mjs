import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../public/InteractNet/',import.meta.url)));
await import('../public/InteractNet/scripts/check-findings.mjs');
