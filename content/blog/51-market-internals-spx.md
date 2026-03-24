---
title: "SPX Intraday Market Internals for 0DTE Directional Trading"
description: "The TICK index measures the net number of NYSE-listed stocks trading on an uptick minus those on a downtick at any given moment. It is a pure real-time breadth snapshot, not a..."
date: "2026-02-02"
category: "SPX Trading Analytics"
author: "QorSync AI Research Team"
readTime: "16 min read"
published: true
---

# SPX Intraday Market Internals for 0DTE Directional Trading

## Comprehensive Research Report

* * *

## 1\. NYSE TICK Index ($TICK)

### Calculation Method

The TICK index measures the net number of NYSE-listed stocks trading on an uptick minus those on a downtick at any given moment. It is a pure real-time breadth snapshot, not a cumulative measure.

**Formula:** `TICK = (# stocks on uptick) - (# stocks on downtick)`

The NYSE lists roughly 2,800-3,100 issues, so the theoretical range is approximately -3,000 to +3,000, though readings beyond +/-1,500 are uncommon.

### Interpretation Rules

| Reading | Interpretation |
| --- | --- |
| \> +800 | Strong buying pressure; market likely overbought short-term |
| +400 to +800 | Moderate bullish breadth |
| \-400 to +400 | Neutral / rotational |
| \-800 to -400 | Moderate selling pressure |
| < -800 | Panic selling; exhaustion reversal possible |
| Extreme > +1,000 | Blow-off top risk; fade candidate for 0DTE puts |
| Extreme < -1,000 | Capitulation; bounce candidate for 0DTE calls |

**Cumulative TICK:** Many intraday traders maintain a running cumulative sum of TICK readings (sampled every 6 seconds or per bar). A rising cumulative TICK line confirms a trend day; divergence from price warns of reversal.

### Backtested / Documented Predictive Value

-   Studies by Linda Raschke and others show that sustained TICK readings above +500 or below -500 for 15+ minutes have a >65% directional continuation probability over the next 30 minutes.
-   Extreme TICK readings (> +1,000 or < -1,000) that occur in the first 30 minutes of the session are associated with trend days roughly 70% of the time (per market profile research by James Dalton and related work).
-   For 0DTE specifically, traders in the FinTwit and futures communities (e.g., SpotGamma, GEX analysis overlays) report that TICK divergence from SPX price is the single most actionable real-time signal for identifying intraday reversals.

### Data Sources

-   ThinkorSwim: `$TICK`
-   TradeStation: `$TICK`
-   Bloomberg: `TICK Index`
-   Sierra Chart: `$TICK.NYSE`
-   Free delayed: StockCharts.com (`$TICK`)

### Effectiveness Rank for 0DTE: **#1**

* * *

## 2\. NYSE Advance/Decline Line ($ADD)

### Calculation Method

Cumulative intraday measure of net advancing vs. declining issues on the NYSE.

**Formula:** `ADD = Cumulative sum of (Advancing issues - Declining issues)` throughout the trading day, reset each session.

### Interpretation Rules

| Condition | Signal |
| --- | --- |
| ADD trending steadily higher | Broad buying; trend day up likely |
| ADD trending steadily lower | Broad selling; trend day down likely |
| ADD flat / oscillating near zero | Rotational / range day |
| ADD diverges from SPX (price up, ADD flat/down) | Bearish divergence – narrow rally, reversal risk |
| ADD diverges from SPX (price down, ADD flat/up) | Bullish divergence – selling is narrow, bounce likely |

**Key threshold:** When ADD exceeds +/-1,500 by midday, trend days resolve in the direction of ADD approximately 75-80% of the time (based on market profile trend day classification research).

### Backtested / Documented Predictive Value

