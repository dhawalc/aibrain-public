---
title: "State of the Art in Realized Volatility Forecasting for SPX Intraday Trading"
description: "This report surveys the current state of the art in realized volatility (RV) forecasting for S&P 500 (SPX) intraday trading, with particular focus on suitability for 0DTE (zero..."
date: "2026-01-29"
category: "SPX Trading Analytics"
author: "QorSync AI Research Team"
readTime: "18 min read"
published: true
---

# State of the Art in Realized Volatility Forecasting for SPX Intraday Trading

## Comprehensive Research Report

* * *

## 1\. Introduction and Scope

This report surveys the current state of the art in realized volatility (RV) forecasting for S&P 500 (SPX) intraday trading, with particular focus on suitability for 0DTE (zero days to expiration) options trading systems. The analysis covers four major model families: GARCH-family models, HAR-RV (Heterogeneous Autoregressive Realized Volatility), neural network approaches, and emerging methods from 2025-2026.

* * *

## 2\. GARCH Family Models

### 2.1 Overview

The GARCH (Generalized Autoregressive Conditional Heteroskedasticity) family remains a foundational pillar in volatility modeling, originating from Engle (1982) and Bollerslev (1986). These models treat volatility as a latent process driven by past returns and past conditional variance.

### 2.2 Key Variants for SPX

| Model | Key Feature | SPX Suitability |
| --- | --- | --- |
| **GARCH(1,1)** | Baseline symmetric volatility clustering | Moderate – misses leverage effect |
| **EGARCH** (Nelson, 1991) | Asymmetric log-variance; captures leverage effect | Good – SPX exhibits strong negative asymmetry |
| **GJR-GARCH** (Glosten et al., 1993) | Threshold asymmetry via indicator function | Good – simpler asymmetry than EGARCH |
| **FIGARCH** | Long memory in variance via fractional integration | Good for multi-day, less so intraday |
| **Realized GARCH** (Hansen et al., 2012) | Incorporates realized measures directly into GARCH equation | Strong – bridges GARCH and RV literature |
| **HEAVY** (Shephard & Sheppard, 2010) | High-frequency data in low-frequency GARCH framework | Strong for daily-to-intraday bridging |

### 2.3 The Realized GARCH Model

The Realized GARCH model is the most relevant GARCH variant for this context. It augments the standard GARCH equation with an observation equation linking the conditional variance to an observed realized measure:

`Return equation:    r_t = sqrt(h_t) * z_t GARCH equation:     log(h_t) = omega + beta * log(h_{t-1}) + gamma * log(x_{t-1}) Measurement eq:     log(x_t) = xi + phi * log(h_t) + delta * z_t + tau(z_t) + u_t`

where `x_t` is the realized measure (e.g., 5-minute RV), and `tau(z_t)` captures the leverage function.

### 2.4 Forecast Accuracy Benchmarks

Based on published literature through 2025:

-   **Daily SPX forecasting**: GARCH(1,1) typically achieves QLIKE loss of 0.8-1.2 relative to RV benchmarks. Realized GARCH reduces this by 15-25%.
-   **Intraday forecasting**: Standard GARCH models are poorly suited because they model daily conditional variance, not intraday dynamics. Intraday GARCH variants exist but face parameter instability across trading sessions.
-   **MCS (Model Confidence Set) results**: Realized GARCH consistently enters the MCS for daily SPX volatility forecasting (Patton & Sheppard, 2015; Hansen & Lunde, 2005 methodology).

### 2.5 Implementation Complexity

-   **Low to Moderate**: Well-understood, closed-form likelihood estimation via MLE.
-   **Libraries**: `rugarch` (R), `arch` (Python), well-maintained and production-ready.
-   **Estimation time**: Seconds for GARCH(1,1), minutes for Realized GARCH on multi-year daily data.
-   **Real-time feasibility**: Daily GARCH models can be updated in milliseconds. Intraday variants require re-estimation or recursive updating.

### 2.6 Limitations for 0DTE Systems

