---
title: "Minutes From Commit to a Live Cluster"
description: "A CI/CD pipeline that spins up a real, disposable Kubernetes cluster inside a GitLab runner for every commit, deploys it with the same Helm charts as production, and tears it down when it's done. How it worked, and the one thing it demanded from developers in return."
date: 2026-07-05
tags: ["infrastructure", "kubernetes", "gitlab-ci", "k3d", "cypress", "ci-cd"]
draft: false
---

Developers testing against something that doesn't look like production is one of the oldest sources of "it worked on my machine." A shared dev environment drifts out of sync with prod configuration over time, and a laptop running Docker Compose never really behaves like a Kubernetes cluster. Bugs that only show up under real orchestration, real networking, real config, don't show up until it's too late to catch them cheaply.

I built a pipeline that closed that gap by giving every commit its own real, disposable environment. Push code, and within minutes you'd have an actual running Kubernetes cluster, built from the same infrastructure-as-code and Helm charts as production, with your change deployed into it and tested against it, gone again once the pipeline finished.

## What ran before anything got deployed

The pipeline didn't hand a developer a live cluster on faith. Before a container image was even built, it ran unit and integration tests to confirm the application was functional on its own. Only after those passed did the pipeline build the container image that would actually get deployed. That ordering mattered: a cluster full of infrastructure is expensive to stand up, so the pipeline earned the right to do that by proving the code underneath it was sound first.

## Building a real cluster inside the runner

Once the image existed, the pipeline used k3d to stand up an actual Kubernetes cluster inside the GitLab runner itself, not a mock, not a set of stubbed-out services, a real cluster running real Kubernetes. It deployed the container that had just been built into that cluster using the same Helm charts used for production, pointed at a throwaway namespace or a dedicated cluster depending on what the developer chose. Namespace was the lighter-weight option for most changes. A dedicated cluster was there for anyone who needed to test something at the cluster level itself, not just the application running inside it.

Because it was the same charts, the same manifests, the same shape of infrastructure, a developer testing here was testing against something that would behave the same way in production. Not an approximation of it.

## Proving it actually worked, not just that it deployed

A pod coming up healthy doesn't mean the feature works. Once the application was live in its own cluster, the pipeline ran Cypress.io against it, driving the application the way a real user would and confirming the change actually did what it was supposed to do, not just that it started without crashing.

That's also the part of this that only worked because of a rule on the developers, not the infrastructure: this whole guarantee depended on developers writing solid end-to-end tests. A pipeline that spins up a perfect replica of production and then runs a shallow test against it isn't actually proving anything. The infrastructure could give you a real environment in minutes. It couldn't give you a test suite that actually exercised the feature. That part was still on the person writing the code.

Every commit or push kicked the whole thing off automatically, and a developer had a live, tested, production-shaped environment to look at within minutes of hitting push, not at the end of a sprint, not after asking someone to provision something by hand.

The infrastructure side of this was the part that got the attention, spinning up a real cluster inside a CI runner isn't something every team gets to see running in minutes. But the part that actually made it trustworthy was quieter: none of this replaces a developer knowing what their feature is supposed to do and proving it with a real test. Fast, production-like infrastructure just meant that proof happened minutes after a commit instead of days after a deploy.
