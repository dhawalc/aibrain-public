---
title: "Charm and Vanna Flows: Second-Order Greeks and Intraday SPX Dynamics"
description: "Charm measures the rate of change of an option’s delta with respect to the passage of time. Formally:"
date: "2026-01-24"
category: "SPX Trading Analytics"
author: "QorSync AI Research Team"
readTime: "14 min read"
published: true
---

# Charm and Vanna Flows: Second-Order Greeks and Intraday SPX Dynamics

## Comprehensive Research Report

* * *

## 1\. DEFINITIONS AND QUANTITATIVE FRAMEWORK

### 1.1 Charm (Delta Decay / DdeltaDtime)

Charm measures the rate of change of an option’s delta with respect to the passage of time. Formally:

`Charm = -∂Δ/∂t = -∂²V/∂S∂t`

Where V is option price, S is the underlying price, and t is time. For a Black-Scholes European call:

`Charm_call = -q * e^(-qT) * N'(d1) * [2(r-q)T - d2*σ√T] / [2T*σ√T]`

Key properties:  
\- **Sign convention**: For OTM puts (the bulk of SPX open interest), charm is typically **negative** — meaning their delta becomes *less negative* (moves toward zero) as time passes. This is critical for understanding dealer hedging flows.  
\- **Magnitude**: Charm is largest for near-the-money options approaching expiration and accelerates as expiration nears — particularly in the final 0-7 DTE window.  
\- **Units**: Expressed as delta change per day (e.g., -0.02 means delta decreases by 0.02 per day).

### 1.2 Vanna (DdeltaDvol)

Vanna measures the sensitivity of an option’s delta to changes in implied volatility:

`Vanna = ∂Δ/∂σ = ∂²V/∂S∂σ = (ν/S) * [1 - d1/(σ√T)]`

Where ν (vega) is the option’s sensitivity to volatility. Equivalently, vanna is the sensitivity of vega to changes in the underlying price.

Key properties:  
\- **For OTM puts**: Vanna is **negative**. When IV falls, the delta of OTM puts moves toward zero (becomes less negative), requiring dealers to *sell* their hedges (sell short futures/stock), which is actually buying pressure relief — but the standard framing is that dealers must *buy back* their short delta hedges.  
\- **For OTM calls**: Vanna is **positive**. When IV falls, call deltas increase, requiring dealers who are short calls to sell more of the underlying.  
\- **The asymmetry matters**: In SPX, put open interest vastly exceeds call open interest (the “skew”), so the put-side vanna effect dominates, creating net **buying pressure** when IV declines and net **selling pressure** when IV rises.

* * *

## 2\. THE DEALER HEDGING MECHANISM: HOW FLOWS ARE CREATED

### 2.1 Market Structure Foundation

The SPX options market is dominated by institutional hedging. The typical positioning is:

-   **Buy-side (asset managers, pension funds, tail-risk funds)**: Net long puts (portfolio hedges), net short calls (overwriting).
-   **Sell-side (market makers/dealers)**: Net **short** puts and net **long** calls — the mirror image. Dealers are thus **short gamma, short vanna, and short charm** on the put side.

Because dealers must remain delta-neutral, any change in the aggregate delta of their book — whether from price movement (gamma), time passage (charm), or volatility change (vanna) — forces them to trade the underlying (SPX futures, SPY, or S&P E-minis) to re-hedge.

### 2.2 Charm Flow Mechanics

**The daily cycle:**

1.  Each day, OTM put options lose a small amount of time value. Their deltas decay toward zero (for OTM) or toward -1 (for deep ITM).
2.  For the dominant OTM put open interest: delta moves from, say, -0.25 toward -0.23 over one day.
3.  Dealers who are short these puts had hedged by being short delta (short futures). As the puts’ delta shrinks, dealers are now *over-hedged* — they are shorter than they need to be.
4.  To rebalance, dealers must **buy futures/stock** to reduce their short delta hedge.
5.  This creates systematic **upward pressure** on SPX throughout the trading day.

