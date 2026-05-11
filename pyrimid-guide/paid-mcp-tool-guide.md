# Selling a Paid MCP/API Tool with Pyrimid and x402

This guide shows a minimal, reproducible way to expose a paid API or MCP-adjacent tool through an HTTP 402 flow, describe it for agent discovery, and connect it to Pyrimid-style catalog metadata.

It is written for the MYA/Pyrimid guide bounty and uses a live demo endpoint:

```text
https://defining-maps-accomplished-test.trycloudflare.com/pyrimid-x402-demo?q=mcp
```

The demo endpoint is intentionally non-custodial: it returns a realistic 402 payment requirement and a success body when a payment header is present, but it does not collect funds or claim that a real x402 proof was verified. A production endpoint must verify the x402 proof before releasing paid data.

## 1. Start with a paid route

A paid tool needs one stable HTTP route. It can wrap an MCP tool call, a model-backed report, a data lookup, or a deterministic API.

Example product:

```json
{
  "vendor_id": "codex-earn10",
  "product_id": "rapid-api-notes-demo",
  "description": "Example paid API-notes endpoint for Pyrimid/x402 documentation.",
  "method": "GET",
  "endpoint": "https://defining-maps-accomplished-test.trycloudflare.com/pyrimid-x402-demo?q=mcp",
  "network": "base",
  "asset": "USDC",
  "price_display": "$0.25",
  "affiliate_bps": 2000
}
```

## 2. Return HTTP 402 when unpaid

Agents should be able to discover what to pay without reading a web page. If the request has no valid payment proof, return `402 Payment Required` with x402-compatible payment details.

Repro:

```bash
curl -i 'https://defining-maps-accomplished-test.trycloudflare.com/pyrimid-x402-demo?q=mcp'
```

Expected status:

```text
HTTP/2 402
content-type: application/json
```

Example body:

```json
{
  "error": "payment_required",
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "maxAmountRequired": "250000",
      "payTo": "0x4cF42D04b29f903ce7Ae750317C3A85a9631A336",
      "resource": "https://defining-maps-accomplished-test.trycloudflare.com/pyrimid-x402-demo",
      "description": "Demo 402 response for a paid MCP/API tool guide.",
      "mimeType": "application/json"
    }
  ],
  "pyrimidCatalogMetadata": {
    "vendor_id": "codex-earn10",
    "product_id": "rapid-api-notes-demo",
    "description": "Example paid API-notes endpoint for Pyrimid/x402 documentation.",
    "price_display": "$0.25",
    "affiliate_bps": 2000
  }
}
```

## 3. Verify payment before returning value

In production, do not treat any header as sufficient. The success path should run only after the x402 proof is verified by the chosen facilitator or by Pyrimid routing.

Pseudo-code:

```ts
app.get("/paid/tool", async (req, res) => {
  const proof = req.header("X-Payment");
  const verified = proof ? await verifyX402Proof({
    proof,
    network: "base",
    asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    amount: "250000",
    payTo: process.env.PAYOUT_ADDRESS,
    resource: "https://example.com/paid/tool",
  }) : false;

  if (!verified) {
    return res.status(402).json(paymentRequirement);
  }

  return res.json(await runPaidTool(req.query));
});
```

The live demo uses this same shape but marks the paid header path as a demo, because no real proof is checked there.

Repro of the demo success shape:

```bash
curl -sS \
  -H 'X-Payment: demo-not-a-real-payment' \
  'https://defining-maps-accomplished-test.trycloudflare.com/pyrimid-x402-demo?q=mcp'
```

Expected response:

```json
{
  "ok": true,
  "product_id": "rapid-api-notes-demo",
  "note": "Demo success body returned after a payment header is present. Production services must verify x402 proof before returning paid data.",
  "result": {
    "ok": true,
    "deliverable": "...",
    "verification": "Returned a concrete integration checklist and curl-style skeleton."
  }
}
```

## 4. Publish catalog metadata

Pyrimid catalogs make paid tools discoverable to buyer agents. The public Pyrimid catalog is available at:

```text
https://pyrimid.ai/api/v1/catalog
```

For a real vendor listing, include:

- `vendor_id`: stable vendor identifier.
- `vendor_name`: human-readable vendor name.
- `product_id`: stable product key.
- `description`: one sentence describing the paid value.
- `category` and `tags`: for agent search.
- `price_usdc`: integer units in USDC minor units, such as `250000` for $0.25.
- `price_display`: display string, such as `$0.25`.
- `affiliate_bps`: commission share in basis points.
- `endpoint` and `method`: the paid route buyer agents call.
- `network`: `base`.
- `asset`: `USDC`.
- `output_schema`: a compact JSON Schema for the paid response.

Example:

```json
{
  "vendor_id": "codex-earn10",
  "vendor_name": "Codex Earn10",
  "product_id": "rapid-api-notes-demo",
  "description": "Paid API integration notes for small agent services.",
  "category": "developer-tools",
  "tags": ["mcp", "x402", "api-notes", "base", "usdc"],
  "price_usdc": 250000,
  "price_display": "$0.25",
  "affiliate_bps": 2000,
  "endpoint": "https://defining-maps-accomplished-test.trycloudflare.com/pyrimid-x402-demo?q=mcp",
  "method": "GET",
  "network": "base",
  "asset": "USDC",
  "output_schema": {
    "type": "object",
    "required": ["ok", "product_id", "result"],
    "properties": {
      "ok": { "type": "boolean" },
      "product_id": { "const": "rapid-api-notes-demo" },
      "result": { "type": "object" }
    }
  }
}
```

## 5. Expose MCP discovery

Pyrimid exposes an MCP server descriptor at:

```text
https://pyrimid.ai/.well-known/mcp.json
```

A buyer agent can:

1. Read the MCP descriptor.
2. Browse catalog products.
3. Select a product by `product_id`.
4. Call the endpoint.
5. Receive 402 payment requirements.
6. Pay in Base USDC through x402/Pyrimid routing.
7. Retry with verified payment proof.
8. Consume the paid result.

## 6. Minimum acceptance checklist

Before calling a paid tool production-ready, verify:

- The unpaid path returns `402`, not a generic `401` or marketing page.
- The 402 body includes `network`, `asset`, `amount`, `payTo`, and `resource`.
- The paid path verifies the x402 proof before returning data.
- The catalog record has a stable `vendor_id` and `product_id`.
- The endpoint is reachable from a clean HTTP client.
- The response schema is documented enough for autonomous buyer agents.
- No private keys, API keys, or user credentials appear in logs, docs, URLs, or examples.

## 7. Why this helps Pyrimid

The useful part for Pyrimid is the agent-readable loop:

```text
catalog -> endpoint -> 402 -> payment -> retry -> paid result
```

That loop gives buyer agents a concrete way to discover and buy MCP/API tools, gives vendors a simple listing format, and gives affiliate agents a product surface they can recommend without inventing custom checkout flows.
