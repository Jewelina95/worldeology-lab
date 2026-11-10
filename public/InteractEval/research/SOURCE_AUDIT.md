# Research taxonomy publication audit — 5 November 2026

The supplied workbook and JSON are retained unchanged. The original 34 IDs and English titles agree. The public catalog derives from them with English evidence summaries and limitations.

The earlier `assets/Qwen_InteractNet.pdf` has different pagination and omits the newer representation experiments. It remains available for existing research pages. New findings link to the matching 100-page edition, `assets/InteractNet_research_v5.pdf`, SHA-256 `f36861fc53e88d020a99ad587c59e6e54e43b60772f10f73a5699101b343b2a4`.

## Source checks

- Capability profiles: Table 5, p. 24; raw/cascaded ranges and weighting: Table 30, p. 47.
- Purpose: Table 6, p. 26; matched information: Table 7, p. 26; behavior: Table 8, p. 27.
- Reimbursement cases: Table 40, p. 81. The archived trajectory arrays agree with this edition.
- Turn scores and percentages reaching each turn: Table 32, p. 48; ten rows transcribed into `data/findings-evidence.json`.
- Partner effects: Tables 11–15, pp. 31–33; pairing variance component: Table 29, p. 45.
- Architectures: Tables 18–19, pp. 40–41; group sizes: Table 20, p. 41.
- Clarification versus L5: §4.6, p. 35. The L5 interval includes zero.
- Role probes: Table 17, p. 36; participant-state residual readouts: Table 38, p. 77; correspondence versus accuracy: §4.7.2, p. 37.
- Restoration and head ablation: §4.7.3, pp. 38–39. Only reported points are displayed; no missing curve points are inferred.
- Relational intervention: §4.7.3, p. 37 and Appendix A.13, p. 77. The result remains qualitative; no effect size is invented.
- Reconstruction and patience ablations: Table 34, p. 50; human endorsement: Table 4, p. 22.
- Extractor stability: Table 25, p. 43; judge-family comparisons: Tables 23–24 and accompanying prose, p. 43.
- Cost: Table 35, p. 50. Generation: 2 × (4,450 input + 305 output) = 9,510 tokens/exchange. Evaluation: 146,450 input + 13,230 output = 159,680, approximately 16.8×. Component totals multiply per-call counts by calls per exchange. Parallelism changes latency, not token totals.

## Current catalog and navigation

The catalog contains 40 findings in seven exclusive categories. The homepage displays 15 curated rows: the original 12 plus F43–F45. F46–F48 are available in the full catalog. Category tags link to the index. Finding links select the existing corresponding result measure and scroll to its visible table or chart. Key metrics, terms and limits follow the data; paper-page and table-ID chips are omitted from the interface. Original F01 and F07 destinations remain compatible.

The Chinese page and Markdown download contain the same 40 IDs. Supplied v5 workbook/JSON files remain unchanged; the derived website catalog includes the six user-requested additions.

## New findings F43–F48

All six were checked against `Qwen_InteractNet (2).pdf`, whose SHA-256 exactly matches the existing 100-page `assets/InteractNet_research_v5.pdf` listed above.

- F43: Tables 33–34, pp. 49–50. No scene revision: 0.229 old-rule L1 failures among turns after an admitted revision. This is not a failure rate across all turns.
- F44: Table 34, p. 50. Joint level call: single-level probe separation 0.90 → 0.61; reliability 0.871 → 0.833. Reliability is independent-run grade agreement, not objective accuracy.
- F45: §3.2.2, pp. 12–13 and Table 2. Approximately 2.6% functional tasks in original role-play material; 10–13 of the 27 designed cells empty across audited source pools before coverage correction. These quantities have different source scopes.
- F46: Table 16, p. 35. All ten simulated-user rows plus the human-log row transcribed. MTLD and contradiction flags have different units. Human contradiction checks exclude role views; simulated-user checks include them, so the comparison is descriptive rather than matched.
- F47: Table 31, p. 47. The matched fixed-length subsample compares 0.223 adaptive range with 0.267 fixed-32 range. The user-supplied 0.222 is the full-design adaptive range and is shown separately. Per-system matched adaptive and fixed-32 values reuse the site's published duration data. Continued episodes can include post-closure turns.
- F48: Tables 26–27, p. 44. All ten prose scores transcribed and compared to the existing reference composites. Nine decrease; mean absolute difference from displayed rounded rows is 0.0124, reported as approximately 0.012. Serialization affects generation and engagement as well as scoring.

## Validation

`node scripts/check-render.mjs` verifies the main article and original routes. `node scripts/check-findings.mjs` renders all 40 evidence contexts, checks 15 curated homepage rows, all Chinese IDs, seven exclusive categories, valid values, related links and the unchanged source PDF hash. Source tables retain their reported denominators and caveats.

## Workbook wording alignment

The original 34 English and Chinese headlines match sheet `02_34条逐句审校` exactly. The visible English explanation, required-evidence sentence and claim boundary are faithful translations of columns F, G and J; the original Chinese column values are retained alongside them in the site data. No old V2 headline is substituted. The original twelve homepage items follow sheet `01_首页精选12` in order, including F28 before F26; the authorized F43–F45 additions follow them. The six later findings remain based on the user-supplied wording and the source corrections documented above.

## Reviewed website list — 9 November 2026

Source: https://docs.google.com/spreadsheets/d/1ALnCQklBXagNB87tN8BHyxlfuR50Jl6cZcJpSRDvJ5s/edit, modified 2026-11-09T16:06:49.484Z. The website-copy sheet supplies eleven public headlines in this order: F01, F07, F09, F13, F19, F22, F28, F26, F30, F32, F35. English and Chinese titles are copied exactly. Seven are confirmed; F09, F19, F22 and F32 retain provisional status in metadata and an explanatory sentence below their data. F43 remains pending and is not in the list.

The list and evidence introductions have no category labels. #findings and #key-findings both lead into the same continuous article; clicking selects and scrolls to the corresponding evidence. Original numeric data and historical routes remain available. F03's profile comparison is integrated into F01, factual-addition evidence into F07, and the prior partner matrix remains below F19's new ranking-reversal diagram. F25, F33 and F36 are no longer independent published findings.

New visual comparisons use the supplied sheet and existing numerical arrays: three stage ranges; information-condition lines; case interest timelines; Sol/Qwen ranking reversal under standard versus DeepSeek partners; role-similarity versus standard-minus-self score (reported correlation −0.65); matched two/four-participant declines; and the F30 gain/Frontier Emergence contrast. F30 uses only the reviewed counts (four stronger bases and zero weaker bases with nonzero FE under Cognizer/Claude Code), without inventing per-model FE rates. The source's claim boundaries are retained.

Evidence emphasis starts after the destination chart is visible; static emphasis remains with reduced-motion preferences. Checks render all eleven reviewed findings and all forty historical evidence contexts. Browser verification covers every reviewed headline, absence of tags, visible highlights, ranking-reversal units, and desktop/mobile layouts.