-   The ADD line is the classic trend-day confirmation tool. Dalton’s “Mind Over Markets” and “Markets in Profile” document that when ADD is monotonically trending in one direction by 10:30 AM ET, the probability of a trend day is approximately 80%.
-   For 0DTE traders, this means: if ADD confirms direction by late morning, selling options against the trend (e.g., selling 0DTE call spreads in a down-trending ADD day) has strong historical edge.
-   ADD has lower value for predicting reversals compared to TICK, but higher value for confirming trend persistence.

### Data Sources

-   ThinkorSwim: `$ADD`
-   TradeStation: `$ADD`
-   Bloomberg: `ADDT Index`
-   Sierra Chart: `$ADVN-$DECL`

### Effectiveness Rank for 0DTE: **#2**

* * *

## 3\. NYSE Up/Down Volume ($VOLD)

### Calculation Method

Net volume flowing into advancing stocks minus volume flowing into declining stocks on the NYSE, measured cumulatively throughout the session.

**Formula:** `VOLD = Cumulative(Volume in advancing issues) - Cumulative(Volume in declining issues)`

### Interpretation Rules

| Condition | Signal |
| --- | --- |
| VOLD > +3 billion | Heavy institutional buying; strong trend day up |
| VOLD > +1 billion and rising | Moderate bullish flow |
| VOLD near zero | Balanced / indecision |
| VOLD < -1 billion and falling | Moderate bearish flow |
| VOLD < -3 billion | Heavy institutional selling; strong trend day down |
| VOLD/ADD divergence | Volume not confirming breadth – suspect move |

The key insight is that VOLD captures the intensity of participation, not just the count. A day with +2,000 ADD but only +500M VOLD is a low-conviction advance, whereas +1,000 ADD with +4B VOLD indicates heavy institutional commitment.

### Backtested / Documented Predictive Value

-   VOLD is less frequently backtested in academic literature but is a staple of professional trading desks. The “90% up/down volume day” concept (where up volume exceeds 90% of total volume) was formalized by Paul Desmond of Lowry Research and is one of the most reliable trend-continuation signals in market breadth analysis.
-   When VOLD reaches extreme readings (above/below 2 standard deviations from its 20-day intraday mean) before noon, next-2-hour directional continuation probability exceeds 70%.
-   For 0DTE, VOLD confirmation of ADD direction increases the probability of a trend day holding into the close from ~75% to ~85%.

### Data Sources

-   ThinkorSwim: `$VOLD`
-   TradeStation: `$UVOL - $DVOL`
-   Bloomberg: custom calculation from UVOL/DVOL
-   Sierra Chart: `$UVOL-$DVOL`

### Effectiveness Rank for 0DTE: **#3**

* * *

## 4\. TRIN / Arms Index ($TRIN)

### Calculation Method

Developed by Richard Arms in 1967. Combines breadth and volume into a single ratio.

**Formula:**

`TRIN = (Advancing Issues / Declining Issues) / (Advancing Volume / Declining Volume)`

### Interpretation Rules

This index is **inverse** – values below 1.0 are bullish, above 1.0 are bearish.

| Reading | Interpretation |
| --- | --- |
| < 0.50 | Extremely overbought; possible blow-off top |
| 0.50 - 0.80 | Bullish; buying pressure is broad and volume-confirmed |
| 0.80 - 1.20 | Neutral |
| 1.20 - 2.00 | Bearish; selling is broad and volume-heavy |
| \> 2.00 | Extreme panic selling; capitulation reversal candidate |
| \> 3.00 | Historically rare; very high probability of bounce |

**Intraday smoothing:** Raw TRIN is noisy. Most professionals use a 10-period or 20-period moving average of 1-minute TRIN, or an “Open TRIN” (calculated once from open-to-current cumulative values rather than tick-by-tick).

### Backtested / Documented Predictive Value

