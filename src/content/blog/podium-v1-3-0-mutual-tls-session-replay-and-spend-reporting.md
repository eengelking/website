---
title: "Podium v1.3.0: Mutual TLS, Session Replay and Spend Reporting"
description: "Podium v1.3.0 replaces the reporter's token over plain HTTP with a certificate it proves on every connection, lets you record and replay a session to see what went wrong, and adds Admin reporting that shows where your Claude spend is going and where it's headed."
date: 2026-10-22
tags: ["ai", "claude-code", "podium", "open-source", "security"]
draft: true
---

Until now, a Podium reporter sent its token in a header over plain HTTP. Anyone on the path between a laptop and the server could read it, and anyone who read it could use it. For a tool that carries your prompts, your plans and the answers you send back, that was the thing I most wanted to fix. v1.3.0 fixes it with mutual TLS, and the hard part wasn't turning TLS on. It was changing a certificate without breaking everyone already holding the old one.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Podium now makes its own certificate authority and gives each person one config file. The reporter proves who it is with a certificate on every connection, and the server checks it on every request. It has been tested end to end with no known security issues.</li>
    <li>The old token method still works as a fallback if the certificate path fails, so turning this on can't lock anyone out.</li>
    <li>A user asked for session recording and replay, and it's here, opt-in. Combined with forking a session, it shows what an agent was doing when something went wrong.</li>
    <li>Admin now has a Reporting group that shows where spend goes, per person and over time, with a projection built from past usage.</li>
  </ul>
</div>

## Why a certificate and not a better token

