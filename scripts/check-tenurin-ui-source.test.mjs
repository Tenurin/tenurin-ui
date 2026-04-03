import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { findInvalidTenurinUiSources } from './check-tenurin-ui-source.mjs';

async function writeFixture(rootDir, files) {
  await Promise.all(
    Object.entries(files).map(([name, content]) =>
      writeFile(join(rootDir, name), content),
    ),
  );
}

test('accepts clean lockfile without tenurin-ui self-reference', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'tenurin-ui-source-check-'));

  await writeFixture(rootDir, {
    'package.json': JSON.stringify(
      {
        name: 'tenurin-ui',
        dependencies: {
          react: '^19.0.0',
        },
      },
      null,
      2,
    ),
    'pnpm-lock.yaml': [
      "lockfileVersion: '9.0'",
      'importers:',
      '  .:',
      '    dependencies:',
      '      react:',
      '        specifier: ^19.0.0',
      '        version: 19.0.0',
      '',
    ].join('\n'),
  });

  assert.deepEqual(await findInvalidTenurinUiSources(rootDir), []);
});

test('flags stale tenurin-ui self-reference in lockfile', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'tenurin-ui-source-check-'));

  await writeFixture(rootDir, {
    'package.json': JSON.stringify(
      {
        name: 'tenurin-ui',
        dependencies: {
          react: '^19.0.0',
        },
      },
      null,
      2,
    ),
    'pnpm-lock.yaml': [
      "lockfileVersion: '9.0'",
      'importers:',
      '  .:',
      '    dependencies:',
      '      tenurin-ui:',
      '        specifier: link:../../../../Library/pnpm/global/5/node_modules/tenurin-ui',
      '        version: link:../../../../Library/pnpm/global/5/node_modules/tenurin-ui',
      '      react:',
      '        specifier: ^19.0.0',
      '        version: 19.0.0',
      '',
    ].join('\n'),
  });

  const failures = await findInvalidTenurinUiSources(rootDir);

  assert.equal(failures.length, 2); // specifier + version lines
  assert.ok(failures.every((f) => f.includes('link:')));
});
