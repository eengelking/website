---
name: write-post
description: Interviews Ed about a rough set of bullet points and drafts a finished blog or interests post as a markdown file in this Astro site's content collections (src/content/blog or src/content/interests). Use this whenever Ed hands over bullets for a post, says something like "help me write a blog post about X" or "I want to write an interests post about Y", or asks to turn notes/an idea into a post for the site. Also use it if he asks to revise or polish a draft post that already exists in one of those directories.
---

# Write Post

Both the blog and interests sections of edengelking.com are live and indexable. He'll hand you a rough list of bullets — not prose — and wants help turning that into a finished markdown file that matches how the rest of the site is built and how he actually talks, staged as a draft until he says it's ready to go live.

## Step 1: Figure out which collection and interview Ed

Don't draft from the bullets right away. A list of bullets tells you *what* he wants to cover, not the shape of the piece, and drafting too early produces something generic that then needs to be re-argued from scratch.

First, confirm which collection this is for if it isn't obvious from what he's said:
- **blog** (`src/content/blog/`) — technical/professional writing: architecture, incidents, tools, career reflections.
- **interests** (`src/content/interests/`) — personal, outside-of-work topics.

Then ask whatever subset of these actually needs answering — skip ones the bullets already make obvious:
- What's the actual point of this post? What should someone remember after reading it?
- Who is this for — other engineers, a general audience, future-Ed?
- Roughly how long? A quick note (like `hello-world.md`) or something with real depth?
- Any companies, systems, incidents, or people that can be named, and anything that's off-limits?
- Is there a natural opening — a story, a specific moment? (Narrative incident posts should open on the hook, not a stated thesis — see Step 4's "tell them" note. "Lead with the idea directly" is only a live option for explainer-format pieces.)
- Is this one meant to go live once it's finished, or does he want it staged as a draft regardless of how it turns out? If he's not sure yet, that's fine, treat it as undecided and fall back to the stopping-point ask in Step 5.

Only move to drafting once you have a real angle, not just a topic.

## Step 2: Create a branch for the work

Once you know the collection and have a rough topic (you don't need the full interview finished yet), check out a new git branch before writing anything, so each post is isolated and easy for Ed to review or abandon independently:

- **Name format**: `<prefix>-<slug>-<date>`
  - prefix is `blog` for blog posts, `interest` (singular) for interests posts
  - slug is a short kebab-case topic identifier, 1-3 words, no filler (e.g. `kubectl`, `germany`, `incident-postmortem`)
  - date is `YYYYMMDD` (today's date)
  - examples: `blog-kubectl-20260704`, `interest-germany-20260704`
- Check `git status` first. If there are uncommitted changes unrelated to this post, flag it to Ed rather than silently carrying them onto the new branch.
- Branch off the current tip of `main` (`git checkout main && git checkout -b <branch-name>`), assuming `main` is clean and up to date. If Ed is mid-work on another branch when this starts, ask before switching away from it.

Do the actual `git checkout -b` yourself — don't just tell Ed the branch name and leave it to him.

**Exception — batch drafting:** if Ed says he's writing several posts together to publish as a batch, skip the per-post branch and stay on the current branch for all of them. In that mode, give each post a distinct `date` (don't let them all land on the same day — stagger them) so the batch doesn't read as a dump when published.

## Step 3: Read the room before you write

Before drafting, read one or two existing posts in the target collection (e.g. `src/content/blog/hello-world.md`, `src/content/interests/outside-of-work.md`) so the new post sits naturally next to them in tone and length. Ed's writing is understated and specific — concrete systems, eras, and details, not generic claims about "extensive experience" or "passion for technology."

## Step 4: Write like Ed, not like an assistant

This is the part that matters most and the easiest to get wrong. A post that reads as AI-written defeats the entire point of the section. Concretely:

- **No em-dashes. Zero. Not one, anywhere in the file** — not in the body, not in the title, not in the description. This is the single most common tell and the rule most likely to get missed by half-checking. Rewrite with a period, a comma, or parentheses instead. Before showing Ed any draft (new or revised), run `grep -n "—" <the file>` and fix every hit — don't rely on having "written carefully."
- **No "it's not just X, it's Y" constructions**, and no other symmetric-contrast crutches leaned on for rhythm rather than meaning.
- **No rule-of-three padding** — don't reach for a third adjective or example just to complete a triplet. Say it in one or two and stop.
- **No stock transitions** ("moreover," "furthermore," "in today's world," "at the end of the day").
- **Don't hedge both sides for balance** ("on one hand... on the other...") when Ed would just state the opinion.
- Prefer short, plain sentences over ones dressed up to sound impressive. If a sentence would look at home in a corporate blog post or an "I asked an AI to write about my job" parody, cut it.
- **Use bullets for enumerable content** — a list of failure causes, a set of discrete lessons learned, concrete steps taken — instead of burying it in a run-on sentence. It reads easier and the items stand out. But don't bullet a closing/"moral of the story" paragraph that's meant to land as one continuous thought building to a final line; breaking that up kills the payoff. When in doubt, ask whether the sentence is a list of separate things or a single idea building momentum, and only bullet the former.
- **Use `##` headers, but only when the piece has genuinely distinct topics, not just narrative beats.** A single-incident story (setup, complication, resolution, payoff line) should stay as flowing prose with no headers, like `earning-the-server-room.md` or `the-race-condition-that-ate-a-key.md` — chopping a one-story arc into sections fights the same momentum-building quality that already rules out bulleting a closing paragraph. Reach for headers on multi-part technical/architecture pieces where the content actually splits into separate subjects (e.g. the problem, how a specific mechanism works, how it's wired together, why it holds up) — see `the-key-that-never-touched-the-disk.md`. If you're not sure which kind of piece it is, ask: is this one continuous story, or several distinct things worth naming separately? Only header the latter.

- **Every post should "tell them, tell them, tell them what you told them," but what that looks like depends on format:**
  - **Narrative posts**: the opening hook *is* the "tell them what you're going to tell them" — it sets up the kind of problem this is without stating a thesis. Never add an explicit "in this post I'll cover..." sentence; that's a formulaic tell, not a hook.
  - **Explainer posts** (the ones that earn headers per the rule above): an explicit short preview paragraph before the first header is expected, not incidental — see the "so the key had to be generated once..." paragraph before `## The shape of it` in `the-key-that-never-touched-the-disk.md`.
  - **Every post, regardless of format**, needs the "tell them what you told them" close: a payoff line or short reflection that ties back to the opening problem (a closing bullet list of lessons, or a single landing line like the ending of `earning-the-server-room.md`). Keep it in Ed's voice, never a labeled "Conclusion" section.

If you're not sure whether a line sounds like Ed or sounds like a chatbot, read it out loud — Ed talks like someone who has fixed things at 3am, not like marketing copy.

## Step 5: Draft the file

- Filename: `src/content/{blog,interests}/<kebab-case-slug>.md`, slug derived from the title (reuse the branch's topic slug if it still fits, but the file slug should match the title, not necessarily the branch name verbatim).
- Frontmatter must satisfy the schema in `src/content.config.ts` (identical for both collections): `title`, `description`, `date` (`YYYY-MM-DD`, use today's date unless Ed says otherwise), `tags` (array), `draft` (bool).
  - Before picking tags, list every tag already used across the *other* files in the same collection (`grep -h '^tags:' src/content/{blog,interests}/*.md` or just read the frontmatter of each file) so the choice is informed by the real set, not just the one or two files you happened to look at earlier. Prefer reusing an existing tag over inventing a near-duplicate (`k8s` vs `kubernetes`). If none of the existing tags fit, propose the new one to Ed and confirm before adding it — tags are effectively a taxonomy for the site and drift is easy to introduce one post at a time.
  - Always write `draft` explicitly rather than leaving it out — the schema defaults to `false` if the field is omitted entirely, and an implicit default is not a decision anyone actually made. Set its value from whatever Ed said in Step 1: if he already gave a publish intent, write that in on the very first save instead of parking it at `true` out of habit. If he was undecided in Step 1, use `true` only as a placeholder until the stopping-point ask below resolves it, not as a blanket default applied without asking.
- Write `description` as real ad copy (it becomes the page's meta description and social preview text), not a restatement of the title.
- Before finalizing, check the draft doesn't contain anything on the denylist in `scripts/check-sensitive.sh` (currently Ed's personal email and compensation figures) — if the topic naturally brushes up against either, flag it to Ed rather than silently omitting.

Write the file directly into the repo once drafted. Then show Ed the rendered result and ask what he'd change — treat the first pass as a draft to react to, not a final answer.

**If publish status wasn't already settled in Step 1, ask about it exactly once per post — the first time it reaches a real stopping point** (Ed stops requesting changes and the piece reads as complete, not a skeleton). At that single moment, ask directly whether to keep `draft: true` or flip to `draft: false`; don't assume either way, and don't let it slide by just because the content is done. If he's unsure, staying in draft is the safer default.

After that first ask, the question is answered — don't repeat it on every subsequent tweak. If Ed comes back later (same session or a new one) asking for a typo fix, a reworded sentence, or any other small edit to a post whose publish status has already been decided, just make the edit and leave `draft` alone. Only bring publishing up again if:
- Ed asks about it directly, or
- The edit is substantial enough to change whether the post is actually ready for the first time — e.g. he asked you to flesh out a rough outline into a real piece, not just polish something already complete.

The goal is to ask exactly when it's a real decision and stay quiet otherwise — repeating it on every revision is noise, not carefulness.

## Step 6: Know what actually gates publication

Blog and interests are live, indexable sections (Nav links visible, in the sitemap, no `noindex`), and both have individual detail pages (`/blog/<slug>`, `/interests/<slug>`) that link out from their index. Both collections gate publication the same way now: `getCollection()` in `blog/index.astro`, `blog/[slug].astro`, `interests.astro`, and `interests/[slug].astro` all filter on `!data.draft`, so a committed `draft: true` file exists in the repo and is safe to merge to `main` without going live. Never set `draft: false` as a side effect of drafting — that's a visible, shared-state change (it makes the entry crawlable/indexable) and should only happen when Ed explicitly says it's ready.

A new post is automatically picked up by the existing SEO wiring with no extra work needed per post: it flows into the index page's `Blog`/`ItemList` JSON-LD and gets its own `BlogPosting` (with `author`/`publisher`) the moment `draft` flips to `false`. Don't add per-post structured data or duplicate any of this — it lives at the page level in `blog/[slug].astro`, `interests/[slug].astro`, `blog/index.astro`, and `interests.astro`.

What's worth a second look after adding posts, not per post but periodically: whether the index page's `description` prop (the meta/OG description for `/blog` or `/interests`, passed to `BaseLayout` in `blog/index.astro`/`interests.astro`) and the on-page intro copy (`src/data/pageIntros.ts`) still describe what the collection actually contains. Four placeholder-quality posts read very differently from four real incident writeups — if a batch of posts meaningfully shifts what a reader would find in the collection, flag to Ed that the index copy might be worth revisiting, rather than letting it silently go stale.
