---
title: "The 0DTE Options Explosion (2022-2026): A Comprehensive Analysis"
description: "“0DTE” (zero days to expiration) options refer to options contracts that expire on the same day they are traded. While same-day options have existed for decades on monthly and..."
date: "2026-01-25"
category: "SPX Trading Analytics"
author: "QorSync AI Research Team"
readTime: "15 min read"
published: true
---

# The 0DTE Options Explosion (2022-2026): A Comprehensive Analysis

## 1\. Introduction and Scope

“0DTE” (zero days to expiration) options refer to options contracts that expire on the same day they are traded. While same-day options have existed for decades on monthly and weekly expiration dates, the phenomenon became a market-structural force beginning in 2022 when the CBOE expanded daily SPX expirations to every trading day. What followed was an unprecedented surge in short-dated options activity that has reshaped market microstructure, volatility pricing, dealer hedging dynamics, and intraday price patterns across U.S. equity markets.

This report synthesizes available data, academic research, and sell-side analysis through early 2026.

* * *

## 2\. The Volume Explosion: CBOE Statistics and Market Data

### 2.1 The Catalyst: Daily SPX Expirations

-   **April 2022**: CBOE introduced Tuesday and Thursday SPX expirations, completing the full Monday-through-Friday daily expiration cycle for S&P 500 index options.
-   Prior to this, SPX options expired on Mondays (2016), Wednesdays (2016), and Fridays (traditional monthly/weekly).
-   This structural change removed the “gap” days where no same-day expiration existed, enabling continuous 0DTE strategies.

### 2.2 Volume Growth Trajectory

| Period | 0DTE SPX ADV (approx.) | Share of Total SPX Volume |
| --- | --- | --- |
| Q1 2022 (pre-expansion) | ~500,000 contracts/day | ~22% |
| Q4 2022 | ~1.2 million contracts/day | ~42% |
| Q1 2023 | ~1.5 million contracts/day | ~46% |
| Q4 2023 | ~1.6-1.8 million contracts/day | ~48-52% |
| 2024 (full year) | ~1.8-2.0 million contracts/day | ~50-55% |
| Early 2025 | ~2.0+ million contracts/day | ~53-56% |

Key statistics:  
\- Total SPX options ADV rose from approximately 2.5 million contracts/day in early 2022 to over 3.5 million by late 2024.  
\- 0DTE options accounted for the majority of the incremental growth – roughly 80%+ of the net increase in SPX options volume from 2022-2025 came from 0DTE contracts.  
\- CBOE reported that 0DTE SPX options crossed the 50% share threshold in mid-to-late 2023 and have remained above that level.  
\- Notional value traded daily in 0DTE SPX options reached an estimated $500 billion to $1 trillion+ on volatile days, a staggering figure that frequently exceeded the notional turnover of the underlying S&P 500 cash equity market.

### 2.3 Participation Mix

Contrary to early narratives, the 0DTE market is not dominated by retail speculators:

-   **CBOE data (published 2023)** showed that retail traders accounted for only approximately **5-7%** of 0DTE SPX volume by number of contracts. The lion’s share was institutional: proprietary trading firms, volatility funds, pension overlays, and systematic strategy operators.
-   A significant portion of activity involves **premium-selling strategies** (selling strangles, iron condors, or naked puts/calls intraday), often by sophisticated market makers and volatility-targeting funds.
-   Retail participation was more prominent in single-stock and ETF 0DTE options (especially SPY), where contract sizes are smaller.

* * *

## 3\. Why 0DTE Options Grew So Rapidly

### 3.1 Structural Factors

1.  **Daily expiration availability**: The 2022 CBOE expansion was the necessary condition.
2.  **Capital efficiency**: 0DTE options have extremely low absolute premiums (due to near-zero time value), allowing large notional exposures with small capital outlays.
3.  **No overnight risk**: Positions open and close the same day, eliminating gap risk.
4.  **High gamma / high leverage**: 0DTE options have the highest gamma of any listed option, meaning small moves in the underlying produce large percentage changes in option value – attractive for directional speculation.
5.  **Theta decay as income**: For sellers, 0DTE options offer the fastest possible theta decay, enabling intraday income-harvesting strategies.