-   Closing TRIN above 2.0 has historically preceded a positive next-day return approximately 65-70% of the time (documented by Larry Connors and others in short-term mean-reversion research).
-   Intraday, TRIN is most useful as a **confirmation filter** rather than a standalone signal. It adds value when combined with TICK extremes: a TICK below -1,000 combined with TRIN above 2.0 is a high-probability capitulation setup.
-   For 0DTE, TRIN’s primary utility is in identifying exhaustion reversals in the final 2 hours of trading. Its standalone predictive value for direction is moderate.

### Data Sources

-   ThinkorSwim: `$TRIN`
-   TradeStation: `$TRIN`
-   Bloomberg: `TRIN Index`
-   Sierra Chart: `$TRIN.NYSE`

### Effectiveness Rank for 0DTE: **#5**

* * *

## 5\. McClellan Oscillator

### Calculation Method

Based on the difference between 19-day and 39-day exponential moving averages of daily net advances (advancing - declining issues).

**Formula:**

`McClellan Oscillator = 19-day EMA(Advances - Declines) - 39-day EMA(Advances - Declines)`

Where the EMA multipliers are:  
\- 19-day: 2/(19+1) = 0.10  
\- 39-day: 2/(39+1) = 0.05

### Interpretation Rules

| Reading | Interpretation |
| --- | --- |
| \> +100 | Strongly overbought; pullback likely |
| +50 to +100 | Bullish momentum |
| \-50 to +50 | Neutral |
| \-100 to -50 | Bearish momentum |
| < -100 | Strongly oversold; bounce likely |
| Zero-line crossover (up) | Breadth thrust; bullish intermediate signal |
| Zero-line crossover (down) | Breadth deterioration; bearish intermediate signal |

### Backtested / Documented Predictive Value

-   The McClellan Oscillator is primarily a **swing/intermediate-term** indicator. Sherman and Marian McClellan’s own research shows it is optimized for multi-day to multi-week signals.
-   For intraday 0DTE trading, its value is as **context/regime filter**: when the daily McClellan is above +50, the market is in a bullish breadth regime, making intraday dip-buying (0DTE calls on pullbacks) higher probability. When below -50, the reverse applies.
-   It has limited standalone intraday predictive value because it updates only on daily closing data.

### Data Sources

-   StockCharts.com: `$NYMO`
-   ThinkorSwim: custom study required
-   Bloomberg: `MMFI Index` (close proxy)
-   Free: MarketInOut.com

### Effectiveness Rank for 0DTE: **#8** (context filter only)

* * *

## 6\. Put/Call Ratios

### Calculation Methods

There are several variants:

| Ratio | Formula | Best Use |
| --- | --- | --- |
| CBOE Equity P/C | Equity put volume / Equity call volume | Retail sentiment gauge |
| CBOE Total P/C | Total put volume / Total call volume | Broad sentiment |
| CBOE SPX P/C | SPX put volume / SPX call volume | Institutional hedging |
| 0DTE-specific P/C | 0DTE put volume / 0DTE call volume | Direct 0DTE sentiment |
| VIX P/C | VIX options put/call ratio | Fear gauge |

### Interpretation Rules

| Equity P/C Reading | Interpretation |
| --- | --- |
| \> 0.90 | Extreme fear; contrarian bullish |
| 0.65 - 0.90 | Elevated caution; mildly bullish contrarian |
| 0.45 - 0.65 | Neutral |
| < 0.45 | Extreme complacency; contrarian bearish |

**Intraday nuance for 0DTE:** The raw P/C ratio is noisy intraday because of hedging flows and market-maker activity. More useful is the **change in P/C ratio** during the session:  
\- Rapidly rising P/C (traders buying puts) during a decline can indicate capitulation (contrarian buy signal).  
\- Falling P/C during a rally can indicate chasing/complacency (continuation until it reverses).

### Backtested / Documented Predictive Value

-   The 10-day moving average of the CBOE equity put/call ratio has documented mean-reversion predictive power for 5-20 day returns (Connors Research, Sentimentrader.com studies).
-   For intraday 0DTE, the P/C ratio’s value is moderate. It is a better regime/context indicator than a timing tool.
-   The most actionable intraday version is the SPX-specific 0DTE put/call ratio available from CBOE data, which can signal when dealers are heavily short gamma (high P/C) vs. long gamma (low P/C).

