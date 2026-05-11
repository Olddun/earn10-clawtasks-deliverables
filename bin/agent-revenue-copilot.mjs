#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PRODUCT_PATH = join(ROOT, "agent-revenue-copilot", "product.json");
const BASE_RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const RECEIVE_ADDRESS = "0x4cF42D04b29f903ce7Ae750317C3A85a9631A336";
const TARGET_USDC = 9.9;

function help() {
  return `Agent Revenue Copilot

A $9.90 starter audit for AI agents and operators trying to earn real spendable money legally.

Usage:
  agent-revenue-copilot              Print buyer routes and safe input format
  agent-revenue-copilot --json       Print the product manifest
  agent-revenue-copilot --check-payment
                                     Check direct Base USDC invoice balance
  agent-revenue-copilot --help       Show this help

Install from GitHub:
  npx github:Olddun/earn10-clawtasks-deliverables -- --json

Safety:
  Do not send private keys, seed phrases, API keys, passwords, session cookies, fake engagement requests, deposits, KYC bypass, or user funds.
`;
}

async function loadProduct() {
  return JSON.parse(await readFile(PRODUCT_PATH, "utf8"));
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
  console.log(JSON.stringify({
    network: "Base mainnet",
    token: "USDC",
    token_contract: USDC,
    receive_address: RECEIVE_ADDRESS,
    required_amount: TARGET_USDC.toFixed(2),
    current_balance: balance,
    target_met: Number(balance) >= TARGET_USDC,
  }, null, 2));
}

function marketplaceLines(product) {
  const initial = product.initial_package;
  const routes = [
    `PayanAgent service: ${initial.canonical_service_id} (${initial.price_cents} cents)`,
    ...initial.additional_marketplaces.map((route) => {
      const id = route.service_id || route.offer_id;
      return `${route.marketplace}: ${id} (${route.price_usdc} USDC)`;
    }),
    `Direct Base USDC: ${initial.direct_payment.amount} ${initial.direct_payment.token} to ${initial.direct_payment.receive_address}`,
    `Machine-readable payment request: ${initial.direct_payment.payment_request}`,
  ];
  return routes.map((line) => `- ${line}`).join("\n");
}

function buyerText(product) {
  return `${product.name}

Price: $${product.initial_package.price_usd.toFixed(2)} starter audit

Buy through any active route:
${marketplaceLines(product)}

Order instructions:
- ${product.public_docs.order}
- ${product.public_docs.payment}
- ${product.public_docs.payment_request}
- ${product.public_docs.openapi}

Safe buyer input:
{
  "kind": "agent-revenue-copilot",
  "brief": "Agent stack, target amount, allowed wallets, forbidden actions, skills, and delivery preference. Do not include secrets."
}

Counting rule:
${product.counting_rule}
`;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--help") || args.has("-h")) {
    console.log(help());
    return;
  }
  if (args.has("--check-payment")) {
    await checkPayment();
    return;
  }
  const product = await loadProduct();
  if (args.has("--json")) {
    console.log(JSON.stringify(product, null, 2));
    return;
  }
  console.log(buyerText(product));
}

main().catch((error) => {
  console.error(`agent-revenue-copilot failed: ${error.message}`);
  process.exitCode = 1;
});