A token is a secret that sits in a header. Whoever reads the header owns it. A certificate works differently. The private key signs part of the TLS handshake and is never sent, so there is nothing in the traffic to lift and replay ([IETF, "RFC 8446: TLS 1.3"](https://www.rfc-editor.org/rfc/rfc8446)).

With TLS on, the server makes its own CA and serving certificate and serves HTTPS on a second port. Each person gets a client certificate inside one generated config file, which holds the server address, the CA, their name, and their certificate and key. It's the same idea as a kubeconfig, which carries the cluster's CA and a user's client certificate and key in one file ([Kubernetes, "Kubeconfig (v1)"](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/)). Nothing gets installed on a person's machine and nothing new is trusted system-wide.

The server maps the certificate to a person by fingerprint, and the report's `userName` still has to match that person. Revoking the certificate, the token, or both are separate actions, and the server checks revocation on every request.

One workaround is worth knowing about. The reporter is a Claude Code mod, and the mod's HTTP call accepts no CA or client certificate. So each session starts a small Node helper, and the mod talks to it over a Unix socket. It needs `node` on the machine, and macOS and Linux are the supported platforms.

## Rotating a certificate without breaking anyone

Every certificate expires, and the CA is no exception. A reporter's config file holds the CA, so the reporter trusts exactly the CA it was given. If I swap the CA on the server, every reporter holding the old one sees a server certificate it has no reason to trust. Telling everyone to download a new file on the same day isn't a rotation plan.

The answer is a cross-signed overlap. A planned rotation makes a new CA and has the old CA sign a cross certificate for it. During the overlap the server trusts both CAs for client certificates, and it presents its new certificate with the cross certificate behind it. A reporter that holds only the old CA follows the chain through the cross certificate and still verifies the server. The old CA's key isn't kept, and nothing is signed with it after the cross certificate.

The cross certificate lasts 120 days, which is a reporter's 90-day certificate plus its 30-day grace. Reporters renew their own certificates during that window and pick up the new CA as they do, so the overlap ends by itself. An Admin can retire the old CA early, for a leaked key for example. A laptop that stays asleep past both the cross certificate and the grace needs a reissued config, and the reporter tells the person so.

An Admin Certificates page shows what expires and when, and a pill in the header warns before it matters.

<figure>
  <img src="/images/blog/podium/admin-certificates-1.3.0.png" alt="The Podium Admin Certificates page in dark mode. A status table lists the certificate authority, valid for 10 years, and the serving certificate, which renews itself on 2027-09-22, both marked valid, with the CA's SHA-256 fingerprint below. Sections follow for renewal and lifetimes in days, a switch labelled Allow reporters to connect over HTTP that is on and carries a warning that the traffic is not encrypted, buttons named Renew now and Rotate CA, and a list of previous certificates that is empty." />
  <figcaption>Rotate CA sits near the bottom, and the switch for the HTTP fallback sits just above it with a plain warning that the traffic isn't encrypted.</figcaption>
</figure>

## The fallback

This is new, and a security change that locks people out is a bad trade. So the token path doesn't go away. Reporters over HTTP are an Admin switch. It's on for an existing install and off for a fresh install that enables TLS. If the certificate path fails for someone, the token method they already had keeps working until the Admin turns it off.

## Record a session, then replay it

A user asked for this one. When an agent does something you didn't expect, the Activity feed has only the last 20 lines. A recording keeps all of it, from the moment you press Start: every prompt, what the model wrote, and each tool call with its whole input and result.

<figure>
  <img src="/images/blog/podium/session-recorder-orchestrator-1.3.0.png" alt="The Podium orchestrator page for a session named api-refactor. A red band reads This session is being recorded and lists what is kept and who started it, with buttons named Stop recording, Open replay and Delete recording. The Recording cell in the facts grid above it is lit red." />
  <figcaption>The red band can't be dismissed while the recording runs, so anyone who opens the session sees it's being recorded.</figcaption>
</figure>

The replay is a page with a position slider and a Jump to next failure button. It never runs anything or sends anything to the session.

<figure>
  <img src="/images/blog/podium/session-replay-1.3.0.png" alt="The Podium replay page for api-refactor, with a loop filter, a Jump to next failure button and a position slider at row 9 of 151. A failed Bash call, npm test for the server's invoices, is outlined and expanded to show the command and its output, where one test failed because the expected currency USD was undefined. Rows above it show the orchestrator's prompt, its plan and a subagent's first steps." />
  <figcaption>Jump to next failure lands on the failed test with the command and its output open, and the rows above it show how the agents got there.</figcaption>
</figure>

Forking a session, from v1.2.0, lets you question an agent without touching the original ([my v1.2.0 post](/blog/podium-v1-2-0-what-three-days-of-feedback-built)). Replay is the other half, because it shows what the agent did without asking it anything.

It's the most Podium has ever kept of a conversation, so it takes three yes answers:

- The Admin turns on the Session recording feature flag, which needs the server's auth on.
- The session's owner, or an Admin, chooses to record that session.
- The reporter's `sessionRecording` option is on.

Everyone sees that a session is recording and who started it, and nobody can hide that. Secrets are replaced on the machine before anything is sent, which is best effort and not a guarantee. A recording is kept 6 hours by default, up to 7 days. The model's thinking text isn't captured.

## Where the spend goes

People told me that tracking spend matters to them, so Admin now has a Reporting group with six pages: Usage, Spend, People and groups, Sessions, Failures and Admin activity. Each takes a period and filters, and exports exactly what it shows as CSV or JSON.

The Spend page breaks cost down by person. Its projection takes a straight run rate over the last 7, 14 or 30 days and carries it to the end of the month or 30 days ahead, with the window and assumptions shown next to the number. With fewer than 7 days of history for someone, it says "Not enough history" and shows no number for them. Spend is estimated from tokens and a price table, so it isn't a bill. Podium keeps daily summaries for 395 days, so a report can reach back further than the 30 days of detailed rows. The summaries hold counts, tokens, cost and names, and no session content.

<figure>
  <img src="/images/blog/podium/admin-report-spend-1.3.0.png" alt="The Podium Admin Spend page in dark mode. A bar chart shows spend today by person, $346 across two people. Below it a Projection table lists each person's run rate per day, spend so far this month and projected spend to 2026-10-31, with a total of $593.45, and a note that it is a straight run rate and not a budget. Three people with too little history read Not enough history. A Spend over time section starts at the bottom." />
  <figcaption>Admin, Rec and Sam read "Not enough history" instead of a number, so a new person's first few days don't produce a made-up projection.</figcaption>
</figure>

## Also in this release

- Admins can keep the agent Activity feed for a set time, filter it on a Stored activity page, and delete it. It's off by default.
- A Bash row in the Activity feed opens to the whole command and its output, with its exit code and whether the call is running, finished or never reported. Collecting output is an Admin flag and is off by default.

## Try it

Podium is free and open source under the MIT license, at [github.com/eengelking/podium](https://github.com/eengelking/podium). The [releases page](https://github.com/eengelking/podium/releases) has the full changelog for v1.3.0. If the certificate path doesn't work on your setup, open an issue, and in the meantime the token method is still there.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Reporters now authenticate with a certificate that can't be replayed from a header, checked on every request, with revocation separate from the token.</li>
    <li>Rotating the CA is safe because the old CA signs a cross certificate for the new one, and reporters keep verifying the server through the overlap.</li>
    <li>The token method remains as a fallback behind an Admin switch.</li>
    <li>Session recording is opt-in, needs three yes answers, redacts secrets on a best-effort basis, and pairs with forking to show what an agent did.</li>
    <li>Admin Reporting adds six pages and a spend projection from past usage, and stores no session content.</li>
  </ul>
</div>
