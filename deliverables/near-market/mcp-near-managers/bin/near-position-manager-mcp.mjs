#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";

const STORE = process.env.NEAR_POSITION_STORE || path.join(os.tmpdir(), "near-position-manager.json");
const serverInfo = { name: "near-position-manager-mcp", version: "0.1.0" };

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE, "utf8"));
  } catch {
    return { positions: [] };
  }
}

function writeStore(store) {
  fs.mkdirSync(path.dirname(STORE), { recursive: true });
  fs.writeFileSync(STORE, `${JSON.stringify(store, null, 2)}\n`);
}

function id(prefix = "position") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function text(payload) {
  return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
}

const inputSchema = {
  type: "object",
  properties: {
    position_id: { type: "string" },
    owner_account_id: { type: "string" },
    protocol: { type: "string" },
    asset: { type: "string" },
    amount: { type: "string" },
    entry_price: { type: "string" },
    current_price: { type: "string" },
    status: { type: "string", enum: ["draft", "open", "closed", "liquidated"] },
    opened_at: { type: "string" },
    closed_at: { type: "string" },
    metadata: { type: "object" }
  }
};

const tools = [
  { name: "position_create", description: "Create a NEAR position record.", inputSchema },
  { name: "position_get", description: "Get one position by position_id.", inputSchema: { type: "object", required: ["position_id"], properties: { position_id: { type: "string" } } } },
  { name: "position_update", description: "Update a position record.", inputSchema },
  { name: "position_delete", description: "Delete a position by position_id.", inputSchema: { type: "object", required: ["position_id"], properties: { position_id: { type: "string" } } } },
  { name: "position_list", description: "List positions with optional owner/status/protocol filters.", inputSchema },
  { name: "position_query", description: "Search positions by owner, protocol, asset, status, or free text.", inputSchema: { type: "object", properties: { q: { type: "string" }, status: { type: "string" }, owner_account_id: { type: "string" }, protocol: { type: "string" }, asset: { type: "string" } } } }
];

function callTool(name, args = {}) {
  const store = readStore();
  if (name === "position_create") {
    const position = {
      position_id: args.position_id || id(),
      owner_account_id: args.owner_account_id || "",
      protocol: args.protocol || "",
      asset: args.asset || "NEAR",
      amount: args.amount || "",
      entry_price: args.entry_price || "",
      current_price: args.current_price || "",
      status: args.status || "draft",
      opened_at: args.opened_at || new Date().toISOString(),
      closed_at: args.closed_at || "",
      metadata: args.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.positions.push(position);
    writeStore(store);
    return text({ ok: true, position });
  }
  if (name === "position_get") return text({ position: store.positions.find((item) => item.position_id === args.position_id) || null });
  if (name === "position_update") {
    const position = store.positions.find((item) => item.position_id === args.position_id);
    if (!position) return text({ ok: false, error: "position not found" });
    Object.assign(position, Object.fromEntries(Object.entries(args).filter(([, value]) => value !== undefined)), { updated_at: new Date().toISOString() });
    writeStore(store);
    return text({ ok: true, position });
  }
  if (name === "position_delete") {
    const before = store.positions.length;
    store.positions = store.positions.filter((item) => item.position_id !== args.position_id);
    writeStore(store);
    return text({ ok: store.positions.length !== before, deleted: args.position_id });
  }
  if (name === "position_list") {
    let positions = store.positions;
    if (args.status) positions = positions.filter((item) => item.status === args.status);
    if (args.owner_account_id) positions = positions.filter((item) => item.owner_account_id === args.owner_account_id);
    if (args.protocol) positions = positions.filter((item) => item.protocol === args.protocol);
    return text({ positions });
  }
  if (name === "position_query") {
    const q = String(args.q || "").toLowerCase();
    const positions = store.positions.filter((item) => {
      const haystack = JSON.stringify(item).toLowerCase();
      return (!q || haystack.includes(q)) &&
        (!args.status || item.status === args.status) &&
        (!args.owner_account_id || item.owner_account_id === args.owner_account_id) &&
        (!args.protocol || item.protocol === args.protocol) &&
        (!args.asset || item.asset === args.asset);
    });
    return text({ positions });
  }
  return text({ ok: false, error: `unknown tool ${name}` });
}

function handle(message) {
  if (message.method === "initialize") return { jsonrpc: "2.0", id: message.id, result: { protocolVersion: "2024-11-05", serverInfo, capabilities: { tools: {} } } };
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
