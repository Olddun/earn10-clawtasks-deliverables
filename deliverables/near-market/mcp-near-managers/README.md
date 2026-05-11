# NEAR MCP Managers

Assignments:

- Approval Manager: `3644a2f4-59fc-417c-bdce-b0a48c6f37a9`
- Position Manager: `a9d7c8e8-6176-412d-a9f8-53be86936a97`

This package provides two stdio MCP servers:

- `near-approval-manager-mcp`
- `near-position-manager-mcp`

The servers implement CRUD and query capabilities over local JSON stores. They are designed as a safe operator layer for tracking NEAR approvals and positions before connecting to production signing flows. They do not require private keys and do not move funds.

## Install From GitHub

```bash
npx --yes github:Olddun/earn10-clawtasks-deliverables deliverables/near-market/mcp-near-managers/bin/near-approval-manager-mcp.mjs
npx --yes github:Olddun/earn10-clawtasks-deliverables deliverables/near-market/mcp-near-managers/bin/near-position-manager-mcp.mjs
```

For local use:

```bash
cd deliverables/near-market/mcp-near-managers
npm install
npm run check
npm run smoke
```

## npm Publication Status

The package is npm-publish-ready as `@olddun/near-mcp-managers`, but this environment is not logged into npm (`npm whoami` returns `ENEEDAUTH`). I therefore did not claim a registry publication that I could not actually perform. A maintainer with npm credentials can publish with:

```bash
cd deliverables/near-market/mcp-near-managers
npm publish --access public
```

## Approval Manager Tools

- `approval_create`
- `approval_get`
- `approval_update`
- `approval_delete`
- `approval_list`
- `approval_query`

Approval records include:

- `approval_id`
- `owner_account_id`
- `approved_account_id`
- `contract_id`
- `token_id`
- `allowance`
- `expires_at`
- `status`
- `metadata`

Example JSON-RPC:

```json
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"approval_create","arguments":{"owner_account_id":"alice.near","approved_account_id":"market.near","contract_id":"token.near","token_id":"wrap.near","allowance":"1.0","status":"active"}}}
```

## Position Manager Tools

- `position_create`
- `position_get`
- `position_update`
- `position_delete`
- `position_list`
- `position_query`

Position records include:

- `position_id`
- `owner_account_id`
- `protocol`
- `asset`
- `amount`
- `entry_price`
- `current_price`
- `status`
- `opened_at`
- `closed_at`
- `metadata`

Example JSON-RPC:

```json
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"position_create","arguments":{"owner_account_id":"alice.near","protocol":"ref-finance","asset":"NEAR","amount":"10","entry_price":"3.20","status":"open"}}}
```

## Storage

By default the servers write local JSON state to:

- approvals: `${TMPDIR}/near-approval-manager.json`
- positions: `${TMPDIR}/near-position-manager.json`

Override with:

```bash
NEAR_APPROVAL_STORE=/path/to/approvals.json near-approval-manager-mcp
NEAR_POSITION_STORE=/path/to/positions.json near-position-manager-mcp
```

## Verification

Verified locally:

- `node --check bin/near-approval-manager-mcp.mjs`
- `node --check bin/near-position-manager-mcp.mjs`
- `npm run smoke`
- JSON-RPC `tools/list`
- JSON-RPC create/list/query calls for each server

## Safety

These servers intentionally do not accept private keys, seed phrases, API keys, or custody credentials. They manage approval and position records only. Production signing should be handled by a wallet, a scoped function-call key, or a separate audited signing service.
