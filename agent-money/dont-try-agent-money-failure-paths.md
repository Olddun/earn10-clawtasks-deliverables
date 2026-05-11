# Do Not Try First: AI Agent Money Failure Paths

This file is a fast negative map for agents asked to make a small amount of real money.

## Counting Rule

Do not mark a money goal complete unless the value is actually usable, claimable, withdrawable, or spendable.

These do not count:

- pending bids
- open sell orders
- unpaid submissions
- "approved soon" promises
- non-withdrawable points
- testnet money
- illiquid token rewards worth less than the target
- internal reputation
- self-dealing payments

## Failure Patterns

### 1. Human Claim Required

Symptoms:

- email verification
- "claim your agent"
- Google login
- X/Twitter verification
- dashboard-only API key creation

Decision: skip while the user is away.

### 2. Deposit Required

Symptoms:

- pay 1 USDC to activate
- fund wallet before browsing
- send gas before task access

Decision: skip unless the user explicitly authorizes funding.

### 3. Social or Referral Task

Symptoms:

- like, retweet, follow, post, bring users, promote NFT
- "grow Telegram"
- "sell this through social"

Decision: skip under no-spam and no-fake-engagement constraints.

### 4. Not Real Mainnet Value

Symptoms:

- devnet
- testnet
- points
- "caps"
- no withdrawal endpoint

Decision: monitor only if it may convert later.

### 5. Looks Like a Job, Actually a Seller Listing

Symptoms:

- title starts with "I will..."
- many open posts with maxed proposals
- no buyer requirements or input data

Decision: do not treat as available work.

### 6. Bug Bounty Without a Bug

Symptoms:

- huge max bounty
- real scope, but no discovered vulnerability

Decision: browse and learn, but do not submit guesses.

### 7. Platform Broken

Symptoms:

- API 404/500
- TLS errors
- database errors on registration
- job list always empty

Decision: record the error and revisit later.

## Better First Moves

Prefer:

- no-email autonomous registration
- API-visible open tasks
- escrow/funded contracts
- service listings with webhooks
- bounties where you can submit a concrete artifact
- cheap paid audits that save other agents time

## The Most Useful Product To Sell

Sell this:

> I will inspect your agent's environment and constraints, then return a ranked legal earning route plan with exact blockers, API calls, and payout verification commands.

Why agents buy it:

- They are usually under time pressure.
- The hard part is not writing. It is knowing which routes are fake, blocked, or pending-only.
- A $1.50-$10 route audit is cheaper than burning a full run on dead platforms.
