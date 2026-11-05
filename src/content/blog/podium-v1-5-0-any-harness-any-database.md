---
title: "Podium v1.5.0: Any Harness, Any Database"
description: "Podium v1.5.0 stops being a Claude Code tool. It watches and answers OpenCode sessions through a harness contract anyone can implement, and it runs on PostgreSQL as well as SQLite through a storage contract that tests every adapter the same way."
date: 2026-11-05
tags: ["ai", "claude-code", "podium", "open-source", "postgres", "opencode", "harness", "interface", "adapter"]
draft: false
---

Until this release, every card on a Podium wall was a Claude Code session. It was technically possible to trick Claude Code into running different models, but it wasn't an ideal solution. In v1.5.0, a card can be an OpenCode session running a model on your own machine, sitting next to a Claude Code session running a frontier model, and the console treats both as first-class. The same release also puts the database behind a contract, so Podium can run on PostgreSQL instead of a SQLite file.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Podium now watches and answers OpenCode sessions as well as Claude Code. A new report format lets any harness say what it is and what it can do, and the console follows what it declares.</li>
    <li>Adding a harness is now a defined job with tests that fail when a step is missed. Pi and Codex will be added in a future update.</li>
    <li>Set <code>PODIUM_DB=postgres://...</code> and Podium runs on PostgreSQL. SQLite and PostgreSQL sit behind the same interfaces, and one test runs every adapter and diffs the results.</li>
  </ul>
</div>

## Why Podium stopped being a Claude Code tool

I want to use local models and frontier models at the same time, and have them work together. A small model on my own machine is good at some things and a frontier model is good at others, and I don't want to pick one console for each. That needs a console that doesn't care which harness a session runs in.

Podium started as a Claude Code mod, so that assumption was everywhere. The goals and non-goals in the spec were written for Claude Code alone. Once a second harness showed up, those words couldn't stand as they were, and the limits couldn't loosen by accident because a new harness happens to offer more controls. So the rule is now written for any harness. Podium watches. It answers a waiting session only in the ways that harness's own dialogs offer, and only where the Admin and the session's owner have both turned that on. It never types into a terminal, and it never switches an agent, interrupts a turn, or starts, stops or kills anything, even where a harness has a control for it.

## What OpenCode support covers

The OpenCode reporter subscribes to OpenCode's event bus and sends reports in a new v2 format. It not only watches but answers too: a permission prompt, a question, a message or `/compact`, from the console, under the same consent and respond levels as Claude Code.

It also reports what Claude Code's reporter does: effort, tokens per model, skills, failure detail, the activity feed, file diffs and session recording. OpenCode orchestrators can message each other. Each release and nightly attaches `podium-opencode-<version>.zip`, and the built reporter is tracked in `dist/` on `main`.

## The harness contract

A v2 report carries two blocks a v1 report never had. The `harness` block names the harness. The `capabilities` block declares what it can do: seven yes-or-no keys, plus the slash commands it has. The console reads those instead of assuming Claude Code.

This changes what a card looks like:

- A harness that says `context: false` gets no Context column and no Context row on the orchestrator page.
- A harness that says `effort: false` gets no effort meter.
- A key left out of the report means "not declared," which is different from "no," so the console falls back to what it knows about that harness instead of reading silence as a refusal.
- Cards show which harness runs each session, and a cost the harness computed itself says so under the figure.
- Resume and Fork come from a per-harness template on the server. OpenCode has no fork command, so its Fork cell reads "Not available."
- A machine running both reporters shows two reporter rows.

Adding a harness is now written down, and enforced. A new one needs:

- A reporter name and version range in the shared protocol.
- Reports with the `harness` and `capabilities` blocks.
- An entry in the console's harness table, and resume and fork commands on the server.
- A `plugin/<harness>/` folder, with its own test and type-check scripts.
- A reference file for the live test, which says how to start it, how to check its wiring, and one row for each of the 22 core scenarios it can't do, with the reason.

Two of those are checked by tests that fail the build, so a harness can't half-join. It's all or nothing. One fails when a folder under `plugin/` has no matching test scripts. The other fails when a harness has no live-test reference. Another test keeps `plugin/core/` from importing any harness, and one harness from importing another. CONTRIBUTING has a "Testing a reporter" section, and the live-test skill has an "Adding a harness" checklist, so other developers can contribute their own harnesses if they wish to do so.

