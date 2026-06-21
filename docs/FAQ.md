**English** · [Français](FAQ.fr.md)

# OpenHub — FAQ

### Is OpenHub free?

The OpenHub shell is open-source (MIT). But it includes no AI credits: you use
your own API keys (Anthropic, OpenAI, OpenRouter, Google) or local models via
Ollama. Inference costs are billed by your provider, not by OpenHub.

### Does it work on Windows or Linux?

No, macOS only (macOS 14+) for now. OpenHub stores secrets in an encrypted file at
`~/Library/Application Support/openhub/secrets.enc` (AES-256-GCM) and depends on
Electron's `WebContentsView`. A port isn't planned in the short term.

### Where are my API keys stored?

In an encrypted file at `~/Library/Application Support/openhub/secrets.enc`
(AES-256-GCM). They are never stored in plaintext, nor in local storage, nor in the
apps' WebViews. The proxy loads them into RAM and injects them when the processes
start. The 3 apps only receive a fake local token, never your real keys.

### Where is my data (projects, memory, chats) stored?

Everything is local, in your home directory:

| Data            | Location                            |
| --------------- | ----------------------------------- |
| Projects        | `~/.config/openhub/projects.json`   |
| Memory          | `~/.config/openhub/memory.json`     |
| opencode config | `~/.config/opencode/opencode.json`  |
| Chat history    | local storage + file backup on disk |

Nothing is sent to an OpenHub server — there isn't one.

### Why a local proxy on port 9999?

To centralize secrets and configuration. Instead of pasting your keys into each of
the 3 apps, you enter them once; the proxy (`127.0.0.1:9999`, OpenAI-compatible,
Bearer required) holds the real keys and routes calls to the right provider. It also
serves as the injection point for web search and context enrichment.

### Are my upstream apps modified?

**Never.** OpenHub clones OpenWork, OpenCode, and Open Design into `apps/` and leaves
them intact. All customization (theme, hiding settings, features) happens through
CSS/JS injection from `electron/overrides/`. That's why upstream updates don't break anything.

### Which LLM providers are supported?

Anthropic (Claude), OpenAI (GPT), OpenRouter (multi-model), Ollama (local), and Google
Gemini (via OAuth). You can mix cloud and local depending on the task.

### What is the orchestrator, concretely?

An engine that breaks a goal down into several specialized agents (code, design, work,
research, verification) organized into a dependency graph, then chains their execution
with automatic quality checks. The result is a folder of deliverables. See the
[usage guide](USAGE.md#4-the-multi-agent-orchestrator).

### After an upstream update, the interface is broken. What do I do?

OpenHub ships a selector check that verifies whether the CSS selectors targeted by the
overrides still exist in the apps' new code. If a selector changed upstream, the
relevant override file in `electron/overrides/` needs adjusting.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the full developer workflow.

### How do I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow: fork, branch, test,
then open a pull request.

### How do I report a bug or request a feature?

Via the [GitHub issues](https://github.com/Open-Fable/OpenHub/issues) — templates are
provided for bugs, features, and questions.
