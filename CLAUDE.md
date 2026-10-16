# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Project Overview

Personal website for Ed Engelking II. It holds his profile, project list, skills, career timeline, and two collections of writing: a technical blog and an interests section. It is a static Astro site with React islands, deployed to GitHub Pages, so a merged PR goes live on the next Actions run with no staging step in between. See `docs/ARCHITECTURE.md` for how it is built.

## Shortcuts

The operator uses shorthand in place of typing a full request out. Case-insensitive, so treat any casing the same. Expand the shorthand below and act on it as if the full phrase had been typed. Add project- or user-specific entries as they come up.

| Shorthand | Expands to |
|---|---|
| `plmk` | "Please let me know if you have any questions or if I can provide any further context and/or information." |
| `wni` | "What is the next GitHub issue to resolve?" |
| `pmm` | "PR has been merged to main." |
| `cii` | "Please review outstanding docs/ISSUES.md and create GitHub issues for anything not yet tracked. Let me know when done." |
| `pnb` | "Please process the next batch of queued items." |

## Do Not

- Edit directly on `main` (for any change, no matter how small, a one-line doc fix included, or how informal, with no tracking issue) or merge a PR into `main` yourself. Both are always the user's call, no exceptions. See "Always Branch First" below.
- Commit secrets, API keys, tokens, or credentials.
- Force-push, skip commit safety checks, or bypass signing without the user's explicit, in-the-moment approval.
- Delegate any task via a fork, no matter how narrow or read-only it looks. No exception.
- Start implementing an issue just because it (or you) filed it. Filing and authorization are separate steps.
- Create a new standing doc when an existing one can hold the content.
- Document architecture in this file. Use `docs/ARCHITECTURE.md`.
- Record current-state facts or status narrative in this file. Facts belong in `CHANGELOG.md`; narrative belongs in commit history, PR descriptions, or `docs/ISSUES.md`.
- Silently pick a reading, or "fix" it in passing, when code and `docs/SPEC.md` disagree. Flag the contradiction and ask.
- Re-invoke `/code-review` a second time on the same diff "to confirm" a fix. There is no defined stopping rule for a fix, review, fix cycle, and the review skill's own finder/verifier fan-out is not guaranteed to converge on a repeat run. It can spawn a large batch of sub-agents and stall indefinitely. Verify fixes by running the project's own checks directly instead (see the Review (pre-PR) row below). If that fails, stop and ask rather than looping back into another review round.
- Hardcode page copy in a component. Edit the data module under `src/data/` instead.
- Put Ed's personal email or compensation figures anywhere in site content. `scripts/check-sensitive.sh` fails the deploy if they reach `dist/`, and its `DENYLIST` array is the list of what is off-limits.
- Commit a blog or interests entry without thinking about `draft`. The field defaults to `false`, so an entry with no `draft` line goes live on the next deploy.

## Always Branch First

Before the first `Edit` or `Write` of *any* change to this repo, check the current branch. If it is `main`, create or switch to a working branch before touching a single file. This holds regardless of size ("just a typo fix"), formality ("no issue for this, just drafting"), or how the request was phrased ("draft a revised README" is still a change once you start writing it to disk). The decision to skip a tracking issue and the decision to skip a branch are unrelated, and only the first is ever legitimate. See `git-branching` for the mechanics, including the pre-commit hook that backstops this rule technically rather than relying on memory alone.

Sync `main` (`git checkout main && git pull`) before branching. Don't assume it is current. Name branches `<topic>-YYYYMMDD` (for example `blog-revisions-20260710`), matching every branch in the repo's history.

## Skills

Procedural detail, the *how* behind the rules this file states, lives in skills, loaded on demand rather than carried in every session's context. "Orchestrator" means whichever agent is coordinating a piece of work (driving a single issue end to end, or running a parallel batch). "Sub-agent" means an agent it spawned to do a scoped piece of that work. For a single issue worked solo, there is only one agent, so both columns apply to it.

