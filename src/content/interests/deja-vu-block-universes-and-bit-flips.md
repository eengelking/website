---
title: "Déjà Vu, Block Universes, and Bit Flips"
description: "A software engineer's thought experiment on déjà vu, chasing it through relativity's block universe and cosmic ray bit flips before landing on what neuroscience actually shows, with a source behind every claim."
date: 2026-09-01
tags: ["personal", "physics", "neuroscience", "consciousness"]
draft: false
---

Everybody's had this happen. You're somewhere completely ordinary, doing something completely ordinary, and for a couple of seconds you're certain you've lived this exact moment before, down to the details. It's common enough that roughly two-thirds of people report it at least once, more often in their teens and twenties than later in life ([Wikipedia, "Déjà vu"](https://en.wikipedia.org/wiki/D%C3%A9j%C3%A0_vu)). Nobody actually knows what causes it. That gap is the kind of thing that keeps me up some nights, so I went looking for what an engineer with a hobbyist's interest in physics can honestly say about it, and where that reasoning actually breaks.

I want to be upfront about the ground rules. This is a thought experiment, not a claim. Every fact below links to something you can go read yourself, and I've tried to draw a clean line between what's established and what's just me speculating out loud.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Physicists take the "block universe" seriously: past, present, and future all equally real, which sounds like license for déjà vu to be a signal from the future. That idea is about existence, not access, and physics gives you no channel back.</li>
    <li>Cosmic rays really do flip bits in computer memory, but neurons run on ion channels, not transistors, so the analogy doesn't transfer cleanly, even though perturbing the brain's actual electrical activity is a proven way to cause déjà vu.</li>
    <li>Wilder Penfield triggered déjà vu on demand by stimulating the temporal lobe during surgery, and it shows up reliably as a seizure aura in temporal lobe epilepsy. That's stronger evidence than anything the physics angle offers.</li>
  </ul>
</div>

## Maybe the future already exists