**Quantitative estimate of daily charm flow (2024-2025 research consensus):**  
\- With approximately $5-8 trillion in SPX/SPY notional put open interest, aggregate charm can produce an estimated **$2-5 billion in daily delta to buy** under normal conditions.  
\- This flow is not evenly distributed — it concentrates around market open (when overnight theta is priced in) and into the close (when dealers reconcile end-of-day marks).  
\- Charm flows are **largest on Fridays** (weekend theta decay gets priced in) and ahead of long weekends/holidays.  
\- The 0DTE explosion (2023-2025) has amplified intraday charm effects because options expiring the same day experience maximal theta and charm acceleration in the final hours.

### 2.3 Vanna Flow Mechanics

**The volatility-price feedback loop:**

1.  SPX rallies → implied volatility typically falls (the leverage effect / volatility-spot correlation, approximately -0.70 to -0.85).
2.  As IV falls, OTM put deltas shrink (vanna effect) → dealers must buy back short hedges → **more buying pressure** → SPX rallies further → IV falls further.
3.  This creates a **positive feedback loop** (reflexive rally) that can persist as long as volatility is compressing.

The reverse is equally powerful:  
1\. SPX sells off → IV rises.  
2\. Rising IV increases OTM put deltas → dealers must sell more to hedge → **more selling pressure** → SPX falls further → IV rises further.  
3\. This is the **vanna-driven selloff cascade**, which explains why equity declines are often faster and more violent than rallies.

**Quantitative estimate of vanna flow:**  
\- A 1-point decline in VIX with typical 2024-2025 SPX put open interest has been estimated to generate approximately **$3-8 billion in buying flow** (sources: SpotGamma, SqueezeMetrics, Nomura cross-asset research).  
\- Vanna is most powerful in the **15-45 DTE range**, where options have substantial vega and meaningful delta sensitivity to vol changes. 0DTE options have minimal vanna because their vega is near zero.

### 2.4 Combined Charm + Vanna: The “Gravitational Pull”

The combined effect creates what practitioners call the **“dealer gravity”** or **“vol-selling vortex”**:

-   In a low-vol, rising market: Charm and vanna both push **upward**. Delta decays on puts (charm) and falling IV reduces put deltas (vanna), both requiring dealer buying. This explains the characteristic “grinding melt-up” pattern seen in SPX during low-VIX regimes (e.g., Q4 2024, Q1 2025).
    
-   In a high-vol, falling market: Both effects reverse. Charm on ITM puts now pushes delta toward -1 (requiring dealer selling), and rising IV expands put deltas (vanna), also requiring selling. This creates the “crash cascade” dynamic.
    
-   **The vol regime is the switch**: When VIX is below ~18-20, charm and vanna are broadly supportive. When VIX is above ~25-30, they become destabilizing.
    

* * *

## 3\. TOOLS AND DATA SOURCES FOR REAL-TIME QUANTIFICATION

### 3.1 Commercial Platforms (Primary Sources, 2024-2026)

| Platform | Key Metrics | Update Frequency | Cost (approx.) |
| --- | --- | --- | --- |
| **SpotGamma** (spotgamma.com) | HIRO (Hedging Impact Real-time Oscillator), GEX, Vanna/Charm exposure by strike, Absolute Gamma, “Volatility Trigger” level | Real-time intraday | $500-2000/mo |
| **SqueezeMetrics** (squeezemetrics.com) | DIX (Dark Index), GEX (Gamma Exposure), put/call gamma-weighted OI | Daily (GEX), intraday (DIX) | Free (GEX chart), $100+/mo (full) |
| **Orats** (orats.com) | Greeks surfaces, charm/vanna by strike and expiry, skew analytics | Real-time | $100-300/mo |
| **Unusual Whales** (unusualwhales.com) | Net GEX, dealer positioning estimates, flow analytics | Real-time | $50-200/mo |
| **Volland/VolSignals** (volsignals.com) | Dealer gamma/vanna/charm positioning commentary, trade ideas | Daily/weekly analysis | $200-500/mo |
| **GammaLab** (gammalab.app) | Open-source-adjacent gamma, vanna, charm calculations | Real-time | Free tier available |

