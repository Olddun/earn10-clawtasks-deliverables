# NEAR Cross-Contract Calls: Promises, Callbacks, Gas, And Tests

Assignment: `71a906e6-f6cc-4676-9a0c-c6b64ab7a45a`

Job: `6c510800-84f4-41a0-b94c-455de548f06f`

Sources used:

- NEAR Docs, Cross-Contract Calls: https://docs.near.org/smart-contracts/anatomy/crosscontract
- NEAR Docs, Transfers and Actions: https://docs.near.org/smart-contracts/anatomy/actions
- NEAR SDK Rust docs: https://docs.rs/near-sdk/latest/near_sdk/
- NEAR SDK `ext_contract`: https://docs.rs/near-sdk/latest/near_sdk/attr.ext_contract.html

## Overview

Cross-contract calls are how one NEAR smart contract asks another contract to do work. The important difference from many synchronous smart-contract environments is that NEAR does not immediately jump into the other contract and come back with a value in the same execution frame. A cross-contract call creates a promise. The network executes that promise later, usually after the current function finishes. If the original contract needs to react to the result, it schedules a callback promise.

That model gives NEAR contracts a clean asynchronous workflow:

1. The caller validates local input and state.
2. The caller creates a promise to an external contract.
3. The caller optionally chains a callback with `.then(...)`.
4. The external contract runs in a later receipt.
5. The callback runs with access to the promise result.
6. The callback commits final local state, refunds, retries, or records failure.

The mental model is less "call a function and get a return value" and more "submit work to the runtime and handle the result in a later receipt."

## Promise Basics

A NEAR promise contains the contract account to call, the method name, serialized arguments, attached deposit, and gas. In Rust with `near-sdk`, high-level cross-contract calls are usually written with `#[ext_contract]`, while lower-level code can create `Promise` values directly.

Minimal low-level shape:

```rust
use near_sdk::{env, near, AccountId, Gas, NearToken, Promise};

const NO_DEPOSIT: NearToken = NearToken::from_yoctonear(0);
const CALL_GAS: Gas = Gas::from_tgas(20);

#[near(contract_state)]
pub struct Router {}

#[near]
impl Router {
    pub fn ping_external(&self, external: AccountId) -> Promise {
        Promise::new(external).function_call(
            "ping".to_string(),
            b"{}".to_vec(),
            NO_DEPOSIT,
            CALL_GAS,
        )
    }
}
```

This does not execute `ping` during the current function. It creates a receipt that the runtime executes after the current receipt succeeds.

## Callbacks

Use a callback when your contract must make a decision based on the external call result. A common pattern is:

- Store pending local intent before the external call.
- Call the external contract.
- Chain a callback to the current contract.
- In the callback, inspect the promise result.
- Finalize, compensate, or mark failed.

High-level Rust shape:

```rust
use near_sdk::{env, ext_contract, near, AccountId, Gas, NearToken, Promise, PromiseError};

const CALL_GAS: Gas = Gas::from_tgas(25);
const CALLBACK_GAS: Gas = Gas::from_tgas(10);
const NO_DEPOSIT: NearToken = NearToken::from_yoctonear(0);

#[ext_contract(ext_registry)]
trait Registry {
    fn set_label(&mut self, account_id: AccountId, label: String) -> bool;
}

#[near(contract_state)]
pub struct ProfileRouter {
    registry: AccountId,
}

#[near]
impl ProfileRouter {
    pub fn update_label(&mut self, account_id: AccountId, label: String) -> Promise {
        assert_eq!(env::predecessor_account_id(), account_id, "only owner can update label");

        ext_registry::ext(self.registry.clone())
            .with_static_gas(CALL_GAS)
            .with_attached_deposit(NO_DEPOSIT)
            .set_label(account_id.clone(), label.clone())
            .then(
                Self::ext(env::current_account_id())
                    .with_static_gas(CALLBACK_GAS)
                    .on_label_updated(account_id, label),
            )
    }

    #[private]
    pub fn on_label_updated(
        &mut self,
        account_id: AccountId,
        label: String,
        #[callback_result] result: Result<bool, PromiseError>,
    ) -> bool {
        match result {
            Ok(true) => {
                env::log_str(&format!("label updated for {account_id}: {label}"));
                true
            }
            Ok(false) => {
                env::log_str("registry returned false");
                false
            }
            Err(_) => {
                env::log_str("registry call failed");
                false
            }
        }
    }
}
```

The `#[private]` annotation is important: callbacks should usually be callable only by the contract itself. Otherwise, a user could call your callback directly and fake the finalization path.

## Error Handling Pattern

Do not assume that an external call succeeded. The callee can panic, run out of gas, reject input, or change its API. Treat callbacks as a small state machine:

```text
received request
  -> local validation passed
  -> external promise scheduled
  -> callback success: finalize
  -> callback failure: revert local pending state or record failed request
```

For financial flows, do not mark an order as paid before the callback confirms the external transfer or mint. For registry flows, do not expose new state until the callback succeeds. For idempotent operations, include a request id so duplicate callbacks or retries do not corrupt state.

