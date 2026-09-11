---
title: "From Punch Cards to Prompts"
description: "A colleague didn't trust AI to touch his code, and he had a good reason not to. Here's the history lesson that talked him into it, and why it's the same trade developers have made four times before."
date: 2026-09-10
tags: ["career", "leadership", "ai"]
draft: false
---

A colleague of mine wouldn't let AI anywhere near his code, and he was falling behind the rest of the team for it, both in output and in the skill itself. He wasn't being stubborn. He told me straight out: he got into this field to be close to the code, to understand exactly what's happening under his hands, and handing that off to a model felt like giving that up. I didn't try to talk him out of the feeling. I walked him through where that feeling had already taken him before.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Punch cards to assembly to C to Go, and now AI/LLMs: developers have given up "closer to the metal" for something faster at every stage, and each time it felt like a loss before it felt like a win.</li>
    <li>The compiler is the clearest turn: it replaced a human manually translating logic into machine instructions, and nobody today mourns not doing that by hand.</li>
    <li>AI and LLMs are the next rung on that same ladder. The people who don't climb it aren't protecting their craft, they're repeating the one mistake every earlier generation of holdouts made.</li>
  </ul>
</div>

## Where we actually started

Programmers in the 1950s didn't type code into anything. They wrote out instructions by hand, then a keypunch machine turned them into patterns of holes on stiff paper cards, one card per line, fed into the machine in a stack that had to stay in exact order. Drop the deck and you'd lost your program. A single mistyped hole meant a whole new card, and a whole run of the program, often hours later once your stack got its turn in the machine's queue. There was no interface between a person and the machine except a literal, physical one.

That wasn't a design choice anyone loved. It was the only interface anyone had.

## Assembly gave programmers a language

Assembly language was the first real abstraction over that. Instead of encoding instructions as raw binary by hand, a programmer could write something like `ADD` or `MOV`, human-readable mnemonics that mapped directly to the machine's own instruction set. It was still tied to one specific processor's design, and it still required understanding the hardware underneath it in detail. But it meant a person could read their own program back and make sense of it, which punch-card binary never really allowed.

## The compiler removed the translator

The leap that actually matters most for this story came in 1952, when Grace Hopper built the A-0 System, generally credited as the first compiler. It took instructions written in a higher-level notation and translated them into machine code automatically, work that a person used to do by hand, one instruction at a time. FORTRAN followed in 1957, letting engineers write math-like expressions instead of hardware-specific instructions. Portability took longer to actually deliver, since every manufacturer's compiler had its own dialect until FORTRAN got a real standard in 1966, but by then a compiler, not a person, was doing the translation.

Compiling used to be a human job. Somebody sat there and manually turned logic into instructions the hardware could run, and a compiler did that job instead, faster and with fewer mistakes. Nobody today asks whether that took something away from programming. It just moved the work up a level, and the level it moved to is where every programmer already lives.

## We stopped noticing the ladder

From there the climb kept going and mostly stopped being remarkable. C gave programmers structure and portability but still made you manage memory by hand, which was a pain. Languages like Go and Python took even that away, along with the need to write your own data structures, your own networking stack, your own anything that a well-maintained library already does correctly.

My colleague told me he likes writing Go and understanding what's happening in it. Sure, we all do! I don't know a developer who doesn't want to understand what's happening in their codebase. However, I asked him if he's writing his own Go libraries, or hand-managing memory the way C requires. He wasn't, of course. Neither am I. We'd already made this trade, more than once, without ever framing it as giving something up.

Almost nobody actually reads the source of the libraries they depend on, especially the popular ones, and that's the real reason this transition is hard for people. I don't audit an import before pulling it in, and neither does he. We trust that enough of the community has used it, poked at it, and filed the bugs, and that collective thumbs-up is good enough to build on. Nothing stops a developer from extending that same trust to code an LLM writes. We just haven't built the habit yet, the same way nobody trusted a compiler's output on faith in 1952 either.

## The next rung

I think AI and LLMs are exactly this, the next rung on a ladder we've been climbing since punch cards. Not a replacement for engineering judgment, the same way a compiler was never a replacement for knowing what program you wanted to write. It's a tool that removes another layer of manual translation between intent and working code, the same trade Hopper's compiler made in 1952 and Go's designers made in 2009.

What changes is where the actual skill lives. I don't spend my time writing lines of code most days. I spend it on architecture: what the system needs to do, how the pieces fit, and how to direct and validate the tools that now write and check the implementation for me. That's a different skill than the one it replaced, and in a lot of ways a harder one, because now you're responsible for a result you didn't type character by character.

## What actually changed for him

My colleague sat with that for a minute. He told me he'd never thought about it that way, that in his head using AI meant skipping the understanding step entirely, not moving where that understanding gets applied. Once he saw it as the same trade he'd already made with Go and with every library he'd never personally read, he didn't have much of an objection left.

Over the following weeks he actually started using the tools instead of avoiding them. His output picked up, and his performance directing those tools improved fast, the same kind of judgment he already used every day deciding which library to trust and which one was worth reading closely.

Nobody remembers the programmers who insisted on punch cards after compilers existed. They didn't lose because the new tool was better on a spec sheet. They lost because the rest of the field moved up a level and kept building, while they stayed exactly where they were.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Every major leap in programming, punch cards to assembly, assembly to compilers, C to managed languages, moved the actual skill up a level instead of eliminating it.</li>
    <li>Developers already trust code they've never personally read, from every popular library they import. Extending that same trust to AI-written code is the same habit, not a new one.</li>
    <li>Treating AI as the next abstraction layer, not a threat to the craft, is what let my colleague catch up to his peers instead of falling further behind them.</li>
  </ul>
</div>
