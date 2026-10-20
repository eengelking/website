---
title: "Podium v1.2.0: What Three Days of Feedback Built"
description: "I published the Podium launch post on October 16 and shipped v1.2.0 three days later. It adds a live Kanban board, safe session forking, orchestrators that can message each other, and a release gate that now includes SonarCloud and CodeQL."
date: 2026-10-19
tags: ["ai", "claude-code", "podium", "open-source"]
draft: false
---

I published the Podium launch post on October 16. Three days later I shipped v1.2.0, the fourth release since ([Podium, "Releases"](https://github.com/eengelking/podium/releases)). Some of what was missing came from people who tried it, and some came from my own use. Most of this release is that list.

<figure>
  <img src="/images/blog/podium/1-kanban-board-1.2.0.jpg" alt="The Podium Board page in dark mode. A row of eight tiles reads 11 orchestrators live, 9 running, 2 waiting, 6 with plans, 38 subagents live, 12 running, 0 waiting and 43 total cards. Below them five columns named Pending, In progress, Review, Blocked and Done hold one card per plan step, each tagged with its orchestrator's name. The Review column holds two cards that read Waiting for your input." />
  <figcaption>The two cards in Review are the sessions waiting on a person, so the Board answers "what needs me" before it answers "what's running."</figcaption>
</figure>

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Update: <a href="https://github.com/eengelking/podium/releases/tag/v1.2.1">v1.2.1</a>, followed by <a href="https://github.com/eengelking/podium/releases/tag/v1.2.2">v1.2.2</a>, has been released since this post was written. This post covers <a href="https://github.com/eengelking/podium/releases/tag/v1.2.0">v1.2.0</a>, so see the v1.2.1 and v1.2.2 release notes for what changed after it.</li>
    <li>v1.2.0 came three days after the launch post and is mostly the feedback list: a Board that updates live, session names on the cards, the right project and branch on a moved session, and a safe way to fork a session.</li>
    <li>One person's orchestrators can now message each other, off by default and gated by rights the owner sets. A Traffic page shows who is talking and what they said.</li>
    <li>SonarCloud and CodeQL are now part of the release pipeline, and the findings were fixed before this version shipped.</li>
  </ul>
</div>

## The Board, and the names on the cards

The Board is a Kanban view of every orchestrator's plan. Each plan step is a card, and the columns are Pending, In progress, Review, Blocked and Done. It refreshes every two seconds in the screenshot above, and a row of eight tiles across the top counts orchestrators, subagents and cards for the whole fleet. A step an orchestrator has finished drops to the bottom of its plan, so the open work stays on the first page of a long one ([Podium, "v1.2.0 release notes"](https://github.com/eengelking/podium/releases/tag/v1.2.0)).

Two fixes were about the card telling the truth. A session you name in Claude Code now takes that name in Podium, and a `/rename` shows from the next prompt. And a session that the desktop app starts as a pre-warmed spare and later moves to a project used to keep the spare's name and no git data on its card. It now shows the project's name, path and branch within one git poll.

## Forking a session without touching the original

An agent that looks stuck is hard to question, because asking it something changes the session you're trying to investigate. The orchestrator page now has a Fork cell next to Resume that copies `cd <cwd> && claude --resume <id> --fork-session`. That flag creates a new session ID instead of reusing the original ([Claude Code Docs, "CLI reference"](https://code.claude.com/docs/en/cli-reference)), so the original is left alone. Podium never runs the command.

<figure>
  <img src="/images/blog/podium/4-session-forking-1.2.0.jpg" alt="The Podium orchestrator page for a session named adapter-rewrite-2, with a facts grid, a plan list and a table of subagents. The pointer rests on the Fork cell in the grid, which has opened a popup titled Starts a copy of this conversation in a new session, followed by five notes about what the copy does and does not carry over." />
  <figcaption>Hovering Fork lists what the copy leaves behind, including the permissions you approved, which you approve again in the fork.</figcaption>
</figure>

A fork is a copy of the conversation, not a sandbox. It works in the same directory, so file edits in it are real, and flags such as `--mcp-config` aren't restored. The popup says all of that before anyone pastes the command.

## Orchestrators that can talk to each other

This is the one that wasn't on anyone's list. A person's orchestrators on different machines can now send each other messages through Podium, and a new Traffic page draws who is talking to whom.

It's off by default. Authentication, the server's Orchestrator messaging flag, the reporter's `peers` option, and a right the owner gives that pair all have to be in place. A right goes one way, and it's one of No access, Can see, Can send with approval, or Can send. Rights only join two reporters with the same owner.

<figure>
  <img src="/images/blog/podium/2-traffic-1.2.0.jpg" alt="The Podium Traffic page in dark mode. A map shows three machines named ed-mbp, build-pi and ci-runner-01, each with its orchestrators, joined by lines of different weights and dash patterns that carry labels such as 5 messages and 3 messages, paused. A panel on the right shows the conversation between claude-dashboard and infra-notes with three messages, the last one held because the link is paused." />
  <figcaption>A paused link holds the newest message until the link resumes, and the label on the line says so.</figcaption>
</figure>

A message waits until the receiving orchestrator is idle, then starts a turn of its own under an opening line saying it's another agent's text, never the person's. It can't answer a question, approve anything or change a permission. Anything that looks like a secret is replaced with `[redacted]` on the sending machine before the text leaves it. After 10 round trips a person has to approve the next message, so two orchestrators can't keep going on their own.

<figure>
  <img src="/images/blog/podium/3-my-reporters-1.2.0.jpg" alt="The Podium My reporters page in dark mode. A Waiting for you section lists three requests: an Admin's proposal to let one reporter send to another with approval, an orchestrator's request for the right to send, and a message waiting for approval whose text includes a registry token shown as [redacted]. A table of four reporters with their system, messaging state and reporter version sits below." />
  <figcaption>The owner answers each request here, and the message waiting for approval already has its secret replaced.</figcaption>
</figure>

## What's underneath

SonarCloud and CodeQL are now in the pipeline, and a SonarCloud reliability finding failed the 1.2.0 release gate before the release went out. The fixes were the unglamorous kind: patterns that could backtrack on long input, a CodeQL alert about stripping HTML tags from a heading, and four accessibility findings, including a theme picker that handled arrow keys at the wrong level. One CodeQL alert is a false positive, and I've left it to dismiss instead of changing code to quiet it ([Podium, "v1.2.0 release notes"](https://github.com/eengelking/podium/releases/tag/v1.2.0)).

There are also design standards now, written as static pages in the repo and checked against the app by a parity script. A project skill checks UI work against them, another updates them only after my approval, and a read-only agent audits the whole app.

A few smaller changes:

- The footer shows which build is running, so a dev build reads `Dev: a1b2c3d4` above the version.
- With the reporter's `fileDiff` option and the Admin's File diff switch both on, a changed file in the Files tab opens its diff on the orchestrator page. Both are off by default, and redaction there is best effort.
- The docs are easier to read.

## Try it

Podium is free and open source under the MIT license, at [github.com/eengelking/podium](https://github.com/eengelking/podium). The latest release is [v1.2.2](https://github.com/eengelking/podium/releases/tag/v1.2.2), and its release page has the full changelog. If something is missing, open an issue. Three days is how long the last list took.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li><a href="https://github.com/eengelking/podium/releases/tag/v1.2.0">v1.2.0</a> shipped three days after the launch post, and most of it came from feedback: a live Board, session names and project details on cards, and a safe fork command.</li>
    <li><a href="https://github.com/eengelking/podium/releases/tag/v1.2.1">v1.2.1</a> and <a href="https://github.com/eengelking/podium/releases/tag/v1.2.2">v1.2.2</a> have been released since.</li>
    <li>A fork is a copy of the conversation that leaves the original alone. It shares the directory, so file edits in it are real.</li>
    <li>Orchestrator messaging is off by default, limited to one person's own orchestrators, redacts secrets before text leaves a machine, and asks a person to approve after 10 round trips.</li>
    <li>SonarCloud and CodeQL now gate releases, and their findings were fixed before v1.2.0 shipped, apart from one CodeQL false positive left to dismiss.</li>
  </ul>
</div>
