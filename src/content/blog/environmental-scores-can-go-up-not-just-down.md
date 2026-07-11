---
title: "Environmental Scores Don't Only Go Down"
description: "Environmental scoring usually turns a scary base score into a smaller number, but it can just as easily push a low, boring finding higher than it started. Here's a real example, and the open source tool I built to make it visible."
date: 2026-07-10
tags: ["security", "cvss", "vulnerability-management", "open-source"]
draft: false
---

A scanner hands you a 3.9. Low. The kind of finding that sits in a backlog for a quarter and nobody thinks twice about it. Now score that exact same CVE against what it's actually sitting on, honestly, and it can come back a 5.9, into medium territory. Same vulnerability, same day, no new exploit. The only thing that changed is which questions about the environment got an honest answer. The score didn't glitch. It found out the truth was worse than "low" implied.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Environmental scoring isn't a one-way dial toward "safer." Score an exposed, critical system honestly and the number can go <strong>up</strong>, sometimes into a whole new severity band.</li>
    <li>CVSS vectors are unreadable to anyone who hasn't memorized the spec, so I built <a href="https://github.com/eengelking/localscore">localscore</a> (open source, MIT licensed): a plain-English interview that rescores any vector or CVE against your actual environment, and calls out bad configurations on its own.</li>
    <li>Real example below: one CVE, base score 3.9 LOW, that scores 5.9 MEDIUM on one environment and 4.5 MEDIUM on another, purely because of how those environments are built. A low base score doesn't mean you're safe.</li>
  </ul>
</div>

I covered this from two other angles already, [why the base score alone means less than people think](/blog/that-cvss-10-might-actually-be-a-zero) and [what confidentiality, integrity, and availability actually are](/blog/the-cia-triad-is-why-severity-means-anything). Both posts made the same move: apply environmental metrics and the number usually comes down, because most systems don't have everything to lose. That's true often enough to be misleading. It implies a direction that doesn't actually exist. Answer the same questions honestly for a system that's genuinely exposed and genuinely critical, and the number moves the other way instead.

Part of why this stays hidden is that CVSS vectors aren't built for humans. `CVSS:3.1/AV:L/AC:L/PR:L/UI:R/S:U/C:L/I:N/A:L` is the real base vector for the CVE below, and it's a completely legible sentence if you've internalized what every two-letter code means. It's line noise to everyone else, including engineers who are good at their jobs and just don't live in FIRST's spec. Stack another dozen environmental codes onto the same string and it stops being readable by anyone who hasn't made a career out of it. The official calculators get you the number. They don't get you the story of why it moved, and "why" is the only part that helps anyone decide what to do next.

## Why I built localscore

Partway through this series I got tired of doing that math by hand and built the tool I actually wanted: [localscore](https://github.com/eengelking/localscore), a self-hosted app that turns a raw CVSS vector or CVE lookup into a plain-English interview instead of a form full of acronyms. It's open source and MIT licensed, so it's free to run, fork, or pick apart.

You name a "location," really just an environment: a dev box, a production cluster, whatever boundary matches how your systems are actually segmented. Each location answers a short interview once, how reachable it is, whether it needs a login, what happens if it goes down, what it holds, and every vector or CVE you check afterward gets automatically rescored against those answers. No hand-translating `MAV:X/MPR:L/MC:H` every time. It also flags its own red flags: if a location's answers describe critical uptime sitting on concentrated resources, or something internet-reachable with nothing beyond basic protections, it says so instead of silently plugging the numbers in.

## A low base score, in a bad environment

Here's a real one from NVD: [CVE-2026-12386](https://nvd.nist.gov/vuln/detail/CVE-2026-12386), a null-termination bug in Pardus Pen that can overflow a buffer. Base score 3.9, LOW. Local access, low privileges, user interaction required, and only low impact even in the best case for an attacker. On its own, a "patch it eventually" finding.

Score it against a "Development (Local)" environment where that dev box is actually a stepping stone to critical systems, and localscore doesn't bring the number down, it brings it up: 3.9 to 5.9, LOW to MEDIUM. Confidentiality and availability requirements jump because losing this data or this uptime would be catastrophic, and the modified scope flips from unchanged to changed because the box isn't isolated, it's a path to something that matters. None of that is a property of the vulnerability. It's a property of an environment that was never supposed to be treated as disposable and has been anyway.

A second location, "Production 2 (Cloud)," goes up too, 3.9 to 4.5, for a smaller version of the same problem: uptime there is critical, and one box is quietly acting as hypervisor, database server, and domain controller at once. Nobody puts "resource concentration" into a CVSS form on purpose. It's the kind of drift that happens gradually and only gets caught because localscore asks directly whether one system here controls a lot, or is just one small piece.

<figure>
  <img src="/images/blog/localscore-review-flag.png" alt="localscore flagging an environment's configuration for review, showing the interview answers that triggered the warning: critical uptime with concentrated resources, and direct internet reachability with only basic protections" />
  <figcaption>The interview answers behind that flag on Production 2 (Cloud): critical uptime on concentrated resources, reachable from the internet with nothing beyond the basics.</figcaption>
</figure>

Two other locations in the same set, "Production 1 (Cloud)" and "Development (Cloud)," score lower than the base instead, 3.7 and 2.8, the usual direction. That's the actual point: environmental scoring doesn't have a direction, only an honest answer. A dev box that's genuinely disposable scores low. One that's quietly become a path into production scores higher than the vulnerability ever implied alone, and the only way to know which one is in front of you is to actually ask.

<figure>
  <img src="/images/blog/localscore-environment-score-increase.png" alt="localscore showing CVE-2026-12386 with a 3.9 LOW base score, but a Development (Local) environment raising it to 5.9 MEDIUM and a Production 2 (Cloud) environment raising it to 4.5 MEDIUM" />
  <figcaption>Same CVE, same base score, four environments: two pushed higher, two pushed lower, depending entirely on what's actually true about each one.</figcaption>
</figure>

That's the trap in a single low score: it reads as "this system is fine" when it never described the system at all, only the vulnerability in isolation. The environment is still yours to account for, and sometimes accounting for it honestly is the part that should actually worry you.

## Don't let a low score be the whole story

A base score only ever describes the vulnerability in a vacuum. Environmental scoring closes that gap, and it's easy to assume it only closes in one direction because it usually does. It doesn't have to. A dev environment that's quietly a shortcut into production, or a "small" box that's grown into where three critical services all live, won't be protected just because the base score printed a friendly number first. That's the gap localscore exists to make visible, one location and one honest answer at a time, instead of something a team finds out about after the fact.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Environmental scoring can push a base score up, not just down, when a system is genuinely more exposed or more critical than the vulnerability assumed.</li>
    <li>CVE-2026-12386 proved it: base score 3.9 LOW, but 5.9 MEDIUM on one environment and 4.5 MEDIUM on another, both because of how those environments are actually built.</li>
    <li>A low base score only describes the vulnerability in isolation. Treat it as a green light and you've skipped the one question that actually mattered: what does this environment look like.</li>
  </ul>
</div>
