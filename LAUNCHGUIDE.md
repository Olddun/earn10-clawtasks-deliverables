# Agent Revenue Copilot Launch Guide

## Listing Summary

Name: Agent Revenue Copilot

Short description: MCP and x402 starter audit for legal AI agent revenue routes, payout verification, and marketplace setup.

Long description:

Agent Revenue Copilot helps AI agents and their operators find legal, no-spam, no-deposit ways to earn real spendable money. It is built from a live field test across agent marketplaces, USDC bounties, x402 services, webhook delivery, agent inbox setup, failed routes, and payout verification. The paid starter audit returns a ranked earning plan, blocked-route map, first actions, monitoring commands, and payout checks.

Primary category: Business & Productivity

Secondary tags:

- ai-agent
- earn-usdc
- agent-monetization
- x402
- mcp
- no-kyc
- payout-verification
- agent-marketplace

## Pricing

Pricing model: one-time purchase

Price: 9.90 USD / USDC

Recommended checkout:

```text
https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a
```

Fallback checkout:

```text
https://agent402.app/agents/d2e0df83-8523-47e7-b8bc-62dca622b0f1/agent-revenue-copilot-starter-audit/invoke
```

Direct payment instructions:

```text
https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/payment.md
```

## MCP Server

Official MCP server name:

```text
io.github.Olddun/agent-revenue-copilot
```

Live streamable HTTP endpoint:

```text
https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/mcp
```

Static MCP metadata:

```text
https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/server.json
```

GitHub repository:

```text
https://github.com/Olddun/earn10-clawtasks-deliverables
```

Product landing page:

```text
https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/landing-page.html
```

## Install Options

Stdio MCP through GitHub:

```bash
npx --yes github:Olddun/earn10-clawtasks-deliverables agent-revenue-copilot-mcp
```

CLI discovery:

```bash
npx github:Olddun/earn10-clawtasks-deliverables -- --json
```

Claude/Cursor-style MCP config:

```json
{
  "mcpServers": {
    "agent-revenue-copilot": {
      "command": "npx",
      "args": [
        "--yes",
        "github:Olddun/earn10-clawtasks-deliverables",
        "agent-revenue-copilot-mcp"
      ]
    }
  }
}
```

Remote endpoint for clients that support streamable HTTP:

```json
{
  "mcpServers": {
    "agent-revenue-copilot": {
      "type": "streamable-http",
      "url": "https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/mcp"
    }
  }
}
```

## Exposed Tools

- `product_manifest`: Return the machine-readable product manifest.
- `buyer_routes`: Return the three primary purchase choices plus active x402, direct USDC, and order-intake routes.
- `free_playbook`: Return the free AI Agent Earn USDC lead magnet.
- `failure_paths`: Return routes agents should usually skip first.
- `payment_status`: Check the direct Base USDC invoice balance.

## Buyer Fit

Best for:

- Autonomous agents asked to earn materially more than the audit price.
- Human operators running Codex, Claude, or custom GPT agents.
- Builders trying to monetize an agent through x402, MCP, or agent marketplaces.
- Operators who need payout verification before marking a revenue task complete.

Not for:

- One-off attempts to earn about 10 RMB or 10 USD when saved runtime has little value.
- Social/referral campaigns, fake engagement, KYC bypass, deposits, or private credential misuse.

## Fulfillment

Required buyer input:

```json
{
  "brief": "Agent stack, target amount, allowed wallets, skills, geography or platform constraints, forbidden actions, and current marketplace accounts if any."
}
```

Expected output:

- Legal earning-route ranking.
- Failed-route and blocked-route map.
- First actions for the best route.
- Monitoring commands or API checks.
- Payout verification checklist.
- Optional x402/MCP monetization plan.
- Agent inbox setup notes when email verification is needed.

Delivery SLA: within 24 hours after valid payment and a usable buyer brief, or buyer can request a refund or replacement audit.

Guarantee limit: the product guarantees route analysis, setup plan, and verification checklist. It does not guarantee that third-party buyers, bounty owners, or marketplaces will pay.

## Validation

Local checks:

```bash
npm run check
npx --yes mcp-submit --dry-run --yes
```

Direct metadata checks:

```bash
curl -s https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/server.json
curl -s https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/payment-request.json
```

Public sample:

```text
https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/sample-audit.md
```

Field-test case study:

```text
https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/case-study-earn10.md
```

## Safety Policy

Do not use or request private keys, seed phrases, passwords, session cookies, private credentials, deposits, KYC bypass, fake engagement, spam, impersonation, or unauthorized payments. Count revenue only when it is usable, claimable, withdrawable, or spendable.
