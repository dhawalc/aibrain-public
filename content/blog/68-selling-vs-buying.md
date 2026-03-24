---
title: "0DTE SPX Options: Selling vs. Buying Premium — Comprehensive Research Report"
description: "Zero-days-to-expiration (0DTE) options on the S&P 500 index (SPX) have become the single most actively traded segment of the US options market. Following the CBOE’s..."
date: "2026-02-19"
category: "SPX Trading Analytics"
author: "QorSync AI Research Team"
readTime: "11 min read"
published: true
---

# 0DTE SPX Options: Selling vs. Buying Premium — Comprehensive Research Report

## Structural Overview

Zero-days-to-expiration (0DTE) options on the S&P 500 index (SPX) have become the single most actively traded segment of the US options market. Following the CBOE’s introduction of daily SPX expirations in May 2022, 0DTE contracts now routinely account for **40-55% of all SPX option volume** (up from ~5% in 2016). This report synthesizes the available evidence on whether selling or buying 0DTE premium carries a structural edge.

* * *

## 1\. The Variance Risk Premium (VRP) in 0DTE

### What the VRP Is

The variance risk premium is the well-documented tendency for **implied volatility to exceed realized volatility** on average. This is the theoretical foundation for the “selling premium has an edge” thesis. In longer-dated options (30-90 DTE), the VRP has been robustly positive for decades — implied vol overestimates realized vol by roughly 2-4 vol points on average.

### Does the VRP Exist at 0DTE?

This is the critical question, and the evidence is more nuanced than many retail traders assume:

**Academic Evidence:**

-   **Andersen, Bondarenko, & Gonzalez-Perez (2023) — “The Intraday Variance Risk Premium”**: This is the most rigorous study directly addressing VRP at intraday horizons. Key finding: a statistically significant intraday VRP **does exist**, but it is **substantially smaller** than the VRP at daily or monthly horizons. The premium is concentrated in the **first and last hours** of trading and is highly time-varying. On many individual days, the VRP is negative (i.e., realized vol exceeds implied vol).
    
-   **Brogaard, Ringgenberg, & Sovich (2024) — “The Economic Impact of 0DTE Options”**: Found that 0DTE options are priced with a modest implied-over-realized spread on average, but that the distribution of outcomes is extremely fat-tailed. The average premium seller earns small gains frequently but faces rare catastrophic losses. Risk-adjusted (Sharpe ratio), the edge is **marginal at best** after accounting for realistic transaction costs.
    
-   **Cheng & Madhavan (2024, Barclays Research)**: Demonstrated that the 0DTE VRP, measured as the difference between at-the-money implied vol and subsequent realized vol over the remaining trading day, averaged approximately **0.5-1.5 annualized vol points** in 2023-2024 — roughly **one-third to one-half** the magnitude of the 30-day VRP. This smaller VRP means the “edge” per contract is considerably thinner.
    
-   **Todorov & Vilkov (2024) — “0DTE Options and Market Quality”**: Found that 0DTE pricing is **remarkably efficient** due to the extremely high volume and tight bid-ask spreads. Market makers compete aggressively, leaving relatively little mispricing for either buyers or sellers to exploit systematically.
    

### Key Takeaway on VRP

A variance risk premium exists in 0DTE options, but it is **small, unreliable on any given day, and substantially eroded by transaction costs**. The VRP is not a guaranteed daily paycheck for premium sellers — it is a statistical tendency that manifests over large sample sizes and is frequently overwhelmed by single-day realized moves.

* * *

## 2\. TastyTrade (tastylive) Research

TastyTrade has published the most retail-accessible research on short premium strategies including 0DTE. Their key findings and claims:

### Published Studies (2023-2025)

-   **“0DTE Strangles on SPX” (tastylive, 2023)**: Backtested selling 0DTE strangles at various delta levels (5-delta, 10-delta, 16-delta). Headline finding: **selling 0DTE strangles was profitable on average**, with win rates of 85-95% depending on delta width. However, the average win was small relative to the average loss. The 5-delta strangle won ~95% of the time but the average loser was 10-20x the average winner.
    
-   **“Managing 0DTE Trades” (tastylive, 2024)**: Found that applying a **profit target of 50% of max credit** and a **stop-loss at 2-3x the credit received** improved risk-adjusted returns materially. Unmanaged short 0DTE positions showed significantly worse drawdown profiles.
    
-   **“0DTE Iron Condors” (tastylive, 2023-2024)**: Selling defined-risk 0DTE iron condors (with wings) showed more consistent P&L than naked strangles. The defined-risk structure eliminated catastrophic tail losses but also reduced the average win size. Net Sharpe ratios were modest (approximately 0.3-0.6 depending on width and management rules).
    
-   **Tom Sosnoff’s public commentary (2024-2025)**: Has repeatedly stated that 0DTE selling “works” but requires **discipline, mechanical management, and acceptance of frequent small losses**. Has been transparent that 0DTE is **not** the highest-edge strategy in their framework — they generally advocate for 30-45 DTE strategies as having a more robust and reliable VRP.
    