### 3.2 Market Ecosystem Factors

-   **Broker technology**: Platforms like Tastytrade, Interactive Brokers, Schwab/thinkorswim, and Robinhood made options trading more accessible.
-   **Social media and education**: The “FinTwit” and Reddit communities popularized 0DTE trading strategies, creating a cultural phenomenon.
-   **Volatility regime**: The elevated but range-bound VIX environment of 2022-2023 (mostly 15-30) was conducive to premium-selling strategies.

* * *

## 4\. Market Microstructure Impacts

### 4.1 Dealer Gamma Exposure and Hedging

This is the most consequential microstructural effect. The core mechanism:

-   **When dealers are net short gamma** (which occurs when customers are net buyers of 0DTE options), dealers must **delta-hedge by buying into rallies and selling into declines**. This amplifies intraday moves and can create self-reinforcing momentum.
-   **When dealers are net long gamma** (when customers are net sellers of 0DTE options), dealers hedge by **selling into rallies and buying dips**, which dampens volatility and compresses the intraday range.

The empirical evidence from 2022-2025 suggests a complex and time-varying picture:

**JPMorgan’s research** (Marko Kolanovic’s team, and later Peng Cheng’s derivatives research group) was among the earliest to flag the gamma-hedging channel. Key findings from their research notes:

-   JPMorgan estimated that 0DTE gamma hedging flows could move the S&P 500 by **20-50 basis points** on a typical day, and considerably more during high-volume or directionally skewed sessions.
-   They argued that the net gamma position of dealers fluctuated rapidly during the day, sometimes flipping from long to short gamma within hours, creating **regime-switching** intraday dynamics.
-   JPMorgan’s 2023-2024 work emphasized that **the last 1-2 hours of trading** saw the most intense gamma effects because 0DTE gamma explodes as expiration approaches (gamma peaks when the option is at-the-money and near expiration).

**Goldman Sachs** (notably the derivatives strategy team under John Marshall, and later research by the Marquee analytics team):

-   Goldman published research arguing that the net effect of 0DTE was more nuanced than the “amplification” narrative suggested.
-   They found that **on most days, the net customer positioning was short premium** (i.e., customers were net sellers of 0DTE options), which meant dealers were net long gamma. This produced a **volatility-suppressing** effect on average.
-   Goldman estimated that this dealer-long-gamma positioning contributed to the unusually low realized volatility observed in 2023 and parts of 2024, even as implied volatility (VIX) remained moderately elevated.
-   However, Goldman also warned that on **stress days** when the dynamic flips (customers rush to buy puts for protection), the gamma effect reverses and can amplify sell-offs.

### 4.2 The “Gamma Trap” and “Charm Flows”

A related phenomenon:

-   **Charm** (the rate of change of delta with respect to time) becomes extremely large for 0DTE options. As the trading day progresses and options approach expiration, out-of-the-money 0DTE options rapidly lose delta, while at-the-money options see delta converge sharply toward 0 or 1.
-   This creates large, predictable hedging flows in the final hours of trading. Dealers adjusting for charm-driven delta changes can produce a “gravitational pull” toward certain strike prices, a phenomenon sometimes called **pinning**.
-   Research from multiple sources (including academic work and CBOE’s own analysis) documented increased evidence of SPX **strike pinning** at major round-number strikes, particularly in the final 60-90 minutes of trading.

### 4.3 Intraday Volatility Patterns

The 0DTE explosion has produced measurable changes in intraday volatility structure:

1.  **Compressed midday volatility**: On days with heavy 0DTE premium selling, the 11:00 AM - 2:00 PM ET window frequently showed unusually low realized volatility, consistent with dealer-long-gamma suppression.
    
2.  **Elevated final-hour volatility**: The 3:00 PM - 4:00 PM ET window showed increased volatility relative to historical norms, consistent with the gamma and charm hedging effects as 0DTE options settle.
    
3.  **Opening auction effects**: Some researchers documented increased volatility in the first 30 minutes as 0DTE positions were established, though this effect was less consistent.
    
4.  **“Volatility smile inversion”**: The 0DTE skew curve (implied volatility across strikes) exhibited unusual shapes, including periods of flatter or even inverted skew relative to longer-dated options, reflecting the unique supply-demand dynamics of the 0DTE market.
    