| Skill | Load it when... | Orchestrator | Sub-agent |
|---|---|---|---|
| `git-branching` | Creating any branch, for an issue, a sub-agent, or a batch integration branch | Creates the batch integration branch (if parallel) | Branches off `main` (solo work) or off the integration branch (parallel batch) |
| `github-pr-merge` | Opening a PR; running any merge command; proposing a release tag | Reviews and merges a sub-agent's PR into the integration branch; never merges into `main` | Opens its own PR; never merges any PR itself |
| `github-release` | Cutting an actual release once a PR has merged `main` to a releasable state | Runs the release steps | N/A. Releases aren't a sub-agent's job |
| `github-issue-filing` | Filing issues: grouping related reports, checking for duplicates | Runs standalone, on explicit request | Same as orchestrator |
| `github-issue-workflow` | Starting, resuming, or closing GitHub-issue-tracked work | Decides sequencing and whether a parallel batch applies | Follows the same checklist/Validation discipline within its own issue |
| `documentation-sync` | Before committing any change | Runs the batch-wide consolidation commit (if parallel) | Keeps its own PR's changes in sync |
| `documentation-bootstrap` | Backfilling or topping up a project's missing doc set (bulk scaffolding, not a single commit's worth of sync) | Runs the doc-type selection pass, sets the sequencing rule, and runs the parallel batch (integration branch, post-bootstrap validation) | Writes its one assigned doc type per the orchestrator's sequencing rule; no merge authority |
| `documentation-voice-guide` | Writing any prose for the project: docs, commit messages, PR descriptions, issue bodies | Yes | Yes |
| `development-commands` | Running tests/lint, starting the app for UI review, seeding a database | Yes | Yes |
| `git-safety` | Force-push, skipping commit checks, secrets review | Yes | Yes |
| `retrospective` | Asked for a retrospective, or "what went well/could be improved," after nontrivial or multi-agent work | Yes | Yes |
| `write-post` (local, `.claude/skills/write-post/`) | Ed hands over bullets for a blog or interests post, or asks to revise or polish an existing one, or asks for a LinkedIn post summarizing one | Yes | Yes |

## Working Style

- **Prefer acting to asking** when the request and the codebase together make the right move obvious. Ask when you're genuinely blocked: ambiguous intent, a decision only the user can make, or a destructive/hard-to-reverse action.
- **Verify with real runs, not just lint/build.** A passing type-check or test suite verifies correctness, not that the feature actually works. Where practical, run the thing and exercise the change before calling it done, and say so explicitly when you can't (no way to run the app, no browser access, etc.) rather than implying it was checked.
- **Leave no mess behind.** Stop dev servers you started, close browser tabs you opened, delete branches once their merge is confirmed. A task isn't finished just because the code is right. Clean up the process and session state too, and validate the cleanup completed and left no orphans behind.
- **Don't let a stale run fool you.** If you changed code, restart whatever's serving it before treating its behavior as evidence. Testing against cached or stale state produces false confidence.
- **If this project has a `docs/NON_NEGOTIABLES.md`, read it before starting any task.** Its constraints are absolute. They don't get traded away for convenience, ever.
- **Prefer a fresh session per PR or unit of work** rather than accumulating context across many PRs in one long-running session. A long session replays its whole accumulated transcript every turn. Starting fresh per PR keeps that small instead of letting it compound.
- **When fixing a bug in code, first write a test that reproduces the failure and confirm it fails for the expected reason, before writing the fix.** A test only ever run against the fixed code doesn't prove it would have caught the regression. This applies to code fixes specifically, not to documentation or other non-code changes. This repo has no test suite today, so for a bug here, say how you reproduced it instead.
- **When waiting on a background agent or task, wait for it properly rather than repeatedly checking its status in a loop.** Polling (check, wait a bit, check again) burns tokens re-sending the whole conversation on every check, for no benefit over a real blocking wait. An orchestrator managing sub-agents or background work is exactly where this loop tends to happen.
- **Before writing a one-off helper script, check whether `scripts/` already has one that does the job.** Run the candidate with `--help`/`-h` to confirm what it does rather than assuming from its name. If nothing fits, write the new script into `scripts/`, give it a `--help`/`-h` flag, and keep it there rather than deleting it once the task is done. A future agent solving the same problem should find it instead of re-writing it from scratch.

## Git & GitHub Workflow

Order of operations for any tracked change. The policy is the invariant that holds regardless of mechanics; the skill covers the how.

