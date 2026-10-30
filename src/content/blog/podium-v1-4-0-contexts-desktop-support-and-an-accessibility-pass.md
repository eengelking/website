---
title: "Podium v1.4.0: Contexts, Desktop Support and an Accessibility Pass"
description: "Podium v1.4.0 moves every database call behind async adapters, adds kubectl-style contexts for switching servers, supports the Claude desktop app and Windows 11, and ships a browser test for every console feature along with a real accessibility pass."
date: 2026-10-30
tags: ["ai", "claude-code", "podium", "open-source"]
draft: false
---

Every database call in Podium now goes through an async interface. SQLite is still the only database, and nobody running Podium today will notice a thing. But a synchronous SQLite call can't be swapped for a network database without touching every place that makes one, and v1.4.0 is where that stopped being true. It also adds Windows 11 and Claude desktop app support, and an accessibility pass over the console.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Every database call now goes through async Storage interfaces. SQLite is still the default and the only adapter, but PostgreSQL and MariaDB can be added without rewriting the callers.</li>
    <li>Podium has contexts, so you can switch between servers the way you switch clusters with kubectl. The Claude desktop app and Windows 11 are supported, and every release attaches a zip the desktop app can install.</li>
    <li>A Cypress suite now tests every console feature in a browser, and the accessibility pass fixed page titles, focus, control names and contrast. Single-key shortcuts are off until you turn them on.</li>
  </ul>
</div>

## The change underneath everything

Every database call in Podium now goes through an async Storage interface. SQLite is still the default, and it's the only adapter there is. Nothing changes for anyone running it today.

With the interface in place, PostgreSQL and MariaDB become adapters instead of a rewrite. I haven't built either one yet.

Making every store call async has a cost, which is that a call you forget to await still compiles and silently does nothing useful. So there's now a `promise-misuse` checker that fails on an un-awaited store call.

## Contexts

If you've used `kubectl config use-context`, this is the same idea ([Kubernetes, "kubectl config use-context"](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_use-context/)). A context names a Podium server, and you switch between them with one command instead of editing config.

## The Claude desktop app and Windows 11

Podium started life as a Claude Code mod, and the Claude desktop app works differently enough that it needed its own pass:

- Windows now finds the reporter's config file.
- A desktop session that starts before the client attaches can use messaging.
- Every release and nightly attaches `podium-reporter-<version>.zip`, because the desktop app installs plugins only from an archive.
- The docs and the console now cover the desktop install path.

## A browser test for every console feature

There's now an end-to-end Cypress suite with a test for each console feature, run in containers. An agent and a skill keep it current.

Some of what the console does is hard to reach in a test, like the Admin idle lock, the sign-in idle end and the lockout. Test-only timing variables let the suite reach all three.

## The accessibility pass

I went through the console page by page. Page titles and headings now follow the route, focus holds after sign-in, and control names match what they show. Contrast failures are fixed, and `npm test` now checks accessibility, so a regression fails the build.

The shortcut change is the one you'll notice. Single-key shortcuts are off by default now, and a new Shortcuts switch turns them on. WCAG 2.1.4 exists for this: a shortcut made of a single character key has to be something a person can turn off or remap, because for speech input users a spoken word can turn into a string of single-key commands if focus is in the wrong place ([W3C, "Understanding Success Criterion 2.1.4: Character Key Shortcuts"](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html)). The word "Shortcuts" opens a list of every key, so you can see what you'd be turning on.

## Smaller things that add up

- **Diffs open instantly.** The Files tab loads every changed file's diff in the background, so opening one has no wait.
- **Compaction is reported accurately.** An automatic compaction below 80% fill is a compact event, not a blowout. When Claude Code compacted a session itself, the card shows a blue "Comp" pill. Blowout events now record the context window and how full it was.
- **Team and Enterprise accounts report better.** Where Claude Code skips the classic hooks, the reporter now reports what it can. One non-messaging `claude -p` session no longer switches a whole machine to Off, and a choice answered in the terminal leaves the Respond modal as soon as the session runs again.
- **`/podium` explains itself.** It says why messaging is off and how the reporter signs in, and it names a mistyped option.

## Also in this release

- A performance audit with repeatable scripts
- SPEC 8.5 for the History page
- A split of `CLAUDE.md` into `CLAUDE.md` and `PROJECT.md`

## Try it

Podium is free and open source under the MIT license, at [github.com/eengelking/podium](https://github.com/eengelking/podium). The [v1.4.0 release page](https://github.com/eengelking/podium/releases/tag/v1.4.0) has the full changelog. If something here doesn't work on your setup, open an issue.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>All storage now goes through async interfaces, with SQLite as the default and only adapter, so PostgreSQL and MariaDB can be added later.</li>
    <li>Contexts switch between Podium servers the way kubectl switches clusters.</li>
    <li>The Claude desktop app and Windows 11 are supported, and every release attaches a zip the desktop app can install.</li>
    <li>A Cypress suite covers every console feature, and <code>npm test</code> now checks accessibility.</li>
    <li>Single-key shortcuts are off by default, which fixes a WCAG 2.1.4 problem.</li>
  </ul>
</div>
