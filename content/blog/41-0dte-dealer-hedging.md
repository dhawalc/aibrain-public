---
title: "Market Makers, 0DTE SPX Options, and Intraday Hedging Dynamics"
description: "Market makers (dealers) in SPX options are fundamentally in the business of providing liquidity, not taking directional bets. When a dealer sells an option to a customer, they..."
date: "2026-01-23"
category: "SPX Trading Analytics"
author: "QorSync AI Research Team"
readTime: "14 min read"
published: true
---

# Market Makers, 0DTE SPX Options, and Intraday Hedging Dynamics

## Comprehensive Research Report

* * *

## 1\. Foundations: How Market Makers Hedge SPX Options

### Basic Delta-Hedging Mechanics

Market makers (dealers) in SPX options are fundamentally in the business of providing liquidity, not taking directional bets. When a dealer sells an option to a customer, they inherit a directional exposure (delta) that they must neutralize. The standard approach is **continuous delta-hedging**:

-   **Sell a call to a customer** –> Dealer is short delta –> Dealer buys SPX futures/shares to hedge
-   **Sell a put to a customer** –> Dealer is long delta –> Dealer sells SPX futures/shares to hedge

As the underlying price moves, delta changes (because of gamma), forcing the dealer to **re-hedge dynamically**. This re-hedging is where the market microstructure effects originate.

### The Critical Variable: Gamma Sign

**Gamma** is the rate of change of delta with respect to the underlying price. The sign of a dealer’s aggregate gamma position determines whether their hedging activity **dampens** or **amplifies** price moves:

#### Positive Gamma (Long Gamma) – Mean-Reversion Regime

When dealers are **net long gamma** (typically when they have bought options or own inventory of options from net customer selling):

-   As SPX rises, dealer delta increases (becomes more long) –> dealers **sell** futures to re-hedge
-   As SPX falls, dealer delta decreases (becomes less long / more short) –> dealers **buy** futures to re-hedge
-   **Net effect**: Dealers trade **against** the direction of price movement – selling rallies, buying dips
-   This creates a **mean-reverting** intraday pattern with **suppressed realized volatility**
-   The market feels “sticky” or “pinned” near strike prices with heavy open interest

#### Negative Gamma (Short Gamma) – Trending/Volatility Amplification Regime

When dealers are **net short gamma** (the more common position, since customers are net option buyers):

-   As SPX rises, dealer delta shifts (becomes less short / they need to get longer) –> dealers **buy** futures to re-hedge
-   As SPX falls, dealer delta shifts (becomes more short / they need to get shorter) –> dealers **sell** futures to re-hedge
-   **Net effect**: Dealers trade **in the same direction** as the price movement – buying into rallies, selling into selloffs
-   This creates a **trend-reinforcing** or momentum dynamic with **amplified realized volatility**
-   The market feels “slippery” and prone to cascading moves

* * *

## 2\. Gamma Exposure (GEX) and the “Gamma Flip”

### Aggregate Gamma Exposure

**GEX (Gamma Exposure)** is a measure popularized by options analytics firms (notably SpotGamma, SqueezeMetrics, and others) that estimates the aggregate gamma position of dealers across all strikes and expirations. It is computed roughly as:

`GEX = Sum over all strikes of:   (Open Interest x Gamma x Contract Multiplier x Spot Price x 100)   x (+1 if dealers are assumed long, -1 if dealers are assumed short at that strike)`

The directional assumption (whether dealers are long or short at a given strike) is typically derived from the observation that customers are **net buyers of puts** and **net buyers of calls at certain strikes**, making dealers net short those options. However, some strikes – particularly where structured product flows or overwriting strategies dominate – can have dealers net long.

### The Gamma Flip Level

The **gamma flip** (or “gamma neutral” / “GEX zero” level) is the SPX price at which aggregate dealer gamma transitions from positive to negative:

-   **Above the gamma flip**: Dealers are net long gamma –> mean-reversion, suppressed vol
-   **Below the gamma flip**: Dealers are net short gamma –> trend-following, amplified vol

This concept was developed and popularized by **SpotGamma** and **Cem Karsan** (Kai Volatility), and has been examined in academic work by researchers including **Brent Kochuba** (SpotGamma founder).

In practice, the gamma flip level often sits **below the current spot price** because:  
\- The heavy open interest in put options at lower strikes creates negative gamma for dealers  
\- At-the-money and above, call overwriting and structured product flows can leave dealers long gamma  
\- As the market sells off through the gamma flip, the regime shifts from dampening to amplifying

### Academic and Industry Research

