import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin } from 'vite';

const isTailwindSourceFile = (fileName: string) =>
  fileName.endsWith('.js') && !fileName.endsWith('.d.ts');

export const copyTailwindSourcesPlugin = (
  sourceDirectories: readonly string[],
  outputDirectory: string,
): Plugin => ({
  name: 'copy-tailwind-sources',
  async closeBundle() {
    await mkdir(outputDirectory, { recursive: true });

    await Promise.all(
      sourceDirectories.map(async (sourceDirectory) => {
        const fileNames = await readdir(sourceDirectory);
        const sourceFiles = fileNames.filter(isTailwindSourceFile);

        await Promise.all(
          sourceFiles.map((fileName) =>
            copyFile(
              join(sourceDirectory, fileName),
              join(outputDirectory, fileName),
            ),
          ),
        );
      }),
    );
  },
});
