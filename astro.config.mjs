// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Reads each collection's markdown frontmatter directly (no astro:content
// access at config-load time) so the sitemap can report a real lastmod per
// entry instead of the build timestamp for everything.
function readCollectionDates(collection) {
  const dir = path.join(rootDir, 'src/content', collection);
  const bySlug = new Map();
  let latest = null;

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const contents = fs.readFileSync(path.join(dir, file), 'utf-8');
    if (/^draft:\s*true/m.test(contents)) continue;

    const dateMatch = contents.match(/^date:\s*['"]?([\d-]+)['"]?/m);
    if (!dateMatch) continue;

    const date = new Date(dateMatch[1]);
    bySlug.set(file.replace(/\.md$/, ''), date);
    if (!latest || date > latest) latest = date;
  }

  return { bySlug, latest };
}

const blogDates = readCollectionDates('blog');
const interestsDates = readCollectionDates('interests');

function withLastmod(item) {
  const pathParts = new URL(item.url).pathname.split('/').filter(Boolean);
  const [section, slug] = pathParts;
  const dates = section === 'blog' ? blogDates : section === 'interests' ? interestsDates : null;
  if (!dates) return item;

  const date = slug ? dates.bySlug.get(slug) : dates.latest;
  return date ? { ...item, lastmod: date.toISOString() } : item;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://edengelking.com',
  integrations: [
    react(),
    sitemap({
      serialize: withLastmod,
    }),
  ]
});
