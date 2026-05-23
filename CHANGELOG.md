# Changelog

## Unreleased

### Changed

- GitHub Issues are now canonical for promoted work. `.backlog/` remains the
  local project memory layer, not a competing task tracker.
- The default backlog structure is now:

```text
.backlog/
  inbox.md
  issues.md
  prds/
  plans/
  memory.md
```

- `.backlog/inbox.md` replaces `.backlog/backlog.md` for rough ideas and tasks
  that are not yet promoted to GitHub Issues.
- `.backlog/issues.md` is a generated/read-only mirror of GitHub Issues.
- `.backlog/memory.md` replaces `.backlog/notes.md` for curated decisions,
  conventions, blockers, gotchas, and durable agent context.
- PRD and plan templates now include an optional `issue` frontmatter field.

### Migration Notes

For projects already using an older `.backlog/` layout:

1. Create the new files if they do not exist:

```text
.backlog/inbox.md
.backlog/issues.md
.backlog/memory.md
```

2. Rename `.backlog/notes.md` to `.backlog/memory.md` and keep the existing
   human-written content. Add a `## Gotchas` section if it would help future
   agents.
3. Review `.backlog/backlog.md`:
   - Move rough, unpromoted items into `.backlog/inbox.md` under `## Inbox`.
   - Promote trackable work to GitHub Issues.
   - Preserve links from related PRDs and plans to their GitHub Issues.
4. Create or regenerate `.backlog/issues.md` from GitHub Issues. Include this
   header:

```markdown
<!-- GENERATED FROM GITHUB ISSUES. DO NOT EDIT DIRECTLY. -->
```

5. Stop manually maintaining `.backlog/backlog.md` once GitHub Issues are
   canonical. Remove or archive it only after confirming its content has moved
   to the inbox, GitHub Issues, PRDs, plans, or memory.

The important invariant is: if an item has a GitHub Issue, GitHub owns its
status.

## 2026-05-23

### Changed

- Updated the install instructions to use:

```bash
npx skills add miguelalcalde/skills --skill backlog
```

- Documented that this repository publishes a single installable skill named
  `backlog`.
- Kept the repository focused on the `backlog` skill and its minimal
  documentation.

### Removed

- Removed the previous portable agent framework, slash commands, setup script,
  global installer, root backlog scaffold files, and unrelated personal skills.
