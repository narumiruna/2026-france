# GOTCHA

## 2026-03-21 - City focus must also switch filtering origin

- Symptom:
  - Clicking a city from `overview` moves the map view, but city restaurants still do not appear.
- Root cause:
  - The map camera center changed, but nearby filtering still used `userPosition || DEFAULT_PARIS` as origin.
- Prevention rule:
  - When adding any city-focus behavior, always bind both:
    - visual center (`map.setView`)
    - data origin (distance filtering source)
  - Verify with a city far from Paris (for example, Avignon) to catch false positives.
