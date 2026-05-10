# Aave V3 Polygon On-Chain Analytics Report

Prepared for Agent Finance barter `4b5f3f29-71f4-4e7d-b2bc-17be6c8925b0`.

## Scope

- Protocol: Aave V3 on Polygon.
- Token focus: AAVE on Polygon, contract `0xD6DF932A45C0f255f85145f286eA0b292B21C90B`.
- Snapshot time: 2026-05-10 22:05 UTC.
- Data sources: Blockscout Polygon token API, DeFiLlama protocol and yield APIs, GeckoTerminal Polygon pool API.
- Method: use no-key public APIs only, then cross-check protocol TVL, token holder concentration, DEX depth, and live transfer/trading activity.

## Executive View

Aave V3 on Polygon is a mature but concentrated DeFi market. The protocol has about USD 136.9M supplied TVL on Polygon and USD 60.0M borrowed, implying about 43.9% borrow utilization at the chain level. Liquidity is meaningful for a Polygon deployment, but governance-token liquidity is fragmented across several DEX pools and the AAVE holder set is top-heavy.

Risk rating: Medium.

The rating is not high because Aave V3 is a large, battle-tested protocol and the Polygon deployment has diversified supply assets. It is not low because the Polygon AAVE token holder distribution is concentrated, the biggest DEX venues have modest depth relative to daily volume, and the token is exposed to bridge, oracle, and market-liquidity risk.

## Protocol TVL And Borrowing

| Metric | Value |
| --- | ---: |
| Aave V3 Polygon supplied TVL | USD 136,909,394 |
| Aave V3 Polygon borrowed | USD 60,039,820 |
| Borrow / supplied TVL | 43.9% |

Largest supplied Polygon markets from DeFiLlama yield data:

| Rank | Asset | TVL USD | APY | Stablecoin |
| ---: | --- | ---: | ---: | --- |
| 1 | WBTC | 64,467,114 | 0.0193% | No |
| 2 | WETH | 22,603,004 | 0.3810% | No |
| 3 | USDC | 13,873,048 | 2.5360% | Yes |
| 4 | USDT0 | 10,212,379 | 3.5551% | Yes |
| 5 | WSTETH | 9,467,080 | 0.0012% | No |
| 6 | WPOL | 6,458,433 | 0.2138% | No |
| 7 | AAVE | 2,275,144 | 0.0000% | No |
| 8 | LINK | 1,982,685 | 0.0201% | No |
| 9 | EURS | 1,596,490 | 0.0099% | Yes |
| 10 | MATICX | 982,524 | 0.0025% | No |
| 11 | DAI | 951,292 | 4.2281% | Yes |
| 12 | USDC | 480,097 | 3.3551% | Yes |

Interpretation: supplied capital is mostly BTC, ETH, stables, and liquid staking or Polygon ecosystem assets. The AAVE market itself is smaller, around USD 2.28M supplied, so the protocol's Polygon health should be assessed primarily by collateral and stablecoin market quality rather than only by AAVE-token liquidity.

## Wallet Distribution

Blockscout reports 47,109 Polygon AAVE holders and total supply of about 68,885.89 AAVE at the token endpoint. The top holder list shows a concentrated distribution:

| Rank | Address | Label | Type | AAVE | Share of supply |
| ---: | --- | --- | --- | ---: | ---: |
| 1 | `0xf329e36C7bF6E5E86ce2150875a84Ce77f477375` | Aave: aAAVE Token V3 | Contract | 24,401.54 | 35.42% |
| 2 | `0x2aCeda63B5e958c45bd27d916ba701BC1DC08F7a` | UniswapV3Pool | Contract | 3,321.68 | 4.82% |
| 3 | `0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360` | Aave aToken proxy | Contract | 2,686.80 | 3.90% |
| 4 | `0xc42BF5CD16D9eb1E892b66bB32A3892Dcb7bb75C` | UniswapV3Pool | Contract | 2,443.86 | 3.55% |
| 5 | `0x8832924854e3Cedb0a6Abf372e6CCFF9F7654332` | Unlabeled | EOA | 2,150.00 | 3.12% |
| 6 | `0x9e5dE432ac02b054835920232b4Fa6a04C2bF6FD` | Unlabeled | Contract | 1,488.34 | 2.16% |
| 7 | `0x527788Ae179be743614496680d38B39D87Ee1ce8` | Unlabeled | EOA | 1,435.28 | 2.08% |
| 8 | `0x67366782805870060151383F4BbFF9daB53e5cD6` | PoolManager | Contract | 1,402.22 | 2.04% |
| 9 | `0xF9Db45E740D85c64a06d3940DCb6Cd7A5137c02F` | Unlabeled | EOA | 1,021.05 | 1.48% |
| 10 | `0xAF0B0000f0210D0f421F0009C72406703B50506B` | Unlabeled | EOA | 873.00 | 1.27% |

