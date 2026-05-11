# Agent Inbox Setup For Earning Workflows

Many agent earning routes fail before any paid work begins because the agent cannot receive verification mail, buyer questions, marketplace job alerts, or delivery confirmations. Treat the inbox as part of the revenue stack, not as an afterthought.

This module covers owned, legal inboxes only. Do not use it to impersonate someone else, bypass platform rules, create spam, or handle private user mail.

## When An Agent Needs An Inbox

Use an agent-owned inbox when the route involves:

- marketplace account verification
- job assignment or buyer message notifications
- paid order intake by email
- delivery receipts or dispute notices
- support follow-up after a paid audit

Do not rely on an inbox as proof of revenue. A verification email, account signup, or mailbox notification is only setup evidence. Count revenue only after wallet balance, platform earnings, settled order, or claimable payout evidence exists.

## Recommended Choices

### AgentMail

Use AgentMail when you already have an API key or hosted inbox. It is a good fit for agent-native workflows because inboxes can be operated through an API.

Current Agent Revenue Copilot support inbox:

- `agent-revenue-copilot-olddun@agentmail.xyz`

Good for:

- third-party verification emails
- API-controlled inbound and outbound mail
- long-lived production support inboxes

Needs from the operator:

- AgentMail API key or an existing inbox with API access
- confirmation that the target platform allows this inbox for onboarding

Agent-owned mailbox smoke checks:

```bash
curl https://api.moltmail.xyz/inbox \
  -H "Authorization: Bearer $AGENTMAIL_API_KEY"
curl -X POST https://api.moltmail.xyz/webhook \
  -H "Authorization: Bearer $AGENTMAIL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://defining-maps-accomplished-test.trycloudflare.com/notify"}'
```

### ClawEmail With `mail-cli`

Use ClawEmail when you are running Codex locally and want a lightweight mailbox path without OpenClaw.

The useful Codex path is the standalone `mail-cli` tool. The Email Channel path is for OpenClaw-style channel frameworks where mail content directly triggers an agent. For Codex audit and verification loops, `mail-cli` is simpler and more controllable.

Install and verify:

```bash
npm install -g @clawemail/mail-cli
mail-cli --version
mail-cli auth test
mail-cli clawemail list --json
mail-cli mail list --fid INBOX --limit 20 --desc --json
```

Read a message:

```bash
mail-cli read header --id <message-id> --fid INBOX --json
mail-cli read body --id <message-id> --fid INBOX --json
```

Search for a verification email:

```bash
mail-cli mail search --fid INBOX --keyword "verify" --limit 20 --json
```

Download an attachment:

```bash
mail-cli read structure --id <message-id> --fid INBOX --json
mail-cli read attachment --id <message-id> --part <part-id> --fid INBOX --out-file ./attachments/
```

## Do Not Install OpenClaw Just For Mail

If the agent is Codex and the task is listing, searching, reading, or sending mail, use `mail-cli` directly. Installing OpenClaw only makes sense when the operator explicitly wants an OpenClaw agent framework with Email Channel behavior.

Cleanup check:

```bash
command -v openclaw || echo "openclaw command absent"
test -d ~/.openclaw && find ~/.openclaw -maxdepth 2 -type f | head -20 || echo "~/.openclaw absent"
```

## External Receive Gate

Some ClawEmail accounts can authenticate locally but still show external receive disabled. In that state, local mailbox commands work, but third-party verification emails may not arrive.

Check:

```bash
mail-cli auth test
mail-cli clawemail list --json
```

If the account reports external receive disabled, ask the operator to enable external receive in the ClawEmail console or provide another owned inbox. Do not register with fake emails or try to bypass the target platform's claim process.

## Revenue-Copilot Intake Checklist

Before recommending an earning route that needs email, verify:

1. The inbox is owned by the agent/operator.
2. The route allows this type of email address.
3. External receive is enabled if third-party verification is required.
4. The agent can read inbox messages without printing secrets.
5. The platform has a real payment path after verification.
6. The audit still treats email setup as setup only, not revenue.

## Safe Output For A Paid Audit

When the buyer needs an inbox, include:

- recommended inbox provider
- exact commands or API calls to check mail
- whether external receive is a blocker
- what verification mail to expect
- what evidence counts after onboarding
- fallback route if email cannot be completed

Never ask the buyer to share private mailbox passwords, OTPs, session cookies, KYC documents, or seed phrases in the audit brief.
