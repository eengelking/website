---
title: "Capacity Isn't Throughput: An IOPS Story"
description: "A data center migration, a state-of-the-art storage array, and a production database that needed ten times the IOPS it was built for. Why disk count and capacity planning aren't the same problem as throughput planning."
date: 2026-07-02
tags: ["infrastructure", "incidents", "iops", "storage", "capacity-planning"]
draft: false
---

A production database needed 30,000 IOPS to run normally. The brand-new array built to replace its old home topped out around 3,000, a tenth of what the workload actually required, and the gap didn't show up anywhere on a spec sheet or a capacity dashboard. It showed up the first time real production traffic hit the array and everything downstream started timing out.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>A replacement storage array got spec'd for capacity (enough disks to hold the data) with nobody checking whether it could also move data at the rate production actually needed.</li>
    <li>The result was a tenth of the required throughput, on a one-way migration with no old data center left to fail back to.</li>
    <li>Capacity and throughput are different numbers. A vendor quote will happily tell you the first one and let you assume the second takes care of itself.</li>
  </ul>
</div>

## What IOPS actually measures

IOPS stands for input/output operations per second: how many individual reads or writes a storage system can service each second, as opposed to how much data it can hold. Those are different numbers, driven by different things. Capacity depends on how many drives you have and how big they are. IOPS depends on how many independent I/O paths the controller offers, how traffic gets distributed across the backplane, and whether the underlying media can service requests in parallel or has to handle them one at a time. Two arrays can hold the exact same number of terabytes and still differ tenfold in how many operations per second they can actually push through.

Think of it as a warehouse. Capacity is how much the warehouse can hold. IOPS is how many loading docks it has and how fast trucks can pull in and out. Build a bigger warehouse with the same four loading docks, and it doesn't move goods any faster, it just has more sitting in it while everyone waits in line.

## How the replacement array got sized wrong

This was a customer of mine who'd run production for years on a large shared storage platform with more throughput than any one tenant could realistically use, so nobody there had ever had to think hard about IOPS. When your storage is effectively bottomless, you stop measuring the bottom. Then the company decided to migrate out of that data center and own their hardware end to end, including the storage layer, a reasonable decision on its own. The problem was in how the replacement array got spec'd. Whoever built it sized it for capacity: state-of-the-art platform, enough disks to hold the data, box checked. Nobody sized it for throughput.

That alone would have been a bad week. What made it worse was the sequencing. This wasn't a "add more disks over the weekend" problem, because the company was in growth mode and needed headroom well past 30,000 IOPS, not just enough to match current load. And the old data center was already gone. The migration was one-way. There was no shared array to fail back to and no spare capacity sitting anywhere else. Whatever array they had was the only copy of production, live.

They couldn't even solve it by throwing more disks at the box they already owned. It didn't have enough drive bays or backplane throughput to reach 30,000 IOPS no matter how it was populated, let alone anything past that for future growth. The unit itself was the constraint, not just how it was configured.

## The fix, and what it actually cost

The only real fix was building a second array sized for the actual throughput requirement plus room to grow, then migrating production onto it live, with the undersized array as the only thing keeping the business running in the meantime. That's a slow, careful, expensive project to run under pressure, and it's exactly the kind of project that doesn't exist if IOPS gets asked about during the original spec instead of after the outage.

The person who originally speced the array had been proud of the price tag: it came in well under budget, and it came in under budget precisely because it wasn't built to move data any faster than it did or grow past what it already had. That wasn't a separate cost saving stacked on top of a good decision, it was the same undersizing showing up on a different line item. Nobody costed in what a second migration under duress would run, or what it costs in trust when production falls over during a project that was supposed to make things better. Capacity is how much data you can store. IOPS is how fast you can move it. A vendor quote and a spec sheet will happily tell you the first number and let you assume the second one takes care of itself. It doesn't, and the only way to know your real number is to measure what your current system actually does under full production load before you go build its replacement.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Capacity and IOPS are different numbers, driven by different things. A spec sheet will happily report the first and let everyone assume the second takes care of itself.</li>
    <li>The array's low price wasn't a coincidence sitting next to the undersizing, it was the same undersizing. It was cheap because it wasn't built to move data fast or grow past current load.</li>
    <li>The only way to know your real IOPS requirement is to measure what your current system does under full production load before you build its replacement.</li>
  </ul>
</div>
