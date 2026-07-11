import type { Project } from '../types/content';

export const projects: Project[] = [
  {
    name: 'AI-Powered Career Documentation System',
    description:
      "A multi-agent Claude Code system that transforms how professionals manage employment history and generate targeted resumes. Eight specialized agents handle document creation, deep forensic role review, batch gap analysis, job-posting alignment, resume generation and validation, job search keyword strategy, and LinkedIn profile optimization.",
    technologies: ['Claude Code Agent SDK', 'Prompt Engineering', 'Multi-Agent Architecture'],
  },
  {
    name: 'Multi-Cloud Kubernetes VM Operator',
    description:
      'A Kubernetes operator (~11,300 lines of Go) enabling declarative management of cloud virtual machines across AWS, Azure, Hetzner, and DigitalOcean through Custom Resource Definitions. Implements the controller pattern with reconciliation loops, provider-agnostic CRDs, TTL-based cleanup, and full GitOps compatibility.',
    technologies: ['Go', 'Kubernetes Operators', 'CRDs', 'Helm', 'Prometheus'],
  },
  {
    name: 'Web-Based Terminal Proxy',
    description:
      'A browser-accessible SSH terminal proxy that integrates natively with Kubernetes, automatically retrieving SSH credentials from K8s Secrets. Session persistence via deterministic tmux naming, a real-time connection checklist, and sub-1-second server startup via lazy-loaded dependencies.',
    technologies: ['Node.js', 'TypeScript', 'Kubernetes', 'tmux', 'xterm.js'],
  },
  {
    name: 'bkn — Lightweight Command Runner',
    description:
      'A Go-based CLI tool ("Bacon") that serves as a simplified Make alternative using YAML configuration files. Supports recursive includes for modular command libraries, variable substitution, and ANSI color-coded output.',
    technologies: ['Go', 'CLI', 'YAML'],
    link: 'https://github.com/eengelking/bkn',
  },
  {
    name: 'CPU Monitor',
    description:
      'A terminal-based CPU monitoring tool written in Go, with real-time per-core usage visualization, a 60-second history graph, and memory tracking, tuned to run at 1-2% CPU overhead.',
    technologies: ['Go', 'TUI', 'Claude Code'],
    link: 'https://github.com/eengelking/cpu-monitor',
  },
  {
    name: 'localscore',
    description:
      'A self-hosted tool that turns a raw CVSS base score into the score that actually applies to a specific system. A short plain-English interview about reachability, auth, data sensitivity, and blast radius per "location" reshapes any pasted CVSS vector or CVE lookup into a context-aware environmental score.',
    technologies: ['TypeScript', 'Hono', 'React', 'SQLite', 'Docker'],
    link: 'https://github.com/eengelking/localscore',
  },
  {
    name: 'LookSharp',
    description:
      'An iPad app for managing sheet music. Tilt your head to turn the page instead of taking your hands off the instrument, hence the name.',
    technologies: ['Swift', 'iPadOS', 'Xcode', 'Claude Code'],
  },
  {
    name: 'Pathfinder',
    description:
      'An iOS app for building custom walking, biking, and hiking routes. Set paths dynamically or manually, track distance in real time, and save routes to revisit later.',
    technologies: ['Swift', 'iOS', 'Xcode', 'Claude Code'],
  },
  {
    name: 'NixOS Configuration',
    description:
      'A fully fleshed-out, flake-based NixOS configuration with Home Manager integration, built to be modular and STIG/CIS-hardened, with mixed stable/unstable channels for faster security patching and an optimized, vulnerability-scanned container build workflow.',
    technologies: ['NixOS', 'Nix Flakes', 'Home Manager'],
    link: 'https://github.com/eengelking/nixos',
  },
  {
    name: 'Orrery',
    description:
      'An early-stage hardened HCI platform built on bootc, designed to be easy to upgrade and scale.',
    technologies: ['bootc', 'Immutable OS', 'HCI'],
  },
];
