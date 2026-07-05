# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website for Ed Engelking II, built with Astro + React islands (Framer Motion), deployed to GitHub Pages via GitHub Actions. Static output — no server runtime.

## Commands

- `npm run dev` — local dev server at `localhost:4321`
- `npm run build` — build production site to `./dist/`
- `npm run preview` — preview the production build locally
- `./scripts/check-sensitive.sh dist` — scans a build output directory for denylisted terms (see below); CI runs this against `dist` before deploy

There is no test suite and no lint/typecheck script configured. TypeScript uses `astro/tsconfigs/strict`; rely on editor/IDE diagnostics or `npx astro check` for type errors.

## Architecture

**Content model**: page copy lives in typed data modules under `src/data/` (`hero.ts`, `about.ts`, `achievements.ts`, `contact.ts`, `projects.ts`, `skills.ts`, `timeline.ts`), typed against shared interfaces in `src/types/content.ts`. Components import from `src/data/*` rather than hardcoding copy. When changing site copy, edit the data module, not the component markup.

Two Astro content collections (`src/content.config.ts`) back actual pages: `blog` and `interests`, both loaded via `glob()` from `src/content/{blog,interests}/*.md` with identical zod schemas — `title`, `description`, `date`, `tags`, `draft` (bool, defaults to `false`). Both collections follow the same list+detail pattern: `blog/index.astro` + `blog/[slug].astro`, and `interests.astro` (index) + `interests/[slug].astro` (detail) — every entry's markdown body renders on its own page at `/interests/<slug>` the same way blog posts do at `/blog/<slug>`; the index pages are just summaries that link out and both filter their `getCollection()` call on `!data.draft`. Both collections are live, indexable, and in the sitemap as of 2026-07-04. A new entry is published automatically on the next build/deploy unless `draft: true` is set — this defaults to `false`, so an entry committed without the field present goes live, not the other way around.

