import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { findPackageExportIssues } from './check-package-exports.mjs';

async function writeFixture(rootDir, files) {
  await Promise.all(
    Object.entries(files).map(async ([name, content]) => {
      const filePath = join(rootDir, name);
      await mkdir(join(filePath, '..'), { recursive: true });
      await writeFile(filePath, content);
    }),
  );
}

test('accepts exports that are present in vite entries and dist', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'tenurin-ui-exports-check-'));

  await writeFixture(rootDir, {
    'package.json': JSON.stringify(
      {
        exports: {
          './button': {
            types: './dist/components/ui/button.d.ts',
            import: './dist/components/ui/button.es.js',
            require: './dist/components/ui/button.cjs.js',
          },
        },
      },
      null,
      2,
    ),
    'vite.config.ts': [
      'export default {',
      '  build: {',
      '    lib: {',
      '      entry: {',
      "        button: path.resolve(__dirname, 'src/components/ui/button.tsx'),",
      '      },',
      '    },',
      '  },',
      '};',
    ].join('\n'),
    'dist/components/ui/button.d.ts': 'export {};\n',
    'dist/components/ui/button.es.js': 'export {};\n',
    'dist/components/ui/button.cjs.js': 'module.exports = {};\n',
  });

  assert.deepEqual(await findPackageExportIssues(rootDir, { checkDist: true }), []);
});

test('flags exports missing from vite entries', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'tenurin-ui-exports-check-'));

  await writeFixture(rootDir, {
    'package.json': JSON.stringify(
      {
        exports: {
          './button': {
            types: './dist/components/ui/button.d.ts',
            import: './dist/components/ui/button.es.js',
            require: './dist/components/ui/button.cjs.js',
          },
        },
      },
      null,
      2,
    ),
    'vite.config.ts': 'export default { build: { lib: { entry: {} } } };',
  });

  const failures = await findPackageExportIssues(rootDir);

  assert.deepEqual(failures, [
    'package.json export "./button" is missing from vite.config.ts build.lib.entry',
  ]);
});

test('flags missing dist artifacts for exported entries', async () => {
  const rootDir = await mkdtemp(join(tmpdir(), 'tenurin-ui-exports-check-'));

  await writeFixture(rootDir, {
    'package.json': JSON.stringify(
      {
        exports: {
          './button': {
            types: './dist/components/ui/button.d.ts',
            import: './dist/components/ui/button.es.js',
            require: './dist/components/ui/button.cjs.js',
          },
        },
      },
      null,
      2,
    ),
    'vite.config.ts': [
      'export default {',
      '  build: {',
      '    lib: {',
      '      entry: {',
      "        button: path.resolve(__dirname, 'src/components/ui/button.tsx'),",
      '      },',
      '    },',
      '  },',
      '};',
    ].join('\n'),
    'dist/components/ui/button.d.ts': 'export {};\n',
  });

  const failures = await findPackageExportIssues(rootDir, { checkDist: true });

  assert.deepEqual(failures, [
    'package.json export "./button" points to missing dist artifact "./dist/components/ui/button.cjs.js"',
    'package.json export "./button" points to missing dist artifact "./dist/components/ui/button.es.js"',
  ]);
});