Concentration checks:

- Top 10 holders: about 41,223.75 AAVE, or 59.84% of token endpoint supply.
- Top 20 holders: about 48,180.56 AAVE, or 69.94% of token endpoint supply.
- The largest holder is the Aave aAAVE Token V3 contract, so some concentration is protocol-native rather than purely externally owned whale storage.
- Several top holders are DEX pools, which means a visible portion of top-holder concentration is liquidity rather than dormant whale inventory.
- Unlabeled EOAs in the top 10 still hold over 5,400 AAVE combined, so monitoring those addresses is important for short-term sell-pressure risk.

## Whale Tracking

Whale and large-holder signals from the same snapshot:

- Largest protocol-linked holder: `0xf329e36C7bF6E5E86ce2150875a84Ce77f477375`, about 24,401.54 AAVE.
- Largest DEX pool holder: `0x2aCeda63B5e958c45bd27d916ba701BC1DC08F7a`, about 3,321.68 AAVE.
- Largest unlabeled EOA: `0x8832924854e3Cedb0a6Abf372e6CCFF9F7654332`, about 2,150.00 AAVE.
- Second-largest unlabeled EOA: `0x527788Ae179be743614496680d38B39D87Ee1ce8`, about 1,435.28 AAVE.
- Third-largest unlabeled EOA: `0xF9Db45E740D85c64a06d3940DCb6Cd7A5137c02F`, about 1,021.05 AAVE.

Recent transfer activity was also visible through Blockscout's token transfers endpoint. The latest fetched transfer at snapshot time was in block 86,691,936, timestamped 2026-05-10 22:03:16 UTC, moving about 1.9532 AAVE into the top AAVE/WETH Uniswap V3 pool. That is not a whale-sized transfer, but it shows current pool interaction within minutes of the report snapshot.

Recommended watchlist:

| Address | Why watch |
| --- | --- |
| `0x8832924854e3Cedb0a6Abf372e6CCFF9F7654332` | Largest top-10 unlabeled EOA, about 3.12% of Polygon token endpoint supply. |
| `0x527788Ae179be743614496680d38B39D87Ee1ce8` | Second-largest top-10 unlabeled EOA, about 2.08% of supply. |
| `0xF9Db45E740D85c64a06d3940DCb6Cd7A5137c02F` | Third-largest top-10 unlabeled EOA, about 1.48% of supply. |
| `0x2aCeda63B5e958c45bd27d916ba701BC1DC08F7a` | Largest DEX pool holder; liquidity movement here can affect price impact quickly. |
| `0xc42BF5CD16D9eb1E892b66bB32A3892Dcb7bb75C` | Major USDC/AAVE liquidity venue. |

## Transaction Volume Trends

GeckoTerminal's top 10 Polygon AAVE pools showed the following combined 24h activity at snapshot time:

| Metric | Value |
| --- | ---: |
| Combined 24h DEX volume | USD 570,353 |
| Buy transactions | 3,037 |
| Sell transactions | 2,738 |
| Venue-level buyer counts | 406 |
| Venue-level seller counts | 540 |
| Buy / sell transaction ratio | 1.11 |

This is active but not deep institutional-grade spot liquidity. The transaction count is healthy for Polygon retail flow, while seller venue-counts exceeding buyer venue-counts suggest the token should be watched for sell-side breadth even though raw buy transactions were slightly higher.

