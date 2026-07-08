---
title: "The CIA Triad Is Why Severity Means Anything"
description: "Confidentiality, integrity, and availability aren't security trivia, they're the three questions every vulnerability score is actually answering. Here's what each one means and why integrity is the one most people underrate."
date: 2026-07-07
tags: ["security", "cia-triad", "vulnerability-management"]
draft: false
---

In the last post I mentioned that a CVSS base score is built around three things: confidentiality, integrity, and availability. I glossed over what those actually mean and moved on to the scoring mechanics, but that's backwards. If you don't have a real sense of what those three words mean, no amount of environmental scoring or calculator walkthroughs is going to make a severity number feel meaningful. It'll just be a different number you don't understand instead of the first one you didn't understand.

The CIA triad is old, it's been the standard framework for describing information security since long before CVSS existed, and it's simple enough to explain in a few sentences. That's exactly why it's worth taking seriously: every vulnerability, every control, every incident report is describing some combination of these three things, and once you can name which one is at stake, severity stops being a mystery number and starts being a question you can answer yourself.

## Confidentiality

Confidentiality is the one everybody already understands, even if they've never heard the word for it. It's about who's allowed to read something. A confidentiality failure is data ending up in front of someone who shouldn't have seen it: a database dump leaked to the internet, an API that returns other customers' records if you change an ID in the URL, a misconfigured bucket sitting open.

This is the failure mode people picture when they hear "breach," and it's the one that makes headlines, because it's easy to describe to a reporter and easy to feel viscerally. Your data got out. Someone else has it now.

## Integrity

Integrity is about whether something is what it claims to be, and whether it changed without permission. Not who can read it, whether it can be trusted.

This is the one I think gets underrated, because a confidentiality failure announces itself. Data that's been read is still there, still correct, and you generally find out because someone got caught with it or it shows up somewhere it shouldn't. An integrity failure can sit there silently. A row in a database gets modified by someone who shouldn't have write access. A build pipeline gets a malicious step inserted into it and every artifact it produces from that point forward is compromised, but they all still build, still pass their checksums against each other, still look completely normal. A log file gets edited after the fact to remove the entry that would have shown what happened.

That silence is what makes integrity dangerous in a way confidentiality isn't. You can't respond to a problem you don't know exists, and integrity failures are specifically the kind that are engineered, or that simply happen, without anyone noticing right away. A supply chain attack against a package registry isn't a confidentiality problem, nobody's data got read. It's an integrity problem: the thing you pulled down and trusted wasn't what it claimed to be.

## Availability

Availability is the most literal of the three: can the system do the thing it's supposed to do, when it's supposed to do it. A denial-of-service attack is the obvious example, but availability failures don't have to be adversarial. A capacity problem that takes a service down under normal load is an availability failure too, it's just one caused by growth instead of an attacker.

Availability is also the one that's most visibly tied to cost. A confidentiality or integrity failure can sit undiscovered for months. An availability failure is usually obvious within minutes, because something that used to work stops working, and someone notices immediately.

## Why a score is really three scores in a trench coat

Go back to a CVSS base score and ask what it's actually measuring. It's not "how bad is this vulnerability" as some abstract quality. It's an estimate of how much confidentiality, integrity, and availability impact an attacker could achieve by exploiting it, combined into one number. A vulnerability that lets an attacker read arbitrary files scores high on confidentiality impact and probably low on the other two. A vulnerability that lets an attacker corrupt data in place, without necessarily being able to read any of it, scores high on integrity and low on confidentiality. They can land on similar overall scores while describing completely different failure modes.

This is also why the disposable dev environment example from the last post works the way it does. That box scored low once you actually applied environmental metrics, not because the vulnerability got weaker, but because none of the three things it threatens were actually present. No real customer data means nothing to read, so confidentiality doesn't matter. Nothing that needs to stay correct means nothing to corrupt, so integrity doesn't matter. Rebuilt from a pipeline every morning means nothing depends on it staying up, so availability doesn't matter. Take away all three targets and there's nothing left for the score to be measuring against.

That's the actual use of the triad day to day: it gives you a vocabulary for the question "does this matter here," instead of leaving you stuck reacting to whatever number a scanner hands you. A critical finding against a system where all three legs of the triad are genuinely at stake deserves the reaction it gets. A critical finding against a system where none of them are is a number describing a risk that doesn't exist in your environment, and now you have language for why.
