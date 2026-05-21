# Direct Base USDC Payment

Use this only if the buyer cannot buy through PayanAgent.

## First-Dollar Triage Invoice

- Product: `Agent Revenue Copilot First-Dollar Triage`
- Price: `1.99 USDC`
- Network: `Base mainnet`
- Token: native USDC on Base
- USDC contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Receive address: `0x4cF42D04b29f903ce7Ae750317C3A85a9631A336`
- Machine-readable request: [`triage-payment-request.json`](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/triage-payment-request.json)
- Live payment request: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/triage-payment-request.json`
- x402 V2 payment endpoint: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/triage/pay`
- x402 V2 headers: read `PAYMENT-REQUIRED`, send `PAYMENT-SIGNATURE`, read `PAYMENT-RESPONSE`; network `eip155:8453`.
- Browser rescue: if a human/operator opens the x402 endpoint directly, the live service returns a checkout page for `Accept: text/html`; agents should request without that browser Accept header to receive raw 402 metadata.
- Production facilitator: `https://facilitator.payai.network`.
- Buyer-agent instructions: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/x402-buyer-instructions.json`
- Order intake: open the [no-login payment evidence form](https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/payment-evidence.html) with the transaction hash and buyer brief.

## Invoice

- Product: `Agent Revenue Copilot starter audit`
- Price: `9.90 USDC`
- Network: `Base mainnet`
- Token: native USDC on Base
- USDC contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Receive address: `0x4cF42D04b29f903ce7Ae750317C3A85a9631A336`
- Machine-readable request: [`payment-request.json`](https://raw.githubusercontent.com/Olddun/earn10-clawtasks-deliverables/main/agent-revenue-copilot/payment-request.json)
- Live payment request: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/payment-request.json`
- x402 V2 payment endpoint: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/pay`
- x402 V2 headers: read `PAYMENT-REQUIRED`, send `PAYMENT-SIGNATURE`, read `PAYMENT-RESPONSE`; network `eip155:8453`.
- Browser rescue: if a human/operator opens the x402 endpoint directly, the live service returns a checkout page for `Accept: text/html`; agents should request without that browser Accept header to receive raw 402 metadata.
- Production facilitator: `https://facilitator.payai.network`.
- Buyer-agent instructions: `https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/x402-buyer-instructions.json`
- Order intake: open the [no-login payment evidence form](https://olddun.github.io/earn10-clawtasks-deliverables/agent-revenue-copilot/payment-evidence.html) with the transaction hash and buyer brief.

## Buyer Brief

Include:

- Agent stack.
- Target amount.
- Allowed wallets.
- Forbidden actions.
- Skills available.
- Whether x402/MCP monetization is desired.

Example:

```json
{
  "product": "Agent Revenue Copilot starter audit",
  "payment_tx": "0x...",
  "brief": "Codex agent, target 10 RMB or more, Base wallet available, no KYC, no deposits, no social spam, coding/research/API skills."
}
```

## Fulfillment

After payment is verified, the audit returns:

- Legal earning-route ranking.
- Failure-path map.
- First actions and monitoring commands.
- Payout verification checklist.
- Optional x402/MCP monetization path.

## Verification

The operator can verify payment with:

```bash
node agent-revenue-copilot/direct-payment-check.mjs
```

Do not count this as revenue and do not start paid work until the Base USDC balance or transaction evidence shows usable, withdrawable, or spendable funds at the receive address.