Special relativity does something genuinely strange to the idea of "now." Two events that happen at the same time for one observer can happen at different times for another observer moving relative to them, and there's no experiment that picks one observer's "now" as the correct one ([Wikipedia, "Relativity of Simultaneity"](https://en.wikipedia.org/wiki/Relativity_of_simultaneity)). Push that far enough and you land on the "block universe" view: past, present, and future aren't a timeline where only the present is real, they're all equally real points laid out in a four-dimensional structure. Our sense of time moving forward is something consciousness does, not something built into the physics ([Stanford Encyclopedia of Philosophy, "Being and Becoming in Modern Physics"](https://plato.stanford.edu/entries/spacetime-bebecome/)). This isn't a fringe idea. It's a real, debated position among physicists and philosophers of physics.

That's about as far as I can push it before it stops being honest. The block universe says the future exists in the same sense the past does. It says nothing about access. Nobody has a mechanism, proposed or otherwise, for a mind to retrieve information from a point in spacetime it hasn't physically reached yet. "The future is real" and "you can somehow perceive it" are two completely different claims, and only the first one has real physics behind it. If déjà vu is your brain reaching forward, there's no known channel for that reach.

## The bit flip idea, and where it breaks

Here's the version of this I actually find more interesting, because it comes from my day job instead of a documentary. Cosmic rays and other radiation genuinely flip bits in computer memory. It's a well-documented problem in electronics, serious enough that spacecraft and some servers use radiation-hardened or error-correcting memory specifically to guard against it, and there's a widely cited real case from a 2003 Belgian election where a single cosmic-ray bit flip added exactly 4,096 (2¹²) votes to a candidate's tally on an electronic voting machine ([John D. Cook, "Cosmic rays flipping bits"](https://www.johndcook.com/blog/2019/05/20/cosmic-rays-flipping-bits/)). If a stray particle can flip a bit in silicon, why couldn't something similar happen in a brain, and produce a moment of misfired "memory"?

The honest answer is that the mechanism doesn't map over cleanly. A transistor bit is a specific, engineered structure built to be vulnerable to a small energy deposit, and a particle strike flips a defined 0 to a 1 or back. A neuron doesn't run on electron conduction through a lattice at all. It runs on ions, sodium, potassium, calcium, and chloride, moving through voltage-gated channel proteins in the membrane ([NCBI Bookshelf, Purves et al., *Neuroscience*](https://www.ncbi.nlm.nih.gov/books/NBK10883/)). That's a much messier, more distributed system than a memory cell, and memory itself isn't stored as a single flippable unit, it's spread across patterns of synaptic connections across many neurons. There's no clean analog for "flip one bit, get one specific, structured experience."

## What we actually know: you can trigger this on purpose

This is where the post stops being speculative and gets genuinely solid, and it's the part that surprised me most while reading into this.

You don't need a cosmic ray to produce déjà vu. Wilder Penfield, operating on epilepsy patients under local anesthesia in the 1950s and 60s, directly stimulated the temporal lobe with electrodes and reliably produced déjà vu-like experiences in his patients, in real time, on the operating table. A more recent review of awake craniotomy cases found this kind of stimulation-induced experiential phenomena, including déjà vu, in roughly 40 of 520 patients studied ([PubMed](https://pubmed.ncbi.nlm.nih.gov/31914177/)). And outside of surgery, déjà vu is a well-documented seizure aura in temporal lobe epilepsy, specifically tied to abnormal activity in the hippocampus and rhinal cortex ([Vignal et al., *Brain*, 2007](https://academic.oup.com/brain/article/130/1/88/348244)).

So the causal chain "perturb the brain's electrical activity, get déjà vu" isn't a hypothesis. It's demonstrated, repeatedly, in humans. What's still open is what perturbs that same circuit in someone who isn't in surgery and isn't having a seizure. A cosmic ray is one candidate nobody has proven or ruled out, but it's a massive leap in scale from the only perturbations we've actually observed causing this, which are a seizure sweeping through a circuit or a surgeon's electrode sitting directly on the tissue.

## The theories that don't need any of this at all

I'd be doing this topic a disservice if I made it sound like neuroscience is stuck without a physics assist. It isn't. The leading, evidence-backed explanations for ordinary déjà vu don't reach for anything exotic:

- **Familiarity and recollection getting out of sync.** The brain has separate systems for "this feels familiar" and "I can recall why," and déjà vu may be what happens when the familiarity signal fires without a matching memory to back it up.
- **The reality-check theory.** Chris Moulin's research frames déjà vu as your brain flagging a mismatch, a "this feels true but I know it isn't" signal, which is why the feeling comes bundled with a strong sense that the familiarity is false, essentially a "fact-check" on your own memory system ([The Conversation, on Moulin's work](https://theconversation.com/jamais-vu-the-science-behind-eerie-opposite-of-deja-vu-213596)).
- **Gestalt familiarity.** Anne Cleary's lab has induced déjà vu experimentally using virtual reality, by building scenes that share spatial layout with a scene a person saw earlier without them consciously noticing the resemblance. The layout alone is enough to trigger the feeling ([Cleary et al.](https://pubmed.ncbi.nlm.nih.gov/22322010/); [Scientific American summary](https://www.scientificamerican.com/article/similar-scenes-spark-deja-vu/)).

These are the frontrunners, not the physics ideas above. If you want one more example of how far a physics-flavored explanation can drift from something that actually holds up, there's the Penrose-Hameroff theory that consciousness comes from quantum effects in microtubules inside neurons. Max Tegmark ran the numbers in 2000 and found the quantum states involved would decohere in something like 10⁻¹³ to 10⁻²⁰ seconds, many orders of magnitude faster than the 10⁻³ to 10⁻¹ second timescales neurons actually operate on ([Tegmark, *Phys. Rev. E*, 2000](https://arxiv.org/pdf/quant-ph/9907009)). Serious physicist, serious math, and the numbers still don't work. That's worth keeping in mind any time a physics idea shows up dressed as an explanation for something conscious.

## Where that leaves me

I don't think déjà vu is a message from the future, and I don't think it's a cosmic ray hitting the right neuron at the right moment. The honest answer is that it's almost certainly a neurological quirk with a mundane explanation, and the researchers working on the familiarity-mismatch and gestalt theories have real evidence, not just a plausible story. But I don't think it's dishonest to notice that physics genuinely doesn't rule out stranger things about time than we're used to thinking about, and that the block universe view is a real, respectable position, not a plot device. The interesting move isn't picking the physics explanation over the neuroscience one. It's being precise about which parts are established and which parts are just a fun place to let your brain wander on a Tuesday night.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>The block universe is real physics, but it's a claim about existence, not access. Nothing gives a mind a channel to perceive a future that already "exists."</li>
    <li>The cosmic ray bit flip analogy is real at the "radiation can perturb tissue" layer, but breaks down at the mechanism layer since neurons run on ion channels, not transistors.</li>
    <li>Perturbing the brain's electrical activity is a proven way to cause déjà vu, demonstrated by Penfield's stimulation experiments and by temporal lobe epilepsy. What's unproven is only what triggers that same effect in an ordinary, healthy brain.</li>
    <li>The strongest current explanations (familiarity/recollection mismatch, the reality-check theory, gestalt familiarity from VR studies) are neuroscience, not physics, and they have real experimental support behind them.</li>
  </ul>
</div>