Example request-id pattern:

```rust
#[derive(Clone)]
pub struct PendingRequest {
    owner_id: AccountId,
    label: String,
}

// Pseudocode storage:
// pending_by_id: LookupMap<u64, PendingRequest>

pub fn start(&mut self, request_id: u64, owner_id: AccountId, label: String) -> Promise {
    assert!(self.pending_by_id.insert(request_id, PendingRequest {
        owner_id: owner_id.clone(),
        label: label.clone(),
    }).is_none(), "duplicate request");

    ext_registry::ext(self.registry.clone())
        .with_static_gas(CALL_GAS)
        .set_label(owner_id, label)
        .then(Self::ext(env::current_account_id()).with_static_gas(CALLBACK_GAS).finish(request_id))
}

#[private]
pub fn finish(&mut self, request_id: u64, #[callback_result] result: Result<bool, PromiseError>) {
    let pending = self.pending_by_id.remove(request_id).expect("missing request");
    if matches!(result, Ok(true)) {
        self.labels.insert(pending.owner_id, pending.label);
    } else {
        env::log_str("external call failed; pending request removed");
    }
}
```

## Gas Attachment

Gas is budgeted across the promise chain. The first contract call receives gas for the external method. The callback receives separate gas. If either leg has too little gas, that leg can fail even when the logic is otherwise correct.

Practical rules:

- Reserve gas for the callback. Do not spend the entire prepaid gas on the external call.
- Keep callbacks small. They should inspect the result and update local state, not run a large computation.
- Use named constants such as `CALL_GAS` and `CALLBACK_GAS`.
- Add logs on both success and failure paths.
- Test insufficient-gas behavior, especially when changing callback logic.

Example:

```rust
const CALL_GAS: Gas = Gas::from_tgas(30);
const CALLBACK_GAS: Gas = Gas::from_tgas(15);
```

The right numbers depend on the callee method and callback complexity. Start with conservative values in tests, then measure and tighten.

## Attached Deposit

Attached deposit is transferred from the caller contract account to the external call. It is separate from gas. Use it only when the callee requires storage staking, minting, transfer, or another payable operation.

Rules:

- For pure metadata or registry updates, attach zero deposit unless the callee requires storage.
- For token transfers or storage deposits, validate the amount before creating the promise.
- In callbacks, handle the case where a deposit-taking call failed.
- Do not assume failed external calls automatically restore your own local state; your callback must keep your local state coherent.

## Promise Composition

NEAR supports chaining and joining promise workflows. Common shapes:

```text
P1.then(P2)
```

Run `P1`, then run `P2` as a callback.

```text
P1.then(P2).then(P3)
```

Run a sequence.

```text
P1.and(P2).then(P3)
```

Run two external calls in parallel, then aggregate in one callback.

Use joins carefully. Aggregation callbacks must inspect each promise result and decide what partial failure means.

## Testing Cross-Contract Calls

Good cross-contract tests should cover both the happy path and callback failure. A useful test plan:

1. Deploy the caller contract and a mock callee.
2. Call the caller method that schedules the external call.
3. Verify the callee was called with the expected arguments.
4. Verify the callback finalizes local state on success.
5. Change the mock callee to panic or return false.
6. Verify the callback clears pending state and does not mark success.
7. Test a duplicate request id.
8. Test insufficient attached deposit if the callee needs one.

Example with a mock callee design:

```rust
#[near(contract_state)]
pub struct MockRegistry {
    should_fail: bool,
}

#[near]
impl MockRegistry {
    pub fn set_should_fail(&mut self, value: bool) {
        self.should_fail = value;
    }

    pub fn set_label(&mut self, _account_id: AccountId, _label: String) -> bool {
        if self.should_fail {
            env::panic_str("forced failure");
        }
        true
    }
}
```

In integration tests, use the sandbox or workspaces-style setup that deploys both contracts, triggers the promise, waits for receipts, and checks final state. Do not stop after asserting the first transaction succeeded; the important behavior happens in later receipts.

## Common Pitfalls

- Treating cross-contract calls as synchronous returns.
- Forgetting a callback and then having no way to know whether the external call succeeded.
- Making callbacks public.
- Updating final state before the external call has succeeded.
- Not reserving enough gas for the callback.
- Attaching deposit to methods that do not need it.
- Ignoring partial failures in joined promises.
- Reusing request ids without idempotency checks.
- Testing only the initial transaction and not the callback result.

## Recommended Implementation Checklist

- Define an external interface with `#[ext_contract]`.
- Validate caller, arguments, and deposit before creating the promise.
- Store a pending request if local state depends on the external result.
- Use `.then(...)` to attach a private callback.
- Pass only the minimal callback context needed.
- In the callback, inspect `#[callback_result]`.
- Finalize only on success.
- Clear or mark pending state on failure.
- Use explicit gas constants.
- Cover success, failure, duplicate, and gas-sensitive paths in tests.

This pattern keeps NEAR cross-contract code understandable: schedule external work, reserve callback gas, and make the callback the only place that finalizes result-dependent state.
