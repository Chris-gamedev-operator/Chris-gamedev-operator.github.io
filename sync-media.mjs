import fs from "node:fs";
import path from "node:path";

const PROJECTS_JS = path.join("scripts", "data-projects.js");
const MEDIA_ROOT = path.join("media", "img");
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

// Maps project id in scripts/data-projects.js -> folder name under media/img/
const FOLDER_MAP = {
  spacey7: "spaceY7",
  towerup: "towerup",
  "canary-grave": "canary-grave",
  luzzbiteyear: "luzzbiteyear",
};

function listImages(folderPath) {
  if (!fs.existsSync(folderPath)) return [];
  return fs
    .readdirSync(folderPath)
    .filter((file) => IMAGE_EXTS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `./${path.join(folderPath, file).replace(/\\/g, "/")}`);
}

function formatJsArray(items) {
  if (!items.length) return "[]";
  const lines = items.map((item) => `            "${item}"`).join(",\n");
  return `[\n${lines}\n        ]`;
}

let content = fs.readFileSync(PROJECTS_JS, "utf8");

for (const [projId, folderName] of Object.entries(FOLDER_MAP)) {
  const baseDir = path.join(MEDIA_ROOT, folderName);
  const screenshots = listImages(path.join(baseDir, "screenshots"));
  const techshots = listImages(path.join(baseDir, "techshots"));

  const pattern = new RegExp(
    `(id:\\s*"${projId}".*?screenshots:\\s*)\\[.*?\\](,\\s*techshots:\\s*)\\[.*?\\]`,
    "s"
  );

  const next = content.replace(
    pattern,
    `$1${formatJsArray(screenshots)}$2${formatJsArray(techshots)}`
  );

  const changed = next !== content;
  content = next;
  console.log(
    `${projId}: ${screenshots.length} screenshots, ${techshots.length} techshots (updated=${changed})`
  );
}

fs.writeFileSync(PROJECTS_JS, content, "utf8");
console.log("Done. Updated scripts/data-projects.js");