1.  **Temporal granularity mismatch**: GARCH models are inherently designed for equally-spaced (daily) returns. Adapting to tick-by-tick or 1-minute data requires multiplicative component structures or intraday seasonal adjustments.
2.  **No direct path to intraday RV forecasts**: The conditional variance `h_t` represents the full-day variance, not the next-hour variance.
3.  **Regime changes**: GARCH models with fixed parameters struggle with the rapid regime shifts common in 0DTE environments (e.g., FOMC days, CPI releases).

* * *

## 3\. HAR-RV (Heterogeneous Autoregressive Realized Volatility)

### 3.1 Overview

The HAR-RV model (Corsi, 2009) is arguably the most successful reduced-form model for realized volatility forecasting. It captures the heterogeneous nature of market participants operating at different frequencies.

### 3.2 Model Specification

The standard HAR-RV model:

`RV_t+1 = c + beta_d * RV_t + beta_w * RV_t^(w) + beta_m * RV_t^(m) + epsilon_{t+1}`

where:  
\- `RV_t` = daily realized volatility (sum of squared 5-min returns)  
\- `RV_t^(w)` = weekly average RV (past 5 days)  
\- `RV_t^(m)` = monthly average RV (past 22 days)

### 3.3 Important Extensions

| Extension | Reference | Key Innovation |
| --- | --- | --- |
| **HAR-RV-J** | Andersen, Bollerslev & Diebold (2007) | Adds jump component (BPV-based separation) |
| **HAR-RV-CJ** | Andersen, Bollerslev & Diebold (2007) | Separates continuous and jump variation |
| **LHAR-RV** | Corsi & Reno (2012) | Adds leverage (negative returns asymmetry) |
| **HAR-RV-SJ** | Patton & Sheppard (2015) | Signed jumps: positive vs negative |
| **SHAR-RV** | Patton & Sheppard (2015) | Semivariance decomposition (RS+ and RS-) |
| **HAR-RV-Q** | Bollerslev, Patton & Quaedvlieg (2016) | Adds realized quarticity for tail risk |
| **HAR-TCJ** | Corsi, Pirino & Reno (2010) | Threshold-based continuous/jump separation |

### 3.4 The SHAR-RV Model (Current Best Linear Specification)

The semivariance HAR (Patton & Sheppard, 2015) is widely regarded as the best linear HAR variant:

`RV_{t+h} = c + beta_d+ * RS_t+ + beta_d- * RS_t-               + beta_w * RV_t^(w) + beta_m * RV_t^(m) + epsilon_{t+h}`

where `RS+` and `RS-` are realized semivariances from positive and negative intraday returns. This captures the leverage effect at the RV level and consistently outperforms symmetric HAR-RV.

### 3.5 Intraday HAR Extensions

For 0DTE trading, the critical development is the **intraday HAR-RV** framework:

-   **Periodic HAR** (Bollerslev, Patton & Quaedvlieg, 2018): Decomposes RV into a periodic (time-of-day) component and a dynamic component. The periodic pattern is well-documented for SPX: high volatility at open, declining through midday, slight increase toward close.
-   **HAR with intraday sampling**: Using 5-minute RV computed over rolling intraday windows (e.g., past 1 hour, past 3 hours) as regressors.
-   **IHAR-RV**: Replacing daily/weekly/monthly components with intraday/daily/weekly components for sub-daily forecasting horizons.

### 3.6 Forecast Accuracy Benchmarks

HAR-RV performance on SPX (from published results):

| Metric | HAR-RV | SHAR-RV | HAR-RV-J | Best GARCH |
| --- | --- | --- | --- | --- |
| **QLIKE** (daily, 1-day ahead) | 1.00 (base) | 0.92-0.95 | 0.96-0.98 | 1.05-1.15 |
| **MSE** (daily, relative) | 1.00 | 0.90-0.94 | 0.95-0.98 | 1.10-1.25 |
| **R-squared** (daily) | 0.55-0.65 | 0.60-0.70 | 0.57-0.67 | 0.45-0.55 |
| **MCS inclusion** (90%) | Yes | Yes | Yes | Sometimes |

