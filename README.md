# TRMNL — TrueNAS Recommended Versions

A [TRMNL](https://usetrmnl.com/) plugin that displays the currently recommended TrueNAS versions, scraped from the official [TrueNAS Software Status](https://www.truenas.com/docs/softwarestatus/) page.

It shows a table of recommended versions per user profile (Developer, Early Adopter, General, Mission Critical) for both Enterprise and Community editions.

## How it works

A GitHub Actions workflow (`.github/workflows/heartbeat.yml`) runs every 6 hours, scrapes the TrueNAS documentation page, and writes the parsed data to `heartbeat.json`. A commit is only created when the recommended versions actually change, keeping the git history clean.

TRMNL polls the raw `heartbeat.json` file on GitHub and renders the data using Liquid templates.

No external hosting (Cloudflare, AWS, etc.) is required — everything runs on GitHub.

## Project structure

```
.github/workflows/
  heartbeat.yml          — GitHub Actions workflow (scrape + commit)
heartbeat.json           — Latest version data (auto-updated by workflow)
settings.yml             — TRMNL plugin settings (documentation only, not synced)
views/
  full.liquid             — Full-screen layout
  half-horizontal.liquid  — Half-screen horizontal layout
  half-vertical.liquid    — Half-screen vertical layout
  quadrant.liquid         — Quarter-screen layout
```

## Setup

### Prerequisites

- A GitHub account (to host this repository)
- A [TRMNL](https://usetrmnl.com/) device

### Deploy

1. Fork or clone this repository to your own GitHub account.

2. Ensure GitHub Actions are enabled on the repository. The workflow runs automatically every 6 hours and can also be triggered manually from the **Actions** tab.

3. The first run will populate `heartbeat.json` with real data. You can trigger it manually via **Actions > Update heartbeat.json > Run workflow**.

### Public polling URL

You can use the following raw GitHub URL as the TRMNL polling endpoint:

```
https://raw.githubusercontent.com/nlhomme/trmnl-truenas-recommended-version/main/heartbeat.json
```

> **Note:** This URL is provided as-is, with no availability warranty.

### Configure the TRMNL plugin

1. In the TRMNL dashboard, create a new **Private Plugin**.
2. Set the **Strategy** to `Polling` with verb `GET`.
3. Set the **Polling URL** to the raw `heartbeat.json` URL above (or your own fork's URL).
4. Paste the contents of each `views/*.liquid` file into the corresponding layout field.
5. Set the refresh interval (recommended: 1440 minutes / once per day).

## License

MIT