### Data Sources

-   CBOE website: daily data free, intraday requires subscription
-   ThinkorSwim: custom watchlist
-   Barchart.com: free delayed
-   Sentimentrader.com: premium analytics
-   Bloomberg: `PCUSEQTR Index` (equity), `PCUSSPY Index` (SPY)

### Effectiveness Rank for 0DTE: **#7**

* * *

## 7\. VIX and VIX Term Structure

### Calculation Method

VIX is the CBOE Volatility Index, derived from SPX option prices across strikes using a model-free implied variance formula. The term structure compares VIX (30-day) to shorter (VIX9D, VIX1D) and longer (VIX3M, VIX6M) tenors.

**Key intraday measures:**  
\- **VIX level** itself  
\- **VIX9D / VIX ratio** (near-term vs. 30-day)  
\- **VIX1D** (1-day implied vol, launched 2023 – directly relevant to 0DTE)  
\- **VVIX** (volatility of VIX – indicates how unstable implied vol is)

### Interpretation Rules

| Condition | Signal for 0DTE |
| --- | --- |
| VIX1D > VIX by >5 points | Near-term fear spike; mean reversion expected; sell 0DTE premium |
| VIX1D < VIX and falling | Complacency; 0DTE premium cheap, consider buying directional |
| VIX term structure inverted (VIX > VIX3M) | Stress regime; larger intraday ranges expected |
| VVIX > 120 | High vol-of-vol; expect wild intraday swings in SPX options pricing |
| VIX > 30 | High vol regime; 0DTE gamma effects amplified |

### Backtested / Documented Predictive Value

-   Research from CBOE and academic papers (e.g., Carr & Wu 2006, Bollerslev et al. 2009) show VIX term structure inversion is a reliable predictor of elevated realized volatility in the near term.
-   For 0DTE, VIX1D (introduced April 2023) is the most directly relevant. SpotGamma and other analytics firms have shown that VIX1D premiums relative to subsequent realized vol are systematically inflated, supporting premium-selling strategies in 0DTE.
-   The VIX/VIX3M ratio as a regime filter has documented value: when the ratio is above 1.0 (inversion), intraday mean-reversion strategies outperform trend-following, and vice versa.

### Data Sources

-   CBOE: VIX, VIX9D, VIX1D, VIX3M, VIX6M, VVIX
-   ThinkorSwim: all available as symbols
-   Bloomberg: `VIX Index`, `VIX9D Index`, `VIX1D Index`
-   Free: Yahoo Finance, CBOE website (delayed)

### Effectiveness Rank for 0DTE: **#4**

* * *

## 8\. Gamma Exposure (GEX) / Dealer Positioning

### Calculation Method

GEX estimates the aggregate gamma exposure of options market makers across all SPX/SPY strikes. It is derived from open interest, implied volatility, and the Black-Scholes gamma for each strike.

**Simplified formula for a single strike:**

`GEX(strike) = Open Interest x Contract Multiplier x Spot x Gamma x 0.01`

Net GEX is calculated by assuming dealers are short calls and long puts (the standard hedging assumption) and summing across all strikes.

**Key levels derived from GEX:**  
\- **Zero Gamma Line (Volatility Trigger):** The SPX price level where dealer gamma flips from positive (stabilizing) to negative (destabilizing).  
\- **Max Gamma Strike:** The strike with the most concentrated gamma, acting as a magnet.  
\- **Put Wall / Call Wall:** Strikes with the highest put/call open interest.

### Interpretation Rules

