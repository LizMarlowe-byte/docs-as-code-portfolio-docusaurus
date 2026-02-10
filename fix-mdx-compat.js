// fix-mdx-compat.js
// Harden MDX compatibility across /docs:
//  - Wrap plain-text curly patterns in inline code so MDX doesn't parse them.
//  - Skips front-matter, fenced code blocks, and inline code.
//  - Also normalizes <br> and <hr> to self-closing, outside of code blocks.
//
// Run: node fix-mdx-compat.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'docs');
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
  // leading YAML front matter (--- ... ---)
  const m = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (m && m.index === 0) {
    return { front: m[0], body: text.slice(m[0].length) };
  }
  return { front: '', body: text };
}

function wrapCurlyOutsideInlineCode(line) {
  // Protect inline code by splitting on backticks
  const segments = line.split('`'); // even idx = outside, odd idx = inside
  for (let i = 0; i < segments.length; i += 2) {
    let seg = segments[i];

    // 1) {{ ... }}  → `{{ ... }}`
    seg = seg.replace(/\{\{[^{}\n]+\}\}/g, (m) => `\`${m}\``);

    // 2) {% ... %}  → `{% ... %}`
    seg = seg.replace(/\{%\s*[^%\n]+\s*%\}/g, (m) => `\`${m}\``);

    // 3) {token} or { token } → `{token}` (allow limited content to avoid huge blocks)
    //    Allow letters, digits, underscore, dot, dash, colon and spaces inside braces.
    //    Avoid matching JSON/object literals by limiting to 1..80 chars without newlines or braces.
    seg = seg.replace(/\{[A-Za-z0-9_.:\-\s]{1,80}\}/g, (m) => {
      // If it already looks like `{ key: value }`, skip (should be fenced as code)
      if (/[A-Za-z0-9_]\s*:\s*/.test(m)) return m;
      return `\`${m}\``;
    });

    segments[i] = seg;
  }
  return segments.join('`');
}

function normalizeVoidTagsOutsideInlineCode(line) {
  // Only handle <br> and <hr> here to keep it safe
  const segments = line.split('`');
  for (let i = 0; i < segments.length; i += 2) {
    let seg = segments[i];
    // <br> or <br > → <br />
    seg = seg.replace(/<br\s*>/gi, '<br />');
    // <hr> or <hr > → <hr />
    seg = seg.replace(/<hr\s*>/gi, '<hr />');
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

    if (inFence) continue; // skip inside fenced code blocks

    // Apply transformations outside fenced code; preserve inline code via backtick splitting
    let out = lines[i];
    out = wrapCurlyOutsideInlineCode(out);
    out = normalizeVoidTagsOutsideInlineCode(out);

    lines[i] = out;
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