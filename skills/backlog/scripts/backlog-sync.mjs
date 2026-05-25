#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DEFAULT_OUTPUT = ".backlog/issues.md";
const DEFAULT_LIMIT = "1000";
const DEFAULT_REMOTE = "origin";
const DEFAULT_STATE = "all";
const VALID_STATES = new Set(["all", "open", "closed"]);

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

const outputPath = resolve(options.output || DEFAULT_OUTPUT);
const limit = options.limit || DEFAULT_LIMIT;
const state = options.state || DEFAULT_STATE;
const remote = options.remote || DEFAULT_REMOTE;
const repo = options.repo || getRepoFromGitRemote(remote);

if (!VALID_STATES.has(state)) {
  console.error(`Invalid --state "${state}". Use one of: all, open, closed.`);
  process.exit(1);
}

if (!repo) {
  console.error("Could not determine GitHub repository.");
  console.error(`Set it explicitly with --repo owner/repo, or configure remote.${remote}.url.`);
  process.exit(1);
}

const fields = [
  "number",
  "title",
  "state",
  "labels",
  "assignees",
  "url",
  "updatedAt",
].join(",");

const args = [
  "issue",
  "list",
  "--state",
  state,
  "--limit",
  limit,
  "--repo",
  repo,
  "--json",
  fields,
];

let issues;

try {
  const output = execFileSync("gh", args, { encoding: "utf8" });
  issues = JSON.parse(output);
} catch (error) {
  const message = error.stderr || error.message;
  console.error(`Failed to read GitHub Issues with gh: ${message}`);
  console.error("Install and authenticate GitHub CLI, then run this script again.");
  process.exit(1);
}

const generatedAt = new Date().toISOString();
const rows = issues.map(formatIssue);

const markdown = [
  "<!-- GENERATED FROM GITHUB ISSUES. DO NOT EDIT DIRECTLY. -->",
  "",
  "# GitHub Issues",
  "",
  `Generated at: ${generatedAt}`,
  "",
  "| Issue | Status | Title | Labels | Assignees | Updated |",
  "| --- | --- | --- | --- | --- | --- |",
  ...rows,
  "",
].join("\n");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, markdown);

console.log(`Synced ${issues.length} GitHub Issues to ${outputPath}`);

function parseArgs(args) {
  const parsed = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      failUsage(`Unexpected argument: ${arg}`);
    }

    const [name, inlineValue] = arg.slice(2).split("=", 2);
    const value = inlineValue ?? args[index + 1];

    if (!inlineValue) {
      index += 1;
    }

    if (!value || value.startsWith("--")) {
      failUsage(`Missing value for --${name}`);
    }

    switch (name) {
      case "repo":
      case "output":
      case "limit":
      case "remote":
      case "state":
        parsed[name] = value;
        break;
      default:
        failUsage(`Unknown option: --${name}`);
    }
  }

  return parsed;
}

function failUsage(message) {
  console.error(message);
  console.error("Run with --help for usage.");
  process.exit(1);
}

function getRepoFromGitRemote(remote) {
  try {
    const url = execFileSync("git", ["config", "--get", `remote.${remote}.url`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return parseGitHubRepo(url);
  } catch {
    return null;
  }
}

function parseGitHubRepo(url) {
  const patterns = [
    /^https:\/\/github\.com\/([^/]+\/[^/]+?)\/?$/,
    /^git@github\.com:([^/]+\/[^/]+?)$/,
    /^ssh:\/\/git@github\.com\/([^/]+\/[^/]+?)\/?$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);

    if (match) {
      return match[1].replace(/\.git$/, "");
    }
  }

  return null;
}

function printHelp() {
  console.log(`Usage: node scripts/backlog-sync.mjs [options]

Regenerate .backlog/issues.md from GitHub Issues.

Options:
  --repo owner/repo       GitHub repository. Defaults to remote.origin.url.
  --remote name          Git remote to inspect when --repo is omitted. Default: origin.
  --output path          Markdown output file. Default: .backlog/issues.md.
  --limit number         Maximum issues to fetch. Default: 1000.
  --state all|open|closed
                          Issue state to fetch. Default: all.
  --help                 Show this help message.
`);
}

function formatIssue(issue) {
  const labels = (issue.labels || [])
    .map((label) => label.name)
    .sort()
    .map((name) => `\`${escapeTableCell(name)}\``)
    .join(", ");

  const assignees = (issue.assignees || [])
    .map((assignee) => assignee.login || assignee.name)
    .filter(Boolean)
    .sort()
    .map(escapeTableCell)
    .join(", ");

  const updated = issue.updatedAt ? issue.updatedAt.slice(0, 10) : "";
  const title = `[${escapeTableCell(issue.title)}](${issue.url})`;

  return `| ${[
    `#${issue.number}`,
    issue.state,
    title,
    labels || "-",
    assignees || "-",
    updated || "-",
  ].join(" | ")} |`;
}

function escapeTableCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}