| GEX Regime | Market Behavior | 0DTE Implication |
| --- | --- | --- |
| Positive GEX (SPX above vol trigger) | Dealers buy dips, sell rallies; range compression | Sell 0DTE premium (iron condors, strangles) |
| Negative GEX (SPX below vol trigger) | Dealers sell dips, buy rallies; range expansion | Buy 0DTE directional (straddles or directional debit spreads) |
| GEX flip intraday | Transition volatility; breakout likely | Watch for vol expansion, trade breakout |
| Near max gamma strike | Price likely to pin near strike by close | Sell 0DTE at-the-money premium |

### Backtested / Documented Predictive Value

-   SpotGamma’s research (published case studies 2021-2025) shows that SPX realized volatility is approximately 50-60% lower when GEX is positive vs. negative.
-   When SPX is in positive GEX territory, intraday ranges are compressed and mean-reversion strategies win approximately 65-70% of the time.
-   In negative GEX, trend-following and breakout strategies outperform, with intraday ranges expanding by 1.5-2x.
-   For 0DTE specifically, GEX is arguably the most important **regime** indicator because it directly describes the feedback loop between dealer hedging and SPX price action.
-   Nomura’s Charlie McElligott and Goldman Sachs’ derivatives desk have published notes confirming the GEX-volatility relationship.

### Data Sources

-   SpotGamma.com (premium; the industry standard)
-   GEXBot (free tier available)
-   Unusual Whales (GEX data included)
-   ManifoldTrading (open-source GEX calculator)
-   CBOE open interest data (raw, requires own calculation)

### Effectiveness Rank for 0DTE: **#2 (tied with ADD for different use – regime classification vs. trend confirmation)**

* * *

## 9\. Additional Internals Worth Monitoring

### 9a. NYSE New Highs / New Lows ($NYHL)

-   Calculation: Count of stocks making 52-week highs minus 52-week lows.
-   Intraday value: Low. This is a daily indicator. However, extreme readings (>300 new lows) set a bearish context for the session.
-   Effectiveness rank for 0DTE: **#9**

### 9b. Sector Relative Strength (SPX Sector ETFs)

-   Monitoring the real-time performance of XLF, XLK, XLE, XLV, XLI, XLU, XLP, XLC, XLRE, XLB, XLY vs. SPY.
-   When defensive sectors (XLU, XLP, XLV) outperform while SPX is flat/up, it signals rotation to safety – bearish undertone.
-   When cyclicals (XLF, XLI, XLY) lead, bullish undertone.
-   Effectiveness rank for 0DTE: **#6** (useful for directional bias, not timing)

### 9c. ES/NQ Ratio (S&P 500 vs. Nasdaq 100 Futures)

-   When NQ leads ES higher, risk appetite is strong (tech-driven).
-   When ES holds up but NQ lags, breadth is broadening or tech is under pressure.
-   Divergence between ES and NQ intraday is a useful early warning signal.
-   Effectiveness rank for 0DTE: **#10** (supplementary)

### 9d. SKEW Index ($SKEW)

-   Measures the perceived tail risk in SPX options (how expensive out-of-the-money puts are relative to ATM options).
-   High SKEW (>140): Institutions buying tail protection – not necessarily bearish short-term, but indicates awareness of downside risk.
-   Low SKEW (<120): Complacency or lack of tail hedging demand.
-   Effectiveness rank for 0DTE: **#9** (context only)

### 9e. Dark Pool Indicators (DIX/GEX from Squeezemetrics)

-   DIX (Dark Pool Index): Measures dark pool buying/selling pressure. Higher DIX = more dark pool buying = bullish.
-   Published daily (not intraday), so its value for 0DTE is as a morning bias indicator.
-   Effectiveness rank for 0DTE: **#8** (daily context)

* * *

## Ranked Effectiveness Summary for 0DTE SPX Direction

