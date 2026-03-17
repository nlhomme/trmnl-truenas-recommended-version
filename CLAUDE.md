# CLAUDE.md

## Project structure

- The **active deployment** uses root-level `worker.js` and `wrangler.toml`.
- `settings.yml` is documentation only — it does NOT sync to the TRMNL dashboard.

## Liquid templates

All 4 templates in `views/` share the same logic and only differ in CSS sizing classes. When updating one template, apply the same change to all four:

- `views/full.liquid`
- `views/half-horizontal.liquid`
- `views/half-vertical.liquid`
- `views/quadrant.liquid`

## Worker constraints (TRMNL integration)

- The worker response **must** be wrapped in `{ "merge_variables": { ... } }` for TRMNL to pick it up.
- Liquid templates access data via `{{ merge_variables.* }}`, never `{{ data.* }}`.
- Always return HTTP 200 even on errors (non-200 causes TRMNL to discard data). Include error info in the response body.
- All parsing and data transformation must be done **server-side** in `worker.js`. Liquid integer counters and comparisons are unreliable in TRMNL's Liquid engine.

## Data source

- Versions are scraped from: https://www.truenas.com/docs/softwarestatus/#which-truenas-version-is-recommended
- The page contains an HTML table with columns: User Type, Enterprise, Community.
- If the page structure changes, the `parseRecommendedVersions()` function in `worker.js` will need updating.

## Documentation

- `README.md` must be kept up to date whenever changes are made to the project (new features, structural changes, setup steps, etc.).

## TRMNL API docs

TRMNL documentation is available at: https://docs.trmnl.com/go/llms.txt
