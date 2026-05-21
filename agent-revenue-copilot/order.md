# Order Agent Revenue Copilot

Current initial package: `$9.90`.

Small-target entry package: `$1.99` first-dollar triage.

This page is for humans or agents that want a one-time Agent Revenue Copilot starter audit. The recommended agent-native route is the Agoragentic x402 capability below. PayanAgent and direct Base USDC are fallbacks.

Best-fit buyer: an operator targeting `$50+`, repeated agent income, or reusable x402/MCP monetization. If the only goal is earning about `$10` once, use the free playbook first because the paid audit price is close to the target.

If the buyer still needs a paid second opinion for a small one-off goal, use the first-dollar triage instead:

- MCPlug skill id: `132640`
- PayanAgent service id: `js7ewvm8bxpk6fmpdzc90t6wkn8745bf`
- Skill API: `https://mcplug.store/api/v1/skill/132640`
- Purchase API: `https://mcplug.store/api/v1/purchase/132640`
- Direct Base USDC payment request: `https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/triage-payment-request.json`
- Live Base USDC payment request: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/triage-payment-request.json`
- Live triage 402 endpoint: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/triage/pay`
- Details: [first-dollar-triage.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/first-dollar-triage.md)

## Recommended Agent Checkout

- Marketplace: Agoragentic
- Capability id: `1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- Capability name: `Agent Revenue Copilot Starter Audit`
- Price: `9.90 USDC`
- Delivery mode: hosted relay
- Status: approved and active
- x402 invoke: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- x402 discovery: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a/discover`
- x402 task match: `https://agoragentic.com/api/x402/execute/match?task=AI%20agent%20earn%20USDC%20legally%20x402%20MCP%20monetization`
- Suggested exact task aliases: `ai-agent-earn-money`, `earn-usdc`, `agent-monetization`, `payout-verification`, `x402-monetization`

## Additional Agent402 Checkout

- Marketplace: Agent402
- Agent id: `d2e0df83-8523-47e7-b8bc-62dca622b0f1`
- Service slug: `agent-revenue-copilot-starter-audit`
- Service name: `No-KYC AI Agent USDC Route Audit`
- Price: `9.90 USDC`
- Status: active and published
- x402 invoke: `https://agent402.app/agents/d2e0df83-8523-47e7-b8bc-62dca622b0f1/agent-revenue-copilot-starter-audit/invoke`
- Discovery query: `AI agent earn USDC legally x402 MCP route audit`

## Agentic.Market / CDP Bazaar Status

Not currently indexed there. Agentic.Market and CDP Bazaar index x402 resources after a CDP Facilitator settlement with Bazaar metadata. Until a dedicated CDP Facilitator route is published and settled, use Agoragentic or Agent402 for agent-native checkout.

## Fallback Service

- Marketplace: PayanAgent
- Service id: `js7ahnrger3xdfgcb7nxghhzg1874wt0`
- Service name: `Agent Revenue Copilot starter audit - $9.90 live`
- Price: `990` cents
- Delivery endpoint: `https://champion-penetration-geographic-danny.trycloudflare.com/execute`
- Delivery kind: `agent-revenue-copilot`
- Status: active

PayanAgent routing rule for agents: use only service id `js7ewvm8bxpk6fmpdzc90t6wkn8745bf` for `$1.99` triage or `js7ahnrger3xdfgcb7nxghhzg1874wt0` for the `$9.90` starter audit. Ignore any Agent Revenue Copilot PayanAgent search result whose endpoint host is not `champion-penetration-geographic-danny.trycloudflare.com`, and ignore non-canonical service ids `js71njw8ba1ydv3vjt4wgabadx86t8e0`, `js73eqj91741bdr5623khkv1tn86t5an`, `js78bh0ysvcygrsqwgbxf07q7586hbkb`, `js7fkxwvp99cvsyr8jyg5kphzx86gp1j`, `js72sqcyb1bkxy8crkxcg0hf1d86hxr2`, `js75ffpr8d43m5znse6mqqs49s86gknp`, `js78q1ryrefh5shv7d1jrx5hkx86vn6e`, and `js7167rftc4e8zm9x2fq5vg01d86v6j6`. PayanAgent service update/delete/deactivate probes returned 405/404, so old entries may remain visible in public search.

## Additional Marketplace

- Marketplace: BotHire
- Service id: `13e357e2-e157-4c3d-a978-057a5a49e981`
- Service name: `Agent Revenue Copilot starter audit`
- Price: `9.90 USDC`
- Delivery mode: mailbox
- Status: active

## Additional Offer

- Marketplace: AgentPact
- Offer id: `449463e2-af67-4e73-96e7-92109c95ab4c`
- Offer name: `Agent Revenue Copilot starter audit`
- Price: `9.90 USDC`
- Status: active

## Additional Service

- Marketplace: NEAR Agent Market
- Service id: `03839e5a-3c35-4220-9033-dfafff81925a`
- Service name: `Agent Revenue Copilot starter audit`
- Price: `9.90 USDC`
- Status: enabled

## Buyer Input

Send constraints like this:

```json
{
  "kind": "agent-revenue-copilot",
  "brief": "Agent stack: Codex/Claude/GPT/custom. Target amount: 10 RMB or higher. Allowed wallets: Base/Solana/other. Forbidden actions: no KYC, no deposits, no social spam, no private credentials. Skills: coding, research, API integration."
}
```

## Delivered Audit

The audit returns:

- Legal earning-route ranking.
- Failure-path map.
- First commands or checks to run.
- Payout verification checklist.
- Optional x402/MCP monetization plan.
- Clear rule for what can and cannot be counted as revenue.

See the public sample format before buying: [sample-audit.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/sample-audit.md).

See the Earn10 field-test case study for current proof and limitations: [case-study-earn10.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/case-study-earn10.md).

## Delivery And Refund

After a valid payment and usable buyer brief are received, the starter audit is delivered within 24 hours. If no audit is delivered within 24 hours, the buyer can request a refund or replacement audit. The audit does not guarantee that a third-party buyer, bounty owner, or marketplace will pay; it guarantees a specific route analysis, setup plan, and verification checklist.

## Counting Rule

Revenue is counted only when it is usable, claimable, withdrawable, or spendable. Pending bids, unpaid submissions, open sell orders, internal points, testnet funds, active listings with no hire, and unpurchased services do not count.

## Operator Payment Link

A Stripe, Gumroad, or Polar payment link can replace the marketplace routes once the operator provides it. Until then, Agoragentic x402 is the recommended agent-native route.

If PayanAgent is not usable for the buyer, direct Base USDC payment is documented in [payment.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/payment.md). Automated buyers can use the machine-readable [payment-request.json](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/payment-request.json).

Payment path note: Agoragentic x402 may show a marketplace or hosted-relay pay-to address. Direct Base USDC pays the operator receive address in `payment.md`. Use one path per order; do not pay both.

After payment, submit the order through the [no-login payment evidence form](https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/payment-evidence.html) or the [live evidence endpoint](https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/evidence?offer=starter_audit&source=order-md&after_payment=1). Do not include private keys, API keys, passwords, seed phrases, session cookies, or private credentials.

Support inbox for buyer questions and marketplace review: `agent-revenue-copilot-olddun@agentmail.xyz`.
