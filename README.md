**English** | [简体中文](README.zh.md)

<p align="center">
  <img src="assets/banner-en.png" alt="AngusAI — Build Agents, Not Boilerplate" width="100%" />
</p>

<p align="center">
  <a href="https://www.anguskit.com/en/pricing"><img alt="Community Edition" src="https://img.shields.io/badge/Community-Free-7d5fa8"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/License-GPL--3.0-blue"></a>
  <a href="https://www.anguskit.com/en/docs/ai"><img alt="Docs" src="https://img.shields.io/badge/docs-anguskit.com-7d5fa8"></a>
  <a href="https://www.anguskit.com"><img alt="Website" src="https://img.shields.io/badge/website-anguskit.com-c96128"></a>
</p>

# AngusAI

**Build Agents, Not Boilerplate. From Model to Published App.**

AI Agent Development — the Build product in [AngusKit](https://github.com/AngusKit/AngusKit).

> **This repository hosts documentation only.** AngusAI source code is distributed through private deployment packages, not through this GitHub repository. Earlier revisions of this repository contained application source; as of this update, distribution has moved to AngusKit's packaging pipeline (see [Get the Community Edition](#get-the-community-edition-free) below). This repository now focuses on product information, quickstart guides, and links to the full documentation site.

## What is AngusAI

AngusAI is enterprise AI agent development on infrastructure you control. It turns "pick a model, configure an agent, attach knowledge and tools, validate in a Playground, then publish" into one controlled, repeatable path — instead of a pile of scripts and half-integrated SDKs.

## Key capabilities

- **Visual agent builder** — drag-and-drop configuration for four agent types: general chat, RAG Q&A, workflow-driven, and code-interpreter agents
- **Knowledge · tools · guardrails on demand** — attach a knowledge base, tools, or safety guardrails only where a given agent needs them
- **Flexible reasoning modes** — switch between reasoning strategies per agent without rewriting the agent
- **Workflow-driven agents** — orchestrate multi-step agent workflows, not just single-turn chat
- **Unified model access layer** — one access layer in front of the models you connect, instead of per-model glue code
- **Procedure & Agent Skills** — package reusable procedures and skills that agents can call into

## Screenshot

<p align="center">
  <img src="assets/screenshot-en.png" alt="AngusAI console" width="100%" />
</p>

## Get the Community Edition (free)

About **300 MB**. This zip is **AngusGM + AngusAI** (not the full seven-app suite). At least **2 cores / 4 GB** RAM and **40 GB** disk (model cache extra). Docker Engine + Compose v2.

This first-run path matches the official docs: Docker Compose, the install wizard, **access mode 2** (bundled Caddy), HTTP `:80` (no certificate).

1. Resolve names to this machine (or add to `/etc/hosts` for a local trial). Public DNS name in the wizard is the **suffix** (e.g. `example.com`), not `gm.example.com`.

```bash
127.0.0.1 gm.example.com ai.example.com
```

Open host **80**. App ports stay behind the proxy — do not use `localhost:8801`. Stop Nginx/Caddy/IIS if they already bind 80. On macOS + Docker Desktop, do not run `./install.sh` with `sudo`.

2. Download, unzip, and run the wizard from the package root:

```bash
curl --fail --location --progress-bar -o AngusAI-Community-1.0.0.zip \
  https://repo.anguskit.com/raw/raw-public/AngusKit/ai/AngusAI-Community-1.0.0.zip
unzip AngusAI-Community-1.0.0.zip
cd AngusAI-1.0.0
./install.sh
```

Answer: Install mode `1` (Compose) → Access **`2`** (bundled reverse proxy — do not press Enter) → Proxy `1` (Caddy) → TLS **`4`** (HTTP `:80`, no certificate) → Database `1` (MySQL 8 in Compose) → Public DNS name = `example.com` → set admin password (default user `admin`). Wait for `Install finished.`

3. Confirm health, then open the console:

```bash
./bin/angusctl.sh doctor
```

Look for `doctor: OK`. Open `http://gm.example.com/`, sign in, then open `http://ai.example.com/`.

Need the full suite? Use `AngusKit-Community-1.0.0.zip` from [AngusKit](https://github.com/AngusKit/AngusKit).

First-run guide: **[ai quickstart](https://www.anguskit.com/en/docs/ai/get-started/quickstart)** · Full install (host ZIP, Helm preview, TLS, offline): **[install docs](https://www.anguskit.com/en/docs/ai/latest/en/manual/02-install-deploy)**

## Community vs. Team / Enterprise vs. SaaS

| | Community | Team / Enterprise | SaaS |
|---|---|---|---|
| Price | Free | Paid, private deployment | Paid, hosted |
| Users | Up to 10 | Higher / unlimited seats | Per plan |
| AI apps | Up to 10 | Higher / unlimited | Per plan |
| AI tokens | Self-managed (bring your own model budget) | Self-managed or pooled | Per plan |
| Skills, guardrail policies, MCP, private model onboarding | Not included | Included | Per plan |

Community Edition source is licensed under GPL-3.0 and distributed with each Community installation package. Team and Enterprise editions are proprietary, governed by the **[XCan Business License, Version 1.0](https://www.anguskit.com/licenses/XCBL-1.0)** (XCBL-1.0), distributed only under a paid subscription.

Full pricing and feature comparison: **[anguskit.com/pricing](https://www.anguskit.com/en/pricing)**

## Related AngusKit products

| Product | Focus | Repository |
|---|---|---|
| AngusKit | The full suite (this product + 5 others + AngusGM) | [AngusKit/AngusKit](https://github.com/AngusKit/AngusKit) |
| AngusGit | AI-native code collaboration | [AngusKit/AngusGit](https://github.com/AngusKit/AngusGit) |
| AngusRepo | Universal artifact management | [AngusKit/AngusRepo](https://github.com/AngusKit/AngusRepo) |
| AngusTester | AI-native software testing | [AngusKit/AngusTester](https://github.com/AngusKit/AngusTester) |
| AngusSecurity | Application security & governance | [AngusKit/AngusSecurity](https://github.com/AngusKit/AngusSecurity) |
| AngusInsight | Private product analytics | [AngusKit/AngusInsight](https://github.com/AngusKit/AngusInsight) |

## Documentation & support

- Full docs: [anguskit.com/docs/ai](https://www.anguskit.com/en/docs/ai)
- Contact / sales: [anguskit.com/contact](https://www.anguskit.com/en/contact) · `sales@anguskit.com`
- This repository's Issues are for **documentation feedback and install troubleshooting**. This repository does not accept source code pull requests — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

- This repository's documentation content: see [LICENSE](LICENSE) (GPL-3.0, matching the Community Edition source it describes).
- AngusAI Community Edition product source: GPL-3.0, distributed with each Community installation package.
- AngusAI Team / Enterprise Edition: proprietary, [XCan Business License, Version 1.0](LICENSE-XCBL-1.0) (XCBL-1.0) — see https://www.anguskit.com/licenses/XCBL-1.0. Distributed under a paid subscription only.