### 3.2 Institutional/Sell-Side Research

-   **Nomura (Charlie McElligott)**: Widely regarded as the pioneer of framing dealer gamma/vanna/charm flows for institutional clients. His daily “Cross-Asset Macro” notes (2018-present) popularized the “vol-trigger” and “charm/vanna” narrative. Available to Nomura institutional clients.
-   **JP Morgan (Peng Cheng, Bram Kaplan)**: Publish regular gamma exposure estimates and “Heisenberg” vol-positioning analytics. Their JHEQX hedged equity index implicitly reflects charm dynamics.
-   **Goldman Sachs (Rocky Fishman, John Marshall)**: Derivatives research team publishes SPX gamma/vanna exposure estimates.
-   **Cboe (LiveVol Pro)**: Provides raw options data (OI, volume, Greeks) that can be used to build custom charm/vanna models. Cboe also publishes the “GEX” index concept.

### 3.3 Data Sources for DIY Calculation

To compute charm and vanna flows independently, you need:

1.  **Options Open Interest and Volume Data**: Cboe DataShop (official), OPRA feed via broker APIs (IBKR, TDAmeritrade/Schwab), or delayed data from Yahoo Finance / Polygon.io.
2.  **Implied Volatility Surface**: Compute from options prices using Black-Scholes or a stochastic vol model. Sources: Cboe LiveVol, IVolatility.com, IBKR’s API.
3.  **Dealer Positioning Estimate**: The hardest part. Requires assumptions about who is long/short at each strike. Common heuristic: assume the “customer” side of trades is net long puts and short calls (from CFTC COT data or exchange volume breakdowns showing buy-to-open vs. sell-to-open where available).

**Calculation workflow:**

`For each strike K, expiry T:   1. Retrieve OI(K,T) and estimate dealer_sign(K,T) ∈ {+1, -1}   2. Compute Δ(K,T), Charm(K,T), Vanna(K,T) using BSM or vol surface   3. Aggregate:      Total_Charm_Flow = Σ dealer_sign(K,T) * OI(K,T) * Charm(K,T) * multiplier * S      Total_Vanna_Flow = Σ dealer_sign(K,T) * OI(K,T) * Vanna(K,T) * multiplier * S * Δσ`

Where multiplier = 100 for standard SPX options and Δσ is the expected daily IV change.

### 3.4 Open-Source / Python Tools

-   **`py_vollib`**: Black-Scholes Greeks including second-order Greeks.
-   **`QuantLib` (Python bindings)**: Full derivatives pricing with higher-order Greeks.
-   **`openbb`** (OpenBB Terminal): Options chain data and basic Greeks visualization.
-   **Custom GitHub repos**: Several open-source implementations of GEX/vanna/charm calculations exist (search: “gamma exposure python SPX”).

* * *

## 4\. TRADING STRATEGIES BASED ON CHARM AND VANNA FLOWS

### 4.1 Strategy 1: The “Charm Drift” — Buying the Intraday Grind

**Thesis**: In low-vol environments (VIX < 18), charm-driven dealer buying creates a systematic upward drift, especially in the afternoon session.

**Implementation**:  
\- Buy SPX/ES futures (or SPY calls) at 11:00-12:00 ET, when morning noise fades and charm flow begins to dominate.  
\- Hold into the close (3:45-4:00 ET) when charm flow peaks as dealers finalize hedges.  
\- Size based on estimated charm flow magnitude (larger when 0DTE OI is elevated and VIX is below the vol trigger).  
\- **Stop**: Exit if VIX spikes above the SpotGamma “Volatility Trigger” level during the day, which flips the charm/vanna regime.

