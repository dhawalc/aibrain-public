---
title: "Gamma Exposure (GEX) Calculation: Comprehensive Technical Guide"
description: "Gamma Exposure (GEX) quantifies the aggregate gamma held by options market makers across all strikes and expirations for a given underlying. It estimates how much delta-hedging..."
date: "2026-01-27"
category: "SPX Trading Analytics"
author: "QorSync AI Research Team"
readTime: "14 min read"
published: true
---

# Gamma Exposure (GEX) Calculation: Comprehensive Technical Guide

## 1\. What GEX Is and Why It Matters

Gamma Exposure (GEX) quantifies the aggregate gamma held by options market makers across all strikes and expirations for a given underlying. It estimates how much delta-hedging activity dealers must perform as the underlying price moves, creating supply/demand pressure that can pin prices at high-GEX strikes or accelerate moves through low-GEX zones.

**Core formula per contract:**

`GEX_i = OI_i * Gamma_i * Contract_Multiplier * Spot_Price * (-1 if put)`

Where:  
\- `OI_i` = open interest at strike i  
\- `Gamma_i` = Black-Scholes gamma at strike i  
\- `Contract_Multiplier` = 100 (standard US equity options)  
\- The sign convention: calls contribute positive gamma to dealers (assuming dealers are short calls to retail), puts contribute negative gamma (dealers are long puts from retail). **This sign assumption is the single largest source of disagreement and error.**

**Aggregate GEX** = sum of GEX\_i across all strikes and expirations.

* * *

## 2\. Open-Source GitHub Repositories

### 2.1 Dedicated GEX Projects

| Repository | Stars (approx.) | Description |
| --- | --- | --- |
| **perfilev/gamma-exposure** | ~200 | Clean Python implementation, uses CBOE delayed data, well-documented formulas |
| **gurmehar-work/gamma-exposure-gex** | ~80 | Jupyter notebooks showing step-by-step GEX calculation with visualizations |
| **yashdani18/GEX\_SPX** | ~50 | SPX-focused, pulls CBOE data, includes charm/vanna extensions |
| **jshellen/options-gex** | ~40 | Lightweight script focused on SPX/SPY, good for learning |
| **spotgamma/gg-core** (if available) | N/A | SpotGamma has occasionally released partial open-source tooling; check their GitHub org |

### 2.2 Broader Options Analytics Libraries (with GEX support or easy extension)

| Library | Notes |
| --- | --- |
| **vollib / py\_vollib** | Vectorized Black-Scholes Greeks; fast gamma calculation; available on PyPI |
| **QuantLib (via QuantLib-Python / QuantLib-SWIG)** | Industrial-grade derivatives pricing; overkill for GEX alone but gold standard for accuracy |
| **mibian** | Simple BSM Greeks calculator; quick prototyping |
| **opstrat** | Options strategy visualization with Greeks |
| **wallstreet** | Fetches options data and computes Greeks; somewhat outdated |

* * *

## 3\. Python Libraries and Data Sources

### 3.1 Data Source Options

#### CBOE Delayed Data (Free, Most Common)

`import pandas as pd  # CBOE publishes delayed options chains as CSVs # SPX example: url = "https://www.cboe.com/delayed_quotes/spx/quote_table"  # More reliable: use the CBOE DataShop API or scrape delayed quote pages # The free delayed data has a 15-minute delay and is acceptable for EOD analysis`

**Limitations:** 15-min delay, rate-limited, no historical archive, format changes without notice.

#### TD Ameritrade / Charles Schwab API

`# schwab-py (successor to tda-api after the Schwab migration) # pip install schwab-py  from schwab import auth, client import json  # OAuth flow c = auth.easy_client(     api_key='YOUR_APP_KEY',     redirect_uri='https://localhost',     token_path='token.json' )  # Fetch options chain resp = c.get_option_chain(     symbol='SPX',     contract_type=client.Client.Options.ContractType.ALL,     strike_count=100,  # strikes above and below ATM     include_underlying_quote=True ) chain = resp.json()`

**Strengths:** Real-time quotes during market hours, comprehensive chain data including Greeks (though Schwab-computed Greeks may differ from your own BSM calc), free with a funded account.

**Limitations:** Rate limits (~120 requests/minute), the API underwent significant changes during the TDA-to-Schwab migration (2023-2025), Greeks provided may use proprietary vol surface.

