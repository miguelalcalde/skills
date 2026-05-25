---
name: backlog
description: |
  Lightweight project backlog workflow. Use when starting a project, creating or
  maintaining a `.backlog/` folder, capturing inbox ideas, promoting work to
  GitHub Issues, refining work into PRDs, planning implementation, or keeping
  project task memory current without a larger agent framework.
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
  inbox.md
  issues.md
  prds/
  plans/
  memory.md
```

Use these roles:

- `.backlog/inbox.md`: raw ideas, bugs, chores, and nitpicks not yet promoted
  to GitHub Issues.
- `.backlog/issues.md`: generated, read-only mirror of GitHub Issues.
- `.backlog/prds/PRD-[slug].md`: temporary drafting artifact for large or
  ambiguous work before it is promoted to GitHub. After promotion, delete it or
  replace it with a tiny pointer only if the user wants local traceability.
- `.backlog/plans/PLAN-[slug].md`: implementation sequencing for non-trivial
  changes.
- `.backlog/memory.md`: durable decisions, conventions, blockers, gotchas, and
  context future agents should remember.

GitHub Issues are canonical for any promoted task. If an item has a GitHub
Issue, GitHub owns its title, body, status, labels, discussion, and assignment.
Do not keep a second editable copy of the same promoted artifact in `.backlog/`.
Local PRDs are drafting buffers before promotion; local plans are execution
notes when implementation needs sequencing.

## Bootstrap Content

Create `.backlog/inbox.md` with:

```markdown
# Backlog Inbox

Raw ideas not yet promoted to GitHub Issues.

## Inbox
```

Create `.backlog/issues.md` with:

```markdown
<!-- GENERATED FROM GITHUB ISSUES. DO NOT EDIT DIRECTLY. -->

# GitHub Issues

Regenerate this file from GitHub Issues when sync tooling exists.
```

Create `.backlog/memory.md` with:

```markdown
# Backlog Memory

## Decisions

## Blockers

## Project Conventions

## Gotchas
```

Keep `prds/` and `plans/` empty until they are needed.

## Inbox Item Format

Use compact inbox items:

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

When an inbox item is promoted, remove it from `.backlog/inbox.md` or replace it
with a short link to the GitHub Issue. Do not track promoted status in the inbox.

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
2. If the item is rough or not ready for GitHub, add it under `## Inbox` in
   `.backlog/inbox.md`.
3. If the item is ready to track, create or update a GitHub Issue when the user
   wants GitHub-backed tracking.
4. Choose type and priority from the user's wording and project context.
5. Keep the item short. Put deeper context in a PRD only when needed.

Do not add manually maintained task lists to `.backlog/issues.md`.

### Promote

When promoting local work to GitHub Issues:

1. If the work has a PRD, create or update the GitHub Issue from the PRD
   content.
2. Verify the GitHub Issue contains the canonical title, body, labels, and
   acceptance criteria.
3. Remove the inbox item or replace it with the issue URL.
4. Delete the promoted PRD unless the user explicitly wants a tiny pointer file.
5. If keeping a pointer file, include only frontmatter and a short note that the
   GitHub Issue is canonical.
6. Choose labels from the user's wording and project context.
7. Regenerate `.backlog/issues.md` if the project has sync tooling.

Pointer file example:

```markdown
---
slug: [slug]
status: promoted
issue: [GitHub issue URL]
promoted_at: [ISO-8601 timestamp]
---

Canonical artifact lives in GitHub Issue #[number].
```

Use labels like:

- `type:feat`, `type:fix`, `type:nitpick`, `type:chore`, `type:research`
- `priority:high`, `priority:medium`, `priority:low`
- `status:needs-refinement`, `status:ready`, `status:blocked`
- `agent-ready`

Only mark work `agent-ready` when acceptance criteria are clear, scope is
bounded, and no unresolved human decision is required.

### Triage

When choosing what to work on:

1. Prefer `high`, then `medium`, then `low`.
2. Prefer unblocked, well-scoped tasks.
3. For promoted work, read the GitHub Issue first and treat it as canonical.
4. For unpromoted inbox work, either promote it to a GitHub Issue or keep it
   local only if the user wants a tiny one-off task.
5. Add or derive a slug if the task needs a PRD, plan, branch, or issue link.

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
issue: [GitHub issue URL or blank]
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
issue: [GitHub issue URL or blank]
prd: [PRD path or blank]
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

1. Read the relevant GitHub Issue or inbox item, plus any PRD and plan.
2. Keep edits scoped to the task.
3. Update the plan checklist if a plan exists.
4. Update GitHub Issue status through normal GitHub workflow when the work is
   promoted.
5. Add durable decisions, blockers, or gotchas to `.backlog/memory.md`.

Do not create PRDs or plans retroactively unless they would help future work.

## GitHub Issues

Use GitHub Issues as the source of truth for promoted work:

- GitHub Issue: canonical title, body, status, labels, discussion, assignment,
  and automation.
- `.backlog/inbox.md`: local ideas not yet promoted.
- `.backlog/issues.md`: generated metadata snapshot for local visibility.
- PRD: temporary local drafting buffer before promotion; not a parallel copy
  after promotion.
- Plan: local implementation sequence when needed; may reference a GitHub Issue.
- Pull request: code review and final execution record.

When linking them, include issue URLs in the PRD or plan frontmatter. Prefer
GitHub closing keywords such as `Closes #123` in pull requests.

When a project wants GitHub sync, use this skill's
`scripts/backlog-sync.mjs` helper. It requires Node.js and the GitHub CLI, but
no npm dependencies. Run it from the downstream project root, either directly
from the installed skill path or copied into the project as
`scripts/backlog-sync.mjs`.

Default usage:

```bash
node scripts/backlog-sync.mjs
```

The helper discovers the GitHub repository from
`git config --get remote.origin.url`, writes `.backlog/issues.md`, and defaults
to all issues with a limit of 1000. Override defaults with flags:

```bash
node scripts/backlog-sync.mjs --repo owner/repo --output .backlog/issues.md --state all --limit 1000
```

The helper rewrites `.backlog/issues.md`; do not manually edit generated issue
content.

Avoid two-way sync unless the user explicitly asks for it. It needs stable IDs,
conflict handling, deletion behavior, label mapping, and rules for edits from
multiple actors.

## Migration

If an existing project has `.backlog/backlog.md`, treat it as a legacy local
backlog:

1. Ask before rewriting it unless the user explicitly requested migration.
2. Move rough, unpromoted items to `.backlog/inbox.md`.
3. Move or recreate promoted work as GitHub Issues.
4. Create or refresh the generated issue mirror at `.backlog/issues.md`.
5. Stop using `.backlog/backlog.md` once GitHub Issues are canonical.

## Rules

- Prefer the smallest useful artifact.
- Do not require PRDs for small fixes.
- Do not require plans for obvious one-step changes.
- Keep inbox entries readable in plain Markdown.
- Treat `.backlog/issues.md` as generated and read-only.
- Never let Markdown status override GitHub Issue status.
- Do not maintain duplicate editable copies of promoted issue content locally
  and in GitHub.
- Preserve human-written memory and decisions.
- Before editing `.backlog/`, read the relevant existing files.
- When a task is blocked, write the blocker where future agents will see it.
