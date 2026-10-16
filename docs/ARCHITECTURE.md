# Architecture

How the site is put together. Rules for working in the repo live in `CLAUDE.md`; this file is only the description of the system.

## Overview

Astro site with React islands (Framer Motion for animation), deployed to GitHub Pages by GitHub Actions. The output is static, so there is no server runtime.

## Content model

Page copy lives in typed data modules under `src/data/` (`hero.ts`, `about.ts`, `achievements.ts`, `contact.ts`, `projects.ts`, `skills.ts`, `timeline.ts`), typed against the shared interfaces in `src/types/content.ts`. Components import from `src/data/*` rather than hardcoding copy.

Two Astro content collections (`src/content.config.ts`) back actual pages: `blog` and `interests`. Both load through `glob()` from `src/content/{blog,interests}/*.md` and share the same zod schema: `title`, `description`, `date`, `tags`, and `draft` (bool, defaults to `false`).

Both follow the same list and detail pattern. `blog/index.astro` pairs with `blog/[slug].astro`, and `interests.astro` pairs with `interests/[slug].astro`. Each entry's markdown body renders on its own page at `/blog/<slug>` or `/interests/<slug>`. The index pages are summaries that link out, and both filter their `getCollection()` call on `!data.draft`. Both collections are indexable and in the sitemap.

Both list pages use a shared `PostList` React island (`src/components/posts/PostList.tsx`) for search. It is a single text input with no tag-chip UI. Quoted phrases match as exact substrings and unquoted words are separate AND'd terms (see `src/utils/searchQuery.ts`, shared with `SkillSearch.tsx`). Only the post title is a real `<a>`. The rest of the row (date, description, tag buttons) stays outside the anchor so text remains selectable and tag buttons are not nested inside a link, which is invalid HTML. Tag buttons set the search box's query instead of navigating.

## Astro and React split

`.astro` files are the default for static sections (Hero, About, Nav, ProjectGrid, ContactCTA). React (`.tsx`) is for components that need client-side interactivity or animation: `AboutReveal`, `StatStrip`, `SkillSearch`, `Timeline` and `TimelineNode`. Those use Framer Motion for scroll-triggered and in-view animation. Check existing `useInView` and `whileInView` usage before adding new motion behavior. New static content stays in `.astro`; reach for React only when you need state, effects, or hooks.

## Design system

CSS custom properties in `src/styles/tokens.css` define the visual language: color, type scale, and an 8px spacing rhythm. Component styles reference these tokens rather than hardcoding values.

The design signature (see the comment at the top of `tokens.css`) is a "system status log" look: monospace timestamps, amber "service online" indicators, and an accent color borrowed from NOC and CRT monitoring walls. The motif is deliberate, especially in the `Timeline` component, and should be preserved when touching related UI.

## SEO and meta

`BaseLayout.astro` centralizes `<title>`, meta description, canonical URL, OG and Twitter tags, the RSS discovery link, and a site-wide `Person` JSON-LD block. That block is sourced from `src/data/hero.ts`, `about.ts`, `contact.ts`, and `skills.ts` (`skillCategories` feeds `knowsAbout`). Pages pass `title`, `description`, and `noindex` props rather than duplicating head tags. `og:type` defaults to `"website"`. Post detail pages pass `ogType="article"` plus `publishedTime` (ISO string) to get `article:published_time`. Pages can also pass a `jsonLd` prop (an array of extra structured-data objects) to layer page-specific schema on top of the `Person` block:

- `blog/[slug].astro` and `interests/[slug].astro` each emit a `BlogPosting` per entry: headline, dates, `author` and `publisher` (both a `Person` pointing at `hero.name`, since Google's structured-data docs expect a `publisher` on Article types and a `Person` fits a single-author site better than an `Organization`), and keywords from tags.
- `blog/index.astro` emits a `Blog` block with a `blogPost` array, one `BlogPosting` summary per non-draft post. `interests.astro` emits an `ItemList` of `CreativeWork` summaries, each with a `url` pointing at its detail page. Both exist so a crawler or LLM tool can get the full list from the index page's JSON-LD alone.
- Every page's `description` prop doubles as its meta description and OG/Twitter description, so it reads as real ad copy for that page, including the two index pages. If the on-page intro copy (`src/data/pageIntros.ts`) changes, check whether the index page's `description` needs a refresh. They do different jobs and need not match word for word, but neither should go stale.

The structured-data setup exists so search engines and LLM web-search tools can assemble a fuller profile from the content than plain prose gives them. A new collection or index/detail pair should mirror it: per-entry `BlogPosting` (or equivalent) with `author` and `publisher`, an index-level list block, and a real per-page meta description.

## RSS

`src/pages/rss.xml.ts` (via `@astrojs/rss`) generates a feed from non-draft blog posts only. Interests is not included. `BaseLayout` links to it site-wide with `<link rel="alternate">`.

## Sitemap lastmod

`astro.config.mjs` reads blog and interests markdown frontmatter directly off disk (`astro:content` is not available at config-load time) to attach a real `lastmod` date to each sitemap URL. It skips files with `draft: true`. The matcher is a simple regex on the `date:` line, not a YAML parser, so unusual frontmatter (multi-line strings, oddly formatted quoted dates) can silently produce no `lastmod` for that entry. That is not fatal, since the sitemap entry just omits `lastmod`, but it is the first thing to check if a new post has none.

## Sensitive content guard

`scripts/check-sensitive.sh` greps the built `dist/` for a hardcoded denylist (currently a personal email and a compensation-related term) and fails if it finds one. New strings to keep out of the public build go in the `DENYLIST` array in that script.

## Deploy

`.github/workflows/deploy.yml` builds on push to `main`, runs the sensitive-content check against `dist`, then deploys to GitHub Pages. The sensitive-content check is the only automated gate before deploy. There is no staging environment.
