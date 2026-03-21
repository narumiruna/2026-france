# 2026 France Food Map

A static travel food tool for France (May-June 2026), designed for fast on-trip decisions.

The site currently provides:
- `Overview` tab: city-level food highlights, areas, and strategy notes.
- `Map` tab: nearby researched places based on live geolocation.
- Geolocation fallback: if location is unavailable, the map defaults to central Paris.

## Quick Start

Run a local static server from the repository root:

```bash
python -m http.server 8000 --directory .
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

## Project Layout

```text
index.html              # App entry point
assets/app.js           # UI, tabs, map, geolocation, filtering logic
assets/style.css        # Visual styles
data/restaurants.json   # Place data for map markers
data/city-overview.json # City overview content
docs/                   # Product/design/process documentation
```

## Data Contracts

- `data/restaurants.json`: one object per place with `id`, `name`, `category`, `lat`, `lng`, `score`, `address`, `google_maps_url`, `price_level`, `opening_hours`, `source_urls`, `notes`.
- `data/city-overview.json`: one object per city with `city`, `period`, `highlights`, `signature_dishes`, `areas`, `research_strategy`, `top_candidates`, `notes`.

## Key Documentation

- `docs/DESIGN_STATIC_MAP.md` - product and UI behavior spec
- `docs/WORKFLOW.md` - research-to-publish operating workflow
- `docs/ITINERARY.md` - city itinerary and date ranges
- `docs/STRUCTURE.md` - repository structure and ownership boundaries

## Current Scope

- Static-only architecture (no backend/API).
- Leaflet + OpenStreetMap tiles.
- Nearby radius currently fixed at 2 km.
