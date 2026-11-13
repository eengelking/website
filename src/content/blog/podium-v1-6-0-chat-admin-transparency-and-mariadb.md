---
title: "Podium v1.6.0: Chat, Admin Transparency and MariaDB"
description: "Podium v1.6.0 adds a chat page where people talk to their orchestrators and watch orchestrators talk to each other, tells a person every time an Admin reads their content, reports on tool calls, cost and cache hits, and runs on MariaDB as well as SQLite and PostgreSQL."
date: 2026-11-11
tags: ["ai", "claude-code", "podium", "open-source", "security", "mariadb", "chat"]
draft: false
---

A Podium Admin can see a lot. Conversations, questions, plans, Activity history, recordings and links all pass through the console, and until this release an Admin could read any of it without the person it belonged to ever knowing. In v1.6.0, that stops. Every time an Admin reads a person's content, that person is told, and the build fails if a route breaks the rule. The same release adds a chat page for people and their agents, a lot more reporting, and a third database.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>A new chat page is an easy way for a person to talk to their orchestrators and to watch the conversations between two or more of them. A "Who can read what" modal explains access.</li>
    <li>Every Admin read of a person's content now notifies that person, in the console and in the reporter. A build check fails when a route returns a person's content to an Admin without the notice.</li>
    <li>Admin reporting covers tool calls, failure rates, cost, cache hit rate and more, and each person gets a "My usage" page with only their own figures.</li>
    <li>Podium runs on MariaDB 11.4 as well as SQLite and PostgreSQL, behind the same storage interfaces and the same contract tests.</li>
  </ul>
</div>

## Chat

The chat page is an easy way for a person to communicate with their orchestrators, and to observe the communications between two or more orchestrators. Subagents are part of it too. A new agent shows up in People and Agents as soon as it launches and leaves when it closes, and chat data follows the harness's resume window. A button on the orchestrator page opens a direct chat, and orchestrators called into a channel can now answer in it.

<figure>
  <img src="/images/blog/podium/podium-chat-160.jpg" alt="The Podium Chat page in dark mode. A sidebar lists the channels General and My group, a direct message named Lower Left, GH-Runner, and People and Agents rows for five orchestrators. The open thread is a conversation between those two orchestrators. GH-Runner's long reply reports measurements of the CI host: eight runners, the CPU and memory each end-to-end run uses, and what nine concurrent runs would need. Lower Left answers with a plan to run three shards at once. A box under the thread reads Add to this conversation, with a Send button." />
  <figcaption>An orchestrator on my laptop asks the agent on the CI runner host to measure it, then uses the answer to decide how many end-to-end shards to run at once.</figcaption>
</figure>

A page where people and agents talk raises the question of who can read it. A "Who can read what" modal answers it in the console, so nobody has to dig through the docs to find out.

## Admin reads always notify the person

Admins get a lot of power in Podium so that they can stop a failure, and that power should come with a guardrail at every chance. Being read-only doesn't make a read harmless. A conversation can hold source code, paths and decisions the person never meant to share. So no Admin read is quiet, and this release makes that a rule with no exceptions.

Every time an Admin sees a person's content, that person is told, in the console and in the reporter. That covers:

- Conversations, questions and plans
- Activity history
- Recordings and links
- Anything an Admin stops or deletes

On OpenCode the reporter's notice is now a line that stays, where it used to be a toast that disappears. The notice goes to the person and never to the model.

A promise like that is only as good as the next route someone adds. So the build now fails if a route returns a person's content to an Admin without the notice. A new endpoint can't quietly skip it.

## Reporting, for Admins and for everyone

The Admin reports now cover:

- Tool calls, failure rates, permission prompts, tool duration and concurrency
- Cost per call and per session, and the token split
- Cache hit rate and context fullness
- Answers sent and how long they waited

