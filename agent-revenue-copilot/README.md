# Agent Revenue Copilot

Initial package: `$9.90/month`.

Agent Revenue Copilot helps AI agents and their operators find legal, no-spam, no-deposit ways to earn real spendable money. It is built from a live field test that checked agent marketplaces, x402 tools, USDC bounties, webhook services, failed routes, and payout verification.

## Who It Is For

- Autonomous agents asked to "earn $1", "earn 10 RMB", or "earn USDC".
- Human operators running OpenClaw/Codex/Claude/GPT agents.
- Builders trying to monetize an agent through x402, MCP, or agent marketplaces.
- Agents that need to avoid KYC, deposits, fake social engagement, and private credential misuse.

## The Promise

In one subscription, the buyer gets:

1. A legal earning-route audit for their current constraints.
2. A prioritized list of platforms to try first.
3. A "do not try first" failure map.
4. API commands and monitoring checks for accepted jobs, balances, and payout state.
5. x402/MCP monetization guidance if the best route is to sell a paid tool.
6. Updates as new agent-money platforms appear or break.

## What The Product Returns

Input:

```json
{
  "agent_stack": "Codex/OpenClaw/Claude/custom",
  "target_amount": "10 RMB or 1.5 USDC",
  "constraints": [
    "no KYC",
    "no deposits",
    "no social spam",
    "no user private credentials"
  ],
  "available_wallets": ["base", "solana"],
  "skills": ["coding", "research", "API integration"]
}
```

Output:

```json
{
  "counting_rule": "Only usable, claimable, withdrawable, or spendable value counts.",
  "top_routes": [
    {
      "route": "PayanAgent API service",
      "why": "No-email agent, API services, webhook delivery, USDC/Base style marketplace",
      "first_action": "Create a buyer-intent service at or above target price",
      "verification": "Check earned/completed balance, not only pending bids"
    },
    {
      "route": "Artifact bounty",
      "why": "A guide or PR can be submitted without fake engagement",
      "first_action": "Pick a bounty where deliverable can be publicly verified",
      "verification": "Accepted/merged/paid status only"
    }
  ],
  "skip_first": [
    "email claim",
    "KYC",
    "deposit-gated jobs",
    "social/referral bounties",
    "testnet rewards",
    "illiquid points"
  ],
  "next_commands": [
    "check wallet balance",
    "check accepted jobs",
    "check webhook events",
    "verify payout before marking complete"
  ]
}
```

## Free Assets

These are the public lead magnets:

- [AI Agent Earn USDC Playbook](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-money/README.md)
- [Do Not Try First: AI Agent Money Failure Paths](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-money/dont-try-agent-money-failure-paths.md)
- [Paid MCP/API Tool Guide with Pyrimid and x402](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/pyrimid-guide/paid-mcp-tool-guide.md)

## Order Path

Current canonical paid route:

- PayanAgent service id: `js7fkxwvp99cvsyr8jyg5kphzx86gp1j`
- Service name: `Agent Revenue Copilot starter audit - $9.90`
- Price: `990` cents
- BotHire mailbox service id: `13e357e2-e157-4c3d-a978-057a5a49e981`
- AgentPact offer id: `449463e2-af67-4e73-96e7-92109c95ab4c`
- NEAR Agent Market service id: `03839e5a-3c35-4220-9033-dfafff81925a`
- Required input: buyer constraints in a `brief` string, plus optional `kind: "agent-revenue-copilot"`
- Full machine-readable order file: [order.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/order.md)
- Product manifest: [product.json](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/product.json)
- Direct Base USDC fallback: [payment.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/payment.md)
- Paid order intake form: [GitHub issue form](https://github.com/Olddun/earn10-clawtasks-deliverables/issues/new?template=agent-revenue-copilot-order.yml)

Do not count a sale until PayanAgent or another payment route shows actual earned, completed, claimable, withdrawable, or spendable value.

## Subscription Positioning

Headline:

> Stop burning agent runtime on fake money routes.

Subheadline:

> Agent Revenue Copilot gives agents a ranked legal earning plan, platform failure map, payout checks, and monetization setup for $9.90/month.

Primary CTA:

> Subscribe for $9.90/month and send your agent constraints.

Secondary CTA:

> Try a one-time $9.90 starter audit first.

## Payment Options To Wire

Best options, in order:

1. Stripe Payment Link or Stripe Checkout subscription.
2. Gumroad or Lemon Squeezy monthly membership.
3. Polar.sh subscription for developer tools.
4. Base USDC manual monthly payment with a simple receipt form.
5. PayanAgent or ClawGig one-time `$9.90` route audit as the first paid wedge.

## Acquisition Channels

### Machine-readable

- `llms.txt`
- `agents.txt`
- `skill.md`
- `order.md`
- `product.json`
- GitHub README and raw Markdown
- x402/Pyrimid catalog entry
- PayanAgent service
- Agent marketplace service names matching buyer intent

### Human-readable

- GitHub repo topics: `ai-agent`, `earn-usdc`, `agent-monetization`, `x402`, `no-kyc`.
- Posts in agent builder communities, but not fake engagement tasks.
- PRs/guides that solve real monetization problems.
- Direct links in bounty submissions.

## Buyer Search Intent

Use these phrases in listings and docs:

- `AI agent earn USDC`
- `autonomous agent monetization`
- `agent earning route audit`
- `no KYC agent earning`
- `x402 paid tool setup`
- `MCP paid tool monetization`
- `agent marketplace payout verification`
- `make money with OpenClaw agent`
- `make money with Codex agent`

## Fulfillment Workflow

1. Buyer pays.
2. Buyer submits constraints, stack, wallets available, and forbidden actions.
3. Copilot returns a ranked earning plan.
4. Copilot optionally creates service listing copy, webhook route, monitor commands, and payout verification checks.
5. Buyer gets updates as platform state changes.

## What We Need From The Operator

To sell this properly, the operator should provide:

- Base/EVM payout address for USDC.
- Optional Solana USDC payout address.
- Stripe/Gumroad/Polar account or payment link if recurring card billing is desired.
- Preferred brand name, or use `Agent Revenue Copilot`.
- Support email or GitHub issue URL.
- Refund policy, such as "refund if no route audit is delivered within 24 hours."
