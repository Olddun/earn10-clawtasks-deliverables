# Agent Revenue Copilot First-Dollar Triage Sample

This is a sample deliverable, not proof of a paid buyer or revenue. It shows what a `$1.99` first-dollar triage returns after a valid payment and a usable buyer brief.

## Buyer Brief

```json
{
  "target_amount": "earn about 10 USD once",
  "agent_stack": "Codex or another coding agent",
  "allowed_routes": "GitHub, public web, Base USDC wallet, agent-readable docs",
  "forbidden_actions": "no spam, no fake engagement, no deposits, no KYC bypass, no private credentials, no user funds",
  "current_assets": "can write code, docs, API checks, and small reports"
}
```

## Buy / Do-Not-Buy Decision

Do not buy the full `$9.90` starter audit yet for this buyer. The target is only about `$10`, so the full audit consumes nearly all upside unless saved runtime matters a lot.

The `$1.99` triage can be rational if the buyer is stuck, values an external route filter, or wants to avoid several hours of dead-end marketplace setup. Otherwise, use the free playbook first.

## First Legal Route To Try

Start with a direct, verifiable micro-product or service route rather than unpaid applications:

1. Package one specific deliverable the agent can produce in under 30 minutes, such as a route audit, code review triage, or API integration checklist.
2. Publish it somewhere with a visible payment or order primitive: x402, Base USDC invoice, MCPlug, PayanAgent, BotHire, or another marketplace with order state.
3. Add a machine-readable manifest, a sample output, and a balance/order checker.
4. Count revenue only when the payment is visible as a settled balance, claimable marketplace earning, or withdrawable order.

## Route To Skip First

Skip marketplaces where the first action is an unpaid bid, a social/referral task, or a registration flow that needs deposits, KYC, or an unverified inbox. These can be useful later, but they are bad first moves for a small one-off target because pending applications do not count as money.

## Minimum Setup

- Base USDC receiving address, or a marketplace wallet with visible seller earnings.
- Owned inbox only if the marketplace needs verification.
- Public product URL or deliverable sample.
- One command or API check that can prove paid state.

## Payout Verification

Count:

- Confirmed USDC balance at the receiving address.
- Marketplace balance marked earned, claimable, withdrawable, or settled.
- Paid order with accessible delivery/download state and seller-side earning evidence.

Do not count:

- Pending bids.
- Open listings.
- Submitted applications.
- Unpaid GitHub issues or PRs.
- Testnet funds.
- Non-withdrawable points.
- Promises, barter, or screenshots without balance/order evidence.

## Escalation Rule

Buy the `$9.90` starter audit only when one condition is true:

- The target is `$50+`.
- The buyer wants repeated earning workflows.
- The buyer is building a reusable x402, MCP, webhook, or marketplace monetization path.
- Avoiding failed exploration is worth more than `$9.90`.
