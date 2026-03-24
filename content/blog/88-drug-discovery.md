---
title: "AI Breakthroughs in Drug Discovery and Protein Design (2025–2026)"
description: "AlphaFold 3, published in Nature in May 2024, represented a major leap beyond its predecessor. While AlphaFold 2 predicted individual protein structures, AlphaFold 3 models the..."
date: "2026-03-12"
category: "AI Breakthroughs"
author: "QorSync AI Research Team"
readTime: "13 min read"
published: true
---

# AI Breakthroughs in Drug Discovery and Protein Design (2025–2026)

## A Comprehensive Research Report

* * *

## 1\. AlphaFold 3 and Its Successors

### AlphaFold 3 (DeepMind / Isomorphic Labs)

AlphaFold 3, published in *Nature* in May 2024, represented a major leap beyond its predecessor. While AlphaFold 2 predicted individual protein structures, AlphaFold 3 models the interactions between proteins and other biomolecules — including DNA, RNA, small-molecule ligands, ions, and post-translational modifications. It uses a diffusion-based architecture to predict the joint 3D structure of molecular complexes rather than individual chains.

**Key capabilities introduced:**  
\- Prediction of protein–ligand binding poses with accuracy rivaling or exceeding traditional docking tools for many targets.  
\- Protein–nucleic acid complex prediction, enabling work in gene regulation and RNA biology.  
\- Antibody–antigen interface modeling, relevant to therapeutic antibody design.  
\- A unified architecture that handles heterogeneous molecular inputs (proteins, nucleic acids, small molecules, ions) in a single forward pass.

**Open-source developments:** In late 2024, DeepMind released the AlphaFold 3 model weights and inference code under an updated license, significantly broadening academic access. The AlphaFold Server (online tool) had already been available, but local inference enabled much larger-scale studies.

**Limitations acknowledged by the community:** AlphaFold 3’s ligand pose predictions, while impressive, are not yet reliable enough to fully replace physics-based free energy perturbation (FEP) methods for lead optimization. Confidence calibration for binding affinity (as opposed to structure) remains an open problem. The model can hallucinate plausible-looking but incorrect binding modes, particularly for novel chemotypes not well-represented in the PDB.

### AlphaFold Successors and Extensions (2025–2026)

Throughout 2025, DeepMind and Isomorphic Labs signaled work on next-generation models that go beyond static structure prediction:

-   **Conformational ensemble prediction:** Multiple groups, including DeepMind-affiliated researchers, published work on predicting not just a single structure but distributions of conformations — critical for understanding allosteric mechanisms and intrinsically disordered regions.
-   **AlphaFold-based virtual screening at scale:** Isomorphic Labs disclosed integration of AlphaFold 3-level predictions into ultra-large virtual screening campaigns (hundreds of millions of compounds), combined with proprietary scoring functions. This was presented at multiple conferences in 2025.
-   **Boltz-1 and community alternatives:** The open-source community responded with Boltz-1 (from MIT/Harvard groups) and OpenFold3 efforts, aiming to replicate and extend AlphaFold 3 capabilities with fully open weights and training code. Boltz-1 achieved competitive accuracy on protein–ligand complex prediction benchmarks by mid-2025.

* * *

## 2\. RFDiffusion and Generative Protein Design

### RFDiffusion (Baker Lab, University of Washington)

RFDiffusion, published by the David Baker laboratory in *Nature* in 2023, applies denoising diffusion probabilistic models to protein backbone generation. It can design entirely new protein structures conditioned on functional constraints — for example, generating a protein that binds a specified molecular surface or scaffolds a particular functional motif.

**2025–2026 progress:**

-   **RFDiffusion All-Atom (RFDiffusionAA):** An extension to handle explicit small-molecule and cofactor placement during protein design. This enables co-design of a protein and its binding pocket geometry around a ligand, published in early 2025.
-   **Experimental validation rates:** Multiple groups reported that RFDiffusion-designed binders achieve experimental binding confirmation rates of 10–30% without extensive optimization — a dramatic improvement over pre-AI computational design, which often yielded success rates below 1%.
-   **Therapeutic binder design:** The Baker lab and collaborators used RFDiffusion to design de novo protein binders against therapeutically relevant targets including cytokines (IL-17, TNF-alpha), viral surface proteins, and immune checkpoint molecules. Several of these advanced into preclinical characterization by 2025.
-   **Integration with ProteinMPNN:** The standard pipeline became RFDiffusion (backbone generation) followed by ProteinMPNN (sequence design), often followed by AlphaFold 2/3-based filtering. This three-step workflow became the de facto standard for AI-driven de novo protein design.

### ProteinMPNN

ProteinMPNN, also from the Baker lab, solves the “inverse folding” problem: given a protein backbone structure, it predicts amino acid sequences that will fold into that structure. It uses a message-passing neural network architecture.

