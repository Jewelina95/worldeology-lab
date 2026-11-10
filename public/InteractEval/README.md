# InteractNet website

Official website: https://worldeology.com/InteractNet/

This repository contains only the InteractNet website. Collaborators can edit this project without write access to Worldeology Lab's other projects.

## Preview
Run `python3 -m http.server 8080` here and open http://localhost:8080/. This is a static HTML/CSS/JavaScript website. Main: index.html; Research: research.html; Showcase: showcase.html.

The full-width opening introduces response-based evaluation versus interaction evaluation. The static Why interact illustration and How InteractNet works pipeline precede the findings, with a shared sticky contents rail. The conversation library remains on Showcase.

## Publication
Changes pushed or merged to this repository's `main` branch are published automatically to https://worldeology.com/InteractNet/. Worldeology Lab checks for a new commit every five minutes and builds only when it finds one. GitHub scheduling and CDN delivery can add delay; publication is not instantaneous. No Lab credentials or Lab write access are shared with project collaborators.

The Lab owner can also publish immediately through https://github.com/Jewelina95/worldeology-lab/actions/workflows/deploy.yml (Run workflow).

Run `node scripts/check-render.mjs` before pushing.


## Credits
Adapted from https://github.com/Xgogu/InteractEval. See LICENSE and UPSTREAM.md.

## Local homepage revision (2026-11-10)

- Why interact is static: no playback, timed overlays, or scanning highlights.
- How InteractNet works uses the approved v168 pipeline (native SVG and downloadable PDF in assets/research/pipeline). XML ampersands were escaped for browser compatibility without changing the artwork.
- The hero explains response-based evaluation versus state, initiative, and progress across turns.
- The bottom Conversations section and its contents entry were removed from Main; Showcase remains available.
- Comic artwork was redrawn as figure1-static-v2.png with the built-in image tool: two repeated-advice exchanges, no Safe model badge, no plants between panels, matching state/event labels, and a fictional cartoon Bomb throw followed by spacecraft retreat and a relieved participant. The shared opening prompt is now Can you help me handle this?; the original image remains archived as figure1.png.

## Brand and introduction update (2026-11-10)

- Site-facing names and metadata use InteractNet. Repository URLs and source document filenames retain their actual identifiers.
- The main headline is the user-selected line “The measure of intelligence is the ability to change”, without an author credit: its common Einstein attribution is not supported by an original source (see https://en.wikiquote.org/wiki/Albert_Einstein#Misattributed). The text directly defines responsive and interactive intelligence using the Introduction and §2.3 (Agency Principle) of the supplied Qwen_InteractNet (1).pdf. Responsive behavior can adapt while continuing a partner-established direction; interactive agency also originates warranted directions and follows through coherently. These are concise website paraphrases, not quotations from the paper.
- How InteractNet works explains world reconstruction, capability assessment, and dialogue continuation.

## Data presentation cleanup (2026-11-10)

- Removed the pipeline footer caption and full-pipeline link.
- Key Findings are static statements; data views are selected independently. Removed finding-triggered focus styling, yellow L5/L6 emphasis, and table/bar entrance effects.
- Normalized the standard-user and reference-judge label to claude-opus-5; claude-opus-5.5 remains a separate model. Numerical publication data are unchanged.
- Qwen uses the purple model mark from the official Qwen3 repository artwork.
- Result subviews share title icons, model identities, table spacing, and forest-green charts through data-views.js/css. Repeated captions are visually removed while statistical units and sample sizes remain.
- Clarification vs. L5 belongs to Partners: it reports the paper's Kimi partner-substitution comparison (claude-opus-5 to claude-opus-5.5), with separate scales for clarification frequency and L5 score changes.
- Verified all 63 result views at desktop (1440 px) and mobile (390 px) widths for JavaScript errors, missing images, page overflow, and clipped bar values.

## Comic composition revision (2026-11-10)

- figure1-static-v3.png combines the supplied newer comic with the original tabletop and throwing poses using user-authorized local compositing. Earlier versions remain archived.
- Background replaces Situation. Background B follows a blocked exit, tabletop preparation of a closed cartoon Bomb, and a retreating spacecraft followed by safe escape. Dialogue and state/event captions reflect that sequence; no construction instructions are depicted.
- Reproducible editing script: ../outputs/interactnet-site-review/edit-comic-v3.py. Asset provenance: assets/research/figure1/source-v3.json.

## Paper-aligned result navigation (2026-11-10)

The website follows the paper's order without displaying section numbers. Existing charts and tables are reused; this revision adds no measurements or datasets. The capability matrix and behavioral overview now live within the same explorer instead of separate sections above it. The original closure bars live under Interaction dynamics.

| Paper | Website | Existing content |
| --- | --- | --- |
| 4.2 | Model performance | L1–L6 matrix, three stages, L6/L5, aggregation sensitivity |
| 4.3 | Agent evaluation | Architecture gains by purpose, stage, and base capability |
| 4.4 | Multi-party evaluation | Two-, three-, and four-participant comparisons |
| 4.5 | Robustness analysis | Repeats, judge changes, extraction stability, formatting; Ablation studies and Human review subgroups |
| 5.1 | Scenario effects | Purpose, world setting, information conditions, coverage |
| 5.2 | Participant effects | Pairings, self-play, user role, pressure, role asymmetry |
| 5.3 | Interaction dynamics | Duration, fixed/adaptive protocols, trajectories, termination, closure |
| 5.4 | Behavioral patterns | Clarification, unsupported additions, behavioral/capability comparisons |
| 5.5 | Representation analysis | State readouts, shared states, partner integration, interventions |
| 5.6 | Cost | Existing calls and token counts |

The simulated-versus-human user comparison is under general robustness; it is not presented as the human review of evaluator judgments.

## English dialogue proofread (2026-11-10)

- figure1-static-v4.png uses the latest user-supplied illustration as its background; it supersedes v3 on the local site. The scene artwork remains intact.
- Twenty independent SVG/transparent PNG overlays in assets/research/figure1/dialogue-components-v4 contain corrected English dialogue, Background A/B, state/event captions, and the cartoon Bomb in flight. The full layered SVG is figure1-static-v4.svg. The bottom white margin is cropped at the user's request.
- Background A now explicitly limits the explanation to chemistry and cautions against making bombs. Background B describes the alien threat, asks for help gathering materials, and shows a cartoon Bomb following the retreating craft; the user retains some concern about its return. No actual materials or construction instructions are specified.
- Local scripts: ../outputs/interactnet-site-review/edit-comic-v4.py and render-comic-v4.cjs.
- The Background A book icon has a transparent background, eliminating the mismatched rectangular patch while preserving the original icon artwork.
