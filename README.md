# TRMNL — TrueNAS Recommended Versions

A [TRMNL](https://usetrmnl.com/) plugin that displays the currently recommended TrueNAS versions, scraped from the official [TrueNAS Software Status](https://www.truenas.com/docs/softwarestatus/) page.

It shows a table of recommended versions per user profile (Developer, Early Adopter, General, Mission Critical) for both Enterprise and Community editions.

## How it works

A Cloudflare Worker (`worker.js`) fetches and parses the TrueNAS documentation page, extracts the recommended versions table, and returns the data in the format expected by TRMNL's plugin system.

TRMNL polls the worker on a configurable interval (default: once per day) and renders the data using Liquid templates.

## Project structure

```
worker.js          — Cloudflare Worker that scrapes and returns version data
wrangler.toml      — Cloudflare Wrangler configuration
settings.yml       — TRMNL plugin settings (documentation only, not synced)
views/
  full.liquid             — Full-screen layout
  half-horizontal.liquid  — Half-screen horizontal layout
  half-vertical.liquid    — Half-screen vertical layout
  quadrant.liquid         — Quarter-screen layout
```

## Setup

### Prerequisites

- A [Cloudflare](https://cloudflare.com/) account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed
- A [TRMNL](https://usetrmnl.com/) device

### Deploy the worker

1. Clone this repository:
   ```sh
   git clone https://github.com/nlhomme/trmnl-truenas-recommended-version.git
   cd trmnl-truenas-recommended-version
   ```

2. Authenticate with Cloudflare:
   ```sh
   wrangler login
   ```

3. Deploy:
   ```sh
   wrangler deploy
   ```

4. Note the worker URL (e.g. `https://truenas-recommended-version.<your-subdomain>.workers.dev/`).

### Public polling URL

If you cannot host your own worker, you can use the following public polling URL:

```
https://truenas-recommended-version.goulash-rafts-06.workers.dev/
```

> **Note:** This URL is provided as-is, with no availability warranty.

### Configure the TRMNL plugin

1. In the TRMNL dashboard, create a new **Private Plugin**.
2. Set the **Strategy** to `Polling` with verb `GET`.
3. Set the **Polling URL** to your worker URL.
4. Paste the contents of each `views/*.liquid` file into the corresponding layout field.
5. Set the refresh interval (recommended: 1440 minutes / once per day).

## License

MIT