### 4.4 Impact on the VIX

The relationship between 0DTE activity and the VIX is indirect but important:

-   0DTE SPX options are **not included** in the VIX calculation (which uses options with 23-37 days to expiration).
-   However, the volatility-suppressing effect of 0DTE dealer hedging on realized volatility feeds back into VIX through the realized-vs-implied volatility relationship.
-   Some analysts argued that the persistent “VIX premium” (implied volatility exceeding realized) during 2023-2024 was partly attributable to 0DTE activity suppressing realized vol while longer-dated implied vol remained elevated.
-   CBOE introduced the **1-Day VIX (VIX1D)** in April 2023, specifically designed to capture the ultra-short-term implied volatility reflected in 0DTE options. VIX1D frequently diverged from the standard VIX, sometimes dramatically (e.g., VIX1D spiking on intraday stress while VIX barely moved, or vice versa).

* * *

## 5\. Academic Research

### 5.1 Key Papers and Findings

Several academic and quasi-academic studies addressed the 0DTE phenomenon:

**“Retail Traders Love 0DTE Options… But They Aren’t the Ones Trading Them” (CBOE Global Markets, 2023)**  
\- Using proprietary order-flow data, CBOE demonstrated that institutional participants dominated 0DTE SPX volume.  
\- Retail share was approximately 5% of SPX 0DTE, though higher in SPY 0DTE (~20-25%).  
\- This paper was influential in correcting the popular narrative that 0DTE was a retail-driven gambling phenomenon.

**Brogaard, Ringgenberg, and others – Working papers on 0DTE and intraday volatility (2023-2024)**  
\- Multiple working papers from financial economics departments examined whether 0DTE options increased or decreased realized volatility.  
\- The general finding was **ambiguous**: 0DTE activity was associated with lower realized volatility on “normal” days but higher tail-risk (larger moves on extreme days).  
\- This is consistent with the dealer-gamma mechanism: long-gamma dealers suppress normal volatility but short-gamma episodes amplify stress.

**“Zero-Day Options and Market Quality” (Working paper, 2024)**  
\- Examined bid-ask spreads, depth, and price efficiency in the SPX and SPY markets around the 0DTE expansion.  
\- Found modest improvements in market quality (tighter spreads, more depth) during normal conditions, attributed to increased market-maker activity.  
\- Found deterioration in market quality during high-stress episodes, as market makers widened spreads and reduced depth to manage gamma risk.

**Federal Reserve and BIS analysis (2023-2025)**  
\- The Bank for International Settlements published a quarterly review note in 2023 flagging 0DTE options as a potential source of systemic risk, focusing on the gamma-hedging amplification channel.  
\- The Federal Reserve’s Financial Stability Report (multiple editions, 2023-2025) included 0DTE options in its discussion of derivatives-market risks, though stopped short of recommending regulatory action.  
\- The SEC’s Division of Economic and Risk Analysis reportedly studied 0DTE market dynamics, though as of early 2026 no formal regulatory proposals had emerged.

### 5.2 The Volatility Paradox

The central academic debate can be summarized as “the 0DTE volatility paradox”:

-   **Thesis (volatility suppression)**: On most days, net premium selling in 0DTE options puts dealers into a long-gamma position, causing them to systematically lean against price moves. This dampens realized volatility and creates an abnormally “quiet” intraday environment. Supporting evidence: 2023 and much of 2024 saw unusually low realized volatility relative to implied volatility.
    
-   **Antithesis (volatility amplification)**: On stress days, the dynamic reverses. Customers who are typically sellers become buyers (purchasing protective puts), flipping dealers to short gamma. The same hedging mechanism that suppressed volatility now amplifies it. Furthermore, the sheer size of the 0DTE market means the gamma flip can be enormous. Supporting evidence: Several sharp intraday reversals in 2023-2025 appeared to be exacerbated by 0DTE gamma dynamics.
    
-   **Synthesis (regime-dependent)**: The emerging consensus by 2025-2026 was that 0DTE options create a **bimodal volatility regime** – volatility is compressed most of the time but the tails are fatter. The distribution of daily returns has become more leptokurtic (thinner waist, fatter tails) since the 0DTE expansion, consistent with this synthesis.
    

