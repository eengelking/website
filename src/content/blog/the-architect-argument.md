---
title: "The Architect Argument"
description: "A colleague was falling behind because he didn't trust AI to touch his code. Here's the conversation that changed his mind, and why lecturing him about productivity never would have."
date: 2026-09-10
tags: ["career", "leadership", "ai"]
draft: false
---

I had a colleague who wouldn't let AI anywhere near his code. Not "used it a little and didn't like it," actually wouldn't touch it. Meanwhile the rest of the team was shipping faster and getting sharper at using the tools every week, and he was quietly falling behind on both counts. I could have brought it up in a standup or a review, but that's the kind of feedback that makes someone defensive before you've finished the sentence. I asked for fifteen minutes one-on-one instead.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>A colleague refused to use AI in his work and was falling behind his peers on output and on the skill itself.</li>
    <li>He wasn't being stubborn for no reason. He got into development because he liked working close to the code, and AI felt like it was taking that away.</li>
    <li>I didn't argue with the premise. I asked him questions until he realized he'd already made the same tradeoff before, more than once.</li>
  </ul>
</div>

I didn't open with an argument. I asked him why he was so against it.

He told me he got into this field because he likes to code. He likes being close to the metal, understanding exactly what's happening under his hands. Handing that off to a model felt like giving up the part of the job he actually loved.

That's not a bad instinct. It's the same instinct that makes someone good at this work in the first place. So instead of telling him he was wrong, I asked him a few questions.

"Do you use punch cards to program computers?"

"No."

"Do you write assembly to program directly against the hardware?"

"No."

"Are you writing our web applications in C to generate HTML, or our APIs?"

"No."

"So what are you using to get to that lower level of work?"

"I enjoy writing code in Go, writing HTML, understanding what's happening there."

"And what's Go written in? Are you writing your own Go libraries?"

"No, I use existing, well established libraries and the latest version of Go."

"So we can agree you don't need to, or want to, write punch cards, assembly, or C to do your job today."

"Yeah."

That was the point. We've been climbing this ladder his entire career, and mine. A compiler is an abstraction layer between you and the hardware. So is a well-established library. So is Go itself, compared to C. Nobody mourns not hand-assembling instructions anymore, because the abstraction did what abstractions do: it let us move faster without making us worse at the job. I told him I think AI is the next rung, not a replacement for the ladder. It's a tool, the same way Go is a tool, the same way a compiler is a tool. Compilers didn't take anyone's job. They just moved the job up a level.

That's when I told him what I actually think we are now. I don't consider myself a developer anymore, not in the sense he meant it. I think of myself as an architect. He is too, whether he's decided to act like one yet or not. The lower-level thinking, the actual typing of syntax, isn't where the value is anymore. The value is in the architecture: how the pieces fit together, what the system should do, how you validate that it does it correctly and securely. I'm not writing lines of code most days. I'm writing the agentic loops that write, check, and ship the code, and that's a different and, frankly, harder skill than the one it replaced.

He sat with that for a second and said it was an interesting way to look at it, and that he'd have to think about it more.

He did. Over the following weeks he started actually using the tools instead of avoiding them, and his output and his skill with them both started catching up to where his peers already were.

What worked wasn't the compiler analogy by itself. It was getting him to walk through his own history and notice he'd already made this exact trade, more than once, and it had worked out fine every time. People don't change their mind because you're right. They change it because they talked themselves into seeing it, with you just asking the questions.