#### Interactive Brokers (IBKR) via ib\_insync

`# pip install ib_insync  from ib_insync import * import pandas as pd  ib = IB() ib.connect('127.0.0.1', 7497, clientId=1)  # Define underlying spx = Index('SPX', 'CBOE') ib.qualifyContracts(spx)  # Fetch all option chains chains = ib.reqSecDefOptParams(spx.symbol, '', spx.secType, spx.conId)  # For each expiry and strike, request market data # This is the most granular but requires careful throttling chain = chains[0]  # pick an exchange strikes = chain.strikes expirations = chain.expirations  contracts = [] for exp in sorted(expirations)[:4]:  # nearest 4 expiries     for strike in strikes:         for right in ['C', 'P']:             contracts.append(                 Option('SPX', exp, strike, right, 'SMART')             )  ib.qualifyContracts(*contracts) tickers = ib.reqTickers(*contracts)`

**Strengths:** True real-time streaming, reliable OI and volume data, ability to get raw bid/ask for IV calculation.

**Limitations:** Requires TWS or IB Gateway running locally, pacing violations if you request too many contracts at once (50 simultaneous market data lines for standard accounts, 100 for higher tiers), OI updates only once daily (not intraday).

#### Polygon.io

`# pip install polygon-api-client  from polygon import RESTClient  client = RESTClient(api_key="YOUR_KEY")  # Fetch options chain snapshot contracts = client.list_snapshot_options_chain(     "SPX",     params={         "strike_price.gte": 4000,         "strike_price.lte": 5000,         "expiration_date.gte": "2026-03-19",         "expiration_date.lte": "2026-04-17",     } )  for contract in contracts:     print(contract.details.strike_price,           contract.open_interest,           contract.greeks.gamma if contract.greeks else None)`

**Strengths:** REST and WebSocket APIs, includes pre-calculated Greeks, historical options data available, good documentation.

**Limitations:** Options data requires paid plans (Starter tier or above at ~$29-$99/month), Greeks are Polygon-computed (verify methodology).

#### Tradier API

`import requests  headers = {     'Authorization': 'Bearer YOUR_TOKEN',     'Accept': 'application/json' }  # Get options chain resp = requests.get(     'https://api.tradier.com/v1/markets/options/chains',     params={'symbol': 'SPY', 'expiration': '2026-04-17', 'greeks': 'true'},     headers=headers )  chain = resp.json()['options']['option']`

**Strengths:** Clean API, includes Greeks, free tier available for delayed data.

#### CBOE DataShop (Paid, Historical)

For backtesting GEX historically, CBOE DataShop sells end-of-day options data with OI, volume, and settlement prices. This is the authoritative source for SPX/VIX options data.

* * *

### 3.2 Key Python Packages Summary

| Package | PyPI | Purpose |
| --- | --- | --- |
| `py_vollib` | Yes | Vectorized BSM Greeks (fastest pure Python) |
| `QuantLib-Python` | Yes (`QuantLib`) | Industrial Greeks + vol surface fitting |
| `scipy` | Yes | For custom BSM implementation (norm.cdf, optimization) |
| `mibian` | Yes | Quick BSM Greeks |
| `schwab-py` | Yes | Schwab/TDA API client |
| `ib_insync` | Yes | IBKR API client |
| `polygon-api-client` | Yes | Polygon data |
| `yfinance` | Yes | Free Yahoo options chains (unreliable OI, no Greeks) |
| `pandas` / `numpy` | Yes | Data manipulation |

* * *

## 4\. Calculation Methodology: Full Implementation

### 4.1 Step-by-Step Calculation

