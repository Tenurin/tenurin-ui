import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';

const TRACKED_FILES = ['package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml'];
const LOCAL_SOURCE_PATTERN = /(?:^|\s)(?:link:|file:)(\S+)/g;

async function readIfPresent(filePath) {
  try {
    await access(filePath, constants.F_OK);
  } catch {
    return null;
  }

  return readFile(filePath, 'utf8');
}

function findPackageJsonFailures(content) {
  const packageJson = JSON.parse(content);
  const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

  return sections.flatMap((section) => {
    const source = packageJson[section]?.['tenurin-ui'];

    if (!source || !source.startsWith('link:') && !source.startsWith('file:')) {
      return [];
    }

    return [`package.json: ${section}.tenurin-ui uses local source "${source}"`];
  });
}

function findYamlFailures(fileName, content) {
  const failures = [];

  for (const match of content.matchAll(LOCAL_SOURCE_PATTERN)) {
    const source = match[0].trim();
    const lineStart = content.lastIndexOf('\n', match.index) + 1;
    const line = content.slice(lineStart, content.indexOf('\n', lineStart) === -1 ? undefined : content.indexOf('\n', lineStart));

    if (!line.includes('tenurin-ui')) {
      continue;
    }

    failures.push(`${fileName}: tenurin-ui uses local source "${source}"`);
  }

  return failures;
}

export async function findInvalidTenurinUiSources(rootDir = process.cwd()) {
  const failures = [];

  for (const fileName of TRACKED_FILES) {
    const content = await readIfPresent(join(rootDir, fileName));

    if (!content) {
      continue;
    }

    if (fileName === 'package.json') {
      failures.push(...findPackageJsonFailures(content));
      continue;
    }

    failures.push(...findYamlFailures(fileName, content));
  }

  return failures;
}

const failures = await findInvalidTenurinUiSources();

if (failures.length > 0) {
  console.error('Tracked files must not pin tenurin-ui to a local link/file source.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}
