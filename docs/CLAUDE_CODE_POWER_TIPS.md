# 10 Claude Code Power Tips Most Developers Aren't Using

*Source: Tamas Piros (DevRel, Trigger.dev) — March 12, 2026*
*Saved: 2026-03-21*

---

## 1. Context Pre-Warming via Session Forking (`--fork-session`)
Load a master session with architecture docs, coding standards, API docs (40k+ tokens), then fork it for each feature. Clean independent branch — no context corruption.

```bash
# Build heavy context once
claude
"Read the architecture docs and prepare for feature work"
/rename master-context

# Fork for specific tasks
claude --resume master-context --fork-session
```

Also great for A/B testing implementation strategies.

## 2. Seamless Code Review Loops (`--from-pr`)
Resume the exact session that created a PR. Full conversation history, trade-offs, constraints.

```bash
claude --from-pr 447
claude --from-pr https://github.com/org/repo/pull/447
```

Compresses "context-switch, re-read, re-understand, respond" → "resume, address, push."

## 3. Compose Prompts in Your Editor (`Ctrl+G`)
Opens `$EDITOR` (Vim, VS Code, etc.) for multi-line prompt composition. Syntax highlighting, macros, proper editing. Save and quit → flushes into Claude's execution loop.

## 4. Inline Shell Execution (`!` prefix)
Bypasses LLM, runs command, auto-appends stdout/stderr to context.

```bash
! npm run test:e2e
! git log --oneline -10
```

No copy-pasting. Model already has the output.

## 5. Opus 4.6 Effort Levels
4 tiers: Low, Medium, High, Max.

- **Low** — boilerplate, variable renaming, JSDoc. Fast and cheap.
- **Max** — race conditions, schema design, gnarly merge conflicts. Deep reasoning.

```bash
export CLAUDE_CODE_EFFORT_LEVEL=low
claude -p "Add JSDoc comments to src/utils.ts"
```

Being intentional about compute across hundreds of automated invocations = real cost savings.

## 6. Parallel Worktrees (`--worktree`)
Isolated physical directories via native git worktree. Each agent gets its own sandbox.

```bash
# Terminal 1
claude --worktree feature/auth-refactor

# Terminal 2
claude --worktree feature/dashboard-ui
```

Same repo, same commit history, zero interference. Merge through normal git workflows.

## 7. Structured JSON Output
Turn Claude into a strictly typed function for automation pipelines.

```bash
claude -p \
  --output-format json \
  --json-schema ./schemas/security-audit.schema.json \
  "Audit src/ for vulnerabilities" | jq '.high_severity[]'
```

Predictable, machine-consumable output. Chain with jq, pipe into dashboards.

## 8. Surgical Context Compaction (Double-Esc)
Double-tap Esc → rewind menu → "Summarise from here."

Preserves early context perfectly, compresses messy trial-and-error into dense summary. Reclaim token budget without losing the narrative. Model retains what was tried and why it failed, at a fraction of the cost.

## 9. Dynamic Multi-Agent Orchestration (`--agents`)
Define session-scoped subagents on the fly with model routing:

```bash
claude --agents '{
  "test-engineer": {
    "description": "Writes unit tests for modified files.",
    "prompt": "You are a strict SDET. Write tests using Vitest. Cover edge cases.",
    "model": "haiku",
    "tools": ["Read", "Write", "Glob"]
  }
}'
```

Main session on Opus for reasoning. Repetitive tasks delegated to Haiku at fraction of cost.

## 10. Headless CI/CD with Hard Budget Caps
Three flags make autonomous CI/CD safe:

```bash
gh pr diff $PR_NUMBER | claude -p \
  --max-turns 3 \
  --max-budget-usd 1.50 \
  "Review this diff for security flaws. Output only actionable feedback."
```

- `--max-turns` — catches runaway logic loops
- `--max-budget-usd` — hard financial ceiling, kills process before burning credits
- `-p` — non-interactive print mode

**You need both.** Either one alone has gaps. Scaling across repos forces prompt discipline — you learn which prompts produce useful output within budget.

---

## Quick Reference

| Tip | Shortcut/Flag | Use Case |
|---|---|---|
| Fork session | `--fork-session` | Branch context for parallel features |
| Resume PR | `--from-pr <id>` | Code review with full history |
| Editor mode | `Ctrl+G` | Complex prompt composition |
| Inline shell | `!command` | Output straight into context |
| Effort levels | `CLAUDE_CODE_EFFORT_LEVEL` | Cost control on automation |
| Worktrees | `--worktree <branch>` | Parallel isolated agents |
| JSON output | `--output-format json --json-schema` | Automation pipelines |
| Compaction | `Esc Esc` → Summarise | Reclaim context budget |
| Dynamic agents | `--agents '{...}'` | Ad-hoc subagent orchestration |

---

*These are production-grade patterns, not chat tricks.*