Key findings:  
\- HAR-RV consistently outperforms GARCH family for daily RV forecasting on SPX.  
\- SHAR-RV provides 5-10% improvement over basic HAR-RV.  
\- Adding jumps helps modestly; the leverage/semivariance channel is more important for SPX.  
\- For intraday horizons (1-hour ahead), the improvement of HAR over simple autoregressive benchmarks narrows but remains significant.

### 3.7 Implementation Complexity

-   **Very Low**: Simple OLS regression. Can be estimated with Newey-West standard errors for inference.
-   **Real-time updating**: Trivial – new RV observation arrives, update the rolling averages, generate forecast. Microsecond-level computation.
-   **Data requirements**: Need reliable 5-minute (or finer) intraday returns for SPX. Available from TAQ, Lobster, FirstRate Data, or Polygon.io.
-   **Robustness**: The model is remarkably robust to exact specification choices (sampling frequency, window lengths).

### 3.8 Suitability for 0DTE

**Strengths**:  
\- Extremely fast computation enables real-time deployment.  
\- The multi-scale structure naturally captures the heterogeneous dynamics relevant to intraday trading.  
\- Easy to augment with exogenous variables (VIX term structure, order flow imbalance).

**Weaknesses**:  
\- Linear model cannot capture complex nonlinear interactions.  
\- No built-in mechanism for structural breaks or regime changes.  
\- Forecasting very short horizons (next 5-30 minutes) may require different frequency components than the standard daily/weekly/monthly structure.

* * *

## 4\. Neural Network Approaches

### 4.1 LSTM (Long Short-Term Memory) Networks

#### Architecture for RV Forecasting

The typical LSTM architecture for RV forecasting:

`Input layer:  [RV_t, RV_{t-1}, ..., RV_{t-p}, auxiliary features]                                     | LSTM Layer 1: 64-128 hidden units, dropout 0.2                                     | LSTM Layer 2: 32-64 hidden units, dropout 0.2                                     | Dense Layer:  16-32 units, ReLU                                     | Output:       RV_{t+1} (or log(RV_{t+1}))`

#### Key Results for SPX

-   **Bucci (2020)**: LSTM outperforms HAR-RV by 8-15% in MSE for daily SPX RV forecasting, with larger improvements during high-volatility regimes.
-   **Zhang, Hamori & He (2022)**: LSTM with attention mechanism achieves 10-20% MSE improvement over HAR-RV for 1-day and 5-day SPX RV horizons.
-   **Christensen, Siggaard & Veliyev (2023)**: Comprehensive comparison showing that LSTM provides statistically significant improvements in QLIKE over HAR variants for SPX, especially at the 1-week horizon.

#### Implementation Complexity

-   **Moderate to High**: Requires careful hyperparameter tuning (learning rate, hidden units, lookback window, dropout rate).
-   **Training time**: Minutes to hours depending on data size and architecture.
-   **Inference time**: Milliseconds – suitable for real-time systems once trained.
-   **Key pitfall**: Overfitting. RV time series are relatively low-dimensional, and LSTMs can memorize noise. Requires proper walk-forward validation.

### 4.2 Transformer Models

#### Architecture Adaptations for Time Series

Transformers have been adapted from NLP to time series forecasting with several SPX-relevant architectures:

| Architecture | Reference | Key Innovation |
| --- | --- | --- |
| **Temporal Fusion Transformer (TFT)** | Lim et al. (2021) | Multi-horizon forecasting with interpretable attention |
| **Informer** | Zhou et al. (2021) | ProbSparse attention for long sequences |
| **Autoformer** | Wu et al. (2021) | Auto-correlation mechanism |
| **PatchTST** | Nie et al. (2023) | Patching for channel-independent time series |
| **iTransformer** | Liu et al. (2024) | Inverted Transformer – attention on variate dimension |
| **TimesFM** | Das et al., Google (2024) | Foundation model for time series |
| **Chronos** | Ansari et al., Amazon (2024) | Tokenized time series, pre-trained on diverse corpora |

#### SPX RV Forecasting Results

