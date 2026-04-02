import { execSync } from 'node:child_process';

// For the tenurin-ui repo itself, the fix is simply regenerating the lockfile.
// Unlike consumer repos, tenurin-ui doesn't depend on itself — stale self-references
// in the lockfile are cleaned up by a fresh pnpm install.
console.log('Regenerating pnpm-lock.yaml to remove stale local references...');
execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