* * *

## 6\. Sell-Side Research: JPMorgan vs. Goldman Sachs Debate

### 6.1 JPMorgan’s Position (Concern)

JPMorgan, particularly under Marko Kolanovic (who departed in mid-2024) and subsequently through Peng Cheng and the derivatives analytics team, was the most vocal major bank warning about 0DTE risks:

-   **Amplification risk**: JPM argued that 0DTE options created a “hidden accelerant” in markets, where gamma-hedging flows could turn an ordinary dip into a sharp sell-off.
-   **Liquidity illusion**: JPM warned that the apparent liquidity in 0DTE markets was partially illusory – in stress scenarios, market makers would pull back, and the liquidity would evaporate precisely when it was needed most.
-   **Systemic risk**: JPM drew analogies to portfolio insurance in 1987 and the “Volmageddon” of February 2018, arguing that 0DTE created similar self-reinforcing feedback loops.
-   **Quantitative estimates**: JPM’s models suggested that 0DTE gamma-hedging could contribute 50-100+ S&P 500 points of movement on extreme days.

### 6.2 Goldman Sachs’s Position (More Sanguine)

Goldman Sachs took a more measured, sometimes contrarian view:

-   **Net suppressive effect**: Goldman’s analysis of customer flow data consistently showed that the dominant 0DTE participants were premium sellers, meaning the net gamma effect was typically volatility-suppressive.
-   **Market evolution**: Goldman argued that the 0DTE market was a natural evolution of options markets, similar to how weekly options (introduced 2005) initially raised concerns but ultimately contributed to market efficiency.
-   **Diversified participation**: Goldman emphasized that the diverse mix of 0DTE participants (market makers, volatility funds, systematic strategies, overlay programs) reduced the risk of correlated positioning.
-   **Self-correcting mechanism**: Goldman noted that the profitability of 0DTE premium selling was self-limiting – as more sellers entered, premiums compressed, reducing the incentive for incremental selling and naturally limiting the gamma accumulation.

### 6.3 Other Sell-Side Perspectives

-   **Nomura/Charlie McElligott**: Provided extensive commentary on 0DTE gamma dynamics, emphasizing the “dual regime” nature and the importance of tracking net dealer gamma positioning in real time.
-   **Citadel Securities**: As the largest options market maker, Citadel’s perspective (shared through industry conferences) was broadly that 0DTE activity was manageable and that market-making technology had evolved to handle the hedging demands.
-   **Cboe Global Markets**: CBOE, as the exchange operator, published extensive research defending the 0DTE ecosystem, emphasizing the sophistication of participants and the risk-management tools available.

* * *

## 7\. Structural and Systemic Implications

### 7.1 The “Implied Leverage” Problem

One of the most concerning aspects of the 0DTE market is the implied leverage:

-   A 0DTE SPX option 10 points out of the money might trade for $0.50-$2.00, representing notional exposure of ~$500,000 per contract.
-   The leverage ratio can exceed 1000:1 in extreme cases (for deep out-of-the-money options).
-   While individual position sizes may be small, the aggregate notional exposure is enormous. On a high-volume day, the total notional in 0DTE SPX options can approach or exceed the market cap of the S&P 500 itself.

### 7.2 Counterparty and Settlement Risk

-   SPX options are European-style, cash-settled, which mitigates delivery risk.
-   However, the sheer volume of daily settlements creates operational risk. Each trading day now involves the settlement of millions of 0DTE contracts, far exceeding historical norms.
-   The Options Clearing Corporation (OCC) has had to scale its infrastructure to handle the increased settlement volume.

### 7.3 Impact on Longer-Dated Options Markets

The 0DTE explosion has had knock-on effects:

-   **Skew flattening**: The demand for 0DTE puts (used for hedging) has arguably reduced demand for longer-dated protective puts, contributing to flatter skew curves in 30-90 day options.
-   **Term structure effects**: The existence of a liquid daily expiration market has changed how volatility term structures behave, particularly at the short end.
-   **Volatility risk premium**: The 0DTE market has created a new, distinct volatility risk premium (the difference between 0DTE implied vol and subsequent realized vol), which has generally been positive (sellers earn premium) but with significant negative episodes.