Key papers and sources:

1.  **Barbon & Buraschi (2021)** – “Gamma Fragility”: Demonstrated that options market maker hedging flows create significant price impact, and that the sign of aggregate gamma predicts intraday return autocorrelation and realized volatility.
    
2.  **Baltussen, Da, Lammers & Martens (2021)** – “Hedging Demand and Market Intraday Momentum”: Found that options hedging demand creates predictable intraday patterns, with delta-hedging flows explaining a meaningful fraction of intraday momentum and reversal.
    
3.  **Luo & Ye (2024)** – Research on 0DTE options and market stability examined how ultra-short-dated options change the gamma exposure landscape. Their findings show that 0DTE options create rapidly time-varying gamma exposure that decays within hours.
    
4.  **SqueezeMetrics white paper** – “The Implied Order Book”: Introduced the concept that options gamma creates a synthetic supply/demand structure that acts like a hidden limit-order book, with positive gamma acting as liquidity provision and negative gamma acting as liquidity withdrawal.
    
5.  **Cem Karsan / Kai Volatility** (industry commentary and interviews) – Extensively discussed how dealer positioning creates a “volatility regime” framework, where the transition through the gamma flip level can trigger sharp volatility expansions.
    

* * *

## 3\. The 0DTE Revolution and Its Impact on Dealer Behavior

### What Changed

Prior to 2022, SPX options had Monday/Wednesday/Friday expirations plus monthly and quarterly cycles. The CBOE introduced **daily expirations for SPX options** (Tuesday and Thursday added), meaning every trading day has options expiring that same day – these are “0DTE” (zero days to expiration) options.

The growth has been extraordinary:  
\- By 2023, 0DTE options accounted for **over 40-50% of total SPX options volume** on many days  
\- Notional gamma exposure from 0DTE options routinely rivals or exceeds that of longer-dated options  
\- Average daily notional volume in 0DTE SPX options exceeded **$1 trillion** by 2023-2024

### Unique Properties of 0DTE Gamma

0DTE options have **extreme gamma characteristics** that differ qualitatively from longer-dated options:

1.  **Gamma is enormous and highly localized**: At-the-money 0DTE options have gamma values many times larger than equivalent weekly or monthly options. This gamma is concentrated in a narrow band around the current price.
    
2.  **Gamma decays within hours**: The “gamma mountain” from 0DTE options builds in the morning and collapses by the close. At 9:30 AM, an ATM 0DTE option might have a gamma of 0.15; by 3:00 PM, if still ATM, the gamma could be 0.50 or higher, but options that are even slightly OTM have gamma collapsing to near zero.
    
3.  **Delta becomes binary**: As expiration approaches, the delta of a 0DTE option increasingly resembles a step function – near 0 if OTM, near 1 (or -1 for puts) if ITM. This means that small price moves across a strike can cause **massive delta shifts** requiring enormous hedging flows.
    
4.  **Pin risk is continuous**: Traditional pin risk occurred monthly. Now it occurs **daily**, with the heaviest open interest strikes acting as attractors throughout the session.
    

### How 0DTE Changed Dealer Hedging in Practice

**Increased hedging frequency**: Dealers must re-hedge 0DTE positions far more frequently than for longer-dated options. The gamma is so large and localized that even a 2-3 point move in SPX can materially alter the hedge ratio.

**Intraday gamma profile shifts**: The overall GEX profile now has a **time-varying component** that shifts dramatically throughout the day:  
\- **Morning (9:30-11:00)**: 0DTE gamma is significant but spread across many strikes. Dealers are actively hedging as positions are established.  
\- **Midday (11:00-14:00)**: Gamma begins concentrating near ATM strikes. The dampening/amplifying effect intensifies.  
\- **Afternoon (14:00-16:00)**: 0DTE gamma becomes extremely concentrated and large for ATM options. Strikes even 5-10 points away have minimal gamma. This creates a “pinning” effect near the most active strike, but if the market moves decisively through that strike, the hedging flow can become explosive.

**The “Charm” Effect**: Charm (the decay of delta over time) is massive for 0DTE options. As time passes, OTM options lose delta rapidly, which means dealers who hedged those options must **unwind their hedges**. This creates predictable directional flows:  
\- Dealers short OTM puts see those puts lose delta –> they must buy back the futures they sold as hedges –> **upward pressure**  
\- Dealers short OTM calls see those calls lose delta –> they must sell the futures they bought as hedges –> **downward pressure**  
\- The net direction depends on the **skew of customer positioning** (typically more puts than calls are bought, creating afternoon charm-driven upward pressure in calm markets)

