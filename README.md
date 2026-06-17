<div align="center">

# OpenHub

**Your entire AI workflow in one macOS window.**

A local AI workspace: chat with any model, orchestrate a team of agents that builds a real deliverable, and switch between three integrated open-source tools — [OpenWork](https://github.com/different-ai/openwork), [OpenCode](https://github.com/sst/opencode), and [Open Design](https://github.com/nexu-io/open-design). One LLM proxy, persistent memory, no Docker.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![macOS](https://img.shields.io/badge/platform-macOS_14+-black?logo=apple)](https://www.apple.com/macos)
[![Electron](https://img.shields.io/badge/Electron-42+-47848F?logo=electron&logoColor=white)](https://www.electronjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![typecheck](https://img.shields.io/github/actions/workflow/status/Open-Fable/OpenHub/typecheck.yml?label=typecheck&style=flat)](https://github.com/Open-Fable/OpenHub/actions/workflows/typecheck.yml)
[![lint](https://img.shields.io/github/actions/workflow/status/Open-Fable/OpenHub/lint.yml?label=lint&style=flat)](https://github.com/Open-Fable/OpenHub/actions/workflows/lint.yml)
[![tests](https://img.shields.io/github/actions/workflow/status/Open-Fable/OpenHub/test.yml?label=tests&style=flat)](https://github.com/Open-Fable/OpenHub/actions/workflows/test.yml)

**English** · [Français](README.fr.md)

[Installation](#-installation) | [Usage](docs/USAGE.md) | [Orchestrator](docs/ORCHESTRATOR.md) | [FAQ](docs/FAQ.md) | [Architecture](#-architecture) | [Contributing](CONTRIBUTING.md)

</div>

---

## Why OpenHub?

Most AI tools run in separate windows with separate API keys. None of them talk to each other. OpenHub puts chat, orchestration, code, design, and work in one macOS window. They share the same memory, the same project context, and the same LLM proxy. You enter your keys once, in the macOS Keychain, and that's it.

**Five sidebar slots:** Chat · Code · Work · Design · Orchestrator (plus a Config panel).

## Features

|                              |                                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-agent orchestrator** | Give it a goal and a DAG of agents will plan, build, and verify the result (site, report, code library...). See [the deep dive](docs/ORCHESTRATOR.md) |
| **Built-in chat**            | Talk to any model with history, attachments, web search, and per-model reasoning effort                                                               |
| **3 integrated tools**       | OpenCode (code agent), OpenWork (structured work), Open Design (visual mockups) in a single sidebar that keeps each view's state                      |
| **Unified LLM proxy**        | One endpoint (`127.0.0.1:9999`) routing to Anthropic, OpenAI, OpenRouter, Ollama, and Google Gemini                                                   |
| **Persistent memory**        | Profile and tagged facts that carry over between sessions                                                                                             |
| **Project management**       | Multiple projects with custom instructions, injected into the AI context                                                                              |
| **Secure by default**        | API keys in macOS Keychain, never on disk. Sandboxed WebViews. Localhost-only proxy with Bearer auth                                                  |

---

## Installation

**Requirements:** macOS 14+ (Apple Silicon)

Download the latest `.dmg` from [GitHub Releases](https://github.com/Open-Fable/OpenHub/releases), open it, and drag OpenHub to your Applications folder.

> [!IMPORTANT]
> The `.dmg` is not signed with an Apple Developer certificate (open-source build). macOS Gatekeeper will block it on first launch. To open it:
>
> - **Right-click** `OpenHub.app` → **Open** → confirm, **or**
> - clear the quarantine flag:
>   ```bash
>   xattr -cr /Applications/OpenHub.app
>   ```

### First launch

1. Open the **Config** panel (gear icon in the sidebar)
2. Add your API keys (Anthropic, OpenAI, OpenRouter, Google AI, Brave Search) — stored in macOS Keychain
3. Pick your models

> [!TIP]
> To use Google Gemini models directly (without OpenRouter), run `opencode auth login` in your terminal.

See the [Usage guide](docs/USAGE.md) for how to use the chat, projects, and orchestrator day-to-day.

---

## Architecture

```
WebView (OpenWork / OpenCode / Open Design)
    │
    ├── CSS/JS overrides  ←──  electron/overrides/
    │
    └── LLM calls  ──→  Proxy :9999  ──→  Anthropic / OpenAI / OpenRouter / Ollama / Gemini
                             │
                             ├── Context injection (project, memory)
                             └── Background memory extraction
```

For the full spec — ports, security model, config cascade, and overlay system — see [ARCHITECTURE.md](ARCHITECTURE.md). For the orchestrator engine, see [docs/ORCHESTRATOR.md](docs/ORCHESTRATOR.md).

---

## Contributing

Want to build from source, fix a bug, or add a feature? See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Security

- **API keys** stored in macOS Keychain via `keytar` — never written to disk
- **LLM proxy** runs on `127.0.0.1:9999` with per-session Bearer auth
- **WebViews** sandboxed (`contextIsolation`, `sandbox`, no `nodeIntegration`)
- **Overrides** are CSS/JS injection only — upstream source code is never modified

See [SECURITY.md](SECURITY.md) for the full policy and how to report a vulnerability.

---

## Acknowledgements

OpenHub is a shell, not a fork. The AI tooling belongs to
[OpenCode](https://github.com/sst/opencode) (sst),
[OpenWork](https://github.com/different-ai/openwork) (different-ai), and
[Open Design](https://github.com/nexu-io/open-design) (nexu-io), each cloned at install
time and run unmodified. See [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) for credits and
licenses.

## License

MIT — see [LICENSE](LICENSE). This covers OpenHub's own code only; the bundled tools
keep their own licenses.

---

**[Open an issue](https://github.com/Open-Fable/OpenHub/issues) · [Usage](docs/USAGE.md) · [Orchestrator](docs/ORCHESTRATOR.md) · [FAQ](docs/FAQ.md) · [Architecture](ARCHITECTURE.md) · [Acknowledgements](ACKNOWLEDGEMENTS.md) · [Contribute](CONTRIBUTING.md)**

---
