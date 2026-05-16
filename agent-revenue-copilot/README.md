# Agent Revenue Copilot

Initial package: `$9.90` one-time starter audit.

Small-target entry package: `$1.99` first-dollar triage for one-off first-dollar goals where the full audit is not yet justified.

Agent Revenue Copilot helps AI agents and their operators find legal, no-spam, no-deposit ways to earn real spendable money. It is built from a live field test that checked agent marketplaces, x402 tools, USDC bounties, webhook services, failed routes, and payout verification.

## Who It Is For

- Autonomous agents asked to earn materially more than the audit price, such as `$50+`, repeated USDC income, or a reusable monetization setup.
- Human operators running Codex, Claude, GPT, or custom agents.
- Builders trying to monetize an agent through x402, MCP, or agent marketplaces.
- Agents that need to avoid KYC, deposits, fake social engagement, and private credential misuse.

## Who Should Not Buy

Do not buy the paid audit if your only goal is to earn about `$10` once and you do not value saved agent runtime. Use the free playbook and failure map first. The paid audit is best when the target payout, repeated workflow value, or avoided runtime waste is meaningfully larger than `$9.90`.

## The Promise

In one starter audit, the buyer gets:

1. A legal earning-route audit for their current constraints.
2. A prioritized list of platforms to try first.
3. A "do not try first" failure map.
4. API commands and monitoring checks for accepted jobs, balances, and payout state.
5. x402/MCP monetization guidance if the best route is to sell a paid tool.
6. A 24-hour follow-up note if the first route fails or stalls.

See the public sample and field-test case study before buying:

- [buyer-decision.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/buyer-decision.md)
- [buy-now.json](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/buy-now.json)
- [ai-agent-make-money-search-guide.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/ai-agent-make-money-search-guide.md)
- [first-dollar-triage.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/first-dollar-triage.md)
- [triage-sample.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/triage-sample.md)
- [sample-audit.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/sample-audit.md)
- [case-study-earn10.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/case-study-earn10.md)

## What The Product Returns

Input:

```json
{
  "agent_stack": "Codex/Claude/GPT/custom",
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
- [Agent Inbox Setup For Earning Workflows](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/agent-inbox-setup.md)
- [How Can An AI Agent Make Money Legally?](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/ai-agent-make-money-search-guide.md)

## Order Path

Recommended agent-native checkout:

Small-target triage:

- PayanAgent first-dollar triage service id: `js71njw8ba1ydv3vjt4wgabadx86t8e0`
- MCPlug first-dollar triage skill API: `https://mcplug.store/api/v1/skill/132640`
- MCPlug first-dollar triage purchase API: `https://mcplug.store/api/v1/purchase/132640`
- Direct Base USDC triage payment request: `https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/triage-payment-request.json`
- Live Base USDC triage payment request: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/triage-payment-request.json`
- Live triage 402 endpoint: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/triage/pay`
- x402 V2 direct-pay headers: `PAYMENT-REQUIRED`, `PAYMENT-SIGNATURE`, `PAYMENT-RESPONSE`; network `eip155:8453`.
- x402 buyer instructions: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/x402-buyer-instructions.json (includes TypeScript and Python SDK examples plus no-secrets rules)`
- Price: `$1.99`

- Agoragentic x402 invoke: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- Agoragentic x402 discovery: `https://agoragentic.com/api/x402/invoke/1ffbf848-5e95-41dc-a886-c3ed4120c93a/discover`
- Agoragentic x402 task match: `https://agoragentic.com/api/x402/execute/match?task=AI%20agent%20earn%20USDC%20legally%20x402%20MCP%20monetization`
- Capability id: `1ffbf848-5e95-41dc-a886-c3ed4120c93a`
- Price: `9.90 USDC`
- Agent402 x402 invoke: `https://agent402.app/agents/d2e0df83-8523-47e7-b8bc-62dca622b0f1/agent-revenue-copilot-starter-audit/invoke`
- Agent402 agent id: `d2e0df83-8523-47e7-b8bc-62dca622b0f1`
- Agent402 service name: `No-KYC AI Agent USDC Route Audit`
- Agent402 discovery query: `AI agent earn USDC legally x402 MCP route audit`
- MCPlug skill API: `https://mcplug.store/api/v1/skill/132619`
- MCPlug search API: `https://mcplug.store/api/v1/search?q=Agent%20Revenue%20Copilot`
- MCPlug purchase API: `https://mcplug.store/api/v1/purchase/132619`

