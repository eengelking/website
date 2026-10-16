# Changelog

All notable changes to this site are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The site has no tagged releases yet. Everything so far sits under Unreleased, grouped by kind of change, with the PR number where there is one. The history was reconstructed from the git log on 2026-10-16.

## [Unreleased]

### Added

- Personal site built with Astro and React islands, with a scroll-driven career timeline and searchable skills. (2026-07-02)
- Scroll-reveal About section and a reworked color palette.
- Core SEO plumbing for the site. (#1)
- Blog and interests collections, each with a list page, detail pages, `draft` support, and a shared `PostList` search box. (#2)
- Structured data for posts and index pages: a `BlogPosting` per entry, a `Blog` block on the blog index, and an `ItemList` on the interests index.
- GitHub and YouTube links in the header nav and in the `Person` JSON-LD.
- Typing-terminal animation on the header brand.
- Inline code styling in post bodies, an opinions disclaimer, and support for figures and callouts in post bodies. (#3, #7)
- Blog posts on diskless encryption (NBDE), a live-cluster CI/CD pipeline, CVSS base scores versus environmental scores, the CIA triad, a race condition, IOPS, untested backups, and moving from punch cards to prompts, among others. (#3, #4, #5, #7, #23)
- Interests posts: a deja vu thought experiment and "What I Was For". (#14, #31)
- "The Moat Is Drying Up" blog post, first as a draft and then published. (#26, #28)
- "Podium: A Control Room for Claude Code" blog post, the launch announcement for Podium, with four screenshots.
- Skills categories for UX/UI Design and Research, and skills for MCP, RAG, self-hosted model tooling, and rapid AI prototyping. (#11, #12)
- Dedicated `/projects` page with search. (#21)
- Portrait photo in the hero. (#22)
- Projects: localscore (#6), Ohrwurm and Readyband (#20), two more on the new projects page (#21), and Podium (#34).
- `write-post` skill for drafting blog and interests posts, refined over time with TL;DR and Key Takeaways callouts, hooks, screenshots, a fact sweep, LinkedIn companion posts, and notes on voice. (#2, #7, #19, #24, #27, #29, #30)
- `CLAUDE.md` documenting the Git workflow, including branch cleanup after a merge. (#10, #13, #16)
- Claude Code tag on localscore, the K8s VM operator, the terminal proxy, and Readyband. (#20)

### Changed

- Hero status line and subtext reworded, then reworked again to lead with current specialties. The title line was dropped when the portrait went in. (#22)
- Tag-chip filtering on the blog and interests pages replaced by a single search box.
- Blog and interests made indexable, with richer SEO and LLM-discovery signals.
- Interests link added back to the site nav now that the section has content. (#15)
- Projects sorted alphabetically, then the projects section removed from the homepage in favor of the `/projects` page. (#6, #21)
- Existing blog posts revised with a TL;DR, Key Takeaways, tighter hooks, and fixed links. (#8)
- The `write-post` skill now publishes by default instead of staying in draft. (#5)
- The moat post and the deja vu post revised for voice and audience. (#15, #18, #29, #30)
- Skills categorization rebalanced and deduplicated. (#9)
- `actions/checkout` and `actions/setup-node` bumped to v5. (#17)
- `CLAUDE.md` rebuilt on the standard from `eengelking/agent`, with architecture notes moved to `docs/ARCHITECTURE.md` and a staging file added at `docs/ISSUES.md`. (#35)
- `linkedin/` scratch directory ignored so local post drafts stay out of the repo. (#25)

### Fixed

- Stat strip rendering with server-side rendering and with JavaScript disabled. (#1)
- UTC date rendering bug in post dates.
- Stale index meta description.
- Intro width on post pages. (#3)
- Stale roadmap links in a revised blog post. (#8)
- Grammar in the moat post and a setting-continuity error in "What I Was For". (#30, #33)

### Removed

- Blog and interests links from the nav while there was no content, since restored. (2026-07-03)
- Placeholder outside-of-work interests entry. (#14)
- GitHub links on the Ohrwurm and Readyband project cards. (#20)
