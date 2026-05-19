# Agentfiles

This repository publishes one installable skill: `backlog`.

Install it with:

```bash
npx skills add miguelalcalde/agents --skill backlog
```

The skill gives an LLM a simple project workflow for bootstrapping and using a
local `.backlog/` folder:

```text
.backlog/
  backlog.md
  prds/
  plans/
  notes.md
```

Use it when starting a project or when you want task work to be captured without
turning the repository into a larger agent framework.

Example prompts:

```text
Use the backlog skill to initialize this project.
Use the backlog skill to capture this task.
Use the backlog skill to refine the next ready backlog item.
Use the backlog skill to plan the auth cleanup task.
```

The skill intentionally keeps the workflow lightweight:

- `backlog.md` is the local task queue.
- PRDs are created only when the task needs product-level clarification.
- Plans are created only when implementation needs sequencing or risk tracking.
- Small fixes and nitpicks can stay as backlog items.
