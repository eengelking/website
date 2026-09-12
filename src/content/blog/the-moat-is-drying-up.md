---
title: "The Moat Is Drying Up"
description: "Software used to take years of schooling and a decade of scars to be good at. AI has been slowing draining that moat, and I built a working certification-practice site in eight hours to prove it to myself."
date: 2026-09-16
tags: ["career", "ai"]
draft: false
---

I built a working product this month in eight hours, spread across two evenings. A certification practice site with drills and mock exams, the kind of thing I would have paid a company real money for a few years ago. It works. I use it. If I wanted to sell access to it, I could.

<figure>
  <img src="/images/blog/moat-cert-dashboard.jpg" alt="A dark-mode certification practice dashboard called Readyband, showing a KCNA exam page with bank coverage at 100%, 40 questions answered, an exam blueprint broken down by domain with mastery percentages, and a readiness gauge reading 1 of 4 domains scored." />
  <figcaption>Domain breakdowns, mastery tracking, a readiness gauge, this is the kind of dashboard a certification-prep vendor would charge a subscription for.</figcaption>
</figure>

That shouldn't be possible in eight hours. And the fact that it is tells you something bigger is happening to software than a productivity bump.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Software used to be a moat: years of schooling, then years more of hands-on scars, before you could build anything real. AI has drained a lot of that moat, fast.</li>
    <li>I built a working certification-practice site with drills and mock exams in about eight hours over two evenings, something I'd previously have paid a company for.</li>
    <li>If software stops being the moat, something else has to be, and I think it's data, which is why companies that don't lock theirs down are handing away the only thing AI can't already generate on its own.</li>
  </ul>
</div>

## What a moat used to buy you

A castle moat wasn't there to look nice. It bought time and made an attack expensive enough that most people didn't bother trying. Software has worked the same way for most of my career. Getting good at it took a degree, or a few years pretending you had one. Then more years of actually building things, breaking them, and getting paged at 3am to learn why. That combination, the schooling and the scar tissue, was the moat. It kept most people out, and it made the people who crossed it valuable.

## The moat is what's actually shrinking

I don't think software holds that line much longer. I'm not talking about AI writing boilerplate faster, I'm talking about the moat itself.

The certification site I built is the proof I needed. I wanted to sharpen my Kubernetes, security, and project management skills, so instead of buying a subscription to somebody else's practice platform, I built my own: real drills, real mock exams, tracking, all of it. Two evenings, roughly eight hours total, and it's not a toy. It's the kind of tool existing companies charge a monthly fee for.

That's not a story about me being clever. It's a story about what used to require capital, a team, and months now requiring an evening and a clear idea of what you want. Experienced engineers still have a real edge here, knowing what to build and how to check the output is still worth something. But that edge is thinner than it was even a year ago, and I don't think it holds forever either.

The skill doesn't disappear here, it moves up a level, the same way it moved when compilers took over from hand-written machine instructions. What's different this time is how far up the ladder that move reaches. It's not just changing how developers work. It's removing the reason a lot of software companies could charge money in the first place.

I honestly believe a lot of the software companies we know, use, and sometimes love are in real danger of not being relevant any longer.

## Why this makes people uncomfortable, including me

I've felt uneasy about this for a couple of years now, and I don't have it resolved. I don't know exactly what my job looks like in five years. My wife works in a completely different field, and she's asking herself the same question about her own work. I think almost everyone is going to be asking it soon, if they aren't already.

I think the discomfort I'm feeling is reasonable. It's not the same feeling as a punch-card programmer being annoyed that compilers existed. This is closer to watching the actual floor you built your career on start to move. I don't have a tidy answer for where that leaves me, and I'm suspicious of anyone who claims they do. For now, I'm just going to keep building things, pay attention to where this all goes, and figure out my next move as it gets clearer. I know that's not a satisfying answer. It's just an honest one.

## If software isn't the moat, what is

The moat doesn't disappear. It moves. And I think it moves to data.

Most major models have already ingested the readily available internet. Meta's own paper on LLaMA lays out the mix: Common Crawl, GitHub, Wikipedia, books, ArXiv, all scraped, filtered, and folded into training ([Touvron et al., "LLaMA: Open and Efficient Foundation Language Models"](https://arxiv.org/abs/2302.13971)). The next round of gains has to come from somewhere, and I expect AI companies, OpenAI, Anthropic, Google, Microsoft, and whoever else is still standing, to start paying for it directly: licensing deals, human data-labeling contracts, arrangements to farm fresh, real-world data instead of recycling what's already been scraped.

I'd be careful about the alternative, which is training on AI-generated data. Researchers already have a name for what happens when a model trains on its own output, or another model's output, across successive generations: model collapse, where the model gradually loses the rare, real-world detail in its data and drifts toward generic, repetitive output ([Shumailov et al., "AI models collapse when trained on recursively generated data," Nature](https://www.nature.com/articles/s41586-024-07566-y)). That's not a hypothetical risk. It's a documented one, and I don't think anyone serious wants to lean on synthetic data at scale until it's better understood.

That's why data is becoming the thing worth protecting, and companies are already reacting like it. Cloudflare started blocking AI crawlers by default in July 2025 and opened a marketplace, Pay Per Crawl, where publishers can charge AI companies per page instead of letting them scrape for free ([Cloudflare, "Cloudflare Just Changed How AI Crawlers Scrape the Internet-at-Large"](https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/)). The New York Times sued OpenAI and Microsoft back in December 2023 over the exact question of whether millions of its articles could be ingested for training without permission or payment, and that case is still working through discovery in the Southern District of New York ([Wikipedia, "The New York Times v. Microsoft and OpenAI"](https://en.wikipedia.org/wiki/The_New_York_Times_v._Microsoft_and_OpenAI)). Neither of those is a hypothetical. They're companies figuring out, in real time, that their archive is worth more locked than open.

If you run a company sitting on any kind of proprietary data, customer behavior, internal documentation, years of support tickets, sensor readings, whatever it is, that data is closer to your actual moat now than your codebase is. The codebase can be rebuilt by a competitor with a laptop and a weekend. The data can't, as long as you keep it yours.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>The old software moat, years of schooling plus years of scars, is draining fast. I built a working certification-practice product in eight hours as proof to myself, not just a claim.</li>
    <li>The open internet has already been scraped. The next round of AI progress depends on new data, and companies like Cloudflare and The New York Times are already treating their own data as the thing worth protecting.</li>
    <li>If your company has proprietary data, that's your real moat now. Software isn't, and it's getting less defensible every month.</li>
  </ul>
</div>