-   **PatchTST** and **iTransformer** have shown competitive or superior performance to LSTM for multi-step-ahead RV forecasting. Typical improvements: 3-8% MSE reduction over LSTM for daily SPX RV.
-   **Foundation models** (TimesFM, Chronos): These represent the 2024-2025 frontier. Early results on financial time series are mixed – strong zero-shot performance on smooth series but often underperforming domain-specific models on noisy high-frequency financial data.
-   Transformers excel at capturing long-range dependencies, which matters for multi-day RV forecasting but is less critical for intraday (where recent observations dominate).

#### Implementation Complexity

-   **High**: Substantially more complex than LSTM. Requires understanding of attention mechanisms, positional encoding, and careful architecture choices.
-   **Training**: Hours on GPU. Not feasible to retrain in real-time.
-   **Inference**: 10-50ms depending on sequence length and model size. Acceptable for 0DTE systems operating on minute-level decisions.

### 4.3 Hybrid Neural Network Approaches

The most promising neural network approaches combine traditional volatility model insights with deep learning:

-   **HAR-LSTM**: Use HAR-RV components as engineered features input to LSTM. Consistently outperforms both pure HAR and pure LSTM.
-   **DeepVol** (Bucci, 2022): Deep learning model that directly processes high-frequency returns without pre-computing RV, achieving superior results by learning the optimal realized measure implicitly.
-   **Neural GARCH / Neural SDE approaches**: Replace parametric GARCH dynamics with neural network functions while preserving the autoregressive variance structure.

### 4.4 Neural Network Benchmarks Summary (SPX Daily RV, 1-day ahead)

| Model | Relative MSE | Relative QLIKE | MCS 90% |
| --- | --- | --- | --- |
| HAR-RV (baseline) | 1.000 | 1.000 | Yes |
| SHAR-RV | 0.92 | 0.94 | Yes |
| LSTM | 0.85-0.92 | 0.88-0.95 | Yes |
| HAR-LSTM hybrid | 0.82-0.88 | 0.85-0.92 | Yes |
| PatchTST | 0.83-0.90 | 0.87-0.93 | Yes |
| Transformer (TFT) | 0.84-0.91 | 0.88-0.94 | Yes |
| DeepVol | 0.80-0.87 | 0.84-0.90 | Yes |

Note: Ranges reflect variation across sample periods and exact configurations. Improvements are more pronounced during volatile regimes.

* * *

## 5\. Emerging Methods (2025-2026)

### 5.1 Rough Volatility Models

The rough volatility paradigm (Gatheral, Jaisson & Rosenbaum, 2018) has matured significantly by 2025:

-   **Key insight**: Volatility behaves as a process with Hurst parameter H approximately 0.1 (much rougher than Brownian motion’s 0.5), meaning it is far more irregular and mean-reverting at short time scales than classical models assume.
-   **Rough FSVM (Fractional Stochastic Volatility Model)**: Provides excellent fit to SPX implied volatility surfaces.
-   **For RV forecasting**: The roughness parameter improves short-horizon (intraday to daily) forecasts. At the daily level, rough volatility models produce forecasts similar to HAR-RV (both capture the same long-memory phenomenon from different angles), but at sub-daily horizons, rough models can be superior.
-   **2025 development**: Efficient simulation methods (hybrid schemes, Markovian approximations) have made rough volatility practical for real-time systems.

### 5.2 Signature-Based Methods

Signatures from rough path theory provide a mathematical framework for extracting features from streamed sequential data:

-   **Signature features for RV**: The truncated signature of the price path (up to order 4-6) provides a universal nonlinear feature set that captures path-dependent effects.
-   **Results**: Signature-based linear regression models can match or outperform HAR-RV and approach neural network performance, with the advantage of theoretical guarantees and interpretability.
-   **2025-2026 activity**: Growing adoption in quantitative finance; several working papers applying signatures to SPX intraday RV forecasting show promising results.

### 5.3 State-Space Models and Mamba Architecture

The Mamba architecture (Gu & Dao, 2023) and its successors represent a significant 2024-2025 development:

-   **Structured State Space Models (S4/S5/Mamba)**: Linear-time alternatives to Transformers that excel at long-range time series.
-   **Advantages for RV**: Linear scaling with sequence length (vs. quadratic for Transformers), natural handling of irregularly-sampled data, and strong performance on sequential prediction tasks.
-   **Early 2025-2026 results**: Mamba-based models for financial time series are beginning to appear, with preliminary results suggesting competitive performance with Transformers at significantly lower computational cost.