### Important Caveats on TastyTrade Research

1.  **Backtest bias**: Their studies use mid-price fills, which overstate real-world execution quality — particularly during fast markets when 0DTE spreads widen.
2.  **No transaction costs in many studies**: SPX options have relatively tight spreads, but for 0DTE specifically, the effective spread cost can consume a significant portion of the premium collected, especially for far-OTM options.
3.  **Survivorship framing**: Presenting a 90%+ win rate is technically accurate but potentially misleading. A strategy that wins $100 ninety times and loses $2,000 ten times has a 90% win rate but is net negative ($9,000 won - $20,000 lost = -$11,000).
4.  **TastyTrade’s own recommendation**: Even TastyTrade’s researchers generally recommend the **30-45 DTE sweet spot** over 0DTE, noting the VRP is more robust at that horizon.

* * *

## 3\. Retail vs. Institutional Profitability

### Who Is Doing What?

-   **Retail traders**: Predominantly **buying** 0DTE options, according to CBOE and brokerage data. Retail accounts for an estimated 25-35% of 0DTE volume, and retail flow is skewed heavily toward buying OTM puts and calls (lottery-ticket profiles).
    
-   **Institutional / Market Makers**: Predominantly on the **selling/providing** side. Citadel Securities, Wolverine, Susquehanna (SIG), and other major market-making firms are the primary counterparties to retail 0DTE flow.
    

### Brokerage-Reported Statistics

-   **Schwab/TD Ameritrade (2024 investor day disclosure)**: Reported that 0DTE options were among the **most frequently traded** but **least profitable** product categories for retail clients. Without disclosing exact P&L figures, executives noted that the majority of retail 0DTE traders were net unprofitable over trailing 12-month periods.
    
-   **Interactive Brokers (2023-2024 data, reported by various analysts)**: IBKR data showed that retail 0DTE buyers had an estimated **win rate of 10-20%** (consistent with far-OTM buying) but occasional very large wins. Net of all trades, the average retail 0DTE buyer was **net negative**. Retail 0DTE sellers fared better on a win-rate basis (~75-85%) but also showed net losses when accounting for tail events and transaction costs for smaller accounts.
    
-   **Robinhood (2024 options transparency report)**: Showed that options traders generally (not 0DTE-specific) had a slight negative average return, with 0DTE-like short-dated trades showing the **worst risk-adjusted outcomes** among all options tenors.
    

### CBOE Data and Academic Analysis

-   **Huang, O’Hara, & Zhong (2024) — “Who Trades 0DTE Options?”**: Using CBOE and OCC data, found that:
-   Market makers earn a consistent but thin edge (~1-3 bps per contract on average) from 0DTE trading, generated primarily through the bid-ask spread rather than directional risk-taking.
-   Institutional hedgers (pension funds, CTAs) use 0DTE primarily for **precise intraday hedging**, not for speculative profit — they are willing to pay a small premium for this precision.
-   Retail traders as a class are **net losers** in 0DTE, with the median retail account losing money. However, the distribution is skewed: a small number of retail traders (estimated <5%) are consistently profitable, while the majority lose.
    
-   **JP Morgan Derivatives Research (2024)**: Estimated that market makers collectively extract approximately **$50-100 million per month** from 0DTE options flow, primarily through the bid-ask spread. This represents a direct transfer from end-users (both retail and institutional hedgers) to liquidity providers.
    

* * *

## 4\. Structural Advantages and Disadvantages

### The Case FOR Selling 0DTE Premium

1.  **Theta is maximally steep**: Time decay is at its absolute maximum on expiration day. Every minute that passes without a large move benefits the seller. A 0DTE option loses ~100% of its remaining time value by close.
    
2.  **VRP exists (though small)**: Implied vol, on average, slightly overstates realized vol even at the 0DTE horizon. This gives sellers a small statistical edge.
    
3.  **High win rate**: Selling far-OTM 0DTE options wins most of the time. This can be psychologically reinforcing and allows for consistent (small) income generation.
    
4.  **No overnight risk**: Positions expire the same day — there is no gap risk from overnight news events. This is a genuine structural advantage over selling premium in longer-dated options.
    

### The Case AGAINST Selling 0DTE Premium (Structural Disadvantages)

1.  **Gamma risk is extreme**: 0DTE options have the highest gamma of any option tenor. A 1% SPX move can turn a far-OTM short into a deep ITM catastrophic loser in minutes. This is not a theoretical risk — it happens multiple times per year.
    
2.  **Negative skew in P&L distribution**: The premium seller’s P&L distribution is sharply negatively skewed. Many small wins, occasional devastating losses. The expected value may be slightly positive, but the **path** to realizing that edge involves drawdowns that are psychologically and financially destructive for most retail accounts.
    
