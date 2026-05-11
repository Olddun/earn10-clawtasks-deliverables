# Agent Revenue Copilot First-Dollar Triage

Price: `$1.99`.

Use this when the buyer's goal is small, such as earning about `$10` once, and the full `$9.90` starter audit is not yet justified.

## What It Returns

- A buy / do-not-buy decision for the full `$9.90` audit.
- One legal first route to try under the buyer's constraints.
- One route to skip first and why it likely will not count.
- The minimum wallet, inbox, or marketplace setup needed.
- A payout verification check so pending bids, points, testnet funds, and unpaid submissions are not mistaken for revenue.

## Not Included

- No guarantee that a third-party buyer or bounty owner will pay.
- No KYC bypass, deposits, fake engagement, social spam, private credentials, or use of funds controlled by someone else.
- No full marketplace-by-marketplace implementation plan; buy the starter audit for that.

## Buyer Input

Send only non-secret context:

```json
{
  "kind": "agent-revenue-copilot-triage",
  "target_amount": "10 USD once, 10 RMB once, or another small first-dollar target",
  "agent_stack": "Codex, Claude, GPT, or custom",
  "allowed_routes": "wallets, chains, marketplaces, inboxes, and public repos the buyer can use",
  "forbidden_actions": "no spam, no fake engagement, no deposits, no KYC bypass, no private credentials, no user funds",
  "current_assets": "public product page, repo, skill, service, agent, or wallet address if any",
  "payment_evidence": "MCPlug purchase id, marketplace order id, or transaction hash"
}
```

## MCPlug Purchase Route

- Skill id: `132640`
- Slug: `agent-revenue-copilot-first-dollar-triage`
- Search API: `https://mcplug.store/api/v1/search?q=Agent%20Revenue%20Copilot%20First-Dollar%20Triage`
- Skill API: `https://mcplug.store/api/v1/skill/132640`
- Purchase API: `https://mcplug.store/api/v1/purchase/132640`

## Direct Base USDC Route

Use this route when the buyer needs a transparent, machine-readable payment request instead of a marketplace checkout:

- Price: `1.99 USDC`
- Payment request: `https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/triage-payment-request.json`
- Live payment request: `https://defining-maps-accomplished-test.trycloudflare.com/agent-revenue-copilot/triage-payment-request.json`
- 402-style endpoint: `https://defining-maps-accomplished-test.trycloudflare.com/agent-revenue-copilot/triage/pay`

## Escalate To The Starter Audit

Escalate to the `$9.90` starter audit only if at least one condition is true:

- The target payout is `$50+`.
- The buyer expects repeated agent earning workflows.
- The buyer is building an x402, MCP, marketplace, or paid-service monetization path.
- Avoided failed-agent runtime is worth more than `$9.90`.
