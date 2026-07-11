---
title: "The Key That Never Touched the Disk"
description: "A customer needed remote machines to netboot an encrypted disk with no copy of the key anywhere on the image or the hardware. Here's how Kea, Tang, Clevis, and LUKS made that possible."
date: 2026-07-05
tags: ["infrastructure", "encryption", "linux", "provisioning", "nbde", "tang", "clevis", "luks", "ipxe", "kea"]
draft: false
---

A customer needed remote machines to netboot a fully encrypted disk, with the encryption key living nowhere the machine could keep it. Not on the disk, since storing the key there defeats the point of encrypting it. Not in the boot image either, since every machine sharing that image would share the same key, and one compromised unit would compromise all of them. The key had to exist somewhere the machine could reach on every boot, but never somewhere it could hold onto.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>The constraint: a disk's encryption key can't live on the disk, in the boot image, or anywhere on the machine, yet the machine still needs it on every single boot.</li>
    <li>NBDE (LUKS plus Tang plus Clevis) solves this: Tang helps a machine reconstruct its key over the network without Tang ever holding a copy of it, so compromising Tang exposes nothing.</li>
    <li>The machine finds Tang for free by piggybacking its address on the DHCP handshake every machine already makes to get an IP, no separate bootstrapping protocol needed.</li>
  </ul>
</div>

The requirement broke down into two cases:

- **First boot**: the disk isn't partitioned, formatted, or encrypted yet. The machine needs a key to set that up.
- **Every boot after that**: the disk is already encrypted. The machine needs the same key back to decrypt it and get at its own data.

This is a solved problem in the Linux world, it's called NBDE, Network-Bound Disk Encryption, and it's built from three pieces: LUKS for the actual disk encryption, Tang as a small stateless server, and Clevis as the client that ties the two together and automates the whole thing at boot.

## What NBDE actually does

LUKS is the on-disk format, a header full of key slots plus the encrypted data itself. Normally you'd unlock a LUKS volume with a passphrase a human types in. NBDE replaces the human with a network exchange.

Tang holds a set of asymmetric keys and does almost nothing else. It doesn't store per-client secrets, doesn't track who has asked it for what, and never sees the actual LUKS key material in the clear. Clevis is the client side: it generates the real encryption key locally, then uses a cryptographic exchange (the McCallum-Relyea protocol) against Tang's public key to produce a binding that gets stored in the LUKS header as a new key slot. That binding is useless on its own. Recovering the key from it requires one more round trip to Tang, but that round trip never actually hands the key to Tang or has Tang hand it back directly, the math works out so Tang can help reconstruct the key without ever holding a copy of it.

That's the property that made this whole design possible: the server can help you unlock the disk without being a store of secrets that's worth attacking. If someone dumped Tang's entire disk, there's nothing on it that decrypts anyone's data.

On first boot, `clevis luks bind` runs against the freshly partitioned and formatted disk, generates the key, and binds it to Tang. The bound key slot gets written into the LUKS header.

On every boot after that, a systemd unit (`clevis-luks-askpass`, part of the standard Clevis tooling) runs early, before anything tries to mount the encrypted volume. It reads the bound key slot from the LUKS header, contacts Tang, completes the exchange, recovers the key, and hands it to `cryptsetup` to unlock the disk. If Tang isn't reachable, the exchange can't complete and the disk stays locked. That's the entire trust model in one sentence: reachability to Tang is what stands in for a passphrase.

## Getting the machine to Tang in the first place

The remaining problem was bootstrapping: a machine cold-booting off iPXE has no local configuration yet. It doesn't know Tang's address until something tells it.

The answer was to piggyback on infrastructure that's already part of network boot: DHCP. I ran Kea as the DHCP server and had it hand out a custom option containing Tang's address alongside the normal lease information. Every machine already has to talk to DHCP to get an IP before it can do anything else, so this didn't add a new protocol or a new trust relationship, it just rode along on a handshake that was already happening.

Kea was also configured to only hand out addresses to MAC addresses it already knew about, from a static reservation list rather than an open pool. That's not airtight (a MAC address can be spoofed) but it meant the network wasn't handing out leases, and by extension Tang's address, to anything that showed up. It was one more lever alongside network segmentation, not the whole lock.

From there it was a matter of getting that option out of the DHCP response and into somewhere the boot process could act on it. The value got carried into the kernel's boot parameters, and the same early systemd unit that drives Clevis read it and used it to point at the right Tang server before attempting the bind or the unlock.

The whole chain, in order:

1. Machine boots via iPXE, requests an address from Kea, and gets an IP plus the custom option pointing at Tang, but only because its MAC was already on Kea's reservation list.
2. That option gets carried into the kernel's boot parameters.
3. On first boot, Clevis generates a key, binds it to Tang, and LUKS-encrypts the disk with it.
4. On every boot after that, the `clevis-luks-askpass` unit reads the bound key slot, exchanges with Tang, recovers the key, and unlocks the disk.

## Why this held up

Nothing about a machine's own storage was ever worth stealing. The LUKS header holds a binding, not a key, and that binding is inert without a live exchange against Tang. If a unit was compromised, decommissioned, or physically stolen, there was no secret sitting on it to extract, only encrypted data and a reference to a server it would need to reach again.

The trust model wasn't per-machine identity checked at unlock time, Tang doesn't do that. It was reachability: only machines on the segmented provisioning network, with a MAC address Kea already knew about, could get far enough to ask Tang anything in the first place. Take a machine off that network and its disk is just encrypted data with no path back to the key.

Reusing DHCP as the discovery mechanism is still the part I'm proudest of. It meant no extra bootstrapping protocol and no chicken-and-egg problem of needing configuration to fetch configuration. The machine was already going to ask the network "where am I and what's around me" as the very first thing it did. Answering "and also, here's where Tang is" cost nothing extra.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>The LUKS header holds a binding, not a key. It's inert without a live exchange against Tang, so there's nothing on the disk worth stealing.</li>
    <li>Trust here is reachability, not identity. Only a machine on the segmented network with a known MAC can even ask Tang anything.</li>
    <li>Piggybacking Tang's address on DHCP avoided a bootstrapping problem entirely: no new protocol was needed to find the thing that unlocks the disk.</li>
  </ul>
</div>
