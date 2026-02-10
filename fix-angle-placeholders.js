// fix-angle-placeholders.js
// Wraps <placeholder> patterns in backticks to avoid MDX HTML tag parsing.
// Only affects patterns of letters, numbers, underscores, hyphens inside angle brackets.
// Skips real HTML tags (<strong>, <table>, etc).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'docs');

function listFiles(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(listFiles(fp));
    else if (fp.endsWith('.md') || fp.endsWith('.mdx')) out.push(fp);
  }
  return out;
}

function fixLine(line) {
  return line.replace(
    /<([A-Za-z0-9_\-]+)>/g,       // match <token>
    (match, token) => `\`<${token}>\``  // wrap in backticks
  );
}

function fixFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  const lines = original.split(/\r?\n/);
  let changed = false;

  const fixed = lines.map(line => {
    const newLine = fixLine(line);
    if (newLine !== line) changed = true;
    return newLine;
  }).join('\n');

  if (changed) {
    fs.writeFileSync(file, fixed, 'utf8');
    console.log("Fixed:", file);
  }
}

listFiles(ROOT).forEach(fixFile);

console.log("\nDone! All angle bracket placeholders wrapped.\n");