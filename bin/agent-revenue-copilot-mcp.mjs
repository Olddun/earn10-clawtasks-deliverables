#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PRODUCT_PATH = join(ROOT, "agent-revenue-copilot", "product.json");
const PLAYBOOK_PATH = join(ROOT, "agent-money", "README.md");
const FAILURE_PATH = join(ROOT, "agent-money", "dont-try-agent-money-failure-paths.md");
const BASE_RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const RECEIVE_ADDRESS = "0x4cF42D04b29f903ce7Ae750317C3A85a9631A336";
const TARGET_USDC = 9.9;
const LIVE_ORIGIN = "https://doctors-lighting-facial-admissions.trycloudflare.com";

let inputBuffer = "";

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function textResult(text) {
  return { content: [{ type: "text", text }] };
}

function jsonText(value) {
  return JSON.stringify(value, null, 2);
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function readDoc(path, maxChars = 12000) {
  const text = await readFile(path, "utf8");
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n\n[truncated]` : text;
}

function encodeBalanceOf(address) {
  const clean = address.toLowerCase().replace(/^0x/, "");
  if (!/^[0-9a-f]{40}$/.test(clean)) throw new Error("Invalid EVM address");
  return `0x70a08231${clean.padStart(64, "0")}`;
}

function formatUsdc(rawHex) {
  const value = BigInt(rawHex || "0x0");
  const whole = value / 1_000_000n;
  const fraction = String(value % 1_000_000n).padStart(6, "0");
  return `${whole}.${fraction}`;
}

async function rpc(method, params) {
  const res = await fetch(BASE_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(12000),
  });
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(body.error?.message || `${res.status} ${res.statusText}`);
  }
  return body.result;
}

async function checkPayment() {
  const result = await rpc("eth_call", [{ to: USDC, data: encodeBalanceOf(RECEIVE_ADDRESS) }, "latest"]);
  const balance = formatUsdc(result);
  return {
    network: "Base mainnet",
    token: "USDC",
    token_contract: USDC,
    receive_address: RECEIVE_ADDRESS,
    required_amount: TARGET_USDC.toFixed(2),
    current_balance: balance,
    target_met: Number(balance) >= TARGET_USDC,
    counting_rule: "Count only confirmed usable, claimable, withdrawable, or spendable value.",
  };
}

function routesFromProduct(product) {
  const initial = product.initial_package;
  return {
    price_usd: initial.price_usd,
    canonical: {
      marketplace: initial.canonical_marketplace,
      service_id: initial.canonical_service_id,
      price_cents: initial.price_cents,
    },
    marketplaces: initial.additional_marketplaces,
    direct_payment: initial.direct_payment,
    paid_order_form: product.support.paid_order_form,
    fulfillment: product.fulfillment,
    safety: {
      do_not_send: [
        "private keys",
        "seed phrases",
        "API keys",
        "passwords",
        "session cookies",
        "fake engagement requests",
        "deposit-funded tasks",
        "KYC bypass requests",
      ],
    },
  };
}

const tools = [
  {
    name: "product_manifest",
    description: "Return the machine-readable Agent Revenue Copilot product manifest.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "route_triage",
    description: "Recommend free playbook, $1.99 triage, or $9.90 starter audit based on the buyer's target and route type.",
    inputSchema: {
      type: "object",
      properties: {
        target_usd: { type: "number", description: "Approximate target earning amount in USD, if known." },
        goal: { type: "string", description: "Short description of the earning or monetization goal." },
        route_type: { type: "string", description: "Examples: one_off, repeated_income, x402, mcp, marketplace, unknown." },
        constraints: {
          type: "array",
          items: { type: "string" },
          description: "Known constraints such as no_kyc, no_deposit, no_social, no_user_funds.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "buyer_routes",
    description: "Return active purchase, x402, direct USDC, and order-intake routes for the $9.90 starter audit.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "checkout_diagnostics",
    description: "Return a one-path checkout recommendation, route readiness map, operator handoff instructions, and payment evidence requirements.",
    inputSchema: {
      type: "object",
      properties: {
        can_pay_x402: { type: "boolean", description: "True if the buyer agent/operator can complete an x402 payment." },
        can_pay_base_usdc: { type: "boolean", description: "True if the buyer can send exact USDC on Base mainnet." },
        needs_operator_handoff: { type: "boolean", description: "True if the agent can inspect but cannot autonomously pay." },
        target_usd: { type: "number", description: "Approximate buyer target value in USD, if known." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "free_playbook",
    description: "Return the free AI Agent Earn USDC playbook lead magnet.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "failure_paths",
    description: "Return routes that agents should usually skip first when trying to earn real spendable value.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "payment_status",
    description: "Check the direct Base USDC invoice balance for the $9.90 starter audit.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function tracked(route, source = "stdio-route-triage") {
  return `${LIVE_ORIGIN}/agent-revenue-copilot/out?route=${encodeURIComponent(route)}&source=${encodeURIComponent(source)}`;
}

function routeTriage(product, input = {}) {
  const targetUsd = Number(input.target_usd || 0);
  const goal = String(input.goal || "");
  const routeType = String(input.route_type || "");
  const constraints = Array.isArray(input.constraints) ? input.constraints.map((item) => String(item).toLowerCase()) : [];
  const haystack = `${goal} ${routeType} ${constraints.join(" ")}`.toLowerCase();
  const forbiddenSignals = ["kyc bypass", "fake engagement", "requires deposit", "deposit required", "fund deposit", "user funds", "private key", "seed phrase", "spam"].filter((term) => haystack.includes(term));
  const isRecurringOrBuilder = /repeat|recurring|agency|client|x402|mcp|api|marketplace|tool|service|monetiz/.test(haystack);
  const isTinyOneOff = targetUsd > 0 && targetUsd <= 15 && !isRecurringOrBuilder;

  if (forbiddenSignals.length) {
    return {
      decision: "do_not_buy_or_execute",
      reason: "The stated route touches forbidden work. Agent Revenue Copilot will not help with fraud, spam, fake engagement, KYC bypass, deposits, user-funded self-purchases, or sensitive credential handling.",
      matched_blockers: forbiddenSignals,
      free_safety_map: "https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-money/dont-try-agent-money-failure-paths.md",
    };
  }

  if (isTinyOneOff) {
    return {
      decision: "read_free_playbook_first",
      reason: "For a one-off target near $10, the $9.90 audit consumes too much of the upside. Start free; use the $1.99 triage only if stuck or if saved time is worth more than the fee.",
      recommended_next: "free_playbook",
      optional_paid_entry: {
        name: product.entry_offer?.name || "Agent Revenue Copilot First-Dollar Triage",
        price: "1.99 USDC",
        tracked_checkout: tracked("triage_mcplug"),
        tracked_direct_402: tracked("triage_402"),
        sample: product.links?.triage_sample,
      },
    };
  }

  if (isRecurringOrBuilder || targetUsd >= 50) {
    return {
      decision: "buy_starter_audit",
      reason: "The target is high enough, recurring, or tied to x402/MCP/API/marketplace productization, so a route audit can save more than its 9.90 USDC price.",
      recommended_checkout: {
        price: "9.90 USDC",
        tracked_x402: tracked("audit_agoragentic"),
        tracked_agent402_fallback: tracked("audit_agent402"),
        tracked_direct_402: tracked("audit_402"),
        buyer_decision: product.links?.buyer_decision,
      },
    };
  }

  return {
    decision: "use_first_dollar_triage",
    reason: "The target is not obviously big enough for the full 9.90 audit, but a 1.99 second opinion can reduce dead-end exploration.",
    recommended_checkout: {
      name: product.entry_offer?.name || "Agent Revenue Copilot First-Dollar Triage",
      price: "1.99 USDC",
      tracked_checkout: tracked("triage_mcplug"),
      tracked_direct_402: tracked("triage_402"),
      sample: product.links?.triage_sample,
    },
    escalation_rule: "Escalate to the 9.90 starter audit only for $50+ targets, repeated-income workflows, or x402/MCP/API monetization work.",
  };
}

function checkoutDiagnostics(product, input = {}) {
  const initial = product.initial_package;
  const targetUsd = Number(input.target_usd || 0);
  const canPayX402 = input.can_pay_x402 === true;
  const canPayBaseUsdc = input.can_pay_base_usdc === true;
  const needsOperatorHandoff = input.needs_operator_handoff === true;
  let recommendedNext = "operator_handoff";
  let reason = "The buyer agent can inspect checkout routes, but payment should be completed by an authorized operator or wallet-capable agent.";

  if (targetUsd > 0 && targetUsd <= 15) {
    recommendedNext = "consider_free_playbook_or_1_99_triage";
    reason = "For a small one-off target, the free playbook or $1.99 triage is usually a better fit than the $9.90 starter audit.";
  } else if (canPayX402) {
    recommendedNext = "pay_agoragentic_x402";
    reason = "Use the recommended x402 route because the buyer can complete an agent-native payment.";
  } else if (canPayBaseUsdc) {
    recommendedNext = "pay_direct_base_usdc";
    reason = "Use the direct Base USDC invoice because the buyer can send exact USDC and then submit payment evidence.";
  } else if (needsOperatorHandoff) {
    recommendedNext = "ask_operator_to_approve_one_payment_path";
    reason = "Prepare a human/operator approval request with one chosen route, price, expected deliverable, and safety constraints.";
  }

  return {
    ok: true,
    diagnosis: "checkout_ready_but_payment_not_bypassed",
    recommended_next: recommendedNext,
    reason,
    one_path_rule: "Choose exactly one payment path per order. Do not pay both marketplace/x402 and direct Base USDC for the same brief.",
    no_autonomous_payment_without_authorization: true,
    routes: {
      recommended_x402: {
        name: "Agoragentic x402",
        status: "active_recommended_agent_checkout",
        price: `${initial.price_usd.toFixed(2)} USD/USDC`,
        use_when: "Buyer can complete x402 or marketplace-relay payment.",
        tracked_checkout: tracked("audit_agoragentic", "stdio-checkout-diagnostics"),
        discover: tracked("audit_agoragentic_discover", "stdio-checkout-diagnostics"),
        evidence_after_payment: "marketplace receipt, x402 receipt, or order id",
      },
      fallback_x402: {
        name: "Agent402",
        status: "active_fallback_agent_checkout",
        price: `${initial.price_usd.toFixed(2)} USD/USDC`,
        use_when: "Buyer already uses Agent402 or Agoragentic is not reachable.",
        tracked_checkout: tracked("audit_agent402", "stdio-checkout-diagnostics"),
        evidence_after_payment: "Agent402 service receipt or settlement evidence",
      },
      direct_base_usdc: {
        name: "Direct Base USDC",
        status: "live_direct_invoice",
        price: `${initial.price_usd.toFixed(2)} USDC`,
        use_when: "Operator can send exact Base USDC and then submit a transaction hash.",
        payment_request: tracked("audit_payment_json", "stdio-checkout-diagnostics"),
        payment_required_endpoint: tracked("audit_402", "stdio-checkout-diagnostics"),
        receive_address: RECEIVE_ADDRESS,
        token: USDC,
        evidence_after_payment: "Base transaction hash submitted through order_intake",
      },
      first_dollar_triage: {
        name: initial.entry_offer?.name || "Agent Revenue Copilot First-Dollar Triage",
        status: "live_low_friction_entry_offer",
        price: "1.99 USD/USDC",
        use_when: "Small one-off target where the $9.90 audit consumes too much upside.",
        tracked_checkout: tracked("triage_mcplug", "stdio-checkout-diagnostics"),
        tracked_direct_402: tracked("triage_402", "stdio-checkout-diagnostics"),
        sample: product.public_docs?.triage_sample,
      },
      operator_handoff: {
        name: "GitHub paid-order intake",
        status: "handoff_only_not_payment",
        use_when: "Agent cannot pay directly or needs an operator to attach payment evidence.",
        tracked_intake: tracked("order_intake", "stdio-checkout-diagnostics"),
        required_fields: ["transaction hash", "agent stack", "target amount", "allowed wallets", "forbidden actions", "skills and constraints"],
      },
    },
    after_payment: {
      submit: product.support?.paid_order_form,
      evidence_required: ["marketplace order id", "x402 receipt", "Base USDC transaction hash"],
      delivery_sla: product.fulfillment?.sla,
      payment_status_tool: "payment_status",
    },
    safety: {
      do_not_send: ["private keys", "seed phrases", "API keys", "passwords", "session cookies", "KYC documents", "user funds"],
      forbidden_work: ["fraud", "spam", "fake engagement", "KYC bypass", "private credential misuse", "deposit-funded tasks", "social/referral manipulation"],
    },
    buyer_confidence: {
      sample_audit: product.public_docs?.sample_audit,
      case_study: product.public_docs?.case_study,
      buyer_decision: product.public_docs?.buyer_decision,
    },
  };
}

async function callTool(name, input = {}) {
  if (name === "product_manifest") {
    return textResult(jsonText(await loadJson(PRODUCT_PATH)));
  }
  if (name === "route_triage") {
    return textResult(jsonText(routeTriage(await loadJson(PRODUCT_PATH), input)));
  }
  if (name === "checkout_diagnostics") {
    return textResult(jsonText(checkoutDiagnostics(await loadJson(PRODUCT_PATH), input)));
  }
  if (name === "buyer_routes") {
    return textResult(jsonText(routesFromProduct(await loadJson(PRODUCT_PATH))));
  }
  if (name === "free_playbook") {
    return textResult(await readDoc(PLAYBOOK_PATH));
  }
  if (name === "failure_paths") {
    return textResult(await readDoc(FAILURE_PATH));
  }
  if (name === "payment_status") {
    return textResult(jsonText(await checkPayment()));
  }
  throw new Error(`Unknown tool: ${name}`);
}

async function handleRequest(request) {
  const { id, method, params } = request;
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params?.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "agent-revenue-copilot",
          version: "0.1.1",
        },
      },
    };
  }
  if (method === "notifications/initialized") {
    return null;
  }
  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools } };
  }
  if (method === "tools/call") {
    return { jsonrpc: "2.0", id, result: await callTool(params?.name, params?.arguments || params?.input || {}) };
  }
  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} };
  }
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

async function handleLine(line) {
  if (!line.trim()) return;
  let request;
  try {
    request = JSON.parse(line);
  } catch (error) {
    writeMessage({ jsonrpc: "2.0", id: null, error: { code: -32700, message: error.message } });
    return;
  }
  try {
    const response = await handleRequest(request);
    if (response) writeMessage(response);
  } catch (error) {
    writeMessage({
      jsonrpc: "2.0",
      id: request.id ?? null,
      error: { code: -32603, message: error.message },
    });
  }
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  inputBuffer += chunk;
  const lines = inputBuffer.split(/\r?\n/);
  inputBuffer = lines.pop() || "";
  for (const line of lines) {
    void handleLine(line);
  }
});
