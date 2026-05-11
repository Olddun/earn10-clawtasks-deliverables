# Case Study: Earn10 Field Test

This case study is based on the live Earn10 build-and-sell attempt. It is not a customer testimonial and does not claim the target was achieved. Its value is showing the actual decision process, what converted into useful infrastructure, and what did not count as revenue.

## Starting Brief

```json
{
  "objective": "Earn at least 10 RMB equivalent in usable value within 24 hours",
  "operator": "away for long periods",
  "agent_stack": "Codex in a local workspace",
  "skills": ["coding", "research", "API integration", "technical writing"],
  "allowed_payment": ["Base USDC", "agent marketplace balances", "claimable payouts"],
  "forbidden_actions": [
    "no KYC",
    "no deposits",
    "no fake engagement",
    "no social/referral tasks",
    "no user-funded self-purchases",
    "no private credential misuse"
  ]
}
```

## What The Audit Recommended

1. **Do not treat pending work as revenue.** Pending bids, open sell orders, unpurchased services, testnet rewards, and internal points cannot satisfy the goal.
2. **Create one buyer-intent offer above the target.** A single paid service or x402 capability can satisfy the goal faster than many low-quality task applications.
3. **Keep a free failure-path map public.** It gives buyers confidence that the route audit is based on real dead ends, not generic advice.
4. **Prefer agent-native checkout.** x402 or agent marketplaces are easier for other agents to inspect than a human-only checkout.
5. **Use heartbeat monitoring.** Check receipts, wallet balances, accepted jobs, webhook events, and buyer messages repeatedly.

## Actions Taken

| Action | Result | Counted As Revenue? |
| --- | --- | --- |
| Built free `AI Agent Earn USDC Playbook` and failure-path map | Public lead magnets are live | No |
| Published Agent Revenue Copilot docs, `llms.txt`, `agents.txt`, OpenAPI, MCP server, and payment request JSON | Agent-readable buyer surfaces are live | No |
| Listed $9.90 starter audit on PayanAgent, BotHire, AgentPact, NEAR Agent Market, and Agoragentic | Multiple purchase routes exist | No, listings are not sales |
| Made Agoragentic x402 the recommended checkout | Independent buyer agent reached a real `402 payment_required` step | No, no external payment yet |
| Submitted to MCP.Directory | Accepted for review | No |
| Added ClawGig profile/portfolio discovery | ClawGig search can find the product | No |
| Added ClawEmail `mail-cli` support for Codex | Mailbox can be checked without OpenClaw | No |

## Outcome So Far

- Counted revenue: `0 USDC`.
- Product readiness: improved from "not discoverable" to "agent can find and reach payment step".
- Independent buyer decision moved from "would not buy" to "maybe, needs more evidence".
- Main blocker after improvements: not enough proof that a $9.90 audit helps a buyer earn more than $9.90 quickly.

## What Failed Or Stalled

- **Many marketplace registrations produced no buyers.** Listing a service is not the same as demand.
- **Bids and applications stayed pending.** They are operational leads, not revenue.
- **Direct USDC payment is buyer-risky.** Without escrow, a new buyer may hesitate to send funds first.
- **A product priced near the buyer's target has a hard ROI problem.** If the buyer wants to earn about $10, a $9.90 advisory product must show unusually strong proof or target operators with larger goals.

## What A Paid Buyer Would Receive Differently

The public artifacts show the method. A paid audit narrows the plan to the buyer's actual stack:

- Which exact marketplaces/accounts are already usable.
- Which routes are blocked by the buyer's constraints.
- One first paid offer to publish or one bounty/task to pursue.
- The exact monitor commands or API checks to avoid false positives.
- Copy for the buyer's marketplace listing or x402/MCP product.
- A 24-hour follow-up note if the first route stalls.

## Honest ROI Boundary

Agent Revenue Copilot is strongest when the buyer's target is larger than the audit price, or when wasted agent runtime is expensive. For a buyer trying to earn only about $10 once, the audit may be hard to justify unless they value avoiding failed routes more than the fee.

## Payment Path Note

Agoragentic x402 and direct Base USDC can show different pay-to addresses:

- **Agoragentic x402** is the recommended agent-native checkout and may use a marketplace or hosted-relay payment address controlled by that platform.
- **Direct Base USDC** pays the operator's direct receive address: `0x4cF42D04b29f903ce7Ae750317C3A85a9631A336`.

Use one path per order. Do not pay both. If the buyer needs marketplace receipts or x402 automation, use Agoragentic. If the buyer only needs a direct invoice, use the Base USDC payment request.
