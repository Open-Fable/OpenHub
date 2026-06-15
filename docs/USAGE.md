**English** · [Français](USAGE.fr.md)

# OpenHub — Usage Guide

This guide explains **how to use OpenHub day to day**, once the app is installed
(see the [README](../README.md#-installation) for installation).

> OpenHub is a shell: it doesn't reinvent OpenWork, OpenCode, and Open Design — it
> brings them together in a single window with a chat, a multi-agent orchestrator, a
> persistent memory, and a single LLM proxy. Your API keys are entered **once** and
> shared across all three tools.

---

## 1. The sidebar

All navigation goes through the left sidebar. Each icon opens an isolated view whose
state is preserved when you switch slots.

| Slot             | Role                                                        | Shortcut |
| ---------------- | ----------------------------------------------------------- | -------- |
| **Chat**         | Built-in Claude-style chat (models, history, web search)    | ⌘1       |
| **Code**         | OpenCode — coding agent (reads/writes files, runs commands) | ⌘2       |
| **Work**         | OpenWork — orchestration and structured work                | ⌘3       |
| **Design**       | Open Design — visual mockups (HTML/CSS/SVG)                 | ⌘4       |
| **Orchestrator** | Projects hub + launching multi-agent workflows              | ⌘5       |
| **Config** ⚙️    | API keys, models, memory, updates, notifications, cache     | —        |

On a small screen, the tab bar automatically switches to a dropdown menu
(configurable in **Config → Updates → navigation mode**).

---

## 2. The built-in chat

Open the **Chat** slot (⌘1).

- **Pick a model**: click the model pill at the bottom of the input area. The menu
  lists the models available through the proxy — cloud (Anthropic, OpenAI,
  OpenRouter), local (Ollama), and workflow models.
- **Reasoning effort**: for models that support it, the effort (minimal → max) is
  remembered per model.
- **Attachments**: the **+** button → images (PNG/JPEG/GIF/WebP) or text files.
- **Web search**: enable the **Web Search** checkbox in the **+** menu; the proxy
  then enriches the context with search results.
- **Project context**: from the **+** menu, link a project to inject its custom
  instructions into the conversation.
- **History**: every conversation is saved automatically (and backed up to disk in
  addition to local storage). Conversations can be pinned to stay at the top of the
  list.

---

## 3. Projects

A **project** bundles instructions, a type, a preferred model, and a context.
Projects are managed from the **Orchestrator** slot.

Two families of projects:

### Standalone projects (`code`, `design`, `work`)

Tied to a single tool (OpenCode / Open Design / OpenWork). You open the
corresponding tool and its **instructions** are injected into the AI context. A
standalone project can also serve as a building block in an orchestration workflow.

### Orchestrator projects (`orchestrator`)

They don't run on their own: they **coordinate several agents**. An orchestrator
project defines:

- a **task** (`task`): the overall goal, written in natural language;
- **dependencies**: the agents (projects) to chain together;
- **settings** (`orchSettings`): auto-distribution, consistency checking, retry on
  error, adaptation to weaker models.

Projects are stored in `~/.config/openhub/projects.json`. A project's instructions
are prepended to the system prompt of the relevant calls (unless memory is explicitly
bypassed for that project).

---

## 4. The multi-agent orchestrator

The heart of OpenHub: breaking a goal down into a **DAG of agents** that together
produce a deliverable (website, report, ebook, code library, study, slides…).

**Launching a workflow:**

1. Open the **Orchestrator** slot (⌘5).
2. Create/select a project of type `orchestrator`.
3. Write the goal in the **task** field, choose the agents (dependencies) and the
   settings.
4. Run the execution.

**What happens next:**

- **Planning** — a model breaks the task down into sub-steps (several planning
  iterations are possible).
- **Execution** — each agent runs through the right backend depending on its type:
  - `code` → OpenCode (real CLI commands, file access),
  - `design` → Open Design (HTML/CSS/SVG mockups),
  - `work` → OpenWork (structured data, documents),
  - pure LLM agent → direct model call with context injection,
  - `verifier` / `research` → quality-control / research agents.
- **DAG order** — agents declare their dependencies; upstream results are injected as
  context into downstream agents.
- **Quality gate** — deterministic checks verify the deliverables and rerun failing
  nodes (based on the configured number of retries).

**Deliverables**: agents write their files into the run's **workspace** (a folder of
files), via `filepath:` blocks in their output. That folder is what you get back at
the end.

For a deep technical dive, see [ORCHESTRATOR.md](ORCHESTRATOR.md).

---

## 5. Persistent memory

Configurable in **Config → Memory**.

- **Profile**: free-form text describing you (job, preferences). Injected into AI
  calls to personalize the answers.
- **Facts**: short, reusable pieces of information (with tags). Only the facts
  relevant to the request are injected, within a token budget, so as not to bloat the
  prompt.
- **Auto-extraction**: an option to let the model automatically extract facts from
  conversations.
- **Disabling**: a global switch turns off all memory injection; a project can also
  bypass it individually.

Storage: `~/.config/openhub/memory.json`.

---

## 6. Config (API keys & models)

The **Config** ⚙️ slot. Your keys are stored in the **macOS Keychain**, never on disk
or in local storage.

- **API keys**: Anthropic, OpenAI, OpenRouter, Ollama (URL), GitHub, Brave Search,
  Google Gemini (OAuth).
- **Models**: memory classifier model, default reasoning effort, vision proxy, web
  search.
- **Updates**: check/update the 3 upstream apps.
- **Notifications**: per source (Work / Code / Design).
- **Cache**: prefix-caching dashboard (hit rate, tokens saved).

> To use Gemini directly (without OpenRouter), run `opencode auth login` in your
> terminal.

---

## 7. Updating the upstream apps

```bash
npm run update:apps     # git pull + rebuild des 3 apps
npm run check:selectors # vérifie que les sélecteurs CSS des overrides existent encore
```

The source code of the 3 apps is **never modified**: all customization lives in
`electron/overrides/`, so upstream updates stay painless.

---

For frequently asked questions (costs, data, macOS-only, troubleshooting), see the
[FAQ](FAQ.md).
