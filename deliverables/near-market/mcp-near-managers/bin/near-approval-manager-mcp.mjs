#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";

const STORE = process.env.NEAR_APPROVAL_STORE || path.join(os.tmpdir(), "near-approval-manager.json");
const serverInfo = { name: "near-approval-manager-mcp", version: "0.1.0" };

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE, "utf8"));
  } catch {
    return { approvals: [] };
  }
}

function writeStore(store) {
  fs.mkdirSync(path.dirname(STORE), { recursive: true });
  fs.writeFileSync(STORE, `${JSON.stringify(store, null, 2)}\n`);
}

function id(prefix = "approval") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function text(payload) {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

const inputSchema = {
  type: "object",
  properties: {
    approval_id: { type: "string" },
    owner_account_id: { type: "string" },
    approved_account_id: { type: "string" },
    contract_id: { type: "string" },
    token_id: { type: "string" },
    allowance: { type: "string" },
    expires_at: { type: "string" },
    status: { type: "string", enum: ["draft", "active", "revoked", "expired"] },
    metadata: { type: "object" }
  }
};

const tools = [
  { name: "approval_create", description: "Create a NEAR approval record.", inputSchema },
  { name: "approval_get", description: "Get one approval by approval_id.", inputSchema: { type: "object", required: ["approval_id"], properties: { approval_id: { type: "string" } } } },
  { name: "approval_update", description: "Update an approval record.", inputSchema },
  { name: "approval_delete", description: "Delete an approval by approval_id.", inputSchema: { type: "object", required: ["approval_id"], properties: { approval_id: { type: "string" } } } },
  { name: "approval_list", description: "List approvals with optional status or account filters.", inputSchema },
  { name: "approval_query", description: "Search approvals by owner, approved account, contract, token, status, or free text.", inputSchema: { type: "object", properties: { q: { type: "string" }, status: { type: "string" }, account_id: { type: "string" } } } }
];

function callTool(name, args = {}) {
  const store = readStore();
  if (name === "approval_create") {
    const approval = {
      approval_id: args.approval_id || id(),
      owner_account_id: args.owner_account_id || "",
      approved_account_id: args.approved_account_id || "",
      contract_id: args.contract_id || "",
      token_id: args.token_id || "NEAR",
      allowance: args.allowance || "",
      expires_at: args.expires_at || "",
      status: args.status || "draft",
      metadata: args.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.approvals.push(approval);
    writeStore(store);
    return text({ ok: true, approval });
  }
  if (name === "approval_get") {
    return text({ approval: store.approvals.find((item) => item.approval_id === args.approval_id) || null });
  }
  if (name === "approval_update") {
    const approval = store.approvals.find((item) => item.approval_id === args.approval_id);
    if (!approval) return text({ ok: false, error: "approval not found" });
    Object.assign(approval, Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined)), { updated_at: new Date().toISOString() });
    writeStore(store);
    return text({ ok: true, approval });
  }
  if (name === "approval_delete") {
    const before = store.approvals.length;
    store.approvals = store.approvals.filter((item) => item.approval_id !== args.approval_id);
    writeStore(store);
    return text({ ok: store.approvals.length !== before, deleted: args.approval_id });
  }
  if (name === "approval_list") {
    let approvals = store.approvals;
    if (args.status) approvals = approvals.filter((item) => item.status === args.status);
    if (args.owner_account_id) approvals = approvals.filter((item) => item.owner_account_id === args.owner_account_id);
    if (args.approved_account_id) approvals = approvals.filter((item) => item.approved_account_id === args.approved_account_id);
    return text({ approvals });
  }
  if (name === "approval_query") {
    const q = String(args.q || "").toLowerCase();
    const account = String(args.account_id || "").toLowerCase();
    const approvals = store.approvals.filter((item) => {
      const haystack = JSON.stringify(item).toLowerCase();
      return (!q || haystack.includes(q)) &&
        (!args.status || item.status === args.status) &&
        (!account || [item.owner_account_id, item.approved_account_id].some((value) => String(value).toLowerCase() === account));
    });
    return text({ approvals });
  }
  return text({ ok: false, error: `unknown tool ${name}` });
}

function handle(message) {
  if (message.method === "initialize") {
    return { jsonrpc: "2.0", id: message.id, result: { protocolVersion: "2024-11-05", serverInfo, capabilities: { tools: {} } } };
  }
  if (message.method === "tools/list") return { jsonrpc: "2.0", id: message.id, result: { tools } };
  if (message.method === "tools/call") return { jsonrpc: "2.0", id: message.id, result: callTool(message.params?.name, message.params?.arguments || {}) };
  return { jsonrpc: "2.0", id: message.id, error: { code: -32601, message: "method not found" } };
}

readline.createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  try {
    process.stdout.write(`${JSON.stringify(handle(JSON.parse(line)))}\n`);
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: error.message } })}\n`);
  }
});