**Vanna flows**: Vanna (change of delta with respect to implied volatility) also plays a role. As implied vol declines (which it typically does into the close on calm days), OTM option deltas decrease, triggering hedge unwinds similar to charm.

* * *

## 4\. Dealer Positioning Effects on Realized Volatility

### Empirical Evidence

Research and practitioner observation have consistently found:

**Positive GEX days** (dealers long gamma):  
\- Realized intraday volatility is **10-30% lower** than implied volatility  
\- Intraday returns show **negative autocorrelation** (mean-reversion)  
\- The VIX term structure tends to be in contango  
\- The market has a “grinding” character with frequent small reversals  
\- Typical when the market is near heavily populated call and put strikes where dealers are net long

**Negative GEX days** (dealers short gamma):  
\- Realized intraday volatility **meets or exceeds** implied volatility  
\- Intraday returns show **positive autocorrelation** (trending)  
\- Moves are self-reinforcing as dealer hedging adds fuel to directional moves  
\- More common during selloffs, when the market drops below the gamma flip level  
\- Gap moves can trigger cascading hedging flows

### The JP Morgan Collar and Structured Product Flows

Large structured positions, such as the **JPMorgan Hedged Equity Fund (JHEQX)** quarterly collar roll, create known, enormous gamma exposures. On quarterly expiration/roll dates, the put and call strikes of these collars generate massive gamma that can dominate the GEX profile. This demonstrates how a single large institutional flow can shift the dealer gamma regime for the entire market.

Similarly, the growth of **income-oriented ETFs** (XYLD, QYLD, JEPI, etc.) that systematically sell calls creates a persistent flow where dealers are long call gamma, contributing to positive GEX at and above certain call strike prices.

### The 0DTE Contribution to Vol Dynamics

Research from the **Federal Reserve Bank of Chicago** (2023 Financial Stability Report mention) and **CBOE Global Markets** examined whether 0DTE options destabilize markets. Key findings:

1.  **0DTE options have not caused a “volmageddon”**: Despite fears, the extremely short lifespan means that gamma from 0DTE self-extinguishes by end of day. Unlike the February 2018 short-vol event (which involved levered VIX products with daily rebalancing), 0DTE options expire and their gamma disappears.
    
2.  **Intraday vol patterns have changed**: The “volatility smile” of the trading day has become more U-shaped, with heightened activity at the open (0DTE position establishment) and into the close (gamma concentration and expiration effects).
    
3.  **Market maker risk management adapted**: Dealers now manage **intraday gamma P&L** rather than multi-day gamma books for the 0DTE component. Some firms use automated hedging systems that re-hedge at sub-minute intervals for large 0DTE exposures.
    
4.  **Net customer positioning in 0DTE is mixed**: Unlike longer-dated options where customers are overwhelmingly net put buyers, 0DTE flow includes significant **premium selling** by retail and systematic strategies (selling iron condors, strangles). This means dealer 0DTE gamma can be positive or negative depending on the day, adding a new source of regime uncertainty.
    

* * *

## 5\. Practical Hedging Mechanics: Step-by-Step

Here is a simplified example of how a dealer hedges 0DTE options and the resulting market impact:

### Scenario: Dealer sells 10,000 ATM 0DTE SPX 5000 puts at 9:30 AM

1.  **Initial hedge**: Put has delta of roughly -0.50. Dealer is short the put, so they are long delta. To hedge, dealer **sells 5,000 SPX futures** (or equivalent ES e-mini contracts).
    
2.  **SPX drops to 4990 by 10:30 AM**: Put delta moves to roughly -0.65. Dealer is now under-hedged on the short side. Dealer must **sell 1,500 more futures** to bring hedge to -6,500. This selling **adds to downward pressure** (negative gamma effect – dealer is short gamma via the short put).
    
3.  **SPX recovers to 5000 by 11:30 AM**: Put delta reverts to roughly -0.50. Dealer must **buy back 1,500 futures**. This buying adds to upward pressure.
    
4.  **SPX stays at 5000, time passes to 2:00 PM**: Due to charm, if SPX is still at 5000, the ATM put’s delta may now be -0.48 (time decay has little effect on ATM delta, but gamma has become larger). The critical change is that the **gamma has increased dramatically** – the same 10-point move now causes a delta shift of perhaps -0.20 instead of -0.15 earlier.
    
5.  **SPX drops to 4990 at 3:00 PM**: Now the put delta jumps to perhaps -0.80 (gamma is enormous this close to expiry for near-the-money options). Dealer must **sell 3,000 additional futures** – double the hedging flow compared to the same move earlier in the day.
    
