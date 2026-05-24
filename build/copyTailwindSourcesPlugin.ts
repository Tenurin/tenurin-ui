import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin } from 'vite';

const isTailwindSourceFile = (fileName: string) =>
  fileName.endsWith('.js') && !fileName.endsWith('.d.ts');

type TailwindSourceGroup = Readonly<{
  sourceDirectory: string;
  outputSubdirectory: string;
}>;

export const copyTailwindSourcesPlugin = (
  sourceGroups: readonly TailwindSourceGroup[],
  outputDirectory: string,
): Plugin => ({
  name: 'copy-tailwind-sources',
  async closeBundle() {
    await rm(outputDirectory, { recursive: true, force: true });

    await Promise.all(
      sourceGroups.map(async ({ sourceDirectory, outputSubdirectory }) => {
        const targetDirectory = join(outputDirectory, outputSubdirectory);
        const fileNames = await readdir(sourceDirectory);
        const sourceFiles = fileNames.filter(isTailwindSourceFile);

        await mkdir(targetDirectory, { recursive: true });

        await Promise.all(
          sourceFiles.map((fileName) =>
            copyFile(
              join(sourceDirectory, fileName),
              join(targetDirectory, fileName),
            ),
          ),
        );
      }),
    );
  },
});
