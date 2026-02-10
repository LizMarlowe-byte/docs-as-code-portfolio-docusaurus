// fix-mdx-placeholders.js
// Safe fixer for MDX "fake HTML" placeholders in Markdown/MDX prose.
// - Skips fenced code blocks (``` or ~~~).
// - Skips inline code spans (`code`), even if they contain angle brackets.
// - Wraps only the known placeholders when they appear in prose.
// - Creates .bak backups.

const fs = require('fs');
const path = require('path');

// Edit this list to the files that are failing in your build output:
const files = [
  'docs/api-guides/OpenWeatherMap-API-Guide.md',
  'docs/api-guides/Spotify-API-Guide.md',
  'docs/technical-reference-guides/Optiflow_CloudSync_CRM_Integration_Guide.md',
  'docs/user-guides/Docmost-User-Guide.md',
  'docs/user-guides/Taiga-User-Guide.md'
];

// Placeholders we want to wrap in backticks when found in prose:
const PLACEHOLDERS = [
  '<YOUR_API_KEY>',
  '<access_token>',
  '</id>',
  '</cli>',
  '</dir>'
];

// Build an exact-match regex for placeholders (escaped) that we will use
// only in prose context (not in code fences or inline code).
const placeholderRegexps = PLACEHOLDERS.map((p) => {
  const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'g');
});

function processContent(content, filePath) {
  const lines = content.split(/\r?\n/);
  let inFence = false;     // inside ``` or ~~~
  let fenceMarker = null;  // ``` or ~~~
  let processed = [];
  let changed = false;

  // Helper to wrap placeholders in a line, but skip inline code spans.
  function wrapPlaceholdersOutsideInlineCode(line) {
    // Split by inline code backticks; odd segments are code, even are prose
    const parts = line.split(/(`)/); // keep delimiters to rebuild accurately
    let out = '';
    let inInline = false;

    for (let i = 0; i < parts.length; i++) {
      const chunk = parts[i];

      if (chunk === '`') {
        inInline = !inInline;
        out += chunk;
        continue;
      }

      if (inInline) {
        // Inside inline code: leave as-is
        out += chunk;
      } else {
        // Prose segment: replace placeholders
        let replaced = chunk;
        for (const rx of placeholderRegexps) {
          if (rx.test(replaced)) {
            changed = true;
            replaced = replaced.replace(rx, (m) => `\`${m}\``);
          }
        }
        out += replaced;
      }
    }
    return out;
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detect start/end of fenced code blocks (```lang or ~~~lang)
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[2];
      if (!inFence) {
        // entering a fence
        inFence = true;
        fenceMarker = marker[0]; // ` or ~
      } else {
        // possible exit: only if same fence char
        if (marker[0] === fenceMarker) {
          inFence = false;
          fenceMarker = null;
        }
      }
      processed.push(line);
      continue;
    }

    if (inFence) {
      // Inside code fence: do nothing
      processed.push(line);
      continue;
    }

    // Not inside fence: process prose line (but respect inline `code`)
    const newLine = wrapPlaceholdersOutsideInlineCode(line);
    processed.push(newLine);
  }

  if (changed) {
    console.log(`✓ Changes made in ${filePath}`);
  } else {
    console.log(`— No changes needed in ${filePath}`);
  }

  return { text: processed.join('\n'), changed };
}

function safeWrite(filePath, text) {
  const bakPath = filePath + '.bak';
  if (!fs.existsSync(bakPath)) {
    fs.copyFileSync(filePath, bakPath);
  }
  fs.writeFileSync(filePath, text, 'utf8');
}

function main() {
  let totalChanged = 0;

  for (const rel of files) {
    const filePath = path.resolve(process.cwd(), rel);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ File not found: ${rel}`);
      continue;
    }
    const input = fs.readFileSync(filePath, 'utf8');
    const { text, changed } = processContent(input, rel);
    if (changed) {
      safeWrite(filePath, text);
      totalChanged++;
    }
  }

  console.log('\nDone. Backups saved as .bak where changes occurred.');
  if (totalChanged === 0) {
    console.log('If the build still fails, the placeholders may be different strings or live in other files. I can scan the repo next.');
  }
}

main();