# AGENTS.md — OpenHub (Opencode)

Agent definitions for multi-agent workflows using Opencode.

## Available Agent Types

| Agent Type | Use Case |
|------------|----------|
| `explore` | Codebase exploration, finding files, searching patterns |
| `general-purpose` | Complex multi-step tasks, research, implementation |

## When to Use Agents

### `explore` — Codebase Discovery
- Finding files by pattern or naming convention
- Searching for specific code patterns across the project
- Understanding how a feature is implemented
- Quick answers about project structure

### `general-purpose` — Complex Tasks
- Implementing new features
- Refactoring existing code
- Researching solutions across multiple files
- Any multi-step task requiring file modifications

## Parallel Execution

Use parallel agent invocation for independent tasks:
- Security review + UI changes (independent)
- Build validation + Selector checks (independent)

Never parallelize agents that write to the same files.

## Agent Rules

1. Every agent reads `ARCHITECTURE.md` before acting.
2. No agent modifies files in `apps/` (upstream source code).
3. Security is CRITICAL — review before committing.
4. Validate selectors after every change to `electron/overrides/`.