import { copyFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Plugin } from 'vite';

type StyleAsset = Readonly<{
  destinationPath: string;
  sourcePath: string;
}>;

export const copyStyleAssetsPlugin = (
  assets: readonly StyleAsset[],
): Plugin => ({
  name: 'copy-style-assets',
  async closeBundle() {
    await Promise.all(
      assets.map(async ({ destinationPath, sourcePath }) => {
        await mkdir(dirname(destinationPath), { recursive: true });
        await copyFile(sourcePath, destinationPath);
      }),
    );
  },
});
