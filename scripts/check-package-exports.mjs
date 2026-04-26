import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

const IGNORED_EXPORTS = new Set([
  "./styles",
  "./theme.css",
  "./tailwind-sources/*",
]);

async function pathExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function readExportEntries(packageJsonContent) {
  const packageJson = JSON.parse(packageJsonContent);

  return Object.entries(packageJson.exports ?? {}).filter(
    ([exportKey]) =>
      exportKey.startsWith("./") && !IGNORED_EXPORTS.has(exportKey),
  );
}

function readViteEntryNames(viteConfigContent) {
  const entryNames = new Set();
  const entryPattern =
    /^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z0-9_]+)):\s*path\.resolve\(/gm;

  for (const match of viteConfigContent.matchAll(entryPattern)) {
    const entryName = match[1] ?? match[2] ?? match[3];
    if (entryName) {
      entryNames.add(entryName);
    }
  }

  return entryNames;
}

function toRelativeExportName(exportKey) {
  return exportKey.slice(2);
}

function normalizeExportPaths(exportValue) {
  if (typeof exportValue === "string") {
    return [exportValue];
  }

  if (!exportValue || typeof exportValue !== "object") {
    return [];
  }

  return ["types", "import", "require", "default", "style"]
    .map((field) => exportValue[field])
    .filter((value) => typeof value === "string");
}

export async function findPackageExportIssues(
  rootDir = process.cwd(),
  options = {},
) {
  const checkDist = options.checkDist === true;
  const packageJsonPath = join(rootDir, "package.json");
  const viteConfigPath = join(rootDir, "vite.config.ts");
  const [packageJsonContent, viteConfigContent] = await Promise.all([
    readFile(packageJsonPath, "utf8"),
    readFile(viteConfigPath, "utf8"),
  ]);

  const exportEntries = readExportEntries(packageJsonContent);
  const viteEntryNames = readViteEntryNames(viteConfigContent);
  const failures = [];

  for (const [exportKey, exportValue] of exportEntries) {
    const exportName = toRelativeExportName(exportKey);

    if (!viteEntryNames.has(exportName)) {
      failures.push(
        `package.json export "${exportKey}" is missing from vite.config.ts build.lib.entry`,
      );
    }

    if (!checkDist) {
      continue;
    }

    const exportPaths = normalizeExportPaths(exportValue);

    await Promise.all(
      exportPaths.map(async (relativePath) => {
        const filePath = join(rootDir, relativePath);
        if (!(await pathExists(filePath))) {
          failures.push(
            `package.json export "${exportKey}" points to missing dist artifact "${relativePath}"`,
          );
        }
      }),
    );
  }

  return failures.sort();
}

const shouldCheckDist = process.argv.includes("--check-dist");
const failures = await findPackageExportIssues(process.cwd(), {
  checkDist: shouldCheckDist,
});

if (failures.length > 0) {
  console.error(
    shouldCheckDist
      ? "Package exports and built dist artifacts are out of sync."
      : "Package exports and vite build entries are out of sync.",
  );
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

assert.ok(true);