**2025–2026 developments:**  
\- **LigandMPNN:** An extension that accounts for non-protein molecules (ligands, metals, nucleic acids) in the local environment during sequence design. This was critical for designing functional enzyme active sites and ligand-binding proteins.  
\- **SolubleMPNN and membrane-aware variants:** Community and Baker lab extensions that bias sequence design toward solubility or membrane compatibility, improving the practical success rate of designed proteins.  
\- **Throughput at scale:** ProteinMPNN’s computational efficiency (seconds per design on a single GPU) enabled workflows generating and filtering millions of candidate sequences, with AlphaFold-based structural validation as a filter.

* * *

## 3\. Chai-1

Chai Discovery released **Chai-1** in late 2024 as an open-source molecular structure prediction model positioned as a competitor to AlphaFold 3. Key characteristics:

-   Predicts structures of drug-like molecular complexes including proteins, small molecules, nucleic acids, and glycans.
-   Uses a multi-track transformer architecture with a diffusion module for coordinate generation.
-   Released with open weights and a commercial-friendly license, differentiating it from AlphaFold 3’s initially more restrictive terms.

**2025 developments:**  
\- Chai Discovery raised significant funding (reported $200M+ Series B) and expanded its team, positioning itself as both a platform company and a drug discovery organization.  
\- Chai-1 performance on the CASP16-adjacent community benchmarks showed competitive accuracy with AlphaFold 3 on protein–ligand complex prediction, with particular strength on RNA-containing complexes.  
\- The company announced internal drug discovery programs leveraging Chai-1 for target-based virtual screening and hit-to-lead optimization, though specific pipeline details remained limited as of early 2026.  
\- **Chai-2** was anticipated, with the company disclosing work on dynamics-aware prediction and binding affinity estimation beyond pose prediction.

* * *

## 4\. ESM-3 (Evolutionary Scale Modeling)

### ESM-3 from EvolutionaryScale (formerly Meta FAIR Protein Team)

ESM-3, disclosed by EvolutionaryScale in mid-2024, is a frontier multimodal protein language model that jointly reasons over sequence, structure, and function. It is a generative model with 98 billion parameters trained on billions of protein sequences and structures.

**Architecture and capabilities:**  
\- Operates on three “tracks” simultaneously: amino acid sequence, per-residue structural tokens (discretized 3D coordinates), and functional annotations.  
\- Can generate novel proteins conditioned on any combination of these modalities — e.g., “generate a sequence and structure that has this function” or “given this partial structure, complete the sequence.”  
\- Demonstrated the ability to generate functional fluorescent proteins (a novel GFP-like protein called esmGFP) that are far from any natural sequence — representing a capability roughly equivalent to what evolution achieved over hundreds of millions of years.

**2025–2026 developments:**  
\- EvolutionaryScale (the company spun out of Meta to commercialize ESM) raised over $500M in funding, with a reported valuation exceeding $2B.  
\- ESM-3 was integrated into drug discovery workflows for multiple pharma partnerships, particularly for biologics design (antibodies, peptides, engineered enzymes).  
\- The company expanded ESM-3’s training to incorporate additional data modalities including protein dynamics (from molecular dynamics simulations) and experimental fitness landscapes (from deep mutational scanning datasets).  
\- **ESM Cambrian:** EvolutionaryScale announced a next-generation model family (sometimes referred to as ESM Cambrian or ESM-4 in press reports) with enhanced capabilities for multi-domain protein complexes and improved controllable generation. Full details were expected in 2026.  
\- Academic access: EvolutionaryScale provided API access and released smaller model variants (ESM-3-open) for academic use, though the full 98B parameter model remained proprietary.

* * *

## 5\. Generative Biology Platforms and Other Notable Models

### Genentech / Prescient Design

-   Published work on **Distributional Graphormer (DiG)** for predicting equilibrium conformational distributions of proteins and molecular complexes, going beyond single-structure prediction.

### Generate Biomedicines

-   Developed **Chroma**, a generative model for protein design using diffusion over protein structure and sequence jointly. Published in *Nature* in 2024, with expanded capabilities demonstrated in 2025 for symmetric assemblies and constrained design.

### Profluent Bio

-   Demonstrated **OpenCRISPR-1**, a gene editor designed entirely by AI (protein language models), which showed functional editing activity comparable to natural CRISPR-Cas9. This was a landmark demonstration that AI-designed proteins can function as complex molecular machines, published in 2024 and extended in 2025.

### xTrimoPGLM and ProGen Series

-   Large protein language models from Salesforce Research (ProGen2) and Tsinghua/BioMap (xTrimoPGLM, 100B parameters) continued to see application in directed evolution guidance and protein engineering.

### Diffusion Models for Small Molecules

