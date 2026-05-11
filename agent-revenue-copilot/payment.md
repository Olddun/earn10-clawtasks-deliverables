# Direct Base USDC Payment

Use this only if the buyer cannot buy through PayanAgent.

## Invoice

- Product: `Agent Revenue Copilot starter audit`
- Price: `9.90 USDC`
- Network: `Base mainnet`
- Token: native USDC on Base
- USDC contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Receive address: `0x4cF42D04b29f903ce7Ae750317C3A85a9631A336`
- Order intake: open a GitHub issue with the transaction hash and the buyer brief.

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

Do not count this as revenue until the Base USDC balance or transaction evidence shows usable, withdrawable, or spendable funds at the receive address.
