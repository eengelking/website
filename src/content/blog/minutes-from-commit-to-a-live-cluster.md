---
title: "Minutes From Commit to a Live Cluster"
description: "A CI/CD pipeline that spins up a real, disposable Kubernetes cluster inside a GitLab runner for every commit, deploys it with the same Helm charts as production, and tears it down when it's done. How it worked, and the one thing it demanded from developers in return."
date: 2026-07-05
tags: ["infrastructure", "kubernetes", "gitlab-ci", "k3d", "cypress", "ci-cd"]
draft: false
---

Push a commit and within minutes there's a real Kubernetes cluster running your change, built from the exact same Helm charts as production, torn down again the moment the pipeline finishes. Not a mock, not Docker Compose pretending to be Kubernetes, an actual cluster spun up inside a GitLab runner and gone before most people would even notice it existed. I built the pipeline that did this, because "it worked on my machine" is one of the oldest lies in software, and it's almost always caused by developers testing against something that doesn't actually resemble production.

<div class="tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>Every commit got its own disposable Kubernetes cluster, deployed with the same Helm charts as production, then torn down once the pipeline finished.</li>
    <li>The pipeline earned the right to spin up that expensive infrastructure: unit and integration tests had to pass first, before it would even build the container image.</li>
    <li>The infrastructure wasn't what made this trustworthy. Real end-to-end tests against the live cluster were, and that part stayed on the developer no matter how good the environment was.</li>
  </ul>
</div>

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

<div class="summary">
  <p class="summary-label">Key Takeaways</p>
  <ul>
    <li>Same Helm charts, same manifests, same shape of infrastructure as production, so a passing test here meant something a Docker Compose approximation never could.</li>
    <li>Cheap code checks ran before expensive infrastructure ever spun up, unit and integration tests had to pass before a cluster was worth the cost of building.</li>
    <li>Fast infrastructure only proves what the tests running against it actually check. A perfect replica of production with a shallow test still proves nothing.</li>
  </ul>
</div>
