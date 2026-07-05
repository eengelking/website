---
title: "Capacity Isn't Throughput: An IOPS Story"
description: "A data center migration, a state-of-the-art storage array, and a production database that needed ten times the IOPS it was built for. Why disk count and capacity planning aren't the same problem as throughput planning."
date: 2026-07-02
tags: ["infrastructure", "incidents", "iops", "storage", "capacity-planning"]
draft: false
---

A customer of mine ran their production environment on a large shared storage platform. It had enormous capacity and enormous throughput, more than any one tenant could realistically use, so nobody there had ever had to think hard about IOPS. When your storage is effectively bottomless, you stop measuring the bottom.

Then the company decided to migrate out of that data center and own their own hardware end to end, including the storage layer. Reasonable decision on its own. The problem was in how the replacement array got spec'd. Whoever built it sized it for capacity: state-of-the-art platform, enough disks to hold the data, box checked. Nobody sized it for throughput.

The production database was running at roughly 30,000 IOPS in normal operation. The new array topped out around 3,000. A tenth of what the workload actually needed, and that gap doesn't show up on a spec sheet or a capacity dashboard. It shows up the first time real production traffic hits the array and everything downstream starts timing out.

That alone would have been a bad week. What made it worse was the sequencing. This wasn't a "add more disks over the weekend" problem, because the company was in growth mode and needed headroom well past 30,000 IOPS, not just enough to match current load. And the old data center was already gone. The migration was one-way. There was no shared array to fail back to and no spare capacity sitting anywhere else. Whatever array they had was the only copy of production, live.

They couldn't even solve it by throwing more disks at the box they already owned. It didn't have enough drive bays or backplane throughput to reach 30,000 IOPS no matter how it was populated, let alone anything past that for future growth. The unit itself was the constraint, not just how it was configured.

The only real fix was building a second array sized for the actual throughput requirement plus room to grow, then migrating production onto it live, with the undersized array as the only thing keeping the business running in the meantime. That's a slow, careful, expensive project to run under pressure, and it's exactly the kind of project that doesn't exist if IOPS gets asked about during the original spec instead of after the outage.

The person who originally speced the array had been proud of the price tag. It came in well under budget. Nobody costed in what a second migration under duress would run, or what it costs in trust when production falls over during a project that was supposed to make things better. Capacity is how much data you can store. IOPS is how fast you can move it. A vendor quote and a spec sheet will happily tell you the first number and let you assume the second one takes care of itself. It doesn't, and the only way to know your real number is to measure what your current system actually does under full production load before you go build its replacement.
