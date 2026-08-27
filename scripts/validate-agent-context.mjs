import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const maxAgentBytes = 24 * 1024;
const commitPattern = /^[0-9a-f]{40}$/;
const branchPattern =
  /^(feat|fix|docs|chore|security|research|design|test|refactor)\/[1-9]\d*-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedStates = new Set([
  "ready",
  "claimed",
  "in_progress",
  "blocked",
  "review",
  "merged",
  "needs_reverification",
]);

function fail(message) {
  console.error(`agent-context error: ${message}`);
  process.exitCode = 1;
}

function readText(relativePath) {
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`missing required file: ${relativePath}`);
    return "";
  }

  return readFileSync(absolutePath, "utf8");
}

function parseFrontMatter(relativePath) {
  const text = readText(relativePath);
  if (!text.startsWith("---\n")) {
    fail(`${relativePath} must begin with YAML-style front matter`);
    return { data: {}, text };
  }

  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    fail(`${relativePath} has unterminated front matter`);
    return { data: {}, text };
  }

  const data = {};
  const lines = text.slice(4, end).split("\n");
  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match = /^([a-zA-Z0-9_]+):\s*(.*)$/.exec(line);
    if (!match) {
      fail(`${relativePath} contains unsupported front-matter syntax: ${line}`);
      continue;
    }

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[match[1]] = value;
  }

  return { data, text };
}

function requireKeys(relativePath, data, keys) {
  for (const key of keys) {
    if (!data[key]) fail(`${relativePath} is missing front-matter key: ${key}`);
  }
}

function scanForSecrets(relativePath, text) {
  const patterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{16,}\b/,
    /\b(?:SUPABASE_SERVICE_ROLE_KEY|GITHUB_CLIENT_SECRET|OPENAI_API_KEY)\s*[:=]\s*["']?[A-Za-z0-9_./+-]{8,}/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(text)) fail(`${relativePath} appears to contain a secret-like value`);
  }
}

const agentsPath = "AGENTS.md";
const agents = parseFrontMatter(agentsPath);
requireKeys(agentsPath, agents.data, [
  "schema_version",
  "project",
  "repository",
  "default_branch",
  "current_milestone",
  "status_verified_at_utc",
  "snapshot_main_commit",
  "primary_active_issue",
  "primary_active_branch",
  "primary_active_commit",
  "primary_active_status",
  "primary_active_pr",
]);

const agentBytes = statSync(join(root, agentsPath)).size;
if (agentBytes > maxAgentBytes) {
  fail(`${agentsPath} is ${agentBytes} bytes; keep it below ${maxAgentBytes} bytes`);
}

if (agents.data.repository !== "samir1234khans/ManyHands") {
  fail("AGENTS.md repository must be samir1234khans/ManyHands");
}
if (agents.data.default_branch !== "main") fail("AGENTS.md default_branch must be main");
if (!commitPattern.test(agents.data.snapshot_main_commit ?? "")) {
  fail("AGENTS.md snapshot_main_commit must be a 40-character lowercase commit SHA");
}
if (!commitPattern.test(agents.data.primary_active_commit ?? "")) {
  fail("AGENTS.md primary_active_commit must be a 40-character lowercase commit SHA");
}
if (!branchPattern.test(agents.data.primary_active_branch ?? "")) {
  fail("AGENTS.md primary_active_branch does not follow the issue branch convention");
}
if (!allowedStates.has(agents.data.primary_active_status)) {
  fail(`AGENTS.md has unsupported primary_active_status: ${agents.data.primary_active_status}`);
}
if (!/^\d+$/.test(agents.data.primary_active_issue ?? "")) {
  fail("AGENTS.md primary_active_issue must be numeric");
}
if (!/^\d+$/.test(agents.data.primary_active_pr ?? "")) {
  fail("AGENTS.md primary_active_pr must be numeric");
}

const verifiedAt = Date.parse(agents.data.status_verified_at_utc ?? "");
if (!Number.isFinite(verifiedAt) || !agents.data.status_verified_at_utc.endsWith("Z")) {
  fail("AGENTS.md status_verified_at_utc must be an ISO-8601 UTC timestamp");
} else {
  const ageDays = (Date.now() - verifiedAt) / 86_400_000;
  if (ageDays > 7) {
    console.warn(
      `agent-context warning: status snapshot is ${ageDays.toFixed(1)} days old; re-verify GitHub before relying on it`,
    );
  }
}

const issuePath = `docs/agent-status/issue-${agents.data.primary_active_issue}.md`;
const handoff = parseFrontMatter(issuePath);
requireKeys(issuePath, handoff.data, [
  "schema_version",
  "issue",
  "title",
  "branch",
  "work_state",
  "contributors",
  "base_commit",
  "last_verified_commit",
  "updated_at_utc",
  "pull_request",
  "verification_state",
]);

if (handoff.data.issue !== agents.data.primary_active_issue) {
  fail(`${issuePath} issue does not match AGENTS.md`);
}
if (handoff.data.branch !== agents.data.primary_active_branch) {
  fail(`${issuePath} branch does not match AGENTS.md`);
}
if (handoff.data.last_verified_commit !== agents.data.primary_active_commit) {
  fail(`${issuePath} last_verified_commit does not match AGENTS.md`);
}
if (handoff.data.pull_request !== agents.data.primary_active_pr) {
  fail(`${issuePath} pull_request does not match AGENTS.md`);
}
if (!commitPattern.test(handoff.data.base_commit ?? "")) {
  fail(`${issuePath} base_commit must be a 40-character lowercase commit SHA`);
}
if (!commitPattern.test(handoff.data.last_verified_commit ?? "")) {
  fail(`${issuePath} last_verified_commit must be a 40-character lowercase commit SHA`);
}
if (!allowedStates.has(handoff.data.work_state)) {
  fail(`${issuePath} has unsupported work_state: ${handoff.data.work_state}`);
}

const compatibility = readText("AI_agent.md");
if (!compatibility.includes("[AGENTS.md](AGENTS.md)")) {
  fail("AI_agent.md must point to canonical AGENTS.md");
}

scanForSecrets(agentsPath, agents.text);
scanForSecrets("AI_agent.md", compatibility);
scanForSecrets(issuePath, handoff.text);

const statusDirectory = join(root, "docs/agent-status");
if (existsSync(statusDirectory)) {
  for (const name of readdirSync(statusDirectory)) {
    if (!name.endsWith(".md")) continue;
    const relativePath = `docs/agent-status/${name}`;
    scanForSecrets(relativePath, readText(relativePath));
  }
}

if (!process.exitCode) {
  console.log(
    `valid agent context: issue #${agents.data.primary_active_issue}, ${agents.data.primary_active_branch}, ${agents.data.primary_active_commit}`,
  );
}
