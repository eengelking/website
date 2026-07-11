---
title: "That CVSS 10 Might Actually Be a Zero"
description: "A vulnerability scanner reports a 10.0 and everyone panics. Here's what that number actually measures, why it almost never describes your environment, and how the CVSS calculator can tell you the real story."
date: 2026-07-06
tags: ["security", "cvss", "vulnerability-management"]
draft: false
---

Someone runs a vulnerability scanner, a finding comes back with a CVSS score of 10.0, and the room goes quiet. Ten out of ten. Critical. Patch everything, tonight, before someone gets in. I've watched that reaction play out more than once, and almost every time, the panic is based on a number nobody actually understands.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>A "10.0" is a base score: worst-case math about the vulnerability alone, not a verdict on your actual risk.</li>
    <li>CVSS itself has changed shape twice (v2, v3.1, v4), and even two scorers using the same version can land on different numbers for the same CVE.</li>
    <li>Before treating a critical finding as an emergency, ask three questions: does this system hold anything worth stealing, does integrity or availability here actually matter, and is there a known exploit in the wild.</li>
  </ul>
</div>

That 10.0 is a `base score`. It's one input into a larger system, and by itself it tells you almost nothing about whether you're actually at risk.

## What the base score is actually measuring

The base score describes the vulnerability in a vacuum: how easy is it to exploit, does it need local access or can it be triggered remotely, does it need a valid user account first, that kind of thing. It says nothing about your network, your data, or what that particular system is even for.

Here's the part most people miss entirely: the base score is also built around the CIA triad, confidentiality, integrity, and availability. Every base score is really answering three questions at once. If an attacker pulls this off, how much confidential data can they read? How much can they change without permission? How much service can they knock offline? A "critical" vulnerability is critical because it scores high across some combination of those three. Take all three off the table and the math doesn't have anywhere left to go.

Take a disposable dev environment with no real customer data, nothing that needs to stay unmodified, and no uptime requirement because it gets rebuilt from a pipeline every morning. A vulnerability that would be a 10 on a production database is, in that box, close to a zero. Not because the vulnerability changed. Because none of the three things it threatens are actually there to threaten.

## Environmental and threat metrics exist for exactly this

CVSS isn't just the base score, even though the base score is the only number most scanners ever surface. The full spec has additional metric groups meant to adjust that number to your actual environment:

- **Environmental metrics** let you re-score confidentiality, integrity, and availability requirements for your specific system, instead of assuming worst case for all three.
- **Threat metrics** (called temporal metrics before CVSS 4.0) account for whether a working exploit actually exists in the wild, or whether this is still theoretical.
- **Supplemental metrics**, new in CVSS 4.0, capture things like whether exploitation requires physical presence or whether automation can chain the exploit at scale, without changing the score itself.

Apply those and a base score of 10 can land anywhere from 10 down to a 0, depending on what's actually true about the system it's sitting on. [FIRST](https://www.first.org/cvss/), the organization that maintains the CVSS spec, publishes calculators for [v2.0](https://www.first.org/cvss/calculator/2.0), [v3.1](https://www.first.org/cvss/calculator/3.1), and [v4.0](https://www.first.org/cvss/calculator/4.0) that walk through every one of these metrics and produce the adjusted score. Almost nobody uses them. Most teams see the base score in a scanner report and stop reading right there.

## Versions aren't interchangeable, and neither are scorers

Part of the confusion is that people treat "CVSS score" as one stable thing, when the scoring model has changed shape twice.

- **CVSS v2** didn't have a clean way to express "user interaction required," and its scoring bands were coarser. A lot of older CVEs still carry v2 scores that don't map cleanly onto how v3 or v4 would treat the same flaw.
- **CVSS v3** (and 3.1) introduced the scope metric, whether a vulnerability in one component can affect resources beyond its own security boundary, and tightened up the base metrics considerably.
- **CVSS v4**, released in late 2023, split things further: it separates out the supplemental metrics, reworked how user interaction is scored, and adjusted how the environmental group interacts with the base score so the final number reflects your environment more precisely instead of just tacking on a modifier.

NVD actually stopped assigning v2 scores to new CVEs on July 13, 2022, so you won't find a v2 score on anything published recently. What you will find, and what makes the point just as well, is disagreement between v3.1 and v4.0, and even between two organizations both scoring the same CVE under v3.1.

Take [CVE-2026-55200](https://nvd.nist.gov/vuln/detail/cve-2026-55200), an out-of-bounds write in libssh2's SSH packet handling that can lead to remote code execution. On the NVD detail page you'll see three separate CVSS entries sitting side by side: NVD's own v3.1 score of 8.3, VulnCheck's v3.1 score of 8.1 for the same flaw, and VulnCheck's v4.0 score of 9.2. Click into each vector string and you can see exactly where they diverge, NVD marks user interaction as required while VulnCheck's v3.1 vector doesn't, which alone accounts for most of the gap between 8.3 and 8.1. That's two people looking at the same bug and reading its exploitability metrics differently, before you even get to the environmental questions of whether it matters to you.

A scanner report showing "CVSS 9.8" doesn't mean anything on its own until you know which version produced it, who scored it, and whether it's the base score or an environmentally adjusted one. Two "9.8" findings from two different tools aren't necessarily describing the same thing even if the digits match, and none of the three scores on that libssh2 CVE say a word about whether your own systems even use libssh2 in a way that's reachable. That part is still on you to work out with the environmental metrics from earlier.

## What to actually do with a scary number

Before treating a critical finding as an emergency, it's worth answering three questions:

- Does this system hold data or capability an attacker would actually want?
- Does anything about integrity or availability here matter if it's disrupted?
- Is there a known exploit in the wild, or is this still a theoretical path?

If the honest answer to all three is "not really," the base score was never describing your risk in the first place. It was describing the vulnerability's worst-case potential against a target that has everything to lose. Most targets don't.

The scanner isn't wrong when it reports a 10. It just isn't finished telling you the story. The CVSS calculator is the part of that story almost nobody reads, and it's usually the part that tells you whether to lose sleep over a finding or close the ticket.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>The base score is one input, not a verdict. Environmental and threat metrics exist to tell you the rest of the story.</li>
    <li>CVSS scoring has changed shape twice, and different scorers can produce different numbers for the same CVE even within one version.</li>
    <li>A scary number on a system with nothing worth stealing and no known exploit in the wild isn't actually a scary finding.</li>
  </ul>
</div>

CVSS is one piece of a much bigger vulnerability management picture. I picked apart what confidentiality, integrity, and availability actually mean in [the next post](/blog/the-cia-triad-is-why-severity-means-anything), and later ran into a case where environmental scoring pushes a low score up instead of down, in [Environmental Scores Don't Only Go Down](/blog/environmental-scores-can-go-up-not-just-down). Topics still on the list:

- What a CVE actually is and why it's worth caring about beyond "it showed up in a scan"
- What CWE is and how it relates to a CVE
- Why CPEs matter for knowing which versions of a product are actually affected
- What a vector is and how it differs across CVSS versions
- Why NIST's NVD matters so much to software organizations worldwide, and the trouble NIST is currently having keeping up with it
- What MITRE is and its role in the CVE process

More topics will probably get added to that list as I go.