<figure>
  <img src="/images/blog/podium/podium-reporting-160.jpg" alt="The Podium Admin Tools report in dark mode, with a sidebar whose Reporting group lists Usage, Spend, People and groups, Sessions, Tools, Harness updates, Failures and Admin activity. Tools is selected. Four figures read 148,016 tool calls, 1,015 sessions, 86 median calls per session and 310 at the 90th percentile. A bar chart shows tool calls by day over 30 days, and a Calls by tool table starts with Bash at 64,291 calls, 43.4 percent, split into Claude Code and OpenCode columns." />
  <figcaption>Bash is 43% of the 148,016 tool calls in the last 30 days, and the page keeps only tool names and counts, never arguments, paths or commands.</figcaption>
</figure>

Two of the additions are about change over time. Podium detects features that break after a harness update, and it shows the spread of versions and platforms across the people on a server. Report tables sort by any column header.

Each person also gets a "My usage" page with only their own figures. That fits the previous section: Admins get the fleet view, and a person can see their own numbers without going through one.

<figure>
  <img src="/images/blog/podium/podium-myusage-160.jpg" alt="The Podium My usage page in dark mode. A line under the title reads that only you can see this page. Filters set the period to the last 30 days, grouped by day and broken down by model. A Spend by day section shows 3,525.22 dollars spent in the period and 881 sessions started, above a bar chart of daily spend that peaks at 675.56 dollars, then a table of sessions, tokens in, tokens out and cost for each day and model." />
  <figcaption>The page is the person's alone, and it says plainly that spend is estimated from tokens, not from a bill.</figcaption>
</figure>

## A third database

v1.5.0 put the database behind a contract with two adapters. v1.6.0 adds a third. Podium now runs on MariaDB 11.4 as well as SQLite and PostgreSQL, behind the same storage interfaces and tested by the same contract. Last release I said the groundwork the PostgreSQL adapter laid was the groundwork a MariaDB adapter would use, and that turned out to be true.

Running one more adapter through the same tests found one more difference. SQLite and PostgreSQL generated group ids differently, and that's fixed.

## The rest of the stack

Node, TypeScript, React, Express and the rest of the dependencies are on their latest versions.

## Smaller things that add up

- **OpenCode wall fixes.** A closed OpenCode session's card is removed within about 10 seconds. The card shows the session name, and the model chip stays inside it. A finished OpenCode agent no longer keeps a failure record, which matches Claude Code.
- **`/podium config` opens the settings window in every harness.** Claude Code's Edit-tool permission dialog in manual mode is announced to Podium, and a running one-off Bash command shows in the Activity feed before it finishes. Reporter logic that was copied between harnesses moved into `plugin/core`.
- **Redaction.** A long quoted secret value in a long text could miss redaction, and now it doesn't.
- **A test lists every fleet route that writes without a token.** `dist/` is left out of CodeQL and SonarCloud analysis, since `plugin/` is scanned.
- **Faster, steadier tests.** The end-to-end suite is sharded so a run finishes in a fraction of the time. Two specs that failed in a full run and passed alone are fixed, and specs no longer use a real sleep or clock-derived data.
- **Console polish.** The display controls moved into a "Wall options" drawer, and Admin summary figures get dividers like the wall's KPI row. The "silent" reporter state has better contrast in the light theme, and the answer poll stops while the tab is hidden.
- **Admin > About** shows the server and reporter versions.
- **Docs.** `docs/PATTERNS.md` lists the development patterns, and all documentation was reviewed against the code.
- **A `podium-pre-release` skill** and issue templates for a milestone's closing issues.

## Try it

Podium is free and open source under the MIT license, at [github.com/eengelking/podium](https://github.com/eengelking/podium). The [v1.6.0 release page](https://github.com/eengelking/podium/releases/tag/v1.6.0) has the full changelog. If something here doesn't work on your setup, open an issue.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Chat gives a person, their orchestrators and their subagents one place to talk, with a modal that says who can read what.</li>
    <li>Every Admin read of a person's content notifies that person, and a build check fails if a route skips the notice.</li>
    <li>Admin reports now cover tool calls, cost, cache hits and wait times, and each person has a "My usage" page of their own.</li>
    <li>MariaDB 11.4 is a third storage adapter, tested by the same contract as SQLite and PostgreSQL.</li>
  </ul>
</div>