Both list pages use a shared `PostList` React island (`src/components/posts/PostList.tsx`) for search — a single text input (no tag-chip UI; that doesn't scale) that matches quoted phrases as exact substrings and unquoted words as separate AND'd terms (see `src/utils/searchQuery.ts`, shared with `SkillSearch.tsx`). Only the post title is a real `<a>`; the rest of the row (date, description, tag buttons) intentionally stays outside the anchor so text remains selectable and tag buttons aren't nested inside a link (invalid HTML). Tag buttons set the search box's query rather than navigating.

**Astro + React split**: `.astro` files are the default for static sections (Hero, About, Nav, ProjectGrid, ContactCTA). React (`.tsx`) is reserved for components needing client-side interactivity or animation — `AboutReveal`, `StatStrip`, `SkillSearch`, `Timeline`/`TimelineNode` — using Framer Motion for scroll-triggered/in-view animation. Check existing usage of `useInView` / `whileInView` patterns before adding new motion behavior for consistency. New static content should stay in `.astro`; only reach for React when you need state, effects, or hooks.

**Design system**: CSS custom properties in `src/styles/tokens.css` define the full visual language (color, type scale, 8px spacing rhythm) — component styles should reference these tokens rather than hardcoding values. The design signature (see comment at top of `tokens.css`) is a "system status log" aesthetic: monospace timestamps, amber "service online" indicators, NOC/CRT-monitoring-wall inspired accent color — this is a deliberate motif, especially in the `Timeline` component, and should be preserved when touching related UI.

**SEO/meta**: `BaseLayout.astro` centralizes `<title>`, meta description, canonical URL, OG/Twitter tags, RSS discovery link, and a site-wide `Person` JSON-LD block (sourced from `src/data/hero.ts`, `src/data/about.ts`, `src/data/contact.ts`, `src/data/skills.ts`'s `skillCategories` for `knowsAbout`). Pages pass `title`/`description`/`noindex` props rather than duplicating head tags. `og:type` defaults to `"website"`; post detail pages pass `ogType="article"` plus `publishedTime` (ISO string) to get `article:published_time`. Pages can also pass a `jsonLd` prop (array of extra structured-data objects) to layer page-specific schema on top of the site-wide `Person` block:
- `blog/[slug].astro` and `interests/[slug].astro` each emit a `BlogPosting` per entry — headline, dates, `author` and `publisher` (both a `Person` block pointing at `hero.name`; Google's structured-data docs expect a `publisher` on Article/BlogPosting types, and a `Person` is what fits a single-author personal site, not an `Organization`), and keywords from tags.
- `blog/index.astro` emits a `Blog` block with a `blogPost` array (one `BlogPosting` summary per non-draft post) and `interests.astro` emits an `ItemList` of `CreativeWork` summaries (each with a `url` pointing at its detail page) — both exist so a crawler or LLM tool can get the full list of posts/entries from the index page's JSON-LD alone, without having to follow every link.
- Every page's `description` prop doubles as its meta description and OG/Twitter description, so it should read as real ad copy for that specific page, not a generic placeholder — this applies to `blog/index.astro` and `interests.astro` too, not just individual posts. If the on-page intro copy (`src/data/pageIntros.ts`) changes, sanity-check whether the index page's `description` prop should be refreshed too; they serve different jobs (one is on-page copy, the other is the search-snippet text) and don't have to match word-for-word, but neither should go stale relative to what the collection actually contains.

This structured-data setup exists specifically so search engines and LLM web-search tools can assemble a fuller profile from the content, not just plain prose. When adding a new collection or a new index/detail page pair, mirror this pattern (per-entry `BlogPosting`-or-equivalent with `author`+`publisher`, an index-level list block, and a real per-page meta description) rather than treating SEO wiring as optional polish.

**RSS**: `src/pages/rss.xml.ts` (via `@astrojs/rss`) generates a feed from non-draft blog posts only — interests isn't included. `BaseLayout` links to it site-wide via `<link rel="alternate">`.

**Sitemap lastmod**: `astro.config.mjs` reads blog/interests markdown frontmatter directly off disk (not via `astro:content`, which isn't available at config-load time) to attach a real `lastmod` date per sitemap URL instead of leaving it blank. It skips files with `draft: true` and skips regenerating this if the frontmatter `date:` line format changes — the matcher is a simple regex, not a YAML parser, so unusual frontmatter (multi-line strings, quoted dates with unusual formatting) could silently fail to produce a `lastmod` for that entry. Not fatal (the sitemap entry just omits `lastmod`), but worth knowing if `lastmod` seems to be missing for a new post.

**Sensitive content guard**: `scripts/check-sensitive.sh` greps the built `dist/` for a hardcoded denylist (currently a personal email and a compensation-related term) and fails CI if found. If new sensitive strings need to be kept out of the public build, add them to the `DENYLIST` array in that script rather than relying on manual review.

**Deploy**: `.github/workflows/deploy.yml` builds on push to `main`, runs the sensitive-content check against `dist`, then deploys to GitHub Pages. There's no separate CI/test gate — the sensitive-content check is the only automated gate before deploy.

## Writing Blog & Interests Posts

The `blog` and `interests` collections are live and indexable (see Content model above). A `write-post` skill (`.claude/skills/write-post/SKILL.md`) codifies the workflow below — it should trigger automatically when Ed hands over bullets for a post. The notes here are the underlying rationale; the skill is the operational version.

When asked to help draft a post:

1. **Start from bullets, not prose.** Ed will hand over a rough list of points he wants the post to cover. Don't draft immediately — ask clarifying questions first: what's the angle/thesis, who's the audience, what should the reader walk away with, does he want a personal-narrative tone (like `hello-world.md`) or something more technical/instructional, roughly how long, and whether specific incidents/companies/tools can be named. Only draft once the shape of the piece is clear.
2. **Match existing voice.** Read a current post in the target collection (e.g. `src/content/blog/hello-world.md`) before drafting — first person, understated, concrete details over generic claims (specific systems/eras, not "extensive experience"). Avoid marketing-speak.
3. **File conventions**: new file at `src/content/blog/<kebab-case-slug>.md` or `src/content/interests/<kebab-case-slug>.md`. Frontmatter must satisfy the zod schema in `src/content.config.ts` — `title`, `description` (this is used as the meta description and OG/Twitter description — write it as real ad copy, not a restatement of the title), `date` (`YYYY-MM-DD`), `tags` (array, lowercase, reuse existing tags like `meta`/`personal` where it fits rather than inventing near-duplicates), and `draft` (bool) — default every new post/entry in *either* collection to `draft: true` so it's safe to commit before it's publish-ready; only set it to `false` if Ed explicitly says it's ready to go live. This matters even more for interests than blog: nothing else gates it.
4. **Run `scripts/check-sensitive.sh` in mind while drafting** — don't include Ed's personal email or compensation figures in post bodies; check the `DENYLIST` array in the script if unsure what's off-limits.
5. **Publishing a specific post or entry**: since the sections themselves are already live, "publishing" is just flipping `draft: false` — that alone puts it in the sitemap and makes it crawlable/indexable by search engines and LLM web-search tools. Still confirm with Ed before flipping `draft`, since it's a visible/shared-state change, but there's no separate site-wide switch to throw anymore.
