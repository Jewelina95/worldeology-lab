import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Check the imported website against the render contract from the same revision.
const cwd = fileURLToPath(new URL('../public/InteractNet/', import.meta.url));
execFileSync(process.execPath, ['scripts/check-render.mjs'], { cwd, stdio: 'inherit' });