**Historical edge (2024-2025 backtests cited in practitioner research)**:  
\- The SPX intraday pattern shows a statistically significant afternoon rally tendency on days when aggregate charm is positive and VIX < 20.  
\- Win rate of approximately 55-60% with favorable risk/reward due to the asymmetric nature of low-vol grinding days.

### 4.2 Strategy 2: The “Vanna Crush” — Trading the Vol Compression Rally

**Thesis**: After a volatility spike (VIX > 25) begins to mean-revert, the vanna unwind creates a powerful mechanical bid.

**Implementation**:  
\- Monitor VIX term structure. When VIX moves from backwardation to contango (front month VIX falls below second month), this signals the vanna-unwind buying is beginning.  
\- Enter long SPX/ES positions or sell put spreads.  
\- The strongest signal is when VIX has spiked > 30 and begins a sustained decline through the 25 → 20 zone — this is where vanna flow is most powerful.  
\- Target: Ride the vanna flow until VIX reaches approximately 15-16 (where vanna flow diminishes as OTM put deltas are already very small).

**Historical examples**:  
\- August 2024 (Japan carry trade unwind): VIX spiked to ~65 intraday, then collapsed. The subsequent vanna unwind drove SPX to new highs within 3 weeks.  
\- March 2025 tariff shock: VIX spike followed by compression generated a multi-day vanna-driven rally.

### 4.3 Strategy 3: The “Vanna Doom Loop” Short — Selling into Vol Expansion

**Thesis**: When VIX is rising through 25-30+, vanna creates a self-reinforcing selling cascade. Position short or buy puts to ride the feedback loop.

**Implementation**:  
\- When SPX breaks below a major gamma level (identifiable via SpotGamma or GEX data) and VIX crosses above 22-25, enter short SPX or buy put spreads.  
\- The key indicator is **negative gamma territory** (dealers are short gamma below the “gamma flip” level) combined with rising IV.  
\- In this regime, every tick lower forces more dealer selling (gamma) AND more vanna-driven selling (rising IV expands put deltas).  
\- Cover shorts when VIX shows signs of peaking (VIX futures curve inverts deeply, put volume exhaustion, or VIX > 35-40 which historically tends to mark short-term bottoms).

### 4.4 Strategy 4: 0DTE Charm Scalping

**Thesis**: On 0DTE expiration days (now daily for SPX), the terminal charm of expiring options creates predictable delta flows in the final 2-3 hours.

**Implementation**:  
\- Identify the strike with maximum 0DTE open interest. As expiration approaches, options near this strike experience extreme charm (delta rapidly converges to 0 or 1).  
\- If SPX is near a large put OI strike, charm pushes dealers to buy (put delta decaying toward zero). Go long ES near this strike with a tight stop.  
\- If SPX is near a large call OI strike, charm on expiring calls forces selling as delta approaches 1. This can create resistance.  
\- The “pinning” effect near max-OI strikes is a direct result of charm + gamma dynamics in the final hours.

**Risk**: 0DTE strategies carry significant gamma risk. A sudden move can overwhelm the charm signal.

### 4.5 Strategy 5: Regime-Based Allocation Using Vanna/Charm Indicators

**Thesis**: Use aggregate vanna and charm positioning as a regime filter for broader portfolio allocation.

**Implementation**:  
\- Compute or subscribe to daily aggregate vanna and charm exposure.  
\- **Positive charm + Positive vanna (low vol, supportive flows)**: Overweight equities, sell vol (short strangles, iron condors).  
\- **Negative charm + Negative vanna (high vol, destabilizing flows)**: Underweight equities, buy tail hedges, raise cash.  
\- **Mixed signals**: Reduce position sizes, widen stops.

* * *

## 5\. KEY FINDINGS FROM 2024-2026 RESEARCH

### 5.1 The 0DTE Revolution and Charm Amplification

The explosive growth of 0DTE SPX options (reaching 45-55% of total SPX volume by 2024-2025) has fundamentally altered intraday dynamics:

