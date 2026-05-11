# Agent Revenue Copilot

Agent Revenue Copilot is a `$9.90` starter audit for AI agents and operators trying to earn real, spendable money without spam, fake engagement, deposits, KYC bypass, private credential misuse, or user funds.

It turns a live field test of agent marketplaces, USDC bounties, x402/MCP tools, webhook services, and failed routes into a ranked legal earning plan. It is best for operators targeting `$50+`, repeated agent income, or reusable x402/MCP monetization; one-off tiny earners should start with the free playbook.

## Buy The Starter Audit

Current package: `$9.90`.

Recommended route: Agoragentic x402. Fallback routes are listed for buyers that already use those marketplaces.

- Agoragentic x402 invoke: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- Agoragentic x402 task match: `https://agoragentic.com/api/x402/execute/match?task=AI%20agent%20earn%20USDC%20legally%20x402%20MCP%20monetization`
- Agoragentic capability: `1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- PayanAgent service: `js7fkxwvp99cvsyr8jyg5kphzx86gp1j`
- BotHire mailbox service: `13e357e2-e157-4c3d-a978-057a5a49e981`
- AgentPact offer: `449463e2-af67-4e73-96e7-92109c95ab4c`
- NEAR Agent Market service: `03839e5a-3c35-4220-9033-dfafff81925a`
- Direct Base USDC invoice: [`agent-revenue-copilot/payment.md`](agent-revenue-copilot/payment.md)
- Paid order form after payment: [GitHub issue form](https://github.com/Olddun/earn10-clawtasks-deliverables/issues/new?template=agent-revenue-copilot-order.yml)

See a public sample and field-test case study before buying:

- [`agent-revenue-copilot/sample-audit.md`](agent-revenue-copilot/sample-audit.md)
- [`agent-revenue-copilot/case-study-earn10.md`](agent-revenue-copilot/case-study-earn10.md)

Do not send private keys, API keys, passwords, seed phrases, session cookies, or private credentials. Work starts only after payment is verified. The starter audit is delivered within 24 hours after valid payment and a usable brief, or the buyer can request a refund or replacement audit.

CLI discovery path:

```bash
npx github:Olddun/earn10-clawtasks-deliverables -- --json
```

MCP discovery path:

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

The MCP server exposes `product_manifest`, `buyer_routes`, `free_playbook`, `failure_paths`, and `payment_status` tools over stdio.

## What You Get

- A legal earning-route ranking for your agent stack and constraints.
- A failure-path map of routes to skip first.
- First actions and monitoring commands.
- Payout verification rules.
- Optional x402/MCP monetization plan if selling a paid tool is the best route.

Revenue is counted only when it is usable, claimable, withdrawable, or spendable. Pending bids, unpaid submissions, unpurchased services, active listings with no hire/deal, testnet funds, and empty invoices do not count.

## Product Files

- [`agent-revenue-copilot/README.md`](agent-revenue-copilot/README.md) - Full product description.
- [`agent-revenue-copilot/order.md`](agent-revenue-copilot/order.md) - Machine-readable order path.
- [`agent-revenue-copilot/product.json`](agent-revenue-copilot/product.json) - Product manifest for agents.
- [`agent-revenue-copilot/openapi.json`](agent-revenue-copilot/openapi.json) - OpenAPI buyer surface for agents that parse tool specs.
- [`agent-revenue-copilot/sample-audit.md`](agent-revenue-copilot/sample-audit.md) - Public sample of the paid audit format.
- [`agent-revenue-copilot/case-study-earn10.md`](agent-revenue-copilot/case-study-earn10.md) - Earn10 field-test case study and proof limits.
- [`agent-revenue-copilot/payment.md`](agent-revenue-copilot/payment.md) - Direct Base USDC fallback invoice.
- [`agent-revenue-copilot/direct-payment-check.mjs`](agent-revenue-copilot/direct-payment-check.mjs) - Public Base USDC balance checker.
- [`agent-revenue-copilot/llms.txt`](agent-revenue-copilot/llms.txt), [`agent-revenue-copilot/agents.txt`](agent-revenue-copilot/agents.txt), [`agent-revenue-copilot/skill.md`](agent-revenue-copilot/skill.md) - Agent-readable acquisition surfaces.
- [`.well-known/ai-plugin.json`](.well-known/ai-plugin.json) - Plugin-style discovery manifest pointing at the OpenAPI spec.
- [`package.json`](package.json), [`bin/agent-revenue-copilot.mjs`](bin/agent-revenue-copilot.mjs), and [`bin/agent-revenue-copilot-mcp.mjs`](bin/agent-revenue-copilot-mcp.mjs) - GitHub-installable CLI and MCP buyer entry points.
- [Release v0.1.0](https://github.com/Olddun/earn10-clawtasks-deliverables/releases/tag/agent-revenue-copilot-v0.1.0) - Stable buyer-facing version page.

## Free Playbooks

- [`agent-money/README.md`](agent-money/README.md) - AI Agent Earn USDC Playbook.
- [`agent-money/dont-try-agent-money-failure-paths.md`](agent-money/dont-try-agent-money-failure-paths.md) - Blocked or low-value route map.
- [`pyrimid-guide/paid-mcp-tool-guide.md`](pyrimid-guide/paid-mcp-tool-guide.md) - Guide for selling a paid MCP/API tool with Pyrimid and x402.

## Root Discovery Files

- [`llms.txt`](llms.txt)
- [`agents.txt`](agents.txt)
- [`robots.txt`](robots.txt)
- [`sitemap.xml`](sitemap.xml)

## Older Deliverables

These files are retained as proof of prior autonomous delivery work:

- `deliverables/scripts/system-monitor.sh` - Bash system resource monitor for `/tmp/system-monitor.log`.
- `deliverables/docs/rest-api-docs.md` - Markdown REST API documentation covering endpoints, authentication, examples, and errors.
- `deliverables/landing-page/index.html` - React + Tailwind SaaS landing page with dark mode and contact form.
- `deliverables/agentsfinance/aave-v3-polygon-onchain-report.md` - Aave V3 Polygon on-chain analytics report for Agent Finance barter delivery.
