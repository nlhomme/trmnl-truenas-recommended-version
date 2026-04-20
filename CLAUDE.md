# CLAUDE.md

## Branching

- `main` is production — only merge into it when changes are tested.
- `dev` is for development and testing. Always test on `dev` first.

## Project structure

- The **active deployment** uses a GitHub Actions workflow (`.github/workflows/heartbeat.yml`) that scrapes TrueNAS and commits results to `heartbeat.json`.
- `settings.yml` is documentation only — it does NOT sync to the TRMNL dashboard.

## Liquid templates

All 4 templates in `views/` share the same logic and only differ in CSS sizing classes. When updating one template, apply the same change to all four:

- `views/full.liquid`
- `views/half-horizontal.liquid`
- `views/half-vertical.liquid`
- `views/quadrant.liquid`

## Heartbeat constraints (TRMNL integration)

- `heartbeat.json` **must** be wrapped in `{ "merge_variables": { ... } }` for TRMNL to pick it up.
- Liquid templates access data via `{{ merge_variables.* }}`, never `{{ data.* }}`.
- All parsing and data transformation must be done in the GitHub Actions workflow. Liquid integer counters and comparisons are unreliable in TRMNL's Liquid engine.

## Data source

- Versions are retrieved from: [https://github.com/truenas/documentation/blob/master/data/software_status_config.yaml](https://github.com/truenas/documentation/blob/master/data/software_status_config.yaml) (via the raw GitHub URL).
- The YAML contains a `table_data` map keyed by profile (`developer`, `early_adopter`, `general`, `mission_critical`), each with `enterprise.version` and `community.version` fields.
- If the YAML schema changes, the `extractVersions()` function in `.github/workflows/heartbeat.yml` will need updating.

## Documentation

- `README.md` must be kept up to date whenever changes are made to the project (new features, structural changes, setup steps, etc.).

## TRMNL API docs

TRMNL documentation is available at: [https://docs.trmnl.com/go/llms.txt](https://docs.trmnl.com/go/llms.txt)

## License

[MIT](LICENSE)