`import numpy as np from scipy.stats import norm import pandas as pd  # ─── Black-Scholes Gamma ───  def bs_gamma(S, K, T, r, sigma, q=0):     """     S: spot price     K: strike price     T: time to expiration in years     r: risk-free rate (annualized)     sigma: implied volatility (annualized)     q: dividend yield (annualized, continuous)      Returns gamma (same for calls and puts in BSM).     """     if T <= 0 or sigma <= 0:         return 0.0     d1 = (np.log(S / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))     gamma = np.exp(-q * T) * norm.pdf(d1) / (S * sigma * np.sqrt(T))     return gamma  # ─── GEX Calculation ───  def calculate_gex(options_df, spot_price, risk_free_rate=0.045):     """     options_df must have columns:         - strike: float         - expiration: datetime         - option_type: 'call' or 'put'         - open_interest: int         - implied_volatility: float (annualized, e.g. 0.20 for 20%)      spot_price: current underlying price     risk_free_rate: annualized (e.g., use 3-month T-bill yield)      Returns DataFrame with per-contract GEX and aggregate GEX.     """     now = pd.Timestamp.now()      df = options_df.copy()      # Time to expiration in years     df['T'] = (pd.to_datetime(df['expiration']) - now).dt.total_seconds() / (365.25 * 24 * 3600)     df = df[df['T'] > 0].copy()  # drop expired      # Calculate gamma for each row (vectorized via apply; for speed, use numpy broadcasting)     df['gamma'] = df.apply(         lambda row: bs_gamma(             S=spot_price,             K=row['strike'],             T=row['T'],             r=risk_free_rate,             sigma=row['implied_volatility']         ), axis=1     )      # GEX per contract     # Convention: dealers are NET SHORT calls (positive gamma)      #             and NET LONG puts (negative gamma)     # This is the "standard" SpotGamma-style assumption.     contract_multiplier = 100      df['gex'] = np.where(         df['option_type'] == 'call',         df['open_interest'] * df['gamma'] * contract_multiplier * spot_price,         -1 * df['open_interest'] * df['gamma'] * contract_multiplier * spot_price     )      return df  # ─── GEX Profile (per-strike aggregation) ───  def gex_profile(gex_df):     """Aggregate GEX by strike for visualization."""     profile = gex_df.groupby('strike')['gex'].sum().reset_index()     profile.columns = ['strike', 'total_gex']     return profile  # ─── Key Levels ───  def find_key_levels(profile_df, spot_price):     """Identify zero-gamma (flip) level and max-gamma strike."""     sorted_df = profile_df.sort_values('strike').reset_index(drop=True)      # Zero gamma (flip) level: where cumulative GEX crosses zero     sorted_df['cum_gex'] = sorted_df['total_gex'].cumsum()     sign_changes = sorted_df['cum_gex'].values[:-1] * sorted_df['cum_gex'].values[1:]     flip_indices = np.where(sign_changes < 0)[0]      flip_levels = []     for idx in flip_indices:         # Linear interpolation         x0, x1 = sorted_df['strike'].iloc[idx], sorted_df['strike'].iloc[idx + 1]         y0, y1 = sorted_df['cum_gex'].iloc[idx], sorted_df['cum_gex'].iloc[idx + 1]         flip = x0 - y0 * (x1 - x0) / (y1 - y0)         flip_levels.append(flip)      # Max gamma strike     max_gex_strike = sorted_df.loc[sorted_df['total_gex'].abs().idxmax(), 'strike']      # Total (net) GEX     net_gex = sorted_df['total_gex'].sum()      return {         'flip_levels': flip_levels,         'max_gex_strike': max_gex_strike,         'net_gex': net_gex,         'regime': 'positive_gamma' if net_gex > 0 else 'negative_gamma'     }`

### 4.2 Vectorized (Fast) NumPy Implementation

The `apply`\-based approach above is slow for large chains (SPX has 10,000+ contracts). Here is a vectorized version:

`def bs_gamma_vectorized(S, K, T, r, sigma, q=0):     """Fully vectorized gamma calculation using numpy arrays."""     mask = (T > 0) & (sigma > 0)     gamma = np.zeros_like(K, dtype=float)      d1 = (np.log(S / K[mask]) + (r - q + 0.5 * sigma[mask]**2) * T[mask]) / (sigma[mask] * np.sqrt(T[mask]))     gamma[mask] = np.exp(-q * T[mask]) * norm.pdf(d1) / (S * sigma[mask] * np.sqrt(T[mask]))      return gamma  def calculate_gex_fast(strikes, expirations_years, option_types, open_interests, ivs, spot, r=0.045):     """     All inputs are numpy arrays of the same length.     option_types: boolean array, True = call, False = put.     Returns array of per-contract GEX values.     """     gamma = bs_gamma_vectorized(spot, strikes, expirations_years, r, ivs)     sign = np.where(option_types, 1.0, -1.0)     gex = sign * open_interests * gamma * 100 * spot     return gex`

### 4.3 Dollar-Gamma vs Shares-to-Hedge