-   **DiffDock** (Corso et al., MIT) for molecular docking via diffusion continued to be refined, with DiffDock-L handling flexible protein side chains.
-   **FRAME** and other 3D generative models for de novo small-molecule generation in protein pockets gained traction for structure-based drug design.

* * *

## 6\. Clinical Trial Entries from AI-Designed or AI-Discovered Drugs

This is one of the most tangible metrics of AI’s impact on drug discovery. By early 2026, the landscape had evolved significantly:

### Insilico Medicine

-   **INS018\_055** — An anti-fibrotic small molecule (TNIK inhibitor) for idiopathic pulmonary fibrosis (IPF). This was the first drug fully discovered and designed by AI (both target identification and molecule generation) to enter clinical trials.
-   Completed Phase I in healthy volunteers (2023).
-   Advanced through Phase IIa by 2025, reporting positive safety and preliminary efficacy signals.
-   Phase IIb initiated in late 2025, making it the most clinically advanced fully AI-designed drug.
-   **ISM001-055 (renamed)** and additional pipeline candidates entered Phase I across oncology and inflammation indications.
-   Insilico reported a total pipeline of 30+ AI-discovered programs, with multiple in IND-enabling studies.

### Recursion Pharmaceuticals

-   Operates one of the largest proprietary biological datasets (the Recursion OS), combining high-content cellular imaging, transcriptomics, and AI-driven analysis.
-   **REC-994** (cerebral cavernous malformation) — advanced through Phase II by 2025.
-   **REC-4881** (MAPK pathway, oncology) — entered Phase I/II studies.
-   In 2025, Recursion completed its acquisition of Exscientia (see below), creating one of the largest AI-driven drug discovery companies, with a combined pipeline of 10+ clinical-stage programs.
-   Recursion–Roche/Genentech partnership expanded, covering multiple therapeutic areas with significant milestone payments.

### Exscientia (acquired by Recursion)

-   Before the acquisition, Exscientia had multiple AI-designed molecules in clinical trials:
-   **EXS-21546** (A2a receptor antagonist, oncology) — Phase I/II.
-   **EXS-4318** (PKC-theta inhibitor, autoimmune) — Phase I.
-   **GTAEXS-617** (CDK7 inhibitor, with GT Apeiron) — Phase I/II in oncology.
-   Exscientia’s platform emphasized “precision design” — using active learning loops where AI proposes molecules, they are synthesized and tested, and results feed back to refine the AI model.

### Isomorphic Labs (Google DeepMind)

-   Announced major partnerships with Eli Lilly and Novartis in 2024 (combined deal value reported at $3B+), applying AlphaFold-derived technology to drug design.
-   By 2025, Isomorphic disclosed that multiple programs from these partnerships had reached lead optimization and candidate selection stages, though specific IND filings had not been publicly confirmed as of early 2026.
-   Isomorphic’s competitive advantage lies in combining AlphaFold 3-level structure prediction with proprietary generative chemistry and binding affinity prediction models. The company operates with significant resources from Alphabet.

### Absci Corporation

-   Used generative AI (including diffusion models) to design de novo therapeutic antibodies. In 2025, Absci reported designing and experimentally validating antibodies against HER2 and other targets with binding affinities in the nanomolar range, entirely from computational design (zero-shot, without starting from known antibody sequences).
-   Partnered with AstraZeneca and other pharma companies for AI-designed antibody programs.

### Other Notable Clinical Programs with Significant AI Involvement

-   **Relay Therapeutics** — RLY-2608 (mutant-selective PI3K-alpha inhibitor), designed using molecular dynamics simulations and AI-guided analysis. Phase I/II data in 2025 showed clinical activity in breast cancer.
-   **Benevolent AI** — BEN-2293 (topical pan-Trk inhibitor for atopic dermatitis). Phase IIa results reported in 2025.
-   **Sumitomo Pharma (with Exscientia)** — DSP-0038 (5HT1a/5HT2a for Alzheimer’s-related psychosis) entered Phase I, with AI-driven design reducing the discovery timeline.

### Aggregate Numbers

By early 2026, independent analyses (including from the AI in Drug Discovery database and Boston Consulting Group reports) tracked over **100 AI-derived molecules in active clinical trials globally**, up from roughly 30 in early 2024. Most were in Phase I or Phase I/II, but the pipeline was maturing rapidly.

* * *

## 7\. Notable Company Progress

### Isomorphic Labs

-   Staffed up to 200+ employees by 2025, drawing heavily from DeepMind and pharma.
-   Disclosed that its internal models go significantly beyond publicly available AlphaFold 3 in ligand binding affinity prediction.
-   The Lilly and Novartis partnerships represent the largest financial commitments by big pharma to a single AI drug discovery company.

### Recursion Pharmaceuticals

