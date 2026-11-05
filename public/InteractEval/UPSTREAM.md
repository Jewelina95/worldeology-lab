# Worldeology Lab InteractEval edition

The complete upstream page design, backgrounds, navigation, assets, charts, and
publication data were synchronized from Xgogu/InteractEval revision
8488b98a2cd99efd784ff411c949617fdbb08ab7 on 2 November 2026. The original license
is retained. Canonical URLs and Source links point to this Worldeology Lab edition:
https://worldeology.com/InteractEval/.

Main follows the upstream hero (A good reply is only the beginning), then the
response-versus-interaction figure, Key Findings, Model performance, and the
remaining upstream sections. Research also contains the same figure.

The standalone figure is `response-interaction.html`. Its source is the approved
Case 11 manuscript PNG in `assets/research/case11/response-interaction.png`.
Its composition, text, fonts, A panel, time axis, role strip, right-hand judgment,
method panel, and results chart are fixed. Only the center of B receives a gray
overlay and sequential color reveals. A and the right column never receive any
animation layer. Playback lights the request, clarification, email, uptake of
2180, project-code gap, follow-up question, uploaded information, and completed
selected fields in sequence. Arrows carry a moving highlight. At the end, all
overlays are removed and the unmodified source image is shown.

The player supports play/pause, replay, continuous seeking, visibility-based
pausing, and an initially completed static view with reduced motion. It does not
run a live evaluator or alter the supplied measurements. Scene stages and
selected fields in the original figure are condensed; routine clarification is
not labeled proactive agency, and completed fields do not establish submission.
Selected source turns remain available in `assets/research/case11/source.json`.

## Figure 5 information flow (2026-11-02)
The Main and Research pages now place the original manuscript Figure 5 after “From Reply to Interaction” and before Main's Key Findings. `system-figure.js` preserves `theory_cartoon_v5_2026-11-02/theory-v5.png` unchanged. SVG clips progressively reveal the three theoretical lenses, measurement questions, four instrument responsibilities, original source-evidence paths, and retained diagnostic record. Captions are grounded in the manuscript's §2.4 synthesis caption and accompanying paragraph (`fig:theory-measurement-bridge`); this is an illustrative measurement workflow, not a performance experiment. Four native SVG icons identify the instrument responsibilities. The animation has independent playback, replay, seek, offscreen pausing, and reduced-motion behavior. Standalone: `system-overview.html`.

## Main render recovery (2026-11-02)
Observed in the user's Chrome: `systemFigure is not defined`, with the main content replaced by the boot error. Figure 5 now ships inside the established `motivation-figure.js` entry point, avoiding an additional blocking dependency. The standalone module uses an idempotent closure and exports only its render/setup functions. Main and Research fall back to the original static Figure 5 if the animation entry is unavailable. `scripts/check-interacteval-render.mjs` reproduces the missing-module failure and verifies both fallback and enhanced rendering; it is included in deployment verification.

## Persistent Main navigation (2026-11-02)
Main now uses a shared left navigation and one visible right content panel. Sidebar activation toggles existing panels in place and updates browser history; it does not perform anchor scrolling or replace the sidebar DOM. The right pane scrolls independently of the left rail. From Response to Interaction, System Overview, Key Findings, model performance, behavior, measures, and conversations share this shell. On narrow screens Contents stays above the independently scrolling content. Original figure artwork and data remain unchanged. Render verification checks that each URL selects exactly one panel; browser checks compare sidebar link positions before and after switches and verify that right-pane scrolling leaves document scrollY at zero.

## Continuous article restoration (2026-11-02)
Supersedes the persistent-panel implementation above. The full-width opening is restored exactly to the pre-panel version. Below it, the shared article shell begins with its sticky contents rail beside Response to Interaction, followed by Figure 5 System Overview, Key Findings, and the existing results sections in one continuous document. Contents links scroll to sections; they do not hide or replace content. The missing-animation-module fallback remains in place.

## Official public release (2026-11-02)
The current approved continuous-article site is published at https://worldeology.com/InteractEval/. The Worldeology Lab homepage and sitemap point to this official route. Canonical/social/source links use the official path. Former preview entry pages redirect to their matching official pages, preserving query strings and section anchors.


## Current website refresh (2026-11-02)

The current InteractEval design is synchronized from Xgogu/InteractEval revision d0b99a665b7f3f2da31a26239897439214ec5962. This supersedes the earlier visual descriptions above. The opening introduces response versus interaction, followed by Why interact and How we extract. Both original manuscript figures loop automatically, pause offscreen, and show a completed view for reduced motion. The current six theory explanations, refined illustrations, judge model header icons, grouped leaderboard picker, publication measurements, and conversation library are retained. Official canonical URLs remain https://worldeology.com/InteractEval/ and Source links point to this repository.

