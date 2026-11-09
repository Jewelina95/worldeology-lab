import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../public/InteractionNet/',import.meta.url)));
await import('../public/InteractionNet/scripts/check-findings.mjs');