-   The Exscientia acquisition (completed 2025) created a combined entity with a market capitalization fluctuating around $5–10B.
-   The Recursion OS dataset comprised over 50 petabytes of proprietary biological data by 2025.
-   Expanded NVIDIA partnership for building biological foundation models on BioNeMo and DGX Cloud infrastructure.
-   Total clinical and preclinical pipeline exceeded 50 programs.

### Insilico Medicine

-   Expanded operations across US, China, UAE, with significant backing from sovereign wealth funds.
-   The IPF program (INS018\_055) remained the flagship demonstration that end-to-end AI drug discovery could work.
-   The Pharma.AI platform (comprising PandaOmics for target discovery, Chemistry42 for molecule generation, and InClinico for clinical trial prediction) was licensed to multiple pharma partners.

### EvolutionaryScale

-   Rapidly became one of the most valuable biotech startups, with the ESM-3 model family as its core technology.
-   Signed partnerships with major pharmaceutical companies for biologics design.
-   The company’s thesis — that large-scale protein language models can serve as a universal simulation engine for biology — attracted significant attention and investment.

### Chai Discovery

-   Positioned as the “open-source alternative” to DeepMind’s ecosystem.
-   Built a computational drug discovery platform on top of Chai-1.
-   Active in the growing movement to keep foundational biological AI models accessible to the research community.

* * *

## 8\. Key Publications (2024–2026 Selection)

| Publication | Venue | Significance |
| --- | --- | --- |
| Abramson et al., “Accurate structure prediction of biomolecular interactions with AlphaFold 3” | *Nature*, 2024 | Foundational AlphaFold 3 paper |
| Hayes et al., “Simulating 500 million years of evolution with a language model” (ESM-3) | *Science*, 2025 | Demonstrated AI generation of functional novel proteins |
| Watson et al., “De novo design of protein structure and function with RFdiffusion” | *Nature*, 2023 (extended in 2025) | Foundational diffusion-based protein design |
| Dauparas et al., “Robust deep learning-based protein sequence design using ProteinMPNN” | *Science*, 2022 (LigandMPNN extension 2024–2025) | Inverse folding for design |
| Corso et al., “DiffDock: Diffusion Steps, Twists, and Turns for Molecular Docking” | *ICLR*, 2023 (refinements 2025) | Diffusion-based molecular docking |
| Ingraham et al., “Illuminating protein space with a programmable generative model” (Chroma) | *Nature*, 2024 | Programmable protein generation |
| Rives et al. / EvolutionaryScale — ESM Cambrian series | *Preprints*, 2025–2026 | Next-generation protein language models |
| Baker lab — RFDiffusion All-Atom | *Science*, 2025 | Co-design of proteins with small molecules |
| Chai Discovery — Chai-1 technical report | *Preprint*, 2024 | Open-source biomolecular structure prediction |
| Zhavoronkov et al. — Insilico IPF program clinical data | *Conference presentations*, 2025 | First fully AI-designed drug Phase II data |

* * *

## 9\. Emerging Themes and Outlook

**Convergence of structure prediction and generative design:** The boundary between “understanding biology” (AlphaFold) and “designing biology” (RFDiffusion, ESM-3) is blurring. Models increasingly predict, generate, and optimize in unified pipelines.

**The data flywheel:** Companies like Recursion and Insilico that generate proprietary experimental data at scale have a compounding advantage — their AI models improve with each experimental cycle, and this data is not available in public databases.

**Biologics as a leading use case:** While small-molecule drug design benefits from AI, the most dramatic demonstrations have been in protein and biologics design (de novo binders, engineered antibodies, novel enzymes), where AI can access a vast and largely unexplored design space.

**Regulatory engagement:** By 2025, the FDA and EMA began engaging more formally with AI-driven drug design, including guidance documents on how AI/ML-derived evidence should be documented in regulatory submissions. No AI-specific regulatory pathway exists yet, but the dialogue is active.

**Clinical validation remains the bottleneck:** Despite the explosion of AI-designed molecules entering trials, no AI-designed drug had received full regulatory approval as of early 2026. The INS018\_055 program from Insilico Medicine, if Phase IIb results are positive, could become the first by 2027–2028. The field’s credibility hinges on clinical outcomes, not computational benchmarks.

**Open science vs. proprietary models:** A tension persists between open efforts (OpenFold, Boltz-1, Chai-1, ESM-3-open) and proprietary systems (Isomorphic Labs’ internal models, Recursion OS). Both approaches are producing significant results, and the interplay between them is driving rapid progress.

* * *

This report synthesizes information available through early 2026. The field is moving extremely rapidly, with new model releases, clinical data readouts, and corporate developments occurring on a monthly basis. The core takeaway is that AI has moved from a promising research tool to an integral part of the drug discovery pipeline, with real molecules in real clinical trials, though definitive clinical validation is the critical next milestone.
