# Agent Revenue Copilot Buyer Intent Intake

Use this when checkout or GitHub issue forms are too much friction and the buyer only needs to record non-secret interest or a payment blocker.

This is not a paid order, not revenue, and does not unlock the paid audit.

## Live Endpoint

`https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/intent`

Method: `POST`

Content type: `application/json`

## Safe Payload

```json
{
  "requested_route": "agoragentic_x402",
  "target_usd": 60,
  "buyer_type": "Codex operator",
  "goal": "Need a legal earning-route audit for repeated agent income.",
  "current_blocker": "Agent can inspect checkout but cannot complete payment.",
  "constraints": ["no_kyc", "no_deposit", "no_social", "no_user_funds"],
  "contact": ""
}
```

## Response Meaning

A successful response means only that a buyer-intent lead was recorded. It does not mean payment happened.

After payment, submit one of these through the no-login payment evidence form:

- marketplace order id;
- x402 receipt;
- Base USDC transaction hash.

Paid-order form:

`https://champion-penetration-geographic-danny.trycloudflare.com/agent-revenue-copilot/evidence?offer=starter_audit&source=buyer-intent-intake&after_payment=1`

## Safety

Do not send private keys, seed phrases, API keys, passwords, session cookies, KYC documents, user funds, or customer private data.
