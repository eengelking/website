---
title: "The CIA Triad Is Why Severity Means Anything"
description: "Confidentiality, integrity, and availability aren't security trivia, they're the three questions every vulnerability score is actually answering. Here's what each one means and why integrity is the one most people underrate."
date: 2026-07-07
tags: ["security", "cia-triad", "vulnerability-management"]
draft: false
---

A malicious step gets inserted into a build pipeline. Every artifact it produces from that point on is compromised. They still build. They still pass their checksums. They still look completely normal, right up until something downstream breaks in a way nobody can explain. Nothing about that failure announces itself the way a leaked database does. That silence is the whole danger, and it's a direct consequence of which leg of the CIA triad got hit: not confidentiality, integrity.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>A CVSS base score isn't one measurement, it's three collapsed into a single number: confidentiality, integrity, and availability impact.</li>
    <li>Confidentiality failures announce themselves, data got out and someone finds out. Integrity failures can sit silently corrupting things for weeks because nothing looks wrong on the surface.</li>
    <li>Once you can name which leg of the triad a finding actually threatens, severity stops being a mystery number a scanner hands you and becomes a question you can answer yourself.</li>
  </ul>
</div>

I touched on the triad in [the last post](/blog/that-cvss-10-might-actually-be-a-zero) and moved straight past it into scoring mechanics, which was backwards. If you don't have a real sense of what those three words mean, no amount of environmental scoring or calculator walkthroughs makes a severity number feel meaningful. It's just a different number you don't understand instead of the first one you didn't. The CIA triad has been the standard framework for describing information security since long before CVSS existed, and it's simple enough to explain in a few sentences. Every vulnerability, every control, every incident report is describing some combination of these three things, and once you can name which one is at stake, severity becomes a question you can answer yourself.

## Confidentiality

Confidentiality is the one everybody already understands, even if they've never heard the word for it. It's about who's allowed to read something. A confidentiality failure is data ending up in front of someone who shouldn't have seen it: a database dump leaked to the internet, an API that returns other customers' records if you change an ID in the URL, a misconfigured bucket sitting open.

This is the failure mode people picture when they hear "breach," and it's the one that makes headlines, because it's easy to describe to a reporter and easy to feel viscerally. Your data got out. Someone else has it now.

## Integrity

Integrity is about whether something is what it claims to be, and whether it changed without permission. Not who can read it, whether it can be trusted.

This is the one I think gets underrated, because a confidentiality failure announces itself. Data that's been read is still there, still correct, and you generally find out because someone got caught with it or it shows up somewhere it shouldn't. An integrity failure, like the build pipeline above, can sit there silently instead. A row in a database gets modified by someone who shouldn't have write access. A log file gets edited after the fact to remove the entry that would have shown what happened.

That silence is what makes integrity dangerous in a way confidentiality isn't. You can't respond to a problem you don't know exists, and integrity failures are specifically the kind that are engineered, or that simply happen, without anyone noticing right away. A supply chain attack against a package registry isn't a confidentiality problem, nobody's data got read. It's an integrity problem: the thing you pulled down and trusted wasn't what it claimed to be.

## Availability

Availability is the most literal of the three: can the system do the thing it's supposed to do, when it's supposed to do it. A denial-of-service attack is the obvious example, but availability failures don't have to be adversarial. A capacity problem that takes a service down under normal load is an availability failure too, it's just one caused by growth instead of an attacker.

Availability is also the one that's most visibly tied to cost. A confidentiality or integrity failure can sit undiscovered for months. An availability failure is usually obvious within minutes, because something that used to work stops working, and someone notices immediately.

## Why a score is really three scores in a trench coat

Go back to a CVSS base score and ask what it's actually measuring. It's not "how bad is this vulnerability" as some abstract quality. It's an estimate of how much confidentiality, integrity, and availability impact an attacker could achieve by exploiting it, combined into one number. A vulnerability that lets an attacker read arbitrary files scores high on confidentiality impact and probably low on the other two. A vulnerability that lets an attacker corrupt data in place, without necessarily being able to read any of it, scores high on integrity and low on confidentiality. They can land on similar overall scores while describing completely different failure modes.

This is also why the disposable dev environment example from the last post works the way it does. That box scored low once you actually applied environmental metrics, not because the vulnerability got weaker, but because none of the three things it threatens were actually present. No real customer data means nothing to read, so confidentiality doesn't matter. Nothing that needs to stay correct means nothing to corrupt, so integrity doesn't matter. Rebuilt from a pipeline every morning means nothing depends on it staying up, so availability doesn't matter. Take away all three targets and there's nothing left for the score to be measuring against.

That's the actual use of the triad day to day: it gives you a vocabulary for the question "does this matter here," instead of leaving you stuck reacting to whatever number a scanner hands you. A critical finding against a system where all three legs of the triad are genuinely at stake deserves the reaction it gets. A critical finding against a system where none of them are is a number describing a risk that doesn't exist in your environment, and now you have language for why.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>A CVSS score is really three scores at once: confidentiality (who can read it), integrity (can it be trusted), and availability (does it work when needed).</li>
    <li>Integrity is the one most people underrate, because unlike a leak, a corrupted or tampered system can look completely normal while it's happening.</li>
    <li>Name which leg of the triad a finding actually threatens, and severity stops being a number you take on faith.</li>
  </ul>
</div>