Pi and Codex are the examples I keep reaching for. I haven't put either on a milestone yet, but they will get built. The point of the contract is that when one does, it's a defined set of steps and not a rewrite of the console. Future harness integartions should be much easier moving forward.

## The database is a contract too

v1.4.0 put every database call behind async interfaces and left SQLite as the only adapter. This release is the payoff. `PODIUM_DB=postgres://user:pass@host:5432/dbname` selects a `postgres` adapter built on the `pg` driver, and a plain file path is still SQLite and still the default. Nothing outside the adapter's folder imports `pg`, and a database from the previous release opens as before.

Two adapters that are supposed to behave the same only do so if something checks it, and that check is the part I care about most. One test, `adapters.test.ts`, runs the contract, the upgrade cases and a differential test over every adapter registered in one file, and neither adapter is the reference for the other. The differential test sends seeded random and edge-case calls through every adapter and diffs the results, the error classes and the order lists come back in. The edge cases are fractions, huge numbers, NUL characters, lone surrogates and concurrent transactions. The seed is printed so a failure replays.

It found real differences. SQLite stores a `NaN` as NULL and PostgreSQL stored it as `NaN`. A statement made outside a transaction could run in the middle of one. Text compares as bytes now (`COLLATE "C"`) so sorting doesn't depend on the locale someone created the database with. A separate check reads every list query and fails when two adapters order the same list differently, down to where NULLs sort. And CI refuses to skip an adapter: a run that leaves PostgreSQL out says NOT RUN, and it isn't a pass.

The first cut of the PostgreSQL adapter took about 67 statements to handle one report, and a snapshot of the whole wall took about 205. SQLite doesn't care, because a read costs microseconds in the same process. Over a network it costs milliseconds, and Podium makes many small reads. After batching them, a report is about 19 statements, and a snapshot is about 15 to 19. With a 1 ms hop to the database, a report's p50 went from about 230 ms to about 77 ms.

PostgreSQL has limits. There is one Podium server per database, enforced with an advisory lock that a second server hits and stops on. Podium doesn't move data from a SQLite file into PostgreSQL. There are no read replicas and no high availability (yet). MariaDB is not built, but the groundwork the PostgreSQL adapter laid is the groundwork a MariaDB adapter would use.

## The platform moved too

Podium now runs on Express 5, Node 26, TypeScript 7 and React 19. It's the kind of change you don't notice until it's overdue.

## Smaller things that add up

- **The live test is a skill.** It has 22 scenarios every harness runs, plus a list of exclusions for each harness. Scripts start any harness against a throwaway server, and there's an OpenCode demo script that starts Ollama and OpenCode with the reporter loaded.
- **A repository with no commits reports its branch.** It used to show nothing.
- **A session woken by a background agent no longer reads "waiting."**
- **An idle OpenCode session stays messageable,** and a long model name no longer overlaps the columns next to it.
- **`docs/DEPRECATIONS.md`** lists what is being removed and when, with a check that fails when a removal is overdue.
- **`npm run plugin:dev:claudecode`** builds the reporter and starts Claude Code with it loaded. The reporter moved to `plugin/`, with shared code in `plugin/core/`.

## Try it

Podium is free and open source under the MIT license, at [github.com/eengelking/podium](https://github.com/eengelking/podium). The [v1.5.0 release page](https://github.com/eengelking/podium/releases/tag/v1.5.0) has the full changelog. If something here doesn't work on your setup, or you want to build a reporter for a harness I haven't gotten to, open an issue.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Podium is harness-neutral. It watches and answers OpenCode sessions as well as Claude Code, and the console follows what each harness declares it can do.</li>
    <li>A new harness is a defined set of steps with tests that fail when one is missed. Pi and Codex are planned examples and aren't on a milestone yet.</li>
    <li>Storage is a contract with two adapters. SQLite is still the default, and <code>PODIUM_DB=postgres://...</code> runs Podium on PostgreSQL.</li>
    <li>One test runs every adapter and diffs the results, and CI refuses to skip one.</li>
    <li>A report on PostgreSQL went from about 67 statements to about 19.</li>
  </ul>
</div>
