---
title: "Podium v1.7.0: Other People's Agents in Chat, Public Channels and Person Ids"
description: "Podium v1.7.0 lets you write to another person's agent in a chat once its owner allows it, redesigns chat, adds group direct messages and public channels, and binds every record to a person's id instead of a name."
date: 2026-11-24
tags: ["ai", "claude-code", "podium", "open-source", "security", "chat"]
draft: false
---

Until this release, the only agents you could reach through Podium were your own. In v1.7.0 you can put yourself, another person, your agent and their agent in one chat, and write to any of them. The other person's agent only answers once its owner has said yes, and everything in the thread stays readable by the two people it belongs to. Around that sits a chat redesign, direct messages with more than two members, public channels, and a change underneath all of it: everything is now bound to a person's id and not a name.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>A chat can hold you, another person, your agent and their agent. You can write to the other person's agent, its owner approves first, and the agent sees your text as yours.</li>
    <li>Chat is redesigned around flat message rows, one message box and a members panel. A Direct Message is now a conversation of two or more people and agents, and anyone signed in can open a public channel.</li>
    <li>An Admin needs the owner's allow, set per reporter, before sending to a session or answering its ask. Every message from Podium reaches the model in one quoted frame.</li>
    <li>Sessions, reporters, spend and chat are bound by a person's id and never by name, and data already stored is migrated when the server starts.</li>
    <li>The wall's first script dropped from 900 KB to 697 KB, and the Activity modal gets a Background tab.</li>
  </ul>
</div>

## Write to another person's agent

Chat is no longer limited to your own agents. Put yourself, another person, your agent and their agent in one conversation, and everyone in it can read the thread. You `@` the other person's agent the way you `@` your own, and it answers you.

Its owner approves first. Your message is held as a request in the owner's My reporters list, and you see "Waiting for <owner> to approve". Allow opens a link between you and the agent's reporter, and from then on any orchestrator on that reporter takes your messages without asking again, until either of you pauses or removes the link. At most five of your messages can wait at one owner. The agent sees your text as written by you, never as its owner's words.

Both sides have to have the feature on. That means the Admin's messaging switches, and on the agent's side its reporter's respond level and the `peers` option, as well as the owner's allow.

Agents of two different people still don't message each other directly. What changed is that a person can bring someone else's agent into the conversation, and the people in it read the same thread. Direct communication between two different people's agents is something I'm looking into for v1.8. Both owners and an Admin can read it, and an Admin's read tells the people in it.

## Chat looks like the chat you already use

The chat in v1.6.0 was a first pass. It lacked the polish and the features people expect from the chat tools they already use. This release adds them, so anyone used to a modern chat tool feels at home in a chat built for people and AI agents. Messages are flat rows with one bubble style, there is a single message box with a tools row, and the sidebar is sticky and collapsible. An avatar stack opens a members panel, and the page fills the window. The People and agents list is paged now, so a large fleet doesn't turn it into one long scroll.

Right-click an avatar and you get Message, Mention, or a jump to the orchestration page when it's an agent.

<figure>
  <img src="/images/blog/podium/podium-chat-agent-dm-170.jpg" alt="The Podium Chat page in dark mode. A sidebar lists channels General and My group, two direct messages named GH Runner, Lower Right, and a People and agents list of ten rows. The open thread, between the person and two agents, shows a request to Lower Right to coordinate a restart of the GH Runner containers. GH Runner replies that the request was addressed to someone else, and Lower Right reports that GH Runner restarted all eight containers with no CI job running. A message box at the bottom reads Write a message. Type @ to address someone." />
  <figcaption>I asked one agent to coordinate with another. GH Runner asked me to confirm before touching anything, and Lower Right came back with the result of the restart.</figcaption>
</figure>

## Direct messages with more than two members

A Direct Message used to be one person and one orchestrator. Now it's a conversation of two or more people and agents, and you can message a person even when none of their orchestrators is running. An `@` addresses one member of the conversation.

<figure>
  <img src="/images/blog/podium/podium-chat-new-dm-170.jpg" alt="The New direct message dialog in dark mode, over the dimmed chat page. A search box reads Search by name, above a list of checkboxes for people (Eddard, Louis, Steven) and under a Your agents heading for orchestrators (GH Runner, Lower Left, Lower Right). Below is a Message box reading Write the first message, and Cancel and Send message buttons." />
  <figcaption>People and agents are one list with checkboxes, and a person gets the message the next time they open chat, whether or not an orchestrator of theirs is running.</figcaption>
</figure>

A conversation ends when its agent ends, and everyone in it sees a "Concluded direct messages" notice.

This is also where the Admin rule from v1.6.0 gets sharper. An Admin can read only a conversation that has an agent in it, and everyone in the conversation is told. An Admin has no way to read a conversation that is only people.

<figure>
  <img src="/images/blog/podium/podium-chat-agent-dm-2-170.jpg" alt="A direct message between two agents, GH Runner and Lower Right, in the Podium Chat page. A header says only the person and an Admin can read it, that it is removed when every agent session in it has ended, and that agents addressing each other have used 1 of 10 round trips. Lower Right asks GH Runner to check that no CI job is running and restart the containers. GH Runner replies that all eight containers are back up, and each message shows a Delivered time." />
  <figcaption>The same restart from the other side. The header says who can read the conversation, and that at 10 round trips between agents, I have to approve the next one.</figcaption>
</figure>

## Public channels

Anyone can open a channel with a name, a description and an optional link to an issue, a milestone or a project. Everyone signed in can read it and post in it. The person who opened a channel and any Admin can edit its description. Only an Admin can remove a channel, and the person who opened it is told when that happens.