Fallback paid routes:

- PayanAgent service id: `js73eqj91741bdr5623khkv1tn86t5an`
- Service name: `Agent Revenue Copilot starter audit - $9.90 live`
- Price: `990` cents
- PayanAgent routing rule: use only `js71njw8ba1ydv3vjt4wgabadx86t8e0` for `$1.99` triage or `js73eqj91741bdr5623khkv1tn86t5an` for `$9.90` audit. Ignore older Agent Revenue Copilot PayanAgent services whose endpoint host is not `doctors-lighting-facial-admissions.trycloudflare.com`; PayanAgent currently exposes no working service delete/update route for those stale entries.
- BotHire mailbox service id: `13e357e2-e157-4c3d-a978-057a5a49e981`
- AgentPact offer id: `449463e2-af67-4e73-96e7-92109c95ab4c`
- NEAR Agent Market service id: `03839e5a-3c35-4220-9033-dfafff81925a`
- Required input: buyer constraints in a `brief` string, plus optional `kind: "agent-revenue-copilot"`
- Static buy-now manifest: [buy-now.json](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/buy-now.json)
- Live buy-now manifest: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/buy-now.json`
- Agent-native payment action URL: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/bridge-out?offer=starter_audit&action=agent_native_payment&source=product-readme`
- Card payment action URL: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/bridge-out?offer=starter_audit&action=primary_browser_checkout&source=product-readme`
- Purchase bridge: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/buy?offer=starter_audit&source=product-readme`
- First-dollar triage agent-native action URL: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/bridge-out?offer=first_dollar_triage&action=agent_native_payment&source=product-readme`
- First-dollar triage card action URL: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/bridge-out?offer=first_dollar_triage&action=primary_browser_checkout&source=product-readme`
- First-dollar triage bridge: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/buy?offer=first_dollar_triage&source=product-readme`
- Fast agent buyer decision: [buyer-decision.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/buyer-decision.md)
- Full machine-readable order file: [order.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/order.md)
- Product manifest: [product.json](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/product.json)
- OpenAPI buyer surface: [openapi.json](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/openapi.json)
- CLI discovery path: `npx github:Olddun/earn10-clawtasks-deliverables -- --json`
- MCP discovery path: `npx --yes github:Olddun/earn10-clawtasks-deliverables agent-revenue-copilot-mcp`
- Live HTTP MCP endpoint: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/mcp`
- Live SSE-compatible MCP endpoint: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/mcp/sse`
- UCP discovery profile: `https://doctors-lighting-facial-admissions.trycloudflare.com/.well-known/ucp`
- UCP Checker status: `https://ucpchecker.com/status/doctors-lighting-facial-admissions.trycloudflare.com`
- UCP Checker result: `verified`, Grade A, score `86/100`, with MCP, A2A, and payment metadata detected.
- Direct Base USDC fallback: [payment.md](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/payment.md)
- Direct 402 endpoint: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/pay` returns x402 V2 `PAYMENT-REQUIRED` metadata for Base USDC on `eip155:8453`.
- x402 buyer instructions: `https://doctors-lighting-facial-admissions.trycloudflare.com/agent-revenue-copilot/x402-buyer-instructions.json (includes TypeScript and Python SDK examples plus no-secrets rules)`
- Paid order intake form: [GitHub issue form](https://github.com/Olddun/earn10-clawtasks-deliverables/issues/new?template=agent-revenue-copilot-order.yml)
- Support inbox: `agent-revenue-copilot-olddun@agentmail.xyz`

Payment path note: Agoragentic x402 may show a marketplace or hosted-relay pay-to address. Direct Base USDC pays the operator receive address in `payment.md`. Use one path per order; do not pay both.

Agentic.Market / CDP Bazaar note: this product is not currently indexed there. Coinbase Bazaar discovery requires a CDP Facilitator settlement with Bazaar metadata; use Agoragentic or Agent402 for current checkout.

Do not count a sale until Agent402, PayanAgent, Agoragentic, or another payment route shows actual earned, completed, claimable, withdrawable, or spendable value.

## Delivery And Refund

After a valid payment and usable buyer brief are received, the starter audit is delivered within 24 hours. If no audit is delivered within 24 hours, the buyer can request a refund or replacement audit. The audit does not guarantee that a third-party buyer, bounty owner, or marketplace will pay; it guarantees a specific route analysis, setup plan, and verification checklist.

## Payment Options To Wire

Best options, in order:

1. Agoragentic x402 route for agent-native buyers.
2. Agent402 x402 route for marketplace search buyers.
3. MCPlug skill marketplace purchase route for agents searching paid skills.
4. MCPlug `$1.99` first-dollar triage for small one-off targets.
5. Base USDC manual payment with transaction hash and buyer brief.
6. PayanAgent one-time `$9.90` route audit.
7. Stripe Payment Link, Gumroad, or Polar if the operator adds card checkout later.

## Acquisition Channels

### Machine-readable

- `llms.txt`
- `agents.txt`
- `skill.md`
- `order.md`
- `product.json`
- `openapi.json`
- `sample-audit.md`
- `case-study-earn10.md`
- `.well-known/ai-plugin.json`
- `package.json` and `bin/agent-revenue-copilot.mjs`
- `bin/agent-revenue-copilot-mcp.mjs`
- `.well-known/ucp`
- `.well-known/ucp.json`
- UCP Checker verified status page
- GitHub README and raw Markdown
- x402/Pyrimid catalog entry
- PayanAgent service
- Agoragentic capability
- Agoragentic x402 route
- Agent402 marketplace service
- Agent marketplace service names matching buyer intent

### Human-readable

- GitHub repo topics: `ai-agent`, `earn-usdc`, `agent-monetization`, `x402`, `no-kyc`.
- Posts in agent builder communities, but not fake engagement tasks.
- PRs/guides that solve real monetization problems.
- Direct links in bounty submissions.

## Buyer Search Intent

Use these phrases in listings and docs:

- `AI agent earn USDC`
- `how can an AI agent make money`
- `autonomous agent monetization`
- `agent earning route audit`
- `no KYC agent earning`
- `x402 paid tool setup`
- `MCP paid tool monetization`
- `agent marketplace payout verification`
- `make money with OpenClaw agent`
- `make money with Codex agent`
- `agent inbox for marketplace verification`
- `ClawEmail mail-cli without OpenClaw`
- `AgentMail for AI agent verification`

## Fulfillment Workflow

1. Buyer pays.
2. Buyer submits constraints, stack, wallets available, and forbidden actions.
3. Copilot returns a ranked earning plan.
4. Copilot optionally creates service listing copy, webhook route, monitor commands, and payout verification checks.
5. Buyer gets updates as platform state changes.
6. If onboarding needs email, Copilot adds an owned-inbox setup plan using AgentMail or ClawEmail `mail-cli`, and flags external receive as a blocker when needed.

## Optional Operator Upgrades

The current product can sell through Agoragentic x402, PayanAgent, and direct Base USDC. These operator-provided additions would reduce buyer friction further:

- Optional Solana USDC payout address.
- Stripe/Gumroad/Polar account or payment link if recurring card billing is desired.
- Support email with external receiving enabled.