Two common output formats:

-   **Dollar GEX** (shown above): measures the notional delta-hedging flow in dollar terms per 1% move.
-   **Shares GEX**: `GEX_shares = OI * Gamma * 100`. This tells you how many shares dealers must buy/sell per $1 move in the underlying.

SpotGamma primarily reports dollar-denominated GEX normalized per 1-point move.

* * *

## 5\. Real-Time Update Approaches

### 5.1 Architecture Overview

`Data Source (Schwab/IBKR/Polygon WebSocket)     │     ▼ [Ingestion Layer] ── normalize quotes, filter bad ticks     │     ▼ [IV Calculation] ── recalculate IV from bid/ask mid (or use source IV)     │     ▼ [GEX Engine] ── vectorized recalculation of all strikes     │     ▼ [Output] ── GEX profile, key levels, regime     │     ▼ [Visualization] ── matplotlib/plotly/dash, or push to frontend`

### 5.2 Intraday Considerations

**Open Interest does NOT update intraday.** OI is calculated by the OCC overnight and published before market open. During the trading day, you can approximate live OI as:

`Estimated_OI(t) = OI_start_of_day + Net_Volume(t)`

But you do not know the buy/sell ratio, so this is inherently imprecise. Most serious GEX tools use **start-of-day OI** and recalculate only the Greeks as spot moves and IV surfaces shift.

**IV Surface updates** are what drive intraday GEX changes (beyond spot moving). As spot moves, the moneyness of each strike changes, altering gamma. If you also update IVs from live quotes, you capture vol surface dynamics.

### 5.3 Streaming with IBKR

`from ib_insync import *  ib = IB() ib.connect('127.0.0.1', 7497, clientId=1)  # Subscribe to underlying spx = Index('SPX', 'CBOE') ib.qualifyContracts(spx) ib.reqMktData(spx)  # Subscribe to options (subset near ATM for speed) options = [Option('SPX', '20260417', strike, right, 'SMART')            for strike in range(4800, 5200, 25)            for right in ['C', 'P']] ib.qualifyContracts(*options)  for opt in options:     ib.reqMktData(opt, genericTickList='106')  # 106 = implied volatility  def on_pending_tickers(tickers):     # Recalculate GEX whenever quotes update     # Throttle to every N seconds to avoid CPU overload     pass  ib.pendingTickersEvent += on_pending_tickers ib.run()`

### 5.4 Polling with Schwab

`import time from schwab import auth, client  c = auth.easy_client(...)  while market_is_open():     chain = c.get_option_chain('SPX', ...).json()     gex = recalculate_gex(chain)     update_display(gex)     time.sleep(60)  # respect rate limits; 1-min granularity is typical`

* * *

## 6\. Accuracy Comparison vs. SpotGamma and Other Paid Services

### 6.1 Sources of Discrepancy

| Factor | Open-Source Typical Approach | SpotGamma / Paid Services | Impact |
| --- | --- | --- | --- |
| **Dealer positioning assumption** | Assume dealers short all calls, long all puts | Proprietary model using volume analysis, customer vs. firm OI splits (from CBOE data), historical positioning inference | **HIGH** – this is the dominant source of error |
| **OI source** | CBOE delayed or broker-reported | Direct CBOE feeds, potentially intraday estimates from proprietary models | Medium |
| **IV calculation** | Use broker-provided IV or single-strike BSM inversion | Fitted vol surface (SVI, SABR, or proprietary), smooth interpolation | Medium |
| **Dividend handling** | Often ignored or flat continuous yield | Discrete dividend modeling, especially for SPX near ex-dates | Low-Medium |
| **Interest rate** | Single constant rate | Term-structure matched to each expiration | Low |
| **Contract filtering** | All strikes | May filter illiquid far-OTM strikes, weeklys vs. monthlys weighting | Low-Medium |
| **Index vs. ETF** | Often mix SPX and SPY | Separate calculations, proper handling of AM vs PM settlement | Medium |

### 6.2 The Dealer Positioning Problem

This is the elephant in the room. The standard assumption – “dealers are short calls and long puts” – is a simplification. In reality:

-   Institutional hedgers sell puts to dealers (dealers are long puts from institutions). This part is usually correct.
-   Retail and funds buy calls from dealers (dealers are short calls). This is often correct for speculative flow.
-   But covered call selling by institutions means dealers are **long** those calls. Single-stock GEX is especially affected.
-   SPX/SPY GEX is more reliable because the flow is dominated by institutional hedging (put selling) and speculative call buying, making the standard assumption closer to reality.

SpotGamma and similar services attempt to decompose flow into customer vs. market-maker using CBOE’s volume data that distinguishes customer, firm, and market-maker volume. This data is available (at a cost) from CBOE and provides a significant accuracy edge.

### 6.3 Realistic Accuracy Expectations

-   **SPX/SPY GEX profiles** from open-source methods will match paid services within ~10-20% on aggregate levels, and key level identification (max gamma strike, flip level) will typically agree within 10-25 points on SPX.
-   **Single-stock GEX** is significantly less reliable with the standard assumption, sometimes directionally wrong.
-   **Regime identification** (positive vs. negative gamma) from open-source methods agrees with SpotGamma roughly 85-90% of the time for SPX.

* * *

## 7\. Known Limitations and Pitfalls

1.  **OI staleness**: OI is published once daily. Any intraday GEX is based on stale OI. Large intraday flow can make morning OI misleading by afternoon.
    
2.  **0DTE options**: Same-day expiry options have exploded in volume since CBOE introduced daily SPX expirations. Their gamma is extremely high but their OI may be small (since they are opened and closed same-day). Their contribution to GEX is debated – some practitioners exclude them, others include them. SpotGamma includes them with caveats.
    
3.  **Pin risk near expiration**: Gamma goes to infinity for ATM options as T approaches 0. Numerical instability requires clamping or filtering contracts with T < some threshold (e.g., < 1 hour).
    
4.  **AM-settled vs PM-settled**: SPX options are AM-settled (standard monthly) or PM-settled (weeklys/dailys). Mixing them up causes T calculation errors.
    
5.  **Yahoo Finance OI**: Often delayed or incorrect. Not recommended for serious GEX work.
    
6.  **European vs American exercise**: SPX is European-style. SPY is American-style. BSM gamma is the same for both in theory, but early exercise optionality affects real-world dealer hedging for American options. The impact on GEX is typically small.
    
7.  **Vol surface vs flat IV**: Using a single IV per strike (as reported by brokers) vs fitting a smooth vol surface changes gamma estimates. The effect is most pronounced for deep OTM options.
    

* * *

## 8\. Recommended Starter Stack

For someone building a GEX tool from scratch:

| Component | Recommendation |
| --- | --- |
| **Data source** | Schwab API (free, real-time) or Polygon (paid, cleaner) |
| **Greeks engine** | `py_vollib` for speed, or custom numpy BSM (full control) |
| **OI data** | CBOE start-of-day (scrape or DataShop) |
| **Visualization** | `plotly` for interactive, `matplotlib` for static |
| **Framework** | `pandas` + `numpy` for batch; `Dash` or `Streamlit` for dashboard |
| **Scheduling** | `APScheduler` or simple loop with sleep for periodic recalculation |

**Example minimal pipeline:**

`# pip install schwab-py py_vollib pandas plotly  # 1. Fetch chain from Schwab # 2. Extract: strike, expiration, type, OI, IV # 3. Calculate gamma via py_vollib or custom BSM # 4. Apply GEX formula with sign convention # 5. Aggregate by strike # 6. Plot with plotly # 7. Identify key levels (max gamma, flip)`

* * *

## 9\. Summary of Key Tradeoffs

| Approach | Cost | Accuracy | Real-time | Effort |
| --- | --- | --- | --- | --- |
| CBOE delayed + custom BSM | Free | ~80% vs paid | No (15-min delay) | Medium |
| Schwab API + py\_vollib | Free | ~85% vs paid | Yes (polling) | Medium |
| IBKR + streaming + QuantLib | ~$10/mo (data) | ~85-90% vs paid | Yes (streaming) | High |
| Polygon + custom engine | $29-99/mo | ~85% vs paid | Yes (WebSocket) | Medium |
| SpotGamma / Orats | $50-500/mo | Reference | Yes | None (turnkey) |

The gap between open-source and paid is primarily the **dealer positioning model**, not the Greeks calculation. If you accept the standard sign convention and focus on SPX/SPY, open-source GEX is a practical and valuable tool. For single stocks or precision regime calls, paid services have a meaningful edge.