### 7.4 The “Tail Wagging the Dog” Concern

Perhaps the most philosophically significant question: have 0DTE options become so large that the derivatives market is now driving the cash equity market, rather than the reverse?

-   On days with heavy 0DTE activity, SPX and S&P 500 futures movements appear to be influenced by options-related hedging flows at least as much as by fundamental news.
-   This creates a potential feedback loop where options pricing and positioning drive equity prices, which in turn affect options pricing.
-   Several market participants and researchers have documented specific intraday episodes where SPX price action appeared to be driven almost entirely by 0DTE gamma dynamics, with no corresponding fundamental catalyst.

* * *

## 8\. The Regulatory Landscape

### 8.1 Current State (Early 2026)

As of early 2026, no major regulatory actions have been taken specifically targeting 0DTE options:

-   The SEC has studied the issue but has not proposed rules.
-   CFTC jurisdiction is not directly implicated (SPX options are securities, not futures).
-   CBOE has implemented margin and position-limit adjustments but no fundamental restrictions.

### 8.2 Regulatory Considerations

Potential regulatory approaches that have been discussed include:

1.  **Enhanced margin requirements** for 0DTE positions, particularly for concentrated short-gamma exposure.
2.  **Position reporting requirements** to improve transparency around aggregate gamma exposure.
3.  **Circuit breaker adjustments** to account for 0DTE-driven amplification effects.
4.  **Inclusion of 0DTE activity in systemic risk monitoring** frameworks.

* * *

## 9\. The Balance Sheet: Does 0DTE Help or Hurt Markets?

### Arguments That 0DTE Is Net Positive:

-   Provides unparalleled hedging precision (hedge specific intraday events like economic releases)
-   Suppresses volatility on most trading days
-   Increases market liquidity and tightens spreads
-   Completes the options maturity spectrum
-   Generates significant revenue for exchanges, brokers, and market makers

### Arguments That 0DTE Is Net Negative:

-   Creates a bimodal volatility regime with fatter tails
-   Introduces a powerful gamma-amplification channel during stress
-   Massive implied leverage with potentially systemic consequences
-   Cash equity market increasingly “wagged” by derivatives flows
-   May create complacency through prolonged low-vol episodes, followed by sharp resets

### The Emerging Consensus View (2025-2026):

The weight of evidence by early 2026 supports a **nuanced middle ground**: 0DTE options have been a net positive for markets in normal conditions (improved liquidity, hedging flexibility, volatility compression) but have increased **tail risk** and made the market more susceptible to sharp, gamma-driven dislocations. The system has not yet been tested by a true systemic shock with the 0DTE market at its current scale, so the full risk profile remains uncertain.

* * *

## 10\. Key Takeaways

1.  **Scale**: 0DTE SPX options grew from ~22% to over 50% of total SPX options volume between early 2022 and 2025, with notional values frequently exceeding the cash equity market.
    
2.  **Participants**: Institutional, not retail. Roughly 93-95% of SPX 0DTE volume is institutional, with net positioning typically favoring premium selling.
    
3.  **Volatility impact**: Bimodal – suppresses volatility most of the time (dealers long gamma), amplifies it during stress (gamma flip). The net effect has been lower average realized vol but fatter tails.
    
4.  **Microstructure**: Measurable changes include compressed midday volatility, elevated final-hour volatility, increased strike pinning, and altered skew dynamics.
    
5.  **Debate**: JPMorgan emphasized the systemic amplification risk; Goldman Sachs emphasized the net suppressive effect. Both were partially right, reflecting different market regimes.
    
6.  **Regulation**: No major action taken through early 2026, though systemic risk monitoring has been enhanced.
    
7.  **Unresolved risk**: The 0DTE market has not been stress-tested by a major systemic event at current scale. The interaction between massive 0DTE gamma exposure and a genuine market crash remains the key unknown.
    

* * *

*This analysis reflects publicly available data, published research, and market analysis through early 2026. Specific volume figures are approximations based on CBOE reports and sell-side estimates, as exact real-time data varies by source and methodology.*
