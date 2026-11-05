# InteractEval website

Official website: https://worldeology.com/InteractEval/

This repository contains only the InteractEval website. Collaborators can edit this project without write access to Worldeology Lab's other projects.

## Preview
Run `python3 -m http.server 8080` here and open http://localhost:8080/. This is a static HTML/CSS/JavaScript website. Main: index.html; Research: research.html; Showcase: showcase.html.

Keep the full-width opening unchanged. Below it, the figures and results form one continuous article with a sticky contents rail.

## Publication
Changes pushed or merged to this repository's `main` branch are published automatically to https://worldeology.com/InteractEval/. Worldeology Lab checks for a new commit every five minutes and builds only when it finds one. GitHub scheduling and CDN delivery can add delay; publication is not instantaneous. No Lab credentials or Lab write access are shared with project collaborators.

The Lab owner can also publish immediately through https://github.com/Jewelina95/worldeology-lab/actions/workflows/deploy.yml (Run workflow).

Run `node scripts/check-render.mjs` before pushing.


## Credits
Adapted from https://github.com/Xgogu/InteractEval. See LICENSE and UPSTREAM.md.
