---
title: "The Backup Nobody Tested"
description: "A production outage, a rack of offsite tapes, and the moment we discovered every one of them was unreadable. Why having a backup and having a restore are not the same thing."
date: 2026-07-01
tags: ["backups", "disaster-recovery", "infrastructure", "incidents", "validation"]
draft: false
---

I got called in to help a customer whose production system had gone down hard. Storage failure, the kind where you stop troubleshooting and start recovering. Not a big deal, they said, we've got backups. A weekly full backup with daily deltas on top of it, all on tape, rotated offsite on a schedule. On paper it was a textbook backup plan.

We pulled the most recent full and started a restore. It failed partway through with a read error. Fine, that happens, grab last week's full instead. Same thing. Then the week before that. We went back through months of their rotation and every full backup came back corrupt or unreadable in some way. The daily deltas didn't matter at that point, there was nothing underneath them to apply against.

The tapes existed. The schedule had been followed for years. Someone drove them offsite on time every week and logged it. What nobody had ever done was try to actually restore from one and confirm it worked. Rotation and offsite storage are about surviving a fire or a stolen tape, not about whether the data on it is readable. The customer had been treating "the tapes are safe" as the same thing as "the tapes are good," and those are two completely different questions. As far as I could tell, no one had read from these tapes since the day they were written.

Once we started pulling on that thread, it wasn't a mystery why they'd failed. A backup job that reports success only tells you the write completed, not that the data on the other end is intact or that a full restore will actually run to completion. A few ways that gap opens up:

- Drives drift out of alignment.
- Tapes degrade sitting in storage.
- Formats fall out of sync with the software that's supposed to read them.

Any one of those will quietly turn "backed up" into "gone," and none of them show up as a failure in a backup log.

We ended up recovering what we could from other sources and rebuilding the rest by hand, which took a lot longer and cost a lot more than a restore should have. The infrastructure work was less interesting than the conversation afterward, where I had to explain that the backup process they'd been proud of had never actually protected them.

The fix isn't complicated: restore from your backups on a schedule, not just take them. Pick a cadence, pull a real backup, run it through a real restore, and check that what comes out the other end actually matches what went in. If you've never done that, you don't have a backup, you have a habit that looks like one. It feels like busywork right up until the day it's the only thing standing between you and starting over from nothing.