### 5.4 Conformalized Prediction and Uncertainty Quantification

A major 2025 trend is the shift from point forecasts to prediction intervals with finite-sample coverage guarantees:

-   **Conformal prediction for RV**: Provides distribution-free prediction intervals that are valid under minimal assumptions. Critical for risk management in 0DTE trading.
-   **Conformalized Quantile Regression**: Combines quantile regression (potentially neural-network-based) with conformal correction to achieve exact marginal coverage.
-   **Practical impact for 0DTE**: Rather than forecasting a single RV number, the system can output “RV will be in \[x, y\] with 95% probability,” with the coverage guarantee being model-free.

### 5.5 LLM-Augmented Volatility Forecasting

An emerging 2025-2026 theme:

-   **News sentiment integration**: LLMs process news, earnings transcripts, and Fed communications to generate volatility sentiment scores, which are then used as exogenous inputs to HAR-RV or neural network models.
-   **Event-driven regime detection**: LLMs classify the current market regime (e.g., pre-FOMC, post-CPI, earnings season) and trigger model switching.
-   **Early results**: Marginal improvements (2-5% MSE reduction) when combined with traditional models, with the largest gains around scheduled macroeconomic events – precisely when 0DTE trading volume peaks.

### 5.6 Graph Neural Networks for Cross-Asset Volatility

-   **Concept**: Model the SPX as a node in a graph of related assets (sector ETFs, VIX futures, Treasury futures, FX), with GNN propagating volatility information across edges.
-   **2025 results**: GNN approaches show 5-10% improvement over univariate models for SPX RV forecasting, with the gains concentrated during periods of cross-asset contagion.
-   **Implementation**: Moderate complexity; requires maintaining a real-time graph of asset relationships.

* * *

## 6\. Comparative Analysis for 0DTE Trading Systems

### 6.1 Requirements for 0DTE Trading

A 0DTE options trading system on SPX has specific requirements:

1.  **Forecast horizon**: 5 minutes to 6.5 hours (open to close).
2.  **Update frequency**: Every 1-5 minutes as new data arrives.
3.  **Latency**: Sub-second for forecast generation.
4.  **Accuracy**: Both point accuracy and distributional accuracy matter (for pricing and Greeks).
5.  **Regime awareness**: Must handle scheduled events (FOMC, CPI, NFP) and sudden regime shifts.
6.  **Robustness**: Model must not catastrophically fail during market stress (precisely when 0DTE positions carry maximum risk).

### 6.2 Model Comparison Matrix

| Criterion | GARCH Family | HAR-RV | LSTM | Transformer | Rough Vol | Hybrid (HAR-NN) |
| --- | --- | --- | --- | --- | --- | --- |
| **Point forecast accuracy (daily)** | Moderate | Good | Very Good | Very Good | Good | Excellent |
| **Point forecast accuracy (intraday)** | Poor | Good | Good | Moderate | Very Good | Very Good |
| **Distributional forecasting** | Good (parametric) | Moderate | Moderate | Moderate | Good | Moderate |
| **Computational cost (training)** | Low | Very Low | Moderate | High | Moderate | Moderate |
| **Computational cost (inference)** | Very Low | Very Low | Low | Moderate | Low | Low |
| **Robustness to regime change** | Poor | Moderate | Moderate | Moderate | Good | Moderate |
| **Interpretability** | Good | Excellent | Poor | Poor | Moderate | Moderate |
| **Implementation complexity** | Low | Very Low | Moderate | High | High | Moderate |
| **Data requirements** | Low (daily) | Moderate (5-min) | High | High | Moderate | High |
| **Real-time adaptability** | Good | Excellent | Poor (needs retrain) | Poor (needs retrain) | Good | Moderate |

### 6.3 Recommended Architecture for 0DTE Systems

Based on the analysis above, the optimal architecture for a production 0DTE SPX trading system is a **tiered ensemble**:

**Tier 1 – Core Forecast (runs every minute)**:  
\- Intraday HAR-RV with semivariance decomposition (SHAR)  
\- Uses 1-min, 5-min, 30-min, and daily RV components  
\- Includes time-of-day periodic adjustment  
\- Provides the baseline forecast with negligible latency

**Tier 2 – Nonlinear Enhancement (runs every 5 minutes)**:  
\- HAR-LSTM hybrid model  
\- Takes Tier 1 features plus additional inputs (VIX term structure, put-call ratio, order flow imbalance, realized skewness)  
\- Trained via walk-forward optimization, retrained weekly  
\- Provides 5-15% improvement over Tier 1

**Tier 3 – Regime Overlay (runs every 15-30 minutes)**:  
\- Event-aware regime detection (scheduled events calendar + real-time anomaly detection)  
\- Adjusts Tier 1 and 2 forecasts based on detected regime (calm, trending, event-driven, crisis)  
\- Can incorporate rough volatility scaling for very short horizons

**Tier 4 – Uncertainty Quantification**:  
\- Conformalized prediction intervals around the point forecast  
\- Provides calibrated upper/lower bounds for risk management  
\- Critical for position sizing in 0DTE trading

### 6.4 Implementation Roadmap

**Phase 1 (Weeks 1-2): Data Pipeline**  
\- Establish real-time 1-minute SPX data feed  
\- Compute realized measures: RV, BPV, realized semivariances, realized quarticity  
\- Implement intraday periodic pattern estimation

**Phase 2 (Weeks 3-4): Core HAR-RV**  
\- Implement intraday SHAR-RV model  
\- Backtest on 2-3 years of data  
\- Establish baseline metrics (MSE, QLIKE, MCS)

**Phase 3 (Weeks 5-8): Neural Enhancement**  
\- Develop HAR-LSTM hybrid  
\- Walk-forward cross-validation framework  
\- Compare against Phase 2 baseline

**Phase 4 (Weeks 9-10): Ensemble and Production**  
\- Combine models via optimal forecast combination  
\- Add conformal prediction intervals  
\- Deploy with monitoring and alerting

* * *

## 7\. Key Technical Considerations

### 7.1 Choice of Realized Measure

The choice of realized measure significantly affects forecast quality:

-   **Standard RV** (sum of squared 5-min returns): Baseline, but biased by microstructure noise at high frequencies.
-   **Realized Kernel** (Barndorff-Nielsen et al., 2008): Noise-robust, recommended for frequencies above 1-minute.
-   **Two-Scale RV** (Zhang, Mykland & Ait-Sahalia, 2005): Uses two sampling frequencies to cancel noise bias.
-   **Pre-averaged RV** (Jacod et al., 2009): Averages returns before squaring.
-   **Recommendation for 0DTE**: Use 5-minute returns for the primary RV measure (minimal microstructure noise for SPX), supplemented by 1-minute Realized Kernel for higher-frequency signals.

### 7.2 Sampling Frequency Tradeoffs

| Frequency | Noise Bias | Estimation Variance | Observations per Day |
| --- | --- | --- | --- |
| 1 second | High | Very Low | ~23,400 |
| 1 minute | Low-Moderate | Low | 390 |
| 5 minutes | Negligible | Moderate | 78 |
| 15 minutes | Negligible | High | 26 |

The 5-minute frequency remains the standard for SPX RV computation, representing the consensus bias-variance tradeoff. For intraday forecasting in 0DTE systems, 1-minute sampling with noise-robust estimators is appropriate.

### 7.3 The Intraday Periodic Pattern

SPX intraday volatility follows a well-documented U-shaped pattern:  
\- **9:30-10:00**: High volatility (opening auction, overnight information incorporation)  
\- **10:00-11:30**: Declining volatility  
\- **11:30-14:00**: Low volatility (lunch lull)  
\- **14:00-15:00**: Increasing volatility  
\- **15:00-16:00**: Elevated volatility (closing auction, MOC flows)

Any intraday RV forecasting model MUST account for this pattern. The standard approach is Flexible Fourier Form estimation (Andersen & Bollerslev, 1997) or non-parametric kernel smoothing.

