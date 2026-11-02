# InteractEval website

Official website: https://worldeology.com/InteractEval/

This repository contains only the InteractEval website. Collaborators can edit this project without write access to Worldeology Lab's other projects.

## Preview
Run `python3 -m http.server 8080` here and open http://localhost:8080/. This is a static HTML/CSS/JavaScript website. Main: index.html; Research: research.html; Showcase: showcase.html.

Keep the full-width opening unchanged. Below it, the figures and results form one continuous article with a sticky contents rail.

## Publication
Worldeology Lab imports this repository's main branch whenever the Lab is published. The Lab owner can publish the latest website by running its existing deployment workflow: https://github.com/Jewelina95/worldeology-lab/actions/workflows/deploy.yml (Run workflow). Project collaborators do not receive Lab credentials or Lab write access.

Run `node scripts/check-render.mjs` before pushing.


## Credits
Adapted from https://github.com/Xgogu/InteractEval. See LICENSE and UPSTREAM.md.
