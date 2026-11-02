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