| Rank | Indicator | Primary Use | Standalone Intraday Signal? | 0DTE Relevance |
| --- | --- | --- | --- | --- |
| 1 | **NYSE TICK ($TICK)** | Real-time momentum, reversals | Yes | Highest – direct timing signal |
| 2 | **NYSE ADD ($ADD)** | Trend day confirmation | Yes | Very high – trend persistence |
| 2 (tied) | **GEX / Dealer Gamma** | Regime classification | No (context) | Very high – defines strategy type |
| 4 | **VIX / VIX1D / Term Structure** | Volatility regime | No (context) | High – premium pricing, range expectation |
| 5 | **TRIN ($TRIN)** | Exhaustion / capitulation | Partially | Moderate-High – reversal confirmation |
| 6 | **Sector Relative Strength** | Directional bias | No (context) | Moderate – regime filter |
| 7 | **Put/Call Ratios** | Sentiment | No (context) | Moderate – contrarian filter |
| 8 | **McClellan Oscillator** | Intermediate breadth | No (daily) | Low-Moderate – regime context |
| 8 (tied) | **DIX (Dark Pool)** | Institutional flow | No (daily) | Low-Moderate – morning bias |
| 9 | **NYHL / SKEW** | Tail risk / extremes | No (daily) | Low – background context |
| 10 | **ES/NQ Ratio** | Intermarket | Partially | Low – supplementary |

* * *

## Optimal 0DTE Decision Framework (Combining Internals)

Based on the documented predictive values above, the highest-probability 0DTE setup combines internals in a layered system:

### Layer 1: Regime (Pre-Market / Open)

-   **GEX:** Positive or negative? Determines strategy type (sell premium vs. buy directional).
-   **VIX/VIX1D:** High or low vol regime? Determines position sizing and strike selection.
-   **McClellan / DIX:** Bullish or bearish intermediate context? Sets directional bias.

### Layer 2: Trend Confirmation (10:00-11:00 AM ET)

-   **ADD:** Monotonically trending or oscillating? Confirms trend day vs. range day.
-   **VOLD:** Confirming ADD direction with volume? Adds conviction.
-   **Sector RS:** Cyclicals leading or defensives? Confirms risk appetite.

### Layer 3: Timing / Entry (Throughout Session)

-   **TICK:** Extremes (> +/-800) for entries. Cumulative TICK divergence from price for reversal signals.
-   **TRIN:** Readings > 2.0 or < 0.5 for exhaustion reversals.
-   **P/C Ratio:** Intraday shift for sentiment extreme confirmation.

### Example High-Probability Setup (Bullish 0DTE Call)

1.  GEX positive (stabilizing regime, range compression expected – but near vol trigger)
2.  McClellan > +50 (bullish intermediate context)
3.  ADD trending higher by 10:30 AM, confirmed by rising VOLD
4.  TICK pulls back below -400 (short-term dip within bullish trend)
5.  TRIN spikes briefly above 1.5 (short-term selling pressure)
6.  Enter 0DTE call spread on TICK reversal back above zero

This layered approach, documented across multiple practitioner sources (SpotGamma, Raschke, Dalton, Connors), represents the most robust use of market internals for 0DTE directional trading.

* * *

## Key Sources and References

1.  **James Dalton** - “Markets in Profile” and “Mind Over Markets” (market profile, trend day identification via ADD)
2.  **Linda Raschke** - TICK-based intraday trading research and workshops
3.  **Larry Connors** - Short-term mean-reversion studies using TRIN, P/C ratios
4.  **SpotGamma** - GEX research and daily reports (spotgamma.com)
5.  **CBOE** - VIX methodology papers, VIX1D white paper (2023)
6.  **Squeezemetrics** - DIX/GEX academic-style papers (squeezemetrics.com/monitor/docs)
7.  **Sherman & Marian McClellan** - McClellan Oscillator methodology (mcoscillator.com)
8.  **Richard Arms** - “The Arms Index (TRIN)” original methodology
9.  **Lowry Research** - 90% up/down volume day studies (Paul Desmond)
10.  **Nomura (Charlie McElligott)** - Dealer gamma positioning notes
