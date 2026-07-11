---
name: write-post
description: Interviews Ed about a rough set of bullet points and drafts a finished blog or interests post as a markdown file in this Astro site's content collections (src/content/blog or src/content/interests). Use this whenever Ed hands over bullets for a post, says something like "help me write a blog post about X" or "I want to write an interests post about Y", or asks to turn notes/an idea into a post for the site. Also use it if he asks to revise or polish a draft post that already exists in one of those directories.
---

# Write Post

Both the blog and interests sections of edengelking.com are live and indexable. He'll hand you a rough list of bullets — not prose — and wants help turning that into a finished markdown file that matches how the rest of the site is built and how he actually talks. Posts publish (`draft: false`) by default once finished; only stay in draft if Ed asks for that.

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
- Does he want this one held back as a draft instead of going live once it's finished (e.g. timing, still needs review, sensitive topic)? Default assumption is it publishes when done, so only worth asking if something about the topic or timing makes that not obviously true. If he's not sure yet, fall back to the stopping-point ask in Step 5.
- If the topic centers on a UI, a tool's output, or data that's genuinely hard to describe in prose (a dashboard, a diff, a before/after), ask whether he has a screenshot for it rather than assuming words alone will carry it. Tell him he can paste the image directly into the Claude Code chat, or if he'd rather save it himself first, give him the target path (`public/images/{blog,interests}/<descriptive-slug>.png`) so it's just waiting there when drafting starts.

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
- **On a complex or technical topic, succinctness is part of telling the story well, not a tax on it.** The instinct on a dense subject is to over-explain: restate the same point from three angles so it's sure to land, or walk through every supporting detail before making the point it supports. Resist it. Say the point once, clearly, with the one example or number that makes it concrete, and move on. If a paragraph and the one after it are making the same claim in different words, cut one. A reader trusts a piece more, not less, when it says a hard thing in a few plain sentences instead of hedging it across a page.
- **Use bullets for enumerable content** — a list of failure causes, a set of discrete lessons learned, concrete steps taken — instead of burying it in a run-on sentence. It reads easier and the items stand out. But don't bullet a closing/"moral of the story" paragraph that's meant to land as one continuous thought building to a final line; breaking that up kills the payoff. When in doubt, ask whether the sentence is a list of separate things or a single idea building momentum, and only bullet the former.
- **Use `##` headers, but only when the piece has genuinely distinct topics, not just narrative beats.** A single-incident story (setup, complication, resolution, payoff line) should stay as flowing prose with no headers, like `earning-the-server-room.md` or `the-race-condition-that-ate-a-key.md` — chopping a one-story arc into sections fights the same momentum-building quality that already rules out bulleting a closing paragraph. Reach for headers on multi-part technical/architecture pieces where the content actually splits into separate subjects (e.g. the problem, how a specific mechanism works, how it's wired together, why it holds up) — see `the-key-that-never-touched-the-disk.md`. If you're not sure which kind of piece it is, ask: is this one continuous story, or several distinct things worth naming separately? Only header the latter.

- **Every post should "tell them, tell them, tell them what you told them," but what that looks like depends on format:**
  - **Narrative posts**: the opening hook *is* the "tell them what you're going to tell them" — it sets up the kind of problem this is without stating a thesis. Never add an explicit "in this post I'll cover..." sentence; that's a formulaic tell, not a hook.
  - **Explainer posts** (the ones that earn headers per the rule above): an explicit short preview paragraph before the first header is expected, not incidental — see the "so the key had to be generated once..." paragraph before `## The shape of it` in `the-key-that-never-touched-the-disk.md`.
  - **Every post, regardless of format**, needs the "tell them what you told them" close: a payoff line or short reflection that ties back to the opening problem (a closing bullet list of lessons, or a single landing line like the ending of `earning-the-server-room.md`). Keep it in Ed's voice, never a labeled "Conclusion" section.

If you're not sure whether a line sounds like Ed or sounds like a chatbot, read it out loud — Ed talks like someone who has fixed things at 3am, not like marketing copy.

### Hooks that earn attention

A post competes for attention from two directions at once: a reader who doesn't know the subject and will bounce if the opening reads dry or academic, and a reader who thinks they already know the subject and will bounce even faster if the opening reads like a 101 recap. Neither one is won with an abstract thesis statement ("this post explains why X matters"). Open on the single most concrete, surprising thing in the piece instead: a specific number that moves in a direction nobody expects, a moment, a contrast that shouldn't be possible but is. If the piece has a real "wait, what?" fact buried in paragraph four, that fact (or a compressed version of it) belongs in sentence one, not paragraph four. The rest of the hook paragraph should earn the "why" in one or two more sentences, then get out of the way.

This matters most on explainer posts about a topic that has an expert audience and a novice audience overlapping, which is common for the technical/security-adjacent side of the blog. Write the hook so an expert can't dismiss it as "I know what this is" at a glance, because it's stated as a specific claim or scenario, not a topic label.

### TL;DR callouts

A TL;DR is a judgment call for any post, not a block reserved for dense technical explainers. The clearest case is a post that's genuinely dense (several distinct technical ideas stacked on each other, jargon that needs unpacking, a worked example with numbers): add it immediately after the hook paragraph, before any section headers, so a skimmer gets the payoff before deciding whether to commit to the rest. But a narrative post can earn one too, when compressing the premise and stakes up front gives a reader a reason to stay without flattening the story, see the note below on not spoiling the ending.

Don't reach for one on a short post or anything where the whole piece is already shorter than a TL;DR would be. It's a tool for giving a reader a reason to invest attention, not a default block to bolt onto every post regardless of length.

**On a narrative post**, write the TL;DR to cover the setup and the stakes, not the payoff. The whole point of a narrative close is that the final line lands because the reader arrived at it through the story, and a TL;DR that gives away that line before the story starts kills the one thing narrative format is for. Summarize the situation and what was at stake, stop before the turn or the ending beat.

Keep it to two or three bullets, each one a complete, specific claim (not a topic label): on an explainer post, the surprising thing the post is actually about, what any tool/mechanism involved does in one sentence, and the concrete proof point (a real number, example, or outcome) if there is one; on a narrative post, the situation, what made it hard, and what was actually at stake, without the resolution. Write it in raw HTML, not markdown bullet syntax, since markdown list syntax nested inside a raw HTML block isn't reliably parsed by this site's content pipeline:

```html
<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>The surprising claim, stated as a specific fact, not a topic label.</li>
    <li>What the tool/mechanism does, in one sentence.</li>
    <li>The concrete proof point: a real number or outcome from the example below.</li>
  </ul>
</div>
```

This depends on `.tldr` / `.tldr-label` CSS existing in the target page's `<style>` block (`src/pages/blog/[slug].astro` or `src/pages/interests/[slug].astro`). Check the target file for those classes before using this pattern; if they're missing (the two detail pages aren't guaranteed to stay in sync), port the rule block over from whichever page already has it rather than writing a new variant, so both collections render TL;DRs identically.

### Key Takeaways callouts, the bookend to a TL;DR

A TL;DR at the top and a prose "tell them what you told them" close (per the rule above) do different jobs, and on the same class of dense post that earns a TL;DR, they're often not enough on their own: the prose close is Ed's voice landing a final thought, not a scannable recap, and a reader who skimmed the middle has nothing to check their understanding against. For posts dense enough to have a TL;DR, add a matching **Key Takeaways** callout at the very end, after the closing prose, not instead of it:

```html
<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Restate the core claim from the TL;DR, now proven by the example instead of just asserted.</li>
    <li>The specific mechanism or number that made the case.</li>
    <li>What a reader should actually do differently now.</li>
  </ul>
</div>
```

Unlike the TL;DR, restating the post's own points here is the job, not a violation of the "don't repeat yourself" rule elsewhere in this skill, since this callout is explicitly the recap, read by someone who wants confirmation of what they just read or is jumping straight to the end. Same scope rule as the TL;DR: only on genuinely dense, multi-section explainer posts, never on a short post or a narrative/incident piece where a bullet recap would kill the payoff line's landing. Uses the same `.summary` / `.summary-label` CSS pair (styled identically to `.tldr`, just a distinct class so the two can be styled apart later if that's ever wanted), with the same cross-page sync check as the TL;DR block above.

## Step 5: Draft the file

- Filename: `src/content/{blog,interests}/<kebab-case-slug>.md`, slug derived from the title (reuse the branch's topic slug if it still fits, but the file slug should match the title, not necessarily the branch name verbatim).
- Frontmatter must satisfy the schema in `src/content.config.ts` (identical for both collections): `title`, `description`, `date` (`YYYY-MM-DD`, use today's date unless Ed says otherwise), `tags` (array), `draft` (bool).
  - Before picking tags, list every tag already used across the *other* files in the same collection (`grep -h '^tags:' src/content/{blog,interests}/*.md` or just read the frontmatter of each file) so the choice is informed by the real set, not just the one or two files you happened to look at earlier. Prefer reusing an existing tag over inventing a near-duplicate (`k8s` vs `kubernetes`). If none of the existing tags fit, propose the new one to Ed and confirm before adding it — tags are effectively a taxonomy for the site and drift is easy to introduce one post at a time.
  - Always write `draft` explicitly rather than leaving it out — the schema defaults to `false` if the field is omitted entirely, and an implicit default is not a decision anyone actually made. Set its value from whatever Ed said in Step 1: if he asked for it to be held back, write `true` on the very first save. Otherwise default to `false` — publishing is the assumed outcome once a post is done, not something that requires a separate go-ahead. If he was undecided in Step 1, use `true` only as a placeholder until the stopping-point ask below resolves it.
- Write `description` as real ad copy (it becomes the page's meta description and social preview text), not a restatement of the title.
- Before finalizing, check the draft doesn't contain anything on the denylist in `scripts/check-sensitive.sh` (currently Ed's personal email and compensation figures) — if the topic naturally brushes up against either, flag it to Ed rather than silently omitting.
- **Verify factual claims yourself before showing Ed the draft, don't wait for him to catch them.** Any external, checkable claim (a named CVE/CWE/vendor and what it actually is, a date something was deprecated/released/changed, a version number, a named tool's actual behavior) needs to be confirmed with a real fetch (WebSearch/WebFetch to a primary source, e.g. the vendor's own page, not just recalled from training data) before it goes in front of Ed, not after. If something can't be verified or turns out to conflict with what was drafted, fix it or flag it to Ed rather than presenting it as settled. This applies to every draft and every subsequent revision that adds a new factual claim, not just the first pass.
- **Embedding screenshots**: if Ed pasted an image into the chat, or pointed you at one saved under `public/images/{blog,interests}/`, embed it with a raw `<figure>`/`<img>`/`<figcaption>` block, not a bare markdown `![]()` (markdown images don't get a caption slot):
  ```html
  <figure>
    <img src="/images/blog/<descriptive-slug>.png" alt="<what's literally in the image, specific enough to stand in for it>" />
    <figcaption>A sentence of commentary on what the image shows, not a restatement of the alt text.</figcaption>
  </figure>
  ```
  This depends on `figure`/`figure img`/`figcaption` CSS existing in the target page's `<style>` block, same caveat as the TL;DR block above: check `src/pages/blog/[slug].astro` and `src/pages/interests/[slug].astro` both have it, and port the rule block over if one is missing it. Confirm `src/styles/global.css` still has a global `img { max-width: 100%; height: auto; }` reset before publishing screenshots — without it, an image wider than its column (common for tall UI screenshots) can overflow the page instead of scaling down, especially on mobile. If Ed's screenshot is a tall, narrow UI panel rather than a wide diagram, don't let it render at native pixel size; check the figure's rendered width looks proportionate next to the body text rather than dominating the page.
  Once images are in a post, don't sign off on the layout from reading markdown alone. Start the dev server, and if a real browser isn't available to check in, drive a headless one (`npx playwright install chromium` the first time if it's not already cached, then a short script with `page.screenshot({ fullPage: true })`) at both a desktop and a mobile viewport width, and look at the rendered output before calling the post done.
- **Writing the caption**: `alt` and `figcaption` do different jobs and shouldn't say the same thing. `alt` is a literal, complete description of what's in the image, for someone who can't see it. `figcaption` is visible commentary sitting right under the image, for someone who *can*, so it should add something the image alone doesn't: what to notice, why it's the interesting part, or a callback to the number/claim in the surrounding prose (see the "two pushed higher, two pushed lower" pattern, a caption that interprets the picture rather than narrating it). Keep it to one sentence, same voice rules as the rest of the post (no em-dashes, no throat-clearing "This screenshot shows..."), and never leave it as a copy of the alt text with the punctuation changed.

Write the file directly into the repo once drafted. Then show Ed the rendered result and ask what he'd change — treat the first pass as a draft to react to, not a final answer.

**If publish status wasn't already settled in Step 1, confirm it exactly once per post — the first time it reaches a real stopping point** (Ed stops requesting changes and the piece reads as complete, not a skeleton). Default to `draft: false` at that point; only ask if there's a real reason to think he might want it held back (sensitive topic, timing, explicitly unsure earlier). Don't ask just as a formality when publishing is clearly the obvious outcome.

After that point, the question is settled — don't repeat it on every subsequent tweak. If Ed comes back later (same session or a new one) asking for a typo fix, a reworded sentence, or any other small edit to a post whose publish status has already been decided, just make the edit and leave `draft` alone. Only bring publishing up again if:
- Ed asks about it directly, or
- The edit is substantial enough to change whether the post is actually ready for the first time — e.g. he asked you to flesh out a rough outline into a real piece, not just polish something already complete.

The goal is to ask exactly when it's a real decision and stay quiet otherwise — repeating it on every revision is noise, not carefulness.

## Step 6: Know what actually gates publication

Blog and interests are live, indexable sections (Nav links visible, in the sitemap, no `noindex`), and both have individual detail pages (`/blog/<slug>`, `/interests/<slug>`) that link out from their index. Both collections gate publication the same way now: `getCollection()` in `blog/index.astro`, `blog/[slug].astro`, `interests.astro`, and `interests/[slug].astro` all filter on `!data.draft`, so a committed `draft: true` file exists in the repo and is safe to merge to `main` without going live. `draft: false` is the default outcome of finishing a post per Step 5, not something that requires a separate go-ahead each time — but it's still a visible, shared-state change, so only set it once the post is actually done, not mid-draft.

A new post is automatically picked up by the existing SEO wiring with no extra work needed per post: it flows into the index page's `Blog`/`ItemList` JSON-LD and gets its own `BlogPosting` (with `author`/`publisher`) the moment `draft` flips to `false`. Don't add per-post structured data or duplicate any of this — it lives at the page level in `blog/[slug].astro`, `interests/[slug].astro`, `blog/index.astro`, and `interests.astro`.

What's worth a second look after adding posts, not per post but periodically: whether the index page's `description` prop (the meta/OG description for `/blog` or `/interests`, passed to `BaseLayout` in `blog/index.astro`/`interests.astro`) and the on-page intro copy (`src/data/pageIntros.ts`) still describe what the collection actually contains. Four placeholder-quality posts read very differently from four real incident writeups — if a batch of posts meaningfully shifts what a reader would find in the collection, flag to Ed that the index copy might be worth revisiting, rather than letting it silently go stale.
