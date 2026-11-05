# Research taxonomy publication audit — 5 November 2026

The supplied workbook and JSON are retained unchanged. All 34 IDs and English titles agree. The public catalog derives from them with English evidence summaries and limitations.

The earlier `assets/Qwen_InteractEval.pdf` has different pagination and omits the newer representation experiments. It remains available for existing research pages. New findings link to the matching 100-page edition, `assets/InteractEval_research_v5.pdf`, SHA-256 `f36861fc53e88d020a99ad587c59e6e54e43b60772f10f73a5699101b343b2a4`.

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

## Compatibility and interpretation

The original first two destinations remain `measure=stage-profile` and `measure=information`. New links add IDs F01 and F07; earlier URLs still work. The pairing destination remains available. The homepage displays the supplied 12 core claims, keeping its original first two positions and F19 third. Four supporting items are available in the full catalog.

Each finding belongs to exactly one category. Related links and reading paths indicate reading order, not causal inference. Every evidence context includes its limitations. The F07 context displays only the three information conditions supported by the new Table 7; the older partial-subvariant view is retained outside that context.

## Validation

`node scripts/check-render.mjs` verifies the main article and original routes. `node scripts/check-findings.mjs` renders all 34 evidence contexts with published model data, verifies seven exclusive categories and related IDs, source integrity, invalid values, 12 homepage claims, original destinations and search. Browser checks cover all 34 direct links, category filtering, search, original destinations and desktop/mobile layouts.
