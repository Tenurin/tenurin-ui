import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { interFontFileNames } from '../src/lib/fontManifest';

export const copyFontAssetsPlugin = (
  sourceDirectory: string,
  outputDirectory: string,
): Plugin => ({
  name: 'copy-font-assets',
  async closeBundle() {
    await mkdir(outputDirectory, { recursive: true });

    await Promise.all(
      interFontFileNames.map((fileName) =>
        copyFile(join(sourceDirectory, fileName), join(outputDirectory, fileName)),
      ),
    );
  },
});
