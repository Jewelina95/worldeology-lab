# InteractEval

Published results and illustrative conversations for the InteractEval study.

- Website: https://worldeology.com/InteractEvalteste/
- Research: https://worldeology.com/InteractEvalteste/research.html
- Showcase: https://worldeology.com/InteractEvalteste/showcase.html

This edition retains the xgogu/InteractEval website and published data, with expanded Research explanations checked against the supplied 26 October 2026 manuscript and showcase. See `UPSTREAM.md` for the source commit and section-level provenance. The existing `/interactiveval/` site is unchanged.

## Measurement sources

All leaderboard and summary measurements are transcribed from the supplied paper,
`assets/Qwen_InteractEval.pdf`, preserving the reported precision:

| Measurements | Paper source |
| --- | --- |
| Base-model composite, L1-L6, stage means, L6/L5, purpose disposition | Table 4, page 19 |
| Purpose and realism facet scores | Table 6, page 20 |
| Terminal-outcome rates | Table 9, page 23 |
| MetaMind, Cognizer, Claude Code configurations | Table 16, page 28 |
| Architecture-wide mean gains | Table 17, page 28 |
| Fabrication and clarification | Table 8, page 22 |
| Assistant-side interaction matrix and partner measurements | Tables 11–12, page 25 |
| Self-play and user-side capability profiles | Tables 13–14, page 26 |
| Independent passes and alternative judges | Tables 21–22, page 32 |
| Episode lengths and fixed-length subsample | Table 30, page 37 |

The main study uses 27 cells, 30 dialogues per cell, and three independent passes:
2,430 episodes per base model (section 4.1, page 18). The standard user is
claude-5-opus. The judge is Claude Opus 5.

`data/paper-results.json` is the only source for published numerical comparisons.
Agent configurations are identified by both architecture and underlying model.
Differences calculated from rounded table values are labeled in the interface;
architecture-wide mean gains are copied directly from Table 17.

The Models explorer provides 42 published measures across eight categories, with
model selection, expanded charts, table view, and CSV export. Each measure includes
a plain-language definition and reading guidance.

The homepage presents findings first and links a selected model across the result
figures. Pass ranges use Table 21, rather than ranges of examples. Conversation
length uses a compact two-column figure and contextual comparison. Paper links
and source-navigation controls are omitted from the website; measurement
provenance remains documented here and in the data metadata.

Research introduces the three theoretical ideas, four instrument stages, world
components, scenario design, and capability rubric. It includes illustrated
theoretical lenses, a four-stage architecture explorer, reconstruction record
sheets, a 27-cell scenario map, a capability ladder, and an interactive dependency
rule example. Conceptual diagrams do not introduce new measurements.
Showcase is a separate page for the
conversation library. Legacy case routes remain available.

Research also reproduces the vocabulary of Appendix A.3 (Box 5) and the recorded
episodes in Tables 36–37. `data/research-evidence.json` keeps those observations
separate from aggregate measurements. Trajectory plots use assistant turns on the
horizontal axis, observed interest and projected Advance probability on separate
0–1 axes, and no values after an episode has ended. Latent-state heatmaps retain
ordinal degrees; they do not turn categories into interval measurements.

`python scripts/build_research_figures.py` exports English and Chinese SVG, PNG,
and PDF figures plus a bilingual findings brief in `assets/research/`. The website
uses English figures and copy. The Chinese figures and bilingual brief are separate
deliverables. Taxonomy sectors count vocabulary fields, not episode frequencies.

## Example library

The 100 conversations in `MarioEval_cases_en_(1)(1).zip` are illustrative examples.
`data/cases.json` indexes their roles and objectives. Complete source records remain
in `data/cases/`. Internal case and scene identifiers are not shown as page labels.
Examples do not determine leaderboard values, outcome rates, sample sizes, or
uncertainty estimates. No example-derived aggregate file is published.

The case reader links each conversation turn to its recorded engagement signals,
trajectory, capability judgments, and quotation evidence. These are individual
example records and do not change the published rankings.

`data/manifest.json` records source archive and paper checksums and explicitly marks
that examples are excluded from the leaderboard.

## Updating sources

Requires Python and PyMuPDF. Run:

```bash
python scripts/import_publication.py /path/to/Qwen_InteractEval.pdf /path/to/MarioEval_cases_en.zip
```

The importer extracts the specified tables from this paper layout, replaces the
previous data directory, and copies the paper used for the displayed values.
Review changes in the paper's table structure before importing another edition.

## Preview and publish

Run `python -m http.server 8788` from the repository root. GitHub Pages publishes
`main` from the repository root. No application backend is required.

## Attribution

Based on [Interactive Evo](https://github.com/Jewelina95/interactive-evo).
The original MIT license is retained. Provider asset sources are listed in
`assets/providers/sources.json`.
