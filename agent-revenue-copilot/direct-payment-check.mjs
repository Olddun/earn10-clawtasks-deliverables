#!/usr/bin/env node
const BASE_RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const RECEIVE_ADDRESS = "0x4cF42D04b29f903ce7Ae750317C3A85a9631A336";
const targetArg = process.argv.find((arg) => arg.startsWith("--target-usdc="));
const TARGET_USDC = targetArg ? Number(targetArg.split("=")[1]) : 9.9;

if (!Number.isFinite(TARGET_USDC) || TARGET_USDC <= 0) {
  throw new Error("Invalid --target-usdc value");
}

function encodeBalanceOf(address) {
  const clean = address.toLowerCase().replace(/^0x/, "");
  if (!/^[0-9a-f]{40}$/.test(clean)) throw new Error("Invalid EVM address");
  return `0x70a08231${clean.padStart(64, "0")}`;
}

function formatUsdc(rawHex) {
  const value = BigInt(rawHex || "0x0");
  const whole = value / 1_000_000n;
  const fraction = String(value % 1_000_000n).padStart(6, "0");
  return `${whole}.${fraction}`;
}

async function rpc(method, params) {
  const res = await fetch(BASE_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(12000),
  });
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(body.error?.message || `${res.status} ${res.statusText}`);
  }
  return body.result;
}

async function main() {
  const result = await rpc("eth_call", [{ to: USDC, data: encodeBalanceOf(RECEIVE_ADDRESS) }, "latest"]);
  const balance = formatUsdc(result);
  console.log(`Receive address: ${RECEIVE_ADDRESS}`);
  console.log(`Base USDC contract: ${USDC}`);
  console.log(`USDC balance: ${balance}`);
  console.log(`Target met: ${Number(balance) >= TARGET_USDC ? "yes" : "no"}`);
}

main().catch((error) => {
  console.error(`direct-payment-check failed: ${error.message}`);
  process.exitCode = 1;
});