6.  **Expiration at 4:00 PM**: If SPX finishes at 4990, the put expires ITM with delta -1.00. The dealer’s hedge converges to the final settlement. The total hedging activity throughout the day has involved multiple rounds of buying and selling futures, with the volume and urgency increasing as expiration approached.
    

* * *

## 6\. The Feedback Loop: How GEX Creates Self-Fulfilling Regimes

The interplay between dealer positioning and market behavior creates feedback loops:

### Positive Gamma Regime (Stable/Low Vol)

`Market stable near strikes with heavy OI   --> Dealers long gamma, sell rallies / buy dips   --> Realized vol suppressed below implied vol   --> Implied vol declines (selling pressure on vol)   --> Vanna effect: declining vol reduces OTM delta   --> Dealers unwind directional hedges (charm + vanna)   --> Further dampening of moves   --> Regime persists until a catalyst breaks through the gamma cushion`

### Negative Gamma Regime (Unstable/High Vol)

`Market moves below gamma flip level   --> Dealers short gamma, buy rallies / sell dips (chase price)   --> Realized vol amplified above implied vol   --> Implied vol increases   --> Vanna effect: rising vol increases OTM put delta   --> Dealers must sell more hedges (puts become more "alive")   --> Further amplification of moves (especially to downside)   --> Regime persists until market stabilizes above gamma flip or options expire`

### The 0DTE Amplifier

With 0DTE options, this feedback loop operates on a **compressed time scale**:  
\- The gamma is larger, so each unit of price movement triggers more hedging flow  
\- The loop completes faster because the options expire within hours  
\- The regime can shift multiple times within a single trading day as new 0DTE positions are established and old ones expire  
\- The “gamma wall” concept (a strike with massive open interest acting as a barrier) is now a daily phenomenon rather than a monthly one

* * *

## 7\. Key Research and Sources

### Academic Papers

-   **Barbon & Buraschi (2021)**: “Gamma Fragility” – demonstrates the price impact of options hedging flows
-   **Baltussen, Da, Lammers & Martens (2021)**: Hedging demand and intraday momentum
-   **Ni, Pearson & Poteshman (2005)**: Early work on options order flow and stock prices
-   **Avellaneda & Lipkin (2003)**: Stock pinning near option expiration
-   **Brogaard, Ringgenberg & Roesch (2023)**: Research on 0DTE options and market quality

### Industry / Practitioner Sources

-   **SpotGamma** (Brent Kochuba): GEX analytics and gamma flip framework
-   **SqueezeMetrics**: “The Implied Order Book” white paper; Dark Index (DIX) and GEX tools
-   **Cem Karsan / Kai Volatility**: Extensive public commentary on dealer gamma positioning
-   **Simplify Asset Management** (Michael Green): Research on passive flows and vol dynamics
-   **CBOE Global Markets**: 0DTE data publications and market structure analysis
-   **Federal Reserve Bank of Chicago**: Financial stability commentary on 0DTE growth (2023)
-   **JP Morgan Derivatives Research** (Kolanovic, Peng): Dealer gamma and vol control frameworks

* * *

## 8\. Summary of Key Dynamics

| Factor | Positive Dealer Gamma | Negative Dealer Gamma |
| --- | --- | --- |
| **Dealer hedging direction** | Counter-trend (sell rallies, buy dips) | Pro-trend (buy rallies, sell dips) |
| **Intraday pattern** | Mean-reverting, range-bound | Trending, breakout-prone |
| **Realized vs implied vol** | Realized < Implied | Realized >= Implied |
| **Return autocorrelation** | Negative (reversal) | Positive (momentum) |
| **Market “feel”** | Sticky, pinned, grinding | Slippery, cascading, volatile |
| **Typical conditions** | Calm markets, above gamma flip | Selloffs, below gamma flip |

**The 0DTE transformation**: Daily expirations have made gamma a faster-cycling, more intense, and more intraday-variable force. Dealers now manage gamma on hourly rather than daily timescales. The afternoon “gamma ramp” from expiring 0DTE options creates a new intraday vol regime that did not exist before 2022. Customer flow in 0DTE is more balanced between buying and selling than in longer-dated options, making the dealer gamma sign less predictable and more dynamic throughout each session.

The net effect is that **understanding dealer gamma positioning has become essential for interpreting intraday SPX price action**, and the rapid growth of 0DTE options has made this dynamic more potent, more frequent, and more complex than at any prior point in market history.
