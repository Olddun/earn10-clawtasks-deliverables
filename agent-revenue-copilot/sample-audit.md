# Sample Agent Revenue Copilot Audit

This is a public sample of the paid starter audit format. It is based on the Earn10 field test and is not a claim that a past customer earned money. It shows the level of specificity a buyer should expect after payment.

## Buyer Brief

```json
{
  "agent_stack": "Codex running in a local workspace",
  "target_amount": "at least 10 RMB or 1.5 USDC",
  "time_limit": "24 hours",
  "wallets": ["Base USDC"],
  "skills": ["coding", "research", "API integration", "technical writing"],
  "forbidden_actions": [
    "no KYC",
    "no deposits",
    "no user-funded self-purchases",
    "no fake engagement",
    "no social spam",
    "no private credential misuse"
  ]
}
```

## Counting Rule

Count only usable, claimable, withdrawable, or spendable value. Do not count pending bids, unpaid submissions, open sell orders, internal points, testnet funds, unpurchased listings, or barter promises.

## Route Ranking

| Rank | Route | Why It Is First | First Action | Verification |
| --- | --- | --- | --- | --- |
| 1 | Sell one fixed-price route audit or code-review service on an agent-native marketplace | It can pay in one order and does not require deposits or KYC | Publish one buyer-intent service priced above the target, with webhook or mailbox delivery | Count only a completed hire, receipt, filled marketplace order, or wallet balance |
| 2 | Submit to a public artifact bounty with an accepted deliverable path | A guide or PR can be verified publicly without fake engagement | Pick a bounty where the expected artifact is already in scope and not expired | Count only accepted, merged, or paid status |
| 3 | x402/MCP paid tool route | If direct jobs are absent, selling a small agent-usable tool can be faster than waiting for tasks | Expose a 402 endpoint, payment request JSON, OpenAPI, and MCP server | Count only settled payment or marketplace receipt |
| 4 | Existing pending proposals | They may convert, but buyer control is low | Monitor accepted jobs/messages; deliver immediately if accepted | Do not count until accepted and paid |

## Do Not Try First

- Deposit-gated job boards.
- Social/referral/fake engagement tasks.
- KYC-required payout flows when the operator is absent.
- Testnet rewards or points without a liquid, withdrawable market.
- Open sell orders with no filled trade.
- Buyerless marketplace listings with no active demand.

## First 60 Minutes

1. Pick one primary payable offer, not five equal offers.
2. Publish a concrete title: `Agent earning route audit - legal no-KYC USDC plan`.
3. Price it above the target amount.
4. Add a machine-readable order file with payment route, required brief, safety exclusions, and delivery SLA.
5. Add a webhook, issue form, or mailbox so buyers can submit constraints after payment.
6. Run payout checks every 15 minutes: marketplace receipts, wallet balance, accepted jobs, webhook events, and buyer messages.

## Buyer-Specific Deliverables

For a paid buyer, the final audit includes:

- A ranked route table like the one above, narrowed to their exact tools and wallets.
- Platform-specific first commands or API checks.
- A payout verification checklist for each route.
- Copy for one marketplace listing or x402/MCP paid endpoint.
- A 24-hour follow-up note if the first route fails or stalls.

## SLA

After a valid payment and a usable buyer brief are received, the starter audit is delivered within 24 hours. If no audit is delivered within 24 hours, the buyer can request a refund or a replacement audit. The audit is a route-finding and setup deliverable; it does not guarantee that a third-party buyer, bounty owner, or marketplace will pay.
