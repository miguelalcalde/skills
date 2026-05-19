---
name: backlog
description: |
  Lightweight project backlog workflow. Use when starting a project, creating or
  maintaining a `.backlog/` folder, capturing tasks, refining work into PRDs,
  planning implementation, or keeping project task memory current without a
  larger agent framework.
---

# Backlog

Use this skill to manage lightweight project memory in `.backlog/`.

The goal is useful continuity, not process ceremony. Create only the artifacts
that reduce ambiguity for the current task.

## Core Structure

When the user asks to initialize or use the backlog workflow, first check whether
`.backlog/` exists. If it does not exist and the user is starting a project or
explicitly asks to initialize the backlog, create:

```text
.backlog/
  backlog.md
  prds/
  plans/
  notes.md
```

Use these roles:

- `.backlog/backlog.md`: local task queue and status.
- `.backlog/prds/PRD-[slug].md`: product reasoning for meaningful features or
  ambiguous work.
- `.backlog/plans/PLAN-[slug].md`: implementation sequencing for non-trivial
  changes.
- `.backlog/notes.md`: durable decisions, conventions, blockers, and context
  that should survive across sessions.

## Bootstrap Content

Create `.backlog/backlog.md` with:

```markdown
# Backlog

## In Progress

## Pending

## Done
```

Create `.backlog/notes.md` with:

```markdown
# Backlog Notes

## Decisions

## Blockers

## Project Conventions
```

Keep `prds/` and `plans/` empty until they are needed.

## Task Format

Use compact backlog items:

```markdown
- [ ] [type] [priority] **Title**. Short description.
```

Allowed types:

- `feat`: new user-facing capability
- `fix`: broken or incorrect behavior
- `nitpick`: small polish or cleanup
- `chore`: maintenance or tooling
- `research`: investigation before deciding what to build

Allowed priorities:

- `high`
- `medium`
- `low`

Example:

```markdown
- [ ] [fix] [high] **Repair login redirect**. Users return to the wrong page after sign-in.
```

## Slugs

Use a slug when a task gets a PRD, plan, branch, or issue link.

Rules:

- lowercase kebab-case
- max 30 characters
- only `a-z`, `0-9`, and `-`
- unique within `.backlog/prds/` and `.backlog/plans/`

Examples:

- `Repair login redirect` -> `login-redirect`
- `Dashboard analytics` -> `dashboard-analytics`

## Workflow

### Capture

When the user shares an idea, bug, nitpick, or task:

1. Ensure `.backlog/` exists if the user wants the backlog workflow active.
2. Add the item under `## Pending`.
3. Choose type and priority from the user's wording and project context.
4. Keep the item short. Put deeper context in a PRD only when needed.

### Triage

When choosing what to work on:

1. Prefer `high`, then `medium`, then `low`.
2. Prefer unblocked, well-scoped tasks.
3. Move the chosen task from `## Pending` to `## In Progress`.
4. Add or derive a slug if the task needs a PRD, plan, branch, or external issue.

### Refine

Create a PRD only when the task benefits from product-level clarification:

- user-facing feature
- ambiguous behavior
- multiple acceptance criteria
- meaningful scope or tradeoffs
- work likely to be resumed later

Skip the PRD for obvious fixes, small chores, and nitpicks.

PRD path:

```text
.backlog/prds/PRD-[slug].md
```

PRD template:

```markdown
---
slug: [slug]
title: [title]
status: draft
created_at: [ISO-8601 timestamp]
---

# [Title]

## Problem

## Goal

## Requirements

## Acceptance Criteria

- [ ]

## Out of Scope

## Open Questions
```

Use statuses:

- `draft`: useful but still being shaped
- `ready`: clear enough to plan or implement
- `blocked`: needs a human decision or external dependency
- `done`: implemented or no longer needed

### Plan

Create a plan only when implementation needs sequencing:

- multiple files or subsystems
- migration, data, auth, payments, security, or deployment risk
- uncertain tests or verification steps
- work that an agent should execute later

Plan path:

```text
.backlog/plans/PLAN-[slug].md
```

Plan template:

```markdown
---
slug: [slug]
status: draft
prd: .backlog/prds/PRD-[slug].md
created_at: [ISO-8601 timestamp]
---

# Plan: [Title]

## Summary

## Tasks

- [ ] [Task with file paths and verification]

## Verification

## Risks

## Notes
```

Use statuses:

- `draft`: being planned
- `ready`: clear enough to execute
- `in_progress`: currently being implemented
- `blocked`: cannot continue without input
- `done`: implemented and verified

### Execute

When implementing from the backlog:

1. Read the relevant backlog item, PRD, and plan.
2. Keep edits scoped to the task.
3. Update the plan checklist if a plan exists.
4. Move the backlog item to `## Done` when complete.
5. Add durable decisions or blockers to `.backlog/notes.md`.

Do not create PRDs or plans retroactively unless they would help future work.

## GitHub Issues

For now, `.backlog/` is the local source of project memory. If the project also
uses GitHub Issues, treat issues as the external task tracker and `.backlog/` as
the reasoning layer:

- GitHub Issue: canonical task, status, discussion, assignment, automation.
- PRD: deeper product reasoning when needed.
- Plan: implementation sequence when needed.
- Pull request: code review and final execution record.

When linking them, include issue URLs in the PRD or plan frontmatter or notes.

Suggested future labels:

- `type:feat`, `type:fix`, `type:nitpick`, `type:chore`, `type:research`
- `priority:high`, `priority:medium`, `priority:low`
- `status:needs-refinement`, `status:ready`, `status:blocked`
- `agent-ready`

Only mark work `agent-ready` when acceptance criteria are clear, scope is
bounded, and no unresolved human decision is required.

## Rules

- Prefer the smallest useful artifact.
- Do not require PRDs for small fixes.
- Do not require plans for obvious one-step changes.
- Keep backlog entries readable in plain Markdown.
- Preserve human-written notes and decisions.
- Before editing `.backlog/`, read the relevant existing files.
- When a task is blocked, write the blocker where future agents will see it.
