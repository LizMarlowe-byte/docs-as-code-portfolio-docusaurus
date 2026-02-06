// fix-curly-in-mdx.js
// Converts plain-text curly brace patterns to inline code so MDX won't parse them.
// - Skips front-matter, fenced code blocks, and inline code spans.
// - Wraps {token}, {{var}}, {% tag %} as literals using backticks.
// Run: node fix-curly-in-mdx.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'docs'); // change if your docs are elsewhere
const exts = new Set(['.md', '.mdx']);

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

function splitFrontMatter(text) {
  // Matches leading front matter block if present
  const m = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (m && m.index === 0) {
    return { front: m[0], body: text.slice(m[0].length) };
  }
  return { front: '', body: text };
}

function processLineOutsideInlineCode(line) {
  // Split by backticks to avoid touching inline code:
  // segments[0] outside, [1] inside, [2] outside, etc.
  const segments = line.split('`');
  for (let i = 0; i < segments.length; i += 2) {
    let seg = segments[i];

    // 1) Wrap {{var}} -> `{{var}}`
    seg = seg.replace(/\{\{[^}]+\}\}/g, (m) => `\`${m}\``);

    // 2) Wrap {% tag %} -> `{% tag %}`
    seg = seg.replace(/\{%\s*[^%]+\s*%\}/g, (m) => `\`${m}\``);

    // 3) Wrap {placeholder} -> `{placeholder}`
    // Allow word-ish tokens inside braces: letters, digits, underscore, dot, dash, colon
    seg = seg.replace(/\{([A-Za-z0-9_.:\-]+)\}/g, (m) => `\`${m}\``);

    segments[i] = seg;
  }
  return segments.join('`');
}

function processContent(body) {
  const lines = body.split(/\r?\n/);
  let inFence = false;
  let fenceChar = null; // '`' or '~'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect start/end of fenced code blocks (``` or ~~~)
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[2];
      const char = marker[0];
      if (!inFence) {
        inFence = true;
        fenceChar = char;
      } else if (char === fenceChar) {
        inFence = false;
        fenceChar = null;
      }
      continue; // don't transform fence lines themselves
    }

    if (inFence) continue; // skip inside fenced code

    // Transform outside fenced code (protect inline code naturally via split)
    lines[i] = processLineOutsideInlineCode(line);
  }

  return lines.join('\n');
}

function run() {
  const files = listFiles(ROOT);
  let changed = 0;

  files.forEach((file) => {
    const original = fs.readFileSync(file, 'utf8');
    const { front, body } = splitFrontMatter(original);
    const processed = front + processContent(body);
    if (processed !== original) {
      fs.writeFileSync(file, processed, 'utf8');
      changed++;
      console.log(`Updated: ${path.relative(process.cwd(), file)}`);
    }
  });

  console.log(`\nDone. Files updated: ${changed}/${files.length}`);
}

run();
``