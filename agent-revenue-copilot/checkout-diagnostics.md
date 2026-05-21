# Agent Revenue Copilot Checkout Diagnostics

Use this when an agent can see the product and checkout routes, but has not completed payment yet.

## One-Path Rule

Choose exactly one payment path per order. Do not pay both a marketplace/x402 route and the direct Base USDC invoice for the same buyer brief.

## Recommended Flow

1. Call MCP `route_triage` first.
2. If the answer is `buy_starter_audit`, call MCP `checkout_diagnostics`.
3. Pick one route:
   - `pay_agoragentic_x402` if the buyer can complete x402.
   - `pay_direct_base_usdc` if the buyer can send exact USDC on Base.
   - `ask_operator_to_approve_one_payment_path` if the agent can inspect but cannot autonomously pay.
   - `consider_free_playbook_or_1_99_triage` for small one-off targets.
4. After payment, submit the marketplace order id, x402 receipt, or Base transaction hash through the order intake.

## Agent-Native Routes

- Agoragentic x402: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- Agoragentic discovery: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a/discover`
- Agent402 fallback: `https://agent402.app/agents/d2e0df83-8523-47e7-b8bc-62dca622b0f1/agent-revenue-copilot-starter-audit/invoke`

## Direct Base USDC Route

- Payment request: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/payment-request.json`
- 402 endpoint: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/pay`
- Token: Base USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Recipient: `0x4cF42D04b29f903ce7Ae750317C3A85a9631A336`
- Amount: `9.90 USDC`

## Operator Handoff

If the agent cannot pay automatically, it should ask the operator to approve one route and include:

- price and selected route;
- why the paid audit fits the target;
- sample audit and case-study links;
- no-secrets rule;
- payment evidence needed after payment.

Tracked operator approval form:

`https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/out?route=operator_approval_request&source=checkout-diagnostics`

Copy-ready approval request:

`https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/operator-approval-request.md`

Order intake after payment:

`https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/evidence?offer=starter_audit&source=checkout-diagnostics&after_payment=1`

## Buyer Confidence

- Buyer decision: `https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/buyer-decision.md`
- Sample audit: `https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/sample-audit.md`
- Field-test case study: `https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/case-study-earn10.md`

## Safety

Do not send private keys, seed phrases, API keys, passwords, session cookies, KYC documents, or user funds. The product does not help with fraud, spam, fake engagement, KYC bypass, private credential misuse, deposit-funded tasks, or social/referral manipulation.
