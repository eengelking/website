---
title: "The Race Condition That Ate a Key"
description: "A customer split their data across two encryption keys, a race condition silently overwrote the first one, and nobody noticed until a restore failed. How we got it back using the ext4 journal instead of luck."
date: 2026-07-03
tags: ["infrastructure", "incidents", "linux", "filesystems", "encryption", "data-recovery"]
draft: false
---

A customer came to me with a problem that a lot of very smart people had already given up on. They had a tool that encrypted data with two keys, one after the other, splitting the workload in half. The two encryption jobs were supposed to run one at a time, each writing its key to the same location on disk before the next one started. Somewhere in that sequencing there was a race condition, meaning the two jobs didn't actually wait on each other the way the code assumed they would, and the second job's write landed on top of the first job's key before anything had a chance to read it back. No backup of the key existed anywhere. The overwrite was silent, there was no error, no failed job, nothing to alert on. It just quietly ate half of their ability to decrypt their own data.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>A customer's tool encrypted data with two keys. A race condition let the second job silently overwrite the first key on disk, no error, no alert, no backup anywhere.</li>
    <li>A room full of capable engineers had already tried brute force and gotten nowhere, a real contract was riding on getting the data back, and the alternative was rebuilding a production dataset from nothing.</li>
    <li>The key didn't come back from guessing. It came from understanding what a journaling filesystem actually does with data before it gets overwritten.</li>
  </ul>
</div>

It only surfaced when they needed to restore from backup for an unrelated reason, went to decrypt the restored data, and found that half of it had been encrypted with a key that no longer existed anywhere. They worked out what had happened fairly quickly, a race condition overwriting the key, but knowing the cause didn't get them the key back. By the time it reached me, they'd already had a room full of capable engineers try brute force, guessing, anything they could think of. Nothing worked, because you can't brute force your way past a real encryption key. There was a significant contract riding on this and a real chance they'd lose the data outright and have to rebuild from scratch.

I started by listening to what they'd tried and what they understood about the failure, then wrote it back to them in my own words to make sure I had it right before touching anything. Once I had a solid model of the bug, I built a lab and reproduced the race condition on purpose, which confirmed two things: the bug was real, and it really did overwrite the original key on disk with no copy left behind.

That's where almost thirty years of knowing what a journaling filesystem actually does paid off. I asked them what the partition was running, and it turned out to be ext4. A journaling filesystem doesn't write changes straight to their final location on disk. It writes them to a journal first (on ext4 that's a subsystem called jbd2), then copies them over to their final location a short time later, a step called checkpointing. It's a safety mechanism, it's what lets the filesystem recover cleanly if the power goes out mid-write instead of ending up in a half-written, corrupted state. The side effect that mattered here is that a block isn't necessarily gone the instant something overwrites its final location on disk. If the old version of that block was still sitting in the journal and hadn't been checkpointed out yet, it could still exist, untouched, even after the "real" copy had been clobbered. So instead of treating the key as gone, I went looking for a copy of it that the overwrite would have never reached in the first place. I pulled the raw journal apart block by block, found the old key's data still sitting there from before it had been checkpointed out, and extracted it intact. From there it was a matter of confirming that combination of the recovered first key and the intact second key would actually decrypt both halves of the data.

It took about three days from first reproducing the bug to a solution I trusted enough to hand off. I wrote it up as six concrete steps and sent it over. Then I waited. A week went by with nothing back, so I followed up to ask if it had worked. The answer was something like "oh, that? yeah, it worked, thanks." That was the whole response, for a fix that saved them from rebuilding a production dataset from nothing.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Know your filesystem at a level deeper than "it stores files." The internals are sometimes the only thing standing between you and permanent data loss.</li>
    <li>Run on something journaling, something built to let you get back to a prior state, and treat that as a real safety property, not an implementation detail you can ignore.</li>
    <li>Never test a fix like this against production first. Build a lab and prove it works before you go anywhere near the real data.</li>
    <li>Once you think you've fixed it, validate that it actually worked instead of assuming. "The fix ran without errors" and "the data is actually recoverable" are not the same claim.</li>
  </ul>
</div>