-   **Intraday charm cycles have intensified**: Because 0DTE options experience their entire lifetime of charm in a single session, the aggregate charm flow is now heavily front-loaded to the trading day rather than spread over weeks.
-   **The 3:00-4:00 PM ET window** has become the peak charm flow period, as 0DTE options approach terminal settlement. Research by Cboe and academic papers (Brogaard et al., 2024) document increased intraday volatility in this window.
-   **“Gamma Wars”**: The interaction between 0DTE charm/gamma and longer-dated vanna creates what some practitioners call “gamma wars” — competing flows that can produce choppy, range-bound price action when they roughly offset.

### 5.2 The “Volatility Trigger” / “Gamma Flip” Concept

SpotGamma and others have popularized the concept of a **critical price level** where dealer gamma exposure flips from positive to negative:

-   **Above the trigger**: Dealers are long gamma → their hedging activity dampens volatility (they buy dips, sell rips). Charm and vanna flows are supportive.
-   **Below the trigger**: Dealers are short gamma → their hedging amplifies volatility (they must sell into drops, buy into rallies). Charm and vanna flows can become destabilizing.
-   This level typically sits near the largest put OI concentration, often 50-150 points below the current SPX level in calm markets.

### 5.3 Academic Research (2024-2025)

Several recent academic papers have formalized the charm/vanna framework:

-   **Hedging Pressure and Market Microstructure**: Studies confirm that market-maker hedging flows are a statistically significant driver of intraday SPX returns, particularly in the last hour of trading.
-   **The Vol-of-Vol Feedback**: Research shows that the vanna effect creates a feedback between realized and implied volatility — when IV falls, mechanical buying reduces realized vol, which in turn justifies lower IV, creating a self-fulfilling low-vol regime.
-   **0DTE Gamma and Intraday Patterns**: Cboe-sponsored research documents that 0DTE options have shifted intraday volatility patterns, with higher volatility near the open and close (when gamma/charm effects are strongest).

### 5.4 Limitations and Risks

-   **Dealer positioning is estimated, not observed**: No public data source reveals exact dealer positions. All charm/vanna flow estimates rely on assumptions about who is on which side of each trade. The standard heuristic (customers are net long puts) is broadly correct but can break down in specific regimes.
-   **Model dependency**: Charm and vanna calculations assume Black-Scholes or similar models. In practice, the vol surface is dynamic, and stochastic vol effects can alter the magnitude and even sign of these Greeks.
-   **Crowding risk**: As charm/vanna trading strategies have become more popular (2023-2025), the edge may be partially arbitraged away. More traders positioning for “charm drift” may front-run the flow, shifting its timing.
-   **Tail events overwhelm flows**: In genuine market dislocations (pandemic, systemic crises), the mechanical flows from charm/vanna are overwhelmed by fundamental selling. These strategies are regime-dependent and perform poorly in crash scenarios.

* * *

## 6\. SUMMARY

Charm and vanna are second-order Greeks that translate into real, quantifiable directional pressure on SPX through the dealer hedging channel. In low-volatility regimes, they create a persistent upward bias (the “gravitational pull” or “melt-up”) as time decay and vol compression both force dealers to buy the underlying. In high-volatility regimes, the same mechanics reverse and amplify selloffs. The growth of 0DTE options has intensified intraday charm dynamics, particularly in the final hours of trading.

The primary tools for monitoring these flows in real-time are SpotGamma (HIRO, vanna/charm heatmaps), SqueezeMetrics (GEX), and institutional sell-side research (Nomura, JPM). For DIY analysis, Cboe options data combined with Python libraries (QuantLib, py\_vollib) enables custom charm/vanna flow calculation, though dealer positioning must be estimated heuristically.

Trading strategies range from intraday charm-drift scalping to multi-day vanna-compression trades, all gated by the current volatility regime (above or below the “gamma flip” level). The key insight is that **volatility itself is the regime switch**: below approximately VIX 18-20, charm and vanna are your tailwind; above VIX 25-30, they become a headwind that can cascade.
