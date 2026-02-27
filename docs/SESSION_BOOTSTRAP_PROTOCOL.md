# Session Bootstrap Protocol

Use this at the start of any new coding session to resume work without context loss.

## Step 1: Read these files in order
1. `docs/AUTONOMOUS_CONTENT_ENGINE_MASTER_PLAN.md`
2. `docs/AUTONOMOUS_CONTENT_ENGINE_TASKBOARD.md`
3. `AUTONOMOUS_CONTENT_PIPELINE.md`

## Step 2: Verify current runtime state
Run:
```bash
cd /home/dhawal/aibrain-public
git status --short
npm run lint
npm run build
```

## Step 3: Pick next task
- Select highest-priority `TODO` from taskboard (`P0` first).
- Mark it `IN_PROGRESS` with date in the taskboard before coding.

## Step 4: Implementation protocol
1. Make changes.
2. Re-run validation commands.
3. Update task status and work log.
4. Commit with task ID in message (example: `ACE-004 add agent contract schema`).

## Step 5: End-of-session handoff
Before ending a session, always update:
- Task statuses in `docs/AUTONOMOUS_CONTENT_ENGINE_TASKBOARD.md`.
- Any architecture changes in `docs/AUTONOMOUS_CONTENT_ENGINE_MASTER_PLAN.md`.
- If new scripts were added, document usage in `AUTONOMOUS_CONTENT_PIPELINE.md`.

## Required Rule
If context is unclear, treat `docs/AUTONOMOUS_CONTENT_ENGINE_TASKBOARD.md` as the source of truth for what is next.