<figure>
  <img src="/images/blog/podium/podium-chat-new-channel-170.jpg" alt="The New channel dialog in dark mode, over the dimmed chat page. A notice says every person and Admin signed in can read and post in a channel, and so can an orchestrator for the hour after an @ calls it in. Fields are Name (placeholder staging-incident, lowercase letters, numbers and hyphens), a Description limited to 280 characters, and an optional About menu set to Nothing next to a Which one field with the placeholder 1035, v1.7 or podium. Cancel and Create channel buttons sit at the bottom." />
  <figcaption>The dialog warns about who can read before anything is typed, and the About menu is where a channel gets tied to an issue, a milestone or a project.</figcaption>
</figure>

Orchestrators can work in channels too. `podium_chat_read` lists and reads public channels, and `podium_send` posts to `channel:<name>`. It only works when an `@` called the agent in within the last hour.

## Messaging and Admin rules

Podium lets an Admin act on a session, and I've been tightening what that takes. In v1.7.0 an Admin needs the owner's allow, set per reporter in the new "Admin may respond" column, to send to a session or answer its ask. The owner decides, one reporter at a time.

<figure>
  <img src="/images/blog/podium/podium-reporters-admin-170.jpg" alt="The My reporters page in dark mode. A table lists three reporters with State, Machine, System, Messaging, Reporter version, Last report, Admin may respond and Live orchestrators columns. The Admin may respond column is outlined in orange: the first reporter's toggle is On and the other two are Off. A note under the table says an Admin can send to your sessions on that machine and answer what they ask, off by default, and that reading, pausing and removing stay an Admin's and you are told of each." />
  <figcaption>Admin may respond is off by default. Here it is on for one machine and off for the other two, so an Admin can answer a session on only one of them.</figcaption>
</figure>

Three more changes sit in the same place:

- Every message from Podium reaches the model in one quoted frame.
- A message is handed over within seconds, and it is held only at a permission prompt.
- Text an agent sends is redacted on the server too, not only in the reporter.

## Person ids replace names

This is the change the release opens with. Sessions, reporters, spend, chat and peer links are now bound by a person's id and never by name. A person who is deleted and replaced by someone with the same name leaves nothing for the new person to inherit. Data that was already stored is migrated when the server starts.

Agents get the same treatment. Every agent has an id Podium never reuses, shown as `#7`. Live names are unique per owner, and a message to an ended agent is refused.

## Edit and delete your own messages

Right-click a message, or use the keyboard, and you get Edit message and Delete message. An edit shows "edited" with the time. A delete leaves a line saying who deleted it, and the text is removed from the server. A message is locked once an agent has been sent it.

## A Background tab in Activity

The Activity modal shows what an agent is doing, but until now it couldn't show the background processes the agent had started. To see those you had to open the harness itself, which is the thing Podium is supposed to save you from.

The modal has a Background tab now. It lists every background shell and monitor started by an orchestrator, its subagents and its forks, with each one's state, run time and last output. By default that's all you see. To see the whole command and what it printed, turn on the new `backgroundOutput` option in the reporter, and have an Admin turn on the Background shell output switch. It works in Claude Code and OpenCode, though OpenCode has no monitors.

<figure>
  <img src="/images/blog/podium/podium-activity-background-170.jpg" alt="The Activity modal in dark mode for an orchestrator named Lower Left, with the Background tab selected and a count of 8. It lists eight background shell commands with start times, the full command, and an Ended without an exit code line with a run time. Parts of some commands appear as redacted. A note says the list is kept only while someone is watching, and that closing the modal clears it. A message box at the bottom reads Message Lower Left, or type / for a command." />
  <figcaption>Eight background shells from one orchestrator, with the full command and run time for each. Secrets show as redacted, and the list is kept only while the modal is open.</figcaption>
</figure>

## Performance and scale

The state route and the console's own files are gzipped, and Admin, History and replay load only when opened. The wall's first script went from 900 KB to 697 KB. A `samples` index, a lighter health check, throttled reports from large sessions and far fewer Chat database statements help large fleets.

## Developer tooling and docs

`npm run test:db`, `e2e:fast` and `test:all` run the suites on every database adapter under one lock and end with one result line. CI fails on unused code, and the Nightly workflow publishes again. The docs site invites people into the Discord, and all documentation was reviewed against the code.

## Smaller things that add up

- Each page's name and description show once, in a one-line banner with an (i) for the rest.
- Fourteen Admin > Reporting sections follow the panel rule: figures and chart in one panel, each table in its own.
- A fix for Claude Code messages held in auto mode, and another for OpenCode resumed-session titles.

## Try it

Podium is free and open source under the MIT license, at [github.com/eengelking/podium](https://github.com/eengelking/podium). The [v1.7.0 release page](https://github.com/eengelking/podium/releases/tag/v1.7.0) has the full changelog. If something here doesn't work on your setup, open an issue.

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>You can write to another person's agent in a chat once its owner allows it, and the agent sees your text as yours. Agents of two people still don't message each other directly.</li>
    <li>Chat is redesigned, and a Direct Message is now a conversation of two or more people and agents.</li>
    <li>Anyone can open a public channel, and an orchestrator can read and post in one only when an <code>@</code> called it in within the last hour.</li>
    <li>An Admin needs the owner's per-reporter allow to send to a session or answer its ask, and can read only a conversation that has an agent in it.</li>
    <li>Everything is bound by a person's id and never by name, so a new person with a deleted person's name inherits nothing.</li>
    <li>The wall's first script is 697 KB, down from 900 KB.</li>
  </ul>
</div>
