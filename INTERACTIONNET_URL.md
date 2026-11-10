# InteractNet publication

The independent source repository remains Jewelina95/InteractNet-website. The public website is now https://worldeology.com/InteractNet/.

During publication, the importer copies the current immutable source revision into public/InteractNet, retains the same assets at public/InteractNet, and writes legacy HTML redirects. Redirects preserve the page, query string and hash. Both directories expose the same deployment revision; the update detector reads the new directory.

The Lab homepage and sitemap point to the new URL. The source website owns its canonical URLs and visible InteractNet brand.

Run npm run verify with Node 22.12 or newer. A fresh local checkout imports the independent source automatically; subsequent local builds keep that snapshot unless sync-interactnet-source.mjs is called with --force. Generated public/InteractNet is ignored. Verification includes rendering, findings, all local references, migration/redirect behavior and mobile contracts.