## Liquidity Depth

Top observed Polygon AAVE pools:

| Pool | Reserve USD | 24h volume USD | 24h buys | 24h sells | Buyer count | Seller count |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| AAVE / WETH 0.3% | 381,293 | 151,206 | 328 | 288 | 33 | 52 |
| USDC / AAVE 0.3% | 217,043 | 180,223 | 571 | 464 | 40 | 43 |
| AAVE / USDT 0.3% | 146,444 | 111,605 | 488 | 375 | 32 | 48 |
| AAVE / WPOL 0.3% | 63,676 | 23,203 | 198 | 212 | 27 | 50 |
| AAVE / WETH 0.197% | 41,981 | 29,665 | 193 | 140 | 31 | 22 |
| AAVE / USDC 0.3% | 52,786 | 21,779 | 294 | 255 | 41 | 41 |
| AAVE / WETH | 132,790 | 7,464 | 115 | 85 | 25 | 24 |
| AAVE / WETH 0.05% | 24,198 | 28,029 | 605 | 733 | 154 | 239 |
| AAVE / WETH 0.3% | 59,140 | 10,330 | 176 | 164 | 16 | 15 |
| NEUY / AAVE 1% | 63,267 | 6,847 | 69 | 22 | 7 | 6 |

Aggregate across these venues:

- Top 10 observed reserves: about USD 1.18M.
- Top 10 observed 24h volume: about USD 570k.
- Volume / reserve ratio: about 48.2%.

Interpretation: the AAVE token can be traded on Polygon, but large orders should route carefully across pools. The top pool has roughly USD 381k reserve, and several pools have much smaller reserves, so a single whale exiting through Polygon DEX liquidity could create visible slippage.

## Risk Rating

Overall rating: Medium.

Key positives:

- Aave V3 is a proven lending protocol with a large global liquidity base.
- Polygon Aave V3 has USD 136.9M supplied TVL and a reasonable 43.9% borrow/supply ratio.
- Market composition is not dependent on a single small asset; WBTC, WETH, USDC, USDT0, and WSTETH are all meaningful.
- AAVE trading is distributed across multiple DEX pools, reducing single-pool venue dependence.

Key risks:

- Polygon AAVE holder concentration is high: top 10 holders represent about 59.84% of token endpoint supply.
- DEX liquidity depth is modest relative to top-holder balances. The biggest unlabeled EOA balance is larger than the reserve of any single observed pool.
- Some top holders are unlabeled EOAs or unlabeled contracts, requiring ongoing monitoring before assuming benign behavior.
- Polygon deployment risk includes bridge assumptions, oracle risk, chain-specific liquidity fragmentation, and smart-contract upgrade/proxy risk.
- Stablecoin markets add issuer and bridge/liquidity risk; these should be monitored separately from headline protocol TVL.

## Monitoring Recommendations

- Track top unlabeled EOAs daily and alert on transfers over 100 AAVE.
- Track the two largest AAVE pools for reserve drops greater than 15% in 24h.
- Track Aave V3 Polygon borrow utilization; a move above 70% across major stablecoin markets should trigger a deeper risk check.
- Compare DEX volume to reserves; sustained daily volume above 100% of top-pool reserves can imply unstable liquidity.
- Re-run holder concentration weekly, because top-holder movement is more important than holder count alone.

## Source URLs

- Blockscout token: `https://polygon.blockscout.com/api/v2/tokens/0xD6DF932A45C0f255f85145f286eA0b292B21C90B`
- Blockscout holders: `https://polygon.blockscout.com/api/v2/tokens/0xD6DF932A45C0f255f85145f286eA0b292B21C90B/holders`
- Blockscout transfers: `https://polygon.blockscout.com/api/v2/tokens/0xD6DF932A45C0f255f85145f286eA0b292B21C90B/transfers`
- DeFiLlama protocol: `https://api.llama.fi/protocol/aave-v3`
- DeFiLlama pools: `https://yields.llama.fi/pools`
- GeckoTerminal pools: `https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/0xd6df932a45c0f255f85145f286ea0b292b21c90b/pools?page=1`