| Phase | Policy | Skill |
|---|---|---|
| Start | Branch first, synced from current `main`, named `<topic>-YYYYMMDD`. | `git-branching` |
| Review (pre-PR) | Applies only when the branch changes code (logic, scripts, config with behavioral effect). A docs/prose-only diff (`CLAUDE.md`, `README.md`, `docs/`, post and data-module copy, comments) has no code for `/code-review` to check and skips the review. A mixed branch still runs it, scoped to the code files. When it applies, run `/code-review` on the branch **exactly once** before opening the PR, then apply its findings with `--fix` (or explicitly defer or note larger, out-of-scope suggestions with reasoning). Never loop back into a second automated round to "confirm" the fixes. Verification of the fixed code is the orchestrator's own job, done directly against the project's real checks, not by re-invoking the skill. If that verification passes, move on to the PR. If it fails, stop and ask the user rather than re-running review. This caps the process at one review round plus one orchestrator-run verification pass. See "Do Not" for why a second round is off the table. Reserve post-PR `--comment`/`ultra` review for a genuinely separate pass (a deeper multi-agent review, or a check the user explicitly wants visible as PR comments), never as a stand-in for pre-PR confirmation. | `code-review`, `development-commands` |
| Pre-PR gate (this repo) | For any change that affects the build, run `npm run build` and then `./scripts/check-sensitive.sh dist` locally. Push to `main` deploys immediately and the sensitive-content check is the only automated gate in CI, so treat this as a gate, not an afterthought. | `development-commands` |
| Develop → PR | Changes land via PR; the user reviews and merges. Once a change is complete, has been through pre-PR review above, and passes its relevant checks, commit, push, and open the PR without waiting for a separate go-ahead. That is normal completion of the work, not a separate action to confirm. Commit as you go rather than batching everything into one commit at the end. Opening a PR is still a stopping point, not a launchpad. It doesn't authorize starting the next unit of work unprompted, and merging remains the user's call, always. | `github-pr-merge` |
| Merge & cleanup | A branch is deleted only after its merge is confirmed with `gh pr view`, not assumed from a chat message. Delete both the local and remote copy, since GitHub doesn't auto-delete on merge in this repo. Deleting the remote branch is a shared-state change, so confirm with Ed first. | `github-pr-merge` |
| Release (if applicable) | A deliberate step after a PR merges, never an automatic side effect of merging. This site doesn't cut releases. | `github-release` |
| Dangerous git actions | See Do Not. A prior approval doesn't carry forward to the next instance. | `git-safety` |
| Committing | Review staged changes for anything sensitive before committing, especially in files that don't look like they'd contain any. If a secret is committed anyway, treat it as compromised and flag it to the user for rotation rather than just removing it from the latest commit. | `git-safety` |
| Remote access | The `gh` CLI is available and authenticated. Use it for PRs, issues, and other GitHub operations rather than assuming it's missing. If a `git push`/`fetch`/`clone` fails with an SSH error (e.g. `git@github.com: Permission denied (publickey)`), this environment's SSH key isn't set up for GitHub. Switch the affected remote to HTTPS (`git remote set-url origin https://github.com/<owner>/<repo>.git`) and retry, rather than treating it as a dead end or asking the user to fix SSH first. | none |

## Issue Management

| Phase | Policy | Skill |
|---|---|---|
| Filing | Group related reports under one issue by root cause rather than one per symptom, but split back out when a report actually bundles more than one distinct Definition of Done. | `github-issue-filing` |
| Working | Work one open issue at a time by default. Closing one, even by a merged PR, doesn't authorize starting the next unprompted, unless the user has deliberately scoped a parallel batch, in which case an orchestrator may run multiple issues at once via sub-agents. Each sub-agent stays scoped to its own issue's files. Never let one touch a shared, single-section file (e.g. `CHANGELOG.md`'s `[Unreleased]` section). Independent agents editing the same lines is a guaranteed conflict. | `github-issue-workflow` |
| Starting | When told to start an issue (e.g. "review issue N and begin work"), maintain a live task list via TaskCreate/TaskUpdate for the entire duration of the work, every step, including any sub-agents to be spawned, with no exceptions. This is always visible progress tracking, not optional bookkeeping. If TaskCreate/TaskUpdate aren't available in the session (they're off by default on some models), don't fall back to informal status updates. Ask the user for permission to add `CLAUDE_CODE_ENABLE_TODO_TOOLS: "1"` to `~/.claude/settings.json`'s `env` block, make the edit once approved, and confirm the tools are now available before proceeding. | `github-issue-workflow` |

## Delegation & Sub-agents

- **Scope a sub-agent's authority to what you actually asked it to do.** A sub-agent asked to research or review should not commit, push, or open/merge a PR on its own initiative. Those actions belong to the coordinating session unless explicitly delegated.
- **A forked agent inherits its parent's entire conversation**, full context and full authority, including merge permissions, whether or not the task you gave it needs any of that (see Do Not). This has already caused real incidents (an unauthorized merge, corrupted files from forks racing on the same working directory). "It's just read-only," "it's just reviewing one PR," "the prompt only asked for one thing": none of these make a fork safe. A fork's authority isn't bounded by what its prompt asked for. Use a fresh, non-fork sub-agent for every delegated step instead, whether that's reviewing a PR, running a validation pass, or read-only research. When you spawn it, state its authority explicitly in the prompt ("report a verdict; you do not have merge authority for this"), not just its scope. Scope alone doesn't bound what an agent can decide to do.

## Writing Blog & Interests Posts

The `write-post` skill is the workflow for any blog or interests post, and it should trigger when Ed hands over bullets. Ed's voice rules and the interview steps live there, not here. Two rules sit above the skill because they protect the live site:

- Whether a new entry ships as a draft or goes live is set by the skill and Ed's say-so. Confirm with Ed before flipping `draft` on an existing entry, since that is a visible change.
- Post bodies get the same sensitive-content discipline as everything else (see Do Not).

## Commands

Project-specific commands. General guidance on running checks lives in `development-commands`.

- `npm run dev`: dev server at `localhost:4321`
- `npm run build`: production build to `./dist/`
- `npm run preview`: preview the production build locally
- `./scripts/check-sensitive.sh dist`: scan a build for denylisted terms. CI runs it before deploy.

There is no test suite and no lint or typecheck script. Use `npx astro check` or editor diagnostics for type errors.