Publication remains owner-controlled through the existing Worldeology Lab deployment workflow. No credentials or changes to other Lab projects are included.

## Why interact: three time slices (2026-11-03)

The Main page and standalone `response-interaction.html` now use the approved
Figure 1 comic and dialogue. A common request appears in two fictional scenes:
ordinary curiosity and fear during an alien arrival. The 28-second player
highlights scene context, extraction of a response from Situation A, observable
evidence, participant latent-state estimates and event chains. Fear persists in
B; observed landing does not establish hostile alien intent. This is a
conceptual illustration, not a new empirical result or a model-internal trace.

The artwork stays intact in `assets/research/figure1/figure1.png`.
`why-interaction.js` and `why-interaction.css` provide playback, replay, seeking,
time-slice selection, visibility pausing and reduced-motion support. The existing
How we extract figure and the other sections remain in their previous order.

## One situation, three theoretical lenses (2026-11-03)

The second Why interact illustration keeps the same approved A/B case labels.
It opens on one case, moves it left, then unfolds Data Iceberg Theory, Movie
Evaluation Theory and Agency Principle on the right. A/B switching updates the
scene, evidence, participant-state estimates, observed event sequence and
proposed direction together. A final information-flow loop returns new
observations to state and event reconstruction.

The iceberg distinguishes visible evidence from contextual state estimates.
The movie separates established events, current development and conditional
futures. The agency illustration leaves admissibility, a new substantive
direction and warrant as separate requirements; the example proposal is not an
observed success or a measured benefit. Main retains the original first Why
interact player and the subsequent How we extract figure. Standalone:
`situation-theories.html`. Player: `theory-process.js` / `theory-process.css`.

## Coupled Situation B panorama (2026-11-03)

Supersedes the separate three-lens illustrations above. The second Why interact
player now uses one continuous, hand-inked Situation B panorama. Each time
slice links dialogue and visible behavior vertically to its participant-state
estimate; those state slices and events connect horizontally into the Movie
Evaluation Theory trajectory. Agency Principle is attached to a conditional
continuation branch, with an evidence-warrant link from unresolved alien intent.
The graph retains all six approved dialogue bubbles and persistent fear. It
keeps projections distinct from observed events and proposed direction distinct
from demonstrated contribution. Artwork: `assets/research/situation-theories/coupled-world.png`.
The SVG lettering, speech bubbles and information-flow paths are authored in
`theory-process.js`. The player supports playback, replay, seeking, time-slice
selection, a full view, visibility pausing and reduced motion. The first Why
interact figure and How we extract remain in place.

## User-sketch three-row arrangement (2026-11-03)

Supersedes the panorama layout immediately above. Situation B's t1, t2 and t3
are now stacked in one left column. The complete shared record D3 feeds three
horizontal theory rows stacked on the right: Data Iceberg Theory, Movie
Evaluation Theory and Agency Principle. Each row has its own full visual and
case-grounded content. The state-context connection links the first two rows;
the event/future context and unresolved-intent warrant feed the agency row.
The three theory headings remain visible throughout playback. Dynamic emphasis
follows the individual rows and their cross-row information paths without
hiding the overall three-principle structure. Dialogue is native SVG text over
the original approved artwork; illustration assets use a consistent pen style.
Source graphics: `theory-rows-art.png` and `case-artwork.png` in the existing
situation-theories asset directory. The first Why interact player and How we
extract remain in place.

## Figure 1 visual language and explicit explanations (2026-11-03)

The three-row layout remains. The right-hand illustrations now match Figure 1's
clean filled 2D characters, black outlines and cyan/mint/gold palette. The large
shared-record brace, rotated notation and long external warrant route have been
removed. Compact time tags connect the right-hand claims to the left-hand case.

Each theory row asks a direct question and gives a concrete explanation. The
iceberg pairs three quotations with supported participant/world interpretations.
The movie follows request, revealed motive and reported landing while showing
possible continuations. Agency contains an explicitly illustrative proposal,
the quoted uncertainty supporting it, scene/direction/evidence checks, and the
later uptake and adaptation to evaluate. Two short labelled arrows link the
rows. All text remains at full contrast throughout playback; a moving outline
and flow marker supply focus instead of dimming or concealing the other rows.
The native SVG lettering remains editable. The new illustration asset is
`theory-clean-art.png`; prior assets are retained for cached references.
