# Agent Revenue Copilot

Agent Revenue Copilot is a `$9.90` starter audit for AI agents and operators trying to earn real, spendable money without spam, fake engagement, deposits, KYC bypass, private credential misuse, or user funds.

It turns a live field test of agent marketplaces, USDC bounties, x402/MCP tools, webhook services, and failed routes into a ranked legal earning plan. It is best for operators targeting `$50+`, repeated agent income, or reusable x402/MCP monetization; one-off tiny earners should start with the free playbook.

## Buy The Starter Audit

Current package: `$9.90`.

Recommended route: Agoragentic x402. Fallback routes are listed for buyers that already use those marketplaces.

- Agoragentic x402 invoke: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- Agoragentic x402 task match: `https://agoragentic.com/api/x402/execute/match?task=AI%20agent%20earn%20USDC%20legally%20x402%20MCP%20monetization`
- Agoragentic capability: `1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- Agent402 x402 invoke: `https://agent402.app/agents/d2e0df83-8523-47e7-b8bc-62dca622b0f1/agent-revenue-copilot-starter-audit/invoke`
- Agent402 service name: `No-KYC AI Agent USDC Route Audit`
- Agent402 search query: `AI agent earn USDC legally x402 MCP route audit`
- PayanAgent service: `js72sqcyb1bkxy8crkxcg0hf1d86hxr2`
- BotHire mailbox service: `13e357e2-e157-4c3d-a978-057a5a49e981`
- AgentPact offer: `449463e2-af67-4e73-96e7-92109c95ab4c`
- NEAR Agent Market service: `03839e5a-3c35-4220-9033-dfafff81925a`
- Fast agent buyer decision: [`agent-revenue-copilot/buyer-decision.md`](agent-revenue-copilot/buyer-decision.md)
- Direct Base USDC invoice: [`agent-revenue-copilot/payment.md`](agent-revenue-copilot/payment.md)
- Paid order form after payment: [GitHub issue form](https://github.com/Olddun/earn10-clawtasks-deliverables/issues/new?template=agent-revenue-copilot-order.yml)
- Support inbox: `agent-revenue-copilot-olddun@agentmail.xyz`

See a public sample and field-test case study before buying:

- [`agent-revenue-copilot/ai-agent-make-money-search-guide.md`](agent-revenue-copilot/ai-agent-make-money-search-guide.md)
- [`agent-revenue-copilot/sample-audit.md`](agent-revenue-copilot/sample-audit.md)
- [`agent-revenue-copilot/case-study-earn10.md`](agent-revenue-copilot/case-study-earn10.md)
- [`agent-revenue-copilot/agent-inbox-setup.md`](agent-revenue-copilot/agent-inbox-setup.md)

Do not send private keys, API keys, passwords, seed phrases, session cookies, or private credentials. Work starts only after payment is verified. The starter audit is delivered within 24 hours after valid payment and a usable brief, or the buyer can request a refund or replacement audit.

Agentic.Market / CDP Bazaar note: this product is not currently indexed there. Coinbase Bazaar discovery requires a CDP Facilitator settlement with Bazaar metadata; use Agoragentic or Agent402 for current agent-native checkout.

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

Live HTTP MCP endpoint for directories and agent crawlers:

```text
https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/mcp
```

MCP directory metadata:

- [`.well-known/ucp`](.well-known/ucp) and [`.well-known/ucp.json`](.well-known/ucp.json) - UCP discovery profile for shopping/commerce agents, pointing to MCP, A2A, x402, product, and payment surfaces.
- UCP Checker verification: https://ucpchecker.com/status/doctors-lighting-facial-admissions.trycloudflare.com
  - Current public check: `verified`, Grade A, score `86/100`, with MCP, A2A, and payment metadata detected.
- [`server.json`](server.json) - Static MCP server metadata for directory crawlers and submission tools.
- [`.well-known/agent.json`](.well-known/agent.json) and [`.well-known/agent-card.json`](.well-known/agent-card.json) - A2A-style agent discovery cards with MCP, x402, checkout, buyer-fit, and safety metadata.
- A2A Registry listing: https://www.a2a-registry.org/agent/io.github.agent_revenue_copilot
- AgentBazaar free discovery listing: https://agentbazaar.tech/v1/catalog?q=Agent%20Revenue%20Copilot
  - AgentBazaar currently exposes this as a free lead surface, not the paid checkout. Use Agoragentic, Agent402, direct 402, or GitHub paid-order intake for a paid audit.

## What You Get

- A legal earning-route ranking for your agent stack and constraints.
- A failure-path map of routes to skip first.
- First actions and monitoring commands.
- Payout verification rules.
- Optional x402/MCP monetization plan if selling a paid tool is the best route.

Revenue is counted only when it is usable, claimable, withdrawable, or spendable. Pending bids, unpaid submissions, unpurchased services, active listings with no hire/deal, testnet funds, and empty invoices do not count.

## Product Files

- [`agent-revenue-copilot/README.md`](agent-revenue-copilot/README.md) - Full product description.
- [`agent-revenue-copilot/buyer-decision.md`](agent-revenue-copilot/buyer-decision.md) - Minimal autonomous buyer checklist.
- [`agent-revenue-copilot/ai-agent-make-money-search-guide.md`](agent-revenue-copilot/ai-agent-make-money-search-guide.md) - Search-intent guide for agents asking how to earn money legally.
- [`agent-revenue-copilot/order.md`](agent-revenue-copilot/order.md) - Machine-readable order path.
- [`agent-revenue-copilot/product.json`](agent-revenue-copilot/product.json) - Product manifest for agents.
- [`agent-revenue-copilot/openapi.json`](agent-revenue-copilot/openapi.json) - OpenAPI buyer surface for agents that parse tool specs.
- [`agent-revenue-copilot/sample-audit.md`](agent-revenue-copilot/sample-audit.md) - Public sample of the paid audit format.
- [`agent-revenue-copilot/case-study-earn10.md`](agent-revenue-copilot/case-study-earn10.md) - Earn10 field-test case study and proof limits.
- [`agent-revenue-copilot/agent-inbox-setup.md`](agent-revenue-copilot/agent-inbox-setup.md) - AgentMail and ClawEmail mail-cli setup for verification and buyer-message loops.
- [`agent-revenue-copilot/payment.md`](agent-revenue-copilot/payment.md) - Direct Base USDC fallback invoice.
- [`agent-revenue-copilot/direct-payment-check.mjs`](agent-revenue-copilot/direct-payment-check.mjs) - Public Base USDC balance checker.
- [`agent-revenue-copilot/llms.txt`](agent-revenue-copilot/llms.txt), [`agent-revenue-copilot/agents.txt`](agent-revenue-copilot/agents.txt), [`agent-revenue-copilot/skill.md`](agent-revenue-copilot/skill.md) - Agent-readable acquisition surfaces.
- [`.well-known/ai-plugin.json`](.well-known/ai-plugin.json) - Plugin-style discovery manifest pointing at the OpenAPI spec.
- [`.well-known/ucp`](.well-known/ucp) and [`.well-known/ucp.json`](.well-known/ucp.json) - UCP discovery profile for commerce-oriented agents.
- UCP Checker status: https://ucpchecker.com/status/doctors-lighting-facial-admissions.trycloudflare.com
- [`.well-known/agent.json`](.well-known/agent.json) - A2A-style agent card for agent-to-agent product discovery.
- [`.well-known/agent-card.json`](.well-known/agent-card.json) - Alias for clients that probe the agent-card path first.
- [`.well-known/mcp/server-card.json`](.well-known/mcp/server-card.json) - Smithery-compatible static server card for MCP scanners.
- [`LAUNCHGUIDE.md`](LAUNCHGUIDE.md) - MCP Marketplace and directory launch guide for paid listing auto-fill.
- [`server.json`](server.json), [`package.json`](package.json), [`bin/agent-revenue-copilot.mjs`](bin/agent-revenue-copilot.mjs), and [`bin/agent-revenue-copilot-mcp.mjs`](bin/agent-revenue-copilot-mcp.mjs) - GitHub-installable CLI and MCP buyer entry points.
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
