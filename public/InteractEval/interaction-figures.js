"use strict";
// Approved native SVG pipeline; no animated overlays.
const systemImage = './assets/research/pipeline/interactnet-pipeline-v168.svg';
function interactionFigure(kind) {
  if (kind === 'motivation') return window.whyInteractionFigure();
  return `<section id="system-overview" class="article-section interaction-opening" aria-labelledby="system-overview-heading">
    <header class="interaction-heading">
      <h2 id="system-overview-heading">How InteractNet works</h2>
      <p>InteractNet reconstructs the evolving interaction world from dialogue evidence, assesses six levels of capability in context, and uses task progress and user interest to guide continuation or termination.</p>
    </header>
    <figure class="interaction-figure pipeline-static">
      <div class="interaction-picture pipeline-picture" tabindex="0" role="region" aria-label="Evaluation pipeline; scroll horizontally on smaller screens">
        <img src="${systemImage}" width="2265" height="925" loading="lazy" decoding="async"
          alt="Evaluation pipeline: the dialogue and background inform interaction-world reconstruction, including the scene, latent-state inference, previous world, and event chain. The reconstructed world informs capability adjudication from L1 to L6. Task and interest terminal decisions feed dialogue control."/>
      </div>
    </figure>
  </section>`;
}
// Shared layout hook; introductory figures are static.
function setupInteractionFigures() { window.setupTheoryProcessFigures?.(); }
if (document.body.dataset.interactionOnly) {
  document.getElementById('interaction-app').innerHTML = interactionFigure(document.body.dataset.interactionOnly);
}
