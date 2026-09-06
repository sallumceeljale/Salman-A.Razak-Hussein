import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const manifestPath = path.join(rootDir, 'src', 'data', 'universities', 'usMarksManifest.json');
const usFilePath = path.join(rootDir, 'src', 'data', 'universities', 'unitedStates.ts');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestMap = new Map();
for (const m of manifest) {
  manifestMap.set(m.universityId, m);
}

function getMonogram(name, aliases) {
  const shortAlias = aliases.find(a => a.length >= 2 && a.length <= 6 && a === a.toUpperCase());
  if (shortAlias) return shortAlias;
  const words = name
    .replace(/University of |College of |The |at |in |–|-|,/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const originalContent = fs.readFileSync(usFilePath, 'utf8');

const regex = /{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*aliases:\s*(\[[^\]]*\]),\s*country:\s*['"]([^'"]+)['"],\s*institutionType:\s*['"]([^'"]+)['"],\s*officialWebsite:\s*['"]([^'"]+)['"](?:\s*,\s*logoPath:\s*['"][^'"]*['"])?(?:\s*,\s*monogram:\s*['"][^'"]*['"])?\s*}/g;

const updatedContent = originalContent.replace(regex, (match, id, name, aliasesRaw, country, institutionType, officialWebsite) => {
  let aliases = [];
  try {
    aliases = JSON.parse(aliasesRaw.replace(/'/g, '"'));
  } catch {
    aliases = [];
  }
  const mono = getMonogram(name, aliases);
  const mark = manifestMap.get(id);
  const logoLine = mark && mark.localAssetPath ? `\n    logoPath: '${mark.localAssetPath}',` : '';
  const monoLine = `\n    monogram: '${mono}',`;

  return `{\n    id: '${id}',\n    name: '${name}',\n    aliases: ${aliasesRaw},\n    country: '${country}',\n    institutionType: '${institutionType}',\n    officialWebsite: '${officialWebsite}',${logoLine}${monoLine}\n  }`;
});

fs.writeFileSync(usFilePath, updatedContent, 'utf8');
console.log('Successfully updated unitedStates.ts with logoPath and monogram');