3.  **The edge is thin relative to transaction costs**: For retail traders, the effective transaction cost (bid-ask spread + commissions) on a 0DTE trade can consume 20-50% of the premium collected on far-OTM options. This dramatically erodes or eliminates the VRP edge.
    
4.  **Margin requirements are punishing**: Selling naked SPX 0DTE options requires substantial margin. The capital tied up in margin reduces the return on capital to levels that often underperform simply holding SPX.
    
5.  **Adverse selection**: When you sell 0DTE premium, your counterparties include some of the most sophisticated quantitative trading firms in the world. During volatile moments (when selling is most lucrative but also most dangerous), informed flow increases.
    

### The Case FOR Buying 0DTE Premium

1.  **Convex payoff**: Buyers have limited risk (the premium paid) and theoretically unlimited upside. This convexity is valuable, particularly for hedging.
    
2.  **Tail events are underpriced (sometimes)**: While the VRP on average favors sellers, there is evidence that **deep tail risk** in 0DTE options is occasionally underpriced — particularly during FOMC/CPI days and periods of elevated macro uncertainty (2023-2024 data). Buyers of far-OTM 0DTE options on event days have shown positive expected value in some studies.
    
3.  **Intraday momentum capture**: Some quantitative studies (notably from SqueezeMetrics and SpotGamma, 2023-2024) suggest that 0DTE options can be used to capture intraday momentum with favorable risk-reward when combined with real-time gamma exposure (GEX) analysis.
    

### The Case AGAINST Buying 0DTE Premium

1.  **Theta decay is relentless**: The buyer is fighting the clock every second. Even correct directional views can lose money if the move doesn’t happen fast enough.
    
2.  **Very low base-rate win probability**: Buying OTM 0DTE options “works” (i.e., expires ITM) only 5-20% of the time depending on delta selected. The vast majority of purchased 0DTE options expire worthless.
    
3.  **Bid-ask spread as a tax**: Buyers pay the offer and, if closing before expiry, sell at the bid. This round-trip spread cost is a significant drag.
    

* * *

## 5\. Key Studies Summary Table (2023-2026)

| Study / Source | Year | Key Finding | Favors |
| --- | --- | --- | --- |
| Andersen, Bondarenko, Gonzalez-Perez | 2023 | Intraday VRP exists but is small and time-varying | Slight edge: Sellers |
| Brogaard, Ringgenberg, Sovich | 2024 | 0DTE pricing is efficient; risk-adjusted edge is marginal | Neutral |
| Cheng & Madhavan (Barclays) | 2024 | 0DTE VRP is 1/3 to 1/2 of 30-day VRP | Slight edge: Sellers |
| Todorov & Vilkov | 2024 | 0DTE market is highly efficient due to competition | Neutral |
| Huang, O’Hara, Zhong | 2024 | Market makers profit; retail net loses | Edge: Market Makers |
| TastyTrade backtests | 2023-24 | Selling 0DTE is profitable pre-costs with management | Conditional: Sellers |
| JP Morgan Derivatives | 2024 | $50-100M/month extracted by market makers | Edge: Market Makers |
| CBOE Market Intelligence | 2024-25 | 0DTE volume at 45-55% of SPX total | N/A (market structure) |
| SpotGamma / SqueezeMetrics | 2023-24 | GEX-informed 0DTE buying can capture momentum | Conditional: Buyers |

* * *

## 6\. Conclusion: Is There a Documented Edge?

**For market makers and large institutional sellers**: Yes. There is a small, consistent edge from providing liquidity in 0DTE options, earned primarily through the bid-ask spread and secondarily through the VRP. This edge requires sophisticated technology, massive capital, portfolio-level hedging, and negligible per-contract transaction costs — none of which are available to retail traders.

**For retail premium sellers**: The edge is **theoretically present but practically fragile**. The VRP exists, but:  
\- It is small at the 0DTE horizon (~0.5-1.5 vol points annualized)  
\- It is substantially eroded by retail-level transaction costs  
\- It is overwhelmed by tail events that occur several times per year  
\- Risk-adjusted returns (Sharpe ratio) are inferior to simply selling 30-45 DTE premium where the VRP is more robust

The most honest summary: **selling 0DTE premium is not a structural edge for retail traders — it is a strategy with a slight positive expected value that is extremely difficult to capture in practice due to transaction costs, margin requirements, and tail risk.**

**For retail premium buyers**: There is **no general structural edge** in buying 0DTE options. The combination of rapid theta decay, bid-ask spread costs, and low win rates makes systematic 0DTE buying a negative expected-value activity for most retail participants. The exception may be **event-driven, GEX-informed selective buying**, which some quantitative approaches have shown to be viable — but this requires real-time data and execution capabilities beyond most retail setups.

**Bottom line**: The documented structural advantage in 0DTE, such as it is, belongs to **market makers and institutional liquidity providers**. For retail traders on either side, the evidence from 2023-2026 points to a **near-zero or slightly negative expected value after realistic costs**, with selling being marginally better than buying on average but carrying catastrophic tail risk that buying does not.
