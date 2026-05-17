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
const REPO_RAW = "https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main";
const LIVE_ORIGIN = "https://doctors-lighting-facial-admissions.trycloudflare.com";
const OPERATOR_APPROVAL_URL = "https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/operator-approval-request.md";
const OPERATOR_HANDOFF_URL = "https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/operator-handoff.html";
const BUYER_INTENT_FORM_URL = "https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/buyer-intent.html";
const FIRST_DOLLAR_BRIEF_FORM_URL = "https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/first-dollar-brief.html";
const PAYMENT_EVIDENCE_FORM_URL = "https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/payment-evidence.html";
const X402_FACILITATOR_URL = "https://facilitator.payai.network";
const BASE_CHAIN_CAIP2 = "eip155:8453";
const PRODUCT_VERSION = "0.1.39";

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
    buy_now: {
      tool: "buy_now",
      starter_audit: tracked("buy_starter_audit", "stdio-buyer-routes"),
      first_dollar_triage: tracked("buy_triage", "stdio-buyer-routes"),
      operator_handoff_page: OPERATOR_HANDOFF_URL,
      buyer_intent_form: BUYER_INTENT_FORM_URL,
    },
    primary_choices: primaryPurchaseChoices(),
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
    name: "buy_now",
    description: "Return one canonical tracked checkout URL for the $9.90 starter audit or $1.99 triage, plus operator handoff if the agent cannot pay.",
    inputSchema: {
      type: "object",
      properties: {
        offer: { type: "string", description: "starter_audit or first_dollar_triage. Defaults to starter_audit unless target_usd is 15 or less." },
        target_usd: { type: "number", description: "Approximate buyer target value in USD, if known." },
        can_pay: { type: "boolean", description: "True if the caller is authorized and able to complete payment now." },
      },
      additionalProperties: false,
    },
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
    name: "operator_approval_request",
    description: "Generate a copy-ready operator approval request for agents that can inspect checkout but cannot pay autonomously.",
    inputSchema: {
      type: "object",
      properties: {
        requested_route: { type: "string", description: "Preferred route: agoragentic_x402, agent402, direct_base_usdc, mcplug_triage, direct_triage_usdc, or free_playbook." },
        target_usd: { type: "number", description: "Approximate buyer target value in USD, if known." },
        agent_stack: { type: "string", description: "Agent/operator stack, for example Codex, Claude, custom MCP agent, or browser agent." },
        current_blocker: { type: "string", description: "Why the agent needs operator approval or payment help." },
        constraints: { type: "array", items: { type: "string" }, description: "Safety or route constraints such as no_kyc, no_deposit, no_social, no_user_funds." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "buyer_intent_intake",
    description: "Return the no-login buyer intent endpoint and a safe payload for non-secret checkout friction. This does not count as payment or unlock paid delivery.",
    inputSchema: {
      type: "object",
      properties: {
        requested_route: { type: "string", description: "Preferred route, such as agoragentic_x402, direct_base_usdc, mcplug_triage, or unknown." },
        target_usd: { type: "number", description: "Approximate buyer target value in USD, if known." },
        buyer_type: { type: "string", description: "Agent/operator type or stack." },
        goal: { type: "string", description: "Short non-secret buyer goal or purchase reason." },
        current_blocker: { type: "string", description: "What prevented payment/order completion." },
        constraints: { type: "array", items: { type: "string" }, description: "Safety constraints such as no_kyc, no_deposit, no_social, no_user_funds." },
        contact: { type: "string", description: "Optional non-secret reply channel, if the buyer wants follow-up." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "first_dollar_brief_intake",
    description: "Return the no-login endpoint and suggested non-secret payload for a $1.99 first-dollar triage brief before payment. This records prepayment interest only.",
    inputSchema: {
      type: "object",
      properties: {
        target_amount: { type: "string", description: "Target amount or payout range." },
        quick_brief: { type: "string", description: "One-sentence non-secret earning goal or payment blocker; enough to start the prepayment record." },
        agent_stack: { type: "string", description: "Agent/operator stack or runtime." },
        allowed_routes: { type: "array", items: { type: "string" }, description: "Allowed payment or marketplace routes." },
        constraints: { type: "array", items: { type: "string" }, description: "Safety constraints." },
        current_assets: { type: "string", description: "Non-secret assets already available." },
        current_blocker: { type: "string", description: "What is stopping the $1.99 payment." },
        goal: { type: "string", description: "Short non-secret earning goal." },
        contact: { type: "string", description: "Optional non-secret reply channel." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "payment_evidence_intake",
    description: "Return the no-login endpoint for submitting non-secret order id, receipt, or transaction hash after payment. Evidence requires verification before revenue is counted.",
    inputSchema: {
      type: "object",
      properties: {
        offer: { type: "string", description: "starter_audit or first_dollar_triage." },
        evidence_type: { type: "string", description: "mcplug_order, stripe_receipt, x402_receipt, base_tx_hash, marketplace_order, or other." },
        payment_reference: { type: "string", description: "Non-secret order id, receipt id, x402 receipt id, or Base transaction hash." },
        amount: { type: "string", description: "Expected amount such as 9.90 or 1.99." },
        currency: { type: "string", description: "USD or USDC." },
        buyer_brief: { type: "string", description: "Short non-secret delivery brief." },
        contact: { type: "string", description: "Optional non-secret reply channel." },
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

function purchaseBridge(offer, source = "stdio-route-triage") {
  return `${LIVE_ORIGIN}/agent-revenue-copilot/buy?offer=${encodeURIComponent(offer)}&source=${encodeURIComponent(source)}`;
}

function paymentEvidence(offer = "starter_audit", source = "stdio-payment-evidence") {
  return `${LIVE_ORIGIN}/agent-revenue-copilot/evidence?offer=${encodeURIComponent(offer)}&source=${encodeURIComponent(source)}&after_payment=1`;
}

function paymentAction(offer, source = "stdio-route-triage") {
  return `${LIVE_ORIGIN}/agent-revenue-copilot/bridge-out?offer=${encodeURIComponent(offer)}&action=primary_browser_checkout&source=${encodeURIComponent(source)}`;
}

function directPaymentPage(offer, source = "stdio-route-triage") {
  return `${LIVE_ORIGIN}/agent-revenue-copilot/direct-pay?offer=${encodeURIComponent(offer)}&source=${encodeURIComponent(source)}`;
}

function directPaymentAmountUnits(amount) {
  const [whole = "0", fractional = ""] = String(amount).split(".");
  return `${Number.parseInt(whole || "0", 10)}${fractional.padEnd(6, "0").slice(0, 6)}`.replace(/^0+(?=\d)/, "");
}

function directPaymentTransfer(offer, source = "stdio-route-triage") {
  const isTriage = offer === "first_dollar_triage";
  const amount = isTriage ? "1.99" : "9.90";
  const amountUnits = directPaymentAmountUnits(amount);
  const walletUri = `ethereum:${USDC}@8453/transfer?address=${RECEIVE_ADDRESS}&uint256=${amountUnits}`;
  const evidenceUrl = paymentEvidence(isTriage ? "first_dollar_triage" : "starter_audit", source);
  return {
    offer: isTriage ? "first_dollar_triage" : "starter_audit",
    amount_usdc: amount,
    amount_units: amountUnits,
    network: "Base mainnet",
    chain_id: 8453,
    chain_caip2: BASE_CHAIN_CAIP2,
    token: "USDC",
    token_contract: USDC,
    receive_address: RECEIVE_ADDRESS,
    wallet_uri: walletUri,
    explorer_address: `https://basescan.org/address/${RECEIVE_ADDRESS}`,
    token_balance_url: `https://basescan.org/token/${USDC}?a=${RECEIVE_ADDRESS}`,
    after_payment_evidence: evidenceUrl,
  };
}

function firstDollarDeliverableContract() {
  return {
    name: "First-dollar triage paid proof",
    what_buyer_gets: [
      "One ranked next earning route matched to the buyer's agent stack, time budget, and allowed payment rails.",
      "One concrete setup checkpoint to complete before spending more time or money.",
      "One stop rule that says when the route is too low-value, unsafe, or unlikely to beat the buyer's target.",
    ],
    required_after_payment_brief: [
      "target amount or target payout range",
      "agent stack or runtime",
      "allowed marketplaces/payment rails",
      "forbidden actions and constraints",
      "current assets or accounts already available",
    ],
    delivery_sla: "24 hours after verified payment and a usable non-secret buyer brief.",
    replacement_or_refund_rule: "If the triage cannot identify a legal next route from the buyer brief, provide one replacement review or a refund/replacement request path.",
    sample_url: `${REPO_RAW}/agent-revenue-copilot/triage-sample.md`,
    no_secrets: ["private keys", "seed phrases", "API keys", "passwords", "session cookies", "KYC documents", "funds controlled by someone else"],
  };
}

function firstDollarProofPath(source = "stdio-first-dollar-proof") {
  const transfer = directPaymentTransfer("first_dollar_triage", source);
  return {
    offer: "first_dollar_triage",
    label: "$1.99 first-dollar triage",
    reason: "Use this as a lower-commitment paid proof before the $9.90 starter audit. It verifies payment and receipt before a larger purchase.",
    price: "1.99 USD/USDC",
    deliverable_contract: firstDollarDeliverableContract(),
    direct_payment_url: directPaymentPage("first_dollar_triage", source),
    pre_payment_brief: `${LIVE_ORIGIN}/agent-revenue-copilot/first-dollar-brief?source=${encodeURIComponent(source)}`,
    pre_payment_brief_static: FIRST_DOLLAR_BRIEF_FORM_URL,
    wallet_uri: transfer.wallet_uri,
    amount_units: transfer.amount_units,
    card_checkout: paymentAction("first_dollar_triage", source),
    payment_request: `${LIVE_ORIGIN}/agent-revenue-copilot/triage-payment-request.json`,
    after_payment_evidence: paymentEvidence("first_dollar_triage", source),
    not_free: true,
    not_revenue_until_confirmed: true,
  };
}

function agentNativePaymentAction(offer, source = "stdio-route-triage") {
  return `${LIVE_ORIGIN}/agent-revenue-copilot/bridge-out?offer=${encodeURIComponent(offer)}&action=agent_native_payment&source=${encodeURIComponent(source)}`;
}

function x402V2Config(offer) {
  const isTriage = offer === "first_dollar_triage";
  const bridgeOffer = isTriage ? "first_dollar_triage" : "starter_audit";
  return {
    x402_version: 2,
    payment_required_header: "PAYMENT-REQUIRED",
    payment_signature_header: "PAYMENT-SIGNATURE",
    payment_response_header: "PAYMENT-RESPONSE",
    legacy_signature_header: "X-PAYMENT",
    network: BASE_CHAIN_CAIP2,
    facilitator: X402_FACILITATOR_URL,
    payment_required_endpoint: isTriage
      ? `${LIVE_ORIGIN}/agent-revenue-copilot/triage/pay`
      : `${LIVE_ORIGIN}/agent-revenue-copilot/pay`,
    buyer_instructions: `${LIVE_ORIGIN}/agent-revenue-copilot/x402-buyer-instructions.json`,
    browser_rescue: purchaseBridge(bridgeOffer, "stdio-x402-browser-rescue"),
    human_first_checkout_url: paymentAction(bridgeOffer, "stdio-x402-browser-rescue"),
    browser_rescue_note: "If a normal browser opened the x402 endpoint, browser_rescue and human_first_checkout_url continue to card checkout. Wallet-capable agents should request the endpoint without Accept: text/html to receive PAYMENT-REQUIRED.",
  };
}

function primaryPurchaseChoices() {
  return {
    name: "Agent Revenue Copilot primary purchase choices",
    version: PRODUCT_VERSION,
    rule: "Show these three choices first. Use advanced checkout links only after one primary choice is selected.",
    mcp_buy_now_tool: "buy_now",
    first_action: "Human/operator buyers can open purchase_bridge or card_payment_action_url; browser purchase_bridge auto-forwards to the primary card checkout, then receipt/order id is submitted only after payment succeeds. Wallet-capable agents can use agent_native_payment_action_url.",
    buy_now_rule: "Human/operator buyers should use card_payment_action_url or purchase_bridge first. Wallet-capable MCP buyer agents can call buy_now and use agent_native_payment_action_url.",
    first_dollar_proof_rule: "If the buyer is not ready for $9.90, show the $1.99 first-dollar triage as the smallest paid proof path before the starter audit.",
    first_dollar_proof_path: firstDollarProofPath("stdio-primary-choice-proof"),
    canonical_buy_rule: "Use canonical_buy first for a payment-ready buyer. Use fallback links only if the canonical route is unavailable or the agent cannot pay.",
    agent_cannot_pay_rule: "If the buyer agent cannot make an authorized payment, show the no-login operator handoff page and buyer intent form before exposing GitHub issue forms.",
    choices: [
      {
        key: "first_dollar_triage",
        label: "Buy $1.99 first-dollar triage",
        price: "1.99 USD/USDC",
        best_for: "Uncertain buyer, small one-off target, or agent stuck at checkout before committing to the full audit.",
        canonical_buy: tracked("buy_triage", "stdio-primary-choice"),
        purchase_bridge: purchaseBridge("first_dollar_triage", "stdio-primary-choice"),
        payment_action_url: paymentAction("first_dollar_triage", "stdio-primary-choice"),
        recommended_payment_action_url: paymentAction("first_dollar_triage", "stdio-primary-choice"),
        recommended_payment_path: "human_card_checkout_first",
        human_first_checkout_url: paymentAction("first_dollar_triage", "stdio-primary-choice"),
        agent_native_payment_action_url: agentNativePaymentAction("first_dollar_triage", "stdio-primary-choice"),
        card_payment_action_url: paymentAction("first_dollar_triage", "stdio-primary-choice"),
        seller_visible_direct_payment_url: directPaymentPage("first_dollar_triage", "stdio-primary-choice"),
        pre_payment_brief_endpoint: `${LIVE_ORIGIN}/agent-revenue-copilot/first-dollar-brief?source=stdio-primary-choice`,
        pre_payment_brief_form: FIRST_DOLLAR_BRIEF_FORM_URL,
        direct_transfer: directPaymentTransfer("first_dollar_triage", "stdio-primary-choice"),
        x402_v2: x402V2Config("first_dollar_triage"),
        tracked_checkout: tracked("triage_mcplug", "stdio-primary-choice"),
        tracked_direct_402: tracked("triage_402", "stdio-primary-choice"),
        if_agent_cannot_pay: {
          operator_handoff_page: OPERATOR_HANDOFF_URL,
          buyer_intent_form: BUYER_INTENT_FORM_URL,
        },
        sample: "https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/triage-sample.md",
      },
      {
        key: "starter_audit",
        label: "Buy $9.90 starter audit",
        price: "9.90 USD/USDC",
        best_for: "$50+ targets, repeated agent earning workflows, or x402/MCP/API monetization work.",
        canonical_buy: tracked("buy_starter_audit", "stdio-primary-choice"),
        purchase_bridge: purchaseBridge("starter_audit", "stdio-primary-choice"),
        payment_action_url: paymentAction("starter_audit", "stdio-primary-choice"),
        recommended_payment_action_url: paymentAction("starter_audit", "stdio-primary-choice"),
        recommended_payment_path: "human_card_checkout_first",
        human_first_checkout_url: paymentAction("starter_audit", "stdio-primary-choice"),
        agent_native_payment_action_url: agentNativePaymentAction("starter_audit", "stdio-primary-choice"),
        card_payment_action_url: paymentAction("starter_audit", "stdio-primary-choice"),
        seller_visible_direct_payment_url: directPaymentPage("starter_audit", "stdio-primary-choice"),
        direct_transfer: directPaymentTransfer("starter_audit", "stdio-primary-choice"),
        x402_v2: x402V2Config("starter_audit"),
        tracked_checkout: tracked("audit_agoragentic", "stdio-primary-choice"),
        tracked_agent402_fallback: tracked("audit_agent402", "stdio-primary-choice"),
        human_checkout: "https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/checkout.html",
        if_agent_cannot_pay: {
          operator_handoff_page: OPERATOR_HANDOFF_URL,
          buyer_intent_form: BUYER_INTENT_FORM_URL,
        },
      },
      {
        key: "operator_handoff_or_intent",
        label: "Ask operator to approve or record buyer intent",
        price: "0 now",
        best_for: "Agent can inspect checkout but cannot pay, or GitHub paid-order forms are too much friction.",
        tracked_operator_approval: tracked("operator_approval_request", "stdio-primary-choice"),
        operator_handoff_page: OPERATOR_HANDOFF_URL,
        buyer_intent_endpoint: `${LIVE_ORIGIN}/agent-revenue-copilot/intent`,
        buyer_intent_form: BUYER_INTENT_FORM_URL,
        preferred_before_github_issue: true,
        not_revenue: true,
        not_paid_order: true,
      },
    ],
    paid_delivery_rule: "Only a marketplace receipt, x402 receipt, Base USDC transaction hash, paid order, hire, deal, assignment, settlement, or confirmed usable balance can unlock paid delivery.",
    static_primary_choices: "https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/primary-choices.json",
    live_primary_choices: `${LIVE_ORIGIN}/agent-revenue-copilot/primary-choices.json`,
  };
}

function buyNow(product, input = {}) {
  const targetUsd = Number(input.target_usd || 0);
  const requestedOffer = String(input.offer || "").toLowerCase();
  const selectedOffer = requestedOffer.includes("triage") || (targetUsd > 0 && targetUsd <= 15)
    ? "first_dollar_triage"
    : "starter_audit";
  const canPay = input.can_pay === true;
  const initial = product.initial_package;
  const entry = initial.entry_offer || {};
  const isTriage = selectedOffer === "first_dollar_triage";
  const route = isTriage ? "buy_triage" : "buy_starter_audit";
  const source = isTriage ? "stdio-buy-now-triage" : "stdio-buy-now";

  return {
    ok: true,
    action: canPay ? "open_canonical_checkout" : "ask_operator_or_record_intent",
    selected_offer: selectedOffer,
    price: isTriage ? "1.99 USD/USDC" : `${initial.price_usd.toFixed(2)} USD/USDC`,
    canonical_buy: tracked(route, source),
    purchase_bridge: purchaseBridge(isTriage ? "first_dollar_triage" : "starter_audit", source),
    recommended_payment_action_url: paymentAction(isTriage ? "first_dollar_triage" : "starter_audit", source),
    recommended_payment_path: "human_card_checkout_first",
    human_first_checkout_url: paymentAction(isTriage ? "first_dollar_triage" : "starter_audit", source),
    agent_native_payment_action_url: agentNativePaymentAction(isTriage ? "first_dollar_triage" : "starter_audit", source),
    card_payment_action_url: paymentAction(isTriage ? "first_dollar_triage" : "starter_audit", source),
    seller_visible_direct_payment_url: directPaymentPage(isTriage ? "first_dollar_triage" : "starter_audit", source),
    direct_transfer: directPaymentTransfer(isTriage ? "first_dollar_triage" : "starter_audit", source),
    first_dollar_proof_path: isTriage ? null : firstDollarProofPath(`${source}-proof`),
    payment_action_url: paymentAction(isTriage ? "first_dollar_triage" : "starter_audit", source),
    x402_v2: x402V2Config(isTriage ? "first_dollar_triage" : "starter_audit"),
    x402_buyer_instructions: `${LIVE_ORIGIN}/agent-revenue-copilot/x402-buyer-instructions.json`,
    use_this_first: true,
    fallback_only_if_unavailable: isTriage
      ? tracked("triage_mcplug", source)
      : tracked("audit_agoragentic", source),
    if_agent_cannot_pay: {
      operator_handoff_page: OPERATOR_HANDOFF_URL,
      buyer_intent_form: BUYER_INTENT_FORM_URL,
      operator_approval_tool: "operator_approval_request",
      buyer_intent_tool: "buyer_intent_intake",
      rule: "Do not autonomously pay unless an authorized operator or wallet-capable agent has approved the payment.",
    },
    after_payment: {
      submit_receipt_or_tx_hash: product.support?.paid_order_form,
      evidence_required: ["marketplace order id", "x402 receipt", "Base USDC transaction hash"],
      delivery_sla: product.fulfillment?.sla,
    },
    sample: isTriage ? entry.sample : product.public_docs?.sample_audit,
    safety: {
      do_not_send: ["private keys", "seed phrases", "API keys", "passwords", "session cookies", "KYC documents", "user funds"],
      forbidden_work: ["fraud", "spam", "fake engagement", "KYC bypass", "private credential misuse", "deposit-funded tasks", "social/referral manipulation"],
    },
    counting_rule: "This response is not revenue. Count only a completed sale, receipt, settlement, assignment payout, or confirmed usable balance.",
  };
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
        canonical_buy: tracked("buy_triage"),
        purchase_bridge: purchaseBridge("first_dollar_triage"),
        tracked_checkout: tracked("triage_mcplug"),
        tracked_direct_402: tracked("triage_402"),
        if_agent_cannot_pay: {
          operator_handoff_page: OPERATOR_HANDOFF_URL,
          buyer_intent_form: BUYER_INTENT_FORM_URL,
        },
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
        canonical_buy: tracked("buy_starter_audit"),
        purchase_bridge: purchaseBridge("starter_audit"),
        tracked_x402: tracked("audit_agoragentic"),
        tracked_agent402_fallback: tracked("audit_agent402"),
        tracked_direct_402: tracked("audit_402"),
        if_agent_cannot_pay: {
          operator_handoff_page: OPERATOR_HANDOFF_URL,
          buyer_intent_form: BUYER_INTENT_FORM_URL,
        },
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
      canonical_buy: tracked("buy_triage"),
      tracked_checkout: tracked("triage_mcplug"),
      tracked_direct_402: tracked("triage_402"),
      if_agent_cannot_pay: {
        operator_handoff_page: OPERATOR_HANDOFF_URL,
        buyer_intent_form: BUYER_INTENT_FORM_URL,
      },
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
        canonical_buy: tracked("buy_starter_audit", "stdio-checkout-diagnostics"),
        purchase_bridge: purchaseBridge("starter_audit", "stdio-checkout-diagnostics"),
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
        canonical_buy: tracked("buy_triage", "stdio-checkout-diagnostics"),
        purchase_bridge: purchaseBridge("first_dollar_triage", "stdio-checkout-diagnostics"),
        tracked_checkout: tracked("triage_mcplug", "stdio-checkout-diagnostics"),
        tracked_direct_402: tracked("triage_402", "stdio-checkout-diagnostics"),
        sample: product.public_docs?.triage_sample,
      },
      operator_handoff: {
        name: "No-login operator handoff",
        status: "handoff_only_not_payment",
        use_when: "Agent cannot pay directly or needs an operator to attach payment evidence.",
        tracked_approval_request: tracked("operator_approval_request", "stdio-checkout-diagnostics"),
        operator_handoff_page: OPERATOR_HANDOFF_URL,
        buyer_intent_form: BUYER_INTENT_FORM_URL,
        tracked_approval_issue: tracked("operator_approval_issue", "stdio-checkout-diagnostics"),
        tracked_intake: tracked("order_intake", "stdio-checkout-diagnostics"),
        approval_template: OPERATOR_APPROVAL_URL,
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

function operatorApprovalRequest(input = {}) {
  const routes = {
    agoragentic_x402: {
      label: "Agoragentic x402 starter audit - 9.90 USD",
      tracked_url: tracked("audit_agoragentic", "stdio-operator-approval"),
    },
    agent402: {
      label: "Agent402 starter audit - 9.90 USD",
      tracked_url: tracked("audit_agent402", "stdio-operator-approval"),
    },
    direct_base_usdc: {
      label: "Direct Base USDC starter audit - 9.90 USDC",
      tracked_url: tracked("audit_payment_json", "stdio-operator-approval"),
    },
    mcplug_triage: {
      label: "MCPlug first-dollar triage - 1.99 USD",
      tracked_url: tracked("triage_mcplug", "stdio-operator-approval"),
    },
    direct_triage_usdc: {
      label: "Direct Base USDC first-dollar triage - 1.99 USDC",
      tracked_url: tracked("triage_payment_json", "stdio-operator-approval"),
    },
    free_playbook: {
      label: "Use free playbook first",
      tracked_url: "https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-money/README.md",
    },
  };
  const routeKey = routes[input.requested_route] ? input.requested_route : "agoragentic_x402";
  const route = routes[routeKey];
  const constraints = Array.isArray(input.constraints) && input.constraints.length
    ? input.constraints.join(", ")
    : "no KYC bypass, no deposits, no social spam, no private credentials, no user funds";
  const target = input.target_usd ? `$${input.target_usd}` : "not specified";
  const stack = String(input.agent_stack || "not specified").replace(/\s+/g, " ").slice(0, 160);
  const blocker = String(input.current_blocker || "agent can inspect checkout routes but cannot autonomously pay").replace(/\s+/g, " ").slice(0, 240);

  return {
    ok: true,
    type: "prepayment_operator_approval_request",
    not_a_paid_order: true,
    recommended_route: {
      key: routeKey,
      label: route.label,
      tracked_url: route.tracked_url,
    },
    tracked_approval_form: tracked("operator_approval_request", "stdio-tool"),
    operator_handoff_page: OPERATOR_HANDOFF_URL,
    approval_template: OPERATOR_APPROVAL_URL,
    paid_order_after_payment: paymentEvidence("starter_audit", "stdio-operator-approval"),
    github_order_fallback: "https://github.com/Olddun/earn10-clawtasks-deliverables/issues/new?template=agent-revenue-copilot-order.yml",
    copy_text: [
      "Please approve exactly one Agent Revenue Copilot payment route.",
      "",
      `Recommended route: ${route.label}`,
      `Route URL: ${route.tracked_url}`,
      `Target amount: ${target}`,
      `Agent/operator stack: ${stack}`,
      `Current blocker: ${blocker}`,
      `Constraints: ${constraints}`,
      "",
      "Safety: the operator, not the agent, must approve any real payment. Do not include private keys, seed phrases, API keys, passwords, session cookies, KYC documents, or user funds.",
      "After payment, submit the marketplace order id, x402 receipt, or Base transaction hash through the no-login payment evidence form.",
    ].join("\n"),
    counting_rule: "Approval requests, unpaid issues, checkout reads, and crawler visits do not count as revenue. Count only confirmed usable, claimable, withdrawable, or spendable value.",
  };
}

function buyerIntentIntake(input = {}) {
  return {
    ok: true,
    endpoint: `${LIVE_ORIGIN}/agent-revenue-copilot/intent`,
    method: "POST",
    content_type: "application/json",
    purpose: "Record non-secret purchase intent or checkout friction without GitHub login.",
    not_revenue: true,
    not_paid_order: true,
    does_not_unlock_paid_delivery: true,
    suggested_payload: {
      requested_route: input.requested_route || "agoragentic_x402",
      target_usd: input.target_usd || null,
      buyer_type: String(input.buyer_type || input.agent_stack || "unknown").replace(/\s+/g, " ").slice(0, 160),
      goal: String(input.goal || "").replace(/\s+/g, " ").slice(0, 400),
      current_blocker: String(input.current_blocker || "agent can inspect checkout but did not complete payment").replace(/\s+/g, " ").slice(0, 240),
      constraints: Array.isArray(input.constraints) ? input.constraints.slice(0, 12) : [],
      contact: String(input.contact || "").replace(/\s+/g, " ").slice(0, 160),
    },
    paid_order_after_payment: paymentEvidence("starter_audit", "stdio-buyer-intent"),
    payment_evidence_form: PAYMENT_EVIDENCE_FORM_URL,
    github_order_fallback: "https://github.com/Olddun/earn10-clawtasks-deliverables/issues/new?template=agent-revenue-copilot-order.yml",
    do_not_send: ["private keys", "seed phrases", "API keys", "passwords", "session cookies", "KYC documents", "user funds"],
  };
}

function firstDollarBriefIntake(input = {}) {
  return {
    ok: true,
    endpoint: `${LIVE_ORIGIN}/agent-revenue-copilot/first-dollar-brief?source=stdio-first-dollar-brief`,
    form: FIRST_DOLLAR_BRIEF_FORM_URL,
    method: "POST",
    content_type: "application/json or application/x-www-form-urlencoded",
    purpose: "Capture the minimum non-secret brief before the $1.99 first-dollar triage payment.",
    recommended_first_action: "Pay $1.99 now, or submit only quick_brief so the seller can distinguish checkout hesitation from no audience.",
    offer: "first_dollar_triage",
    price: "1.99 USDC",
    deliverable_contract: firstDollarDeliverableContract(),
    payment_next: {
      direct_base_usdc: directPaymentPage("first_dollar_triage", "stdio-first-dollar-brief"),
      card_checkout: paymentAction("first_dollar_triage", "stdio-first-dollar-brief"),
      payment_request: `${LIVE_ORIGIN}/agent-revenue-copilot/triage-payment-request.json`,
      after_payment_evidence: paymentEvidence("first_dollar_triage", "stdio-first-dollar-brief"),
    },
    not_revenue: true,
    not_paid_order: true,
    does_not_unlock_paid_delivery: true,
    minimum_fields: ["quick_brief"],
    suggested_payload: {
      quick_brief: String(input.quick_brief || input.goal || "I want one route to earn about $10, but I have not completed checkout yet.").replace(/\s+/g, " ").slice(0, 700),
      target_amount: String(input.target_amount || input.target_usd || "about 10 USD").replace(/\s+/g, " ").slice(0, 80),
      agent_stack: String(input.agent_stack || input.buyer_type || "unknown").replace(/\s+/g, " ").slice(0, 180),
      allowed_routes: Array.isArray(input.allowed_routes) ? input.allowed_routes.slice(0, 12) : ["x402", "direct Base USDC", "MCPlug/card"],
      constraints: Array.isArray(input.constraints) ? input.constraints.slice(0, 12) : ["no KYC bypass", "no deposits", "no social spam", "no fake engagement", "no private credentials", "no user funds"],
      current_assets: String(input.current_assets || "").replace(/\s+/g, " ").slice(0, 500),
      current_blocker: String(input.current_blocker || "buyer reached first-dollar payment decision but has not paid yet").replace(/\s+/g, " ").slice(0, 360),
      goal: String(input.quick_brief || input.goal || "").replace(/\s+/g, " ").slice(0, 700),
      contact: String(input.contact || "").replace(/\s+/g, " ").slice(0, 160),
    },
    do_not_send: ["private keys", "seed phrases", "API keys", "passwords", "session cookies", "customer private data", "KYC documents", "user funds"],
  };
}

function paymentEvidenceIntake(input = {}) {
  const offer = input.offer === "first_dollar_triage" || input.offer === "triage" ? "first_dollar_triage" : "starter_audit";
  return {
    ok: true,
    endpoint: paymentEvidence(offer, "stdio-payment-evidence"),
    form: PAYMENT_EVIDENCE_FORM_URL,
    method: "POST",
    content_type: "application/json",
    verification_required: true,
    not_revenue_until_verified: true,
    suggested_payload: {
      offer,
      evidence_type: String(input.evidence_type || "unknown").replace(/\s+/g, " ").slice(0, 80),
      payment_reference: String(input.payment_reference || input.order_id || input.tx_hash || input.receipt_id || "").replace(/\s+/g, " ").slice(0, 240),
      amount: String(input.amount || (offer === "first_dollar_triage" ? "1.99" : "9.90")).replace(/\s+/g, " ").slice(0, 40),
      currency: String(input.currency || (offer === "first_dollar_triage" ? "USD" : "USDC")).replace(/\s+/g, " ").slice(0, 20),
      buyer_brief: String(input.buyer_brief || input.brief || "").replace(/\s+/g, " ").slice(0, 800),
      contact: String(input.contact || "").replace(/\s+/g, " ").slice(0, 160),
    },
    github_order_fallback: "https://github.com/Olddun/earn10-clawtasks-deliverables/issues/new?template=agent-revenue-copilot-order.yml",
    counting_rule: "This is not revenue until usable, claimable, withdrawable, or spendable value is verified.",
    do_not_send: ["private keys", "seed phrases", "API keys", "passwords", "session cookies", "KYC documents", "user funds"],
  };
}

async function callTool(name, input = {}) {
  if (name === "product_manifest") {
    return textResult(jsonText(await loadJson(PRODUCT_PATH)));
  }
  if (name === "buy_now") {
    return textResult(jsonText(buyNow(await loadJson(PRODUCT_PATH), input)));
  }
  if (name === "route_triage") {
    return textResult(jsonText(routeTriage(await loadJson(PRODUCT_PATH), input)));
  }
  if (name === "checkout_diagnostics") {
    return textResult(jsonText(checkoutDiagnostics(await loadJson(PRODUCT_PATH), input)));
  }
  if (name === "operator_approval_request") {
    return textResult(jsonText(operatorApprovalRequest(input)));
  }
  if (name === "buyer_intent_intake") {
    return textResult(jsonText(buyerIntentIntake(input)));
  }
  if (name === "first_dollar_brief_intake") {
    return textResult(jsonText(firstDollarBriefIntake(input)));
  }
  if (name === "payment_evidence_intake") {
    return textResult(jsonText(paymentEvidenceIntake(input)));
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
          version: PRODUCT_VERSION,
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