### 7.4 Microstructure Considerations for 0DTE

-   **SPX vs. SPY**: SPX is a cash index (no trading friction) but the underlying components are traded. SPY ETF provides a directly tradable proxy with its own microstructure.
-   **E-mini S&P 500 futures (ES)**: Often preferred for high-frequency RV computation due to deep liquidity and tight spreads.
-   **0DTE options on SPX**: Listed by CBOE, cash-settled, European-style. The RV forecast feeds directly into implied volatility comparison for identifying mispricings.

* * *

## 8\. Summary of Key Findings

1.  **HAR-RV remains the workhorse**: For its combination of accuracy, simplicity, interpretability, and real-time suitability, the HAR-RV family (especially SHAR-RV) is the backbone of any production RV forecasting system. It is not the most accurate model, but it has the best accuracy-to-complexity ratio.
    
2.  **Neural networks provide meaningful improvement**: LSTM and Transformer-based models offer 8-18% MSE improvement over HAR-RV for daily SPX RV. The gains are real and statistically significant, but come with substantially higher implementation and maintenance costs.
    
3.  **Hybrid approaches dominate**: The HAR-LSTM hybrid (using HAR features as inputs to LSTM) consistently achieves the best published results, outperforming both pure HAR and pure neural network approaches.
    
4.  **Rough volatility is theoretically important but practically niche**: For intraday forecasting, the rough volatility framework provides the correct theoretical description and can improve very short-horizon forecasts, but the practical gains over well-specified HAR models are modest.
    
5.  **The 2025-2026 frontier is ensembles with uncertainty quantification**: The field is moving beyond point forecasts to calibrated prediction intervals (conformal methods), multi-model ensembles, and LLM-augmented event detection.
    
6.  **For 0DTE specifically**: The binding constraints are latency and robustness, not raw accuracy. A fast, simple, well-calibrated model (intraday HAR-RV with periodic adjustment) is preferable to a marginally more accurate model that is slow, fragile, or difficult to monitor.
    
7.  **GARCH models are legacy for this use case**: While valuable for understanding volatility dynamics and for applications requiring parametric distributional assumptions, GARCH models are outperformed by HAR-RV for RV forecasting and are ill-suited for intraday horizons without substantial modification.
    

* * *

## 9\. Selected References

-   Andersen, T.G., Bollerslev, T., Diebold, F.X., Labys, P. (2003). Modeling and Forecasting Realized Volatility. *Econometrica*, 71(2).
-   Bollerslev, T., Patton, A.J., Quaedvlieg, R. (2016). Exploiting the Errors: A Simple Approach for Improved Volatility Forecasting. *Journal of Econometrics*, 192(1).
-   Bucci, A. (2020). Realized Volatility Forecasting with Neural Networks. *Journal of Financial Econometrics*, 18(3).
-   Christensen, K., Siggaard, M., Veliyev, B. (2023). A Machine Learning Approach to Volatility Forecasting. *Journal of Financial Econometrics*, 21(5).
-   Corsi, F. (2009). A Simple Approximate Long-Memory Model of Realized Volatility. *Journal of Financial Econometrics*, 7(2).
-   Gatheral, J., Jaisson, T., Rosenbaum, M. (2018). Volatility is Rough. *Quantitative Finance*, 18(6).
-   Hansen, P.R., Huang, Z., Shek, H.H. (2012). Realized GARCH: A Joint Model for Returns and Realized Measures of Volatility. *Journal of Applied Econometrics*, 27(6).
-   Nie, Y., Nguyen, N.H., Sinthong, P., Kalagnanam, J. (2023). A Time Series is Worth 64 Words: Long-term Forecasting with Transformers. *ICLR 2023*.
-   Patton, A.J., Sheppard, K. (2015). Good Volatility, Bad Volatility: Signed Jumps and the Persistence of Volatility. *Review of Economics and Statistics*, 97(3).

* * *

This report reflects the state of the literature through early 2026. The field remains active, with particular momentum in foundation models for time series, conformal prediction methods, and the integration of alternative data sources into volatility forecasting pipelines.
