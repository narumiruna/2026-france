# TASTE

## Stable Preferences

- Web UI verification workflow:
  - For every modification to static web pages (`index.html`, `assets/*`, or static JSON rendered by UI), run Playwright MCP checks before reporting completion.
  - Minimum check set: page open attempt, DOM snapshot, and browser console messages.
  - If environment constraints block page access, explicitly report the blocker and provide the nearest verifiable evidence.

- Preference elicitation format:
  - Before asking the user to choose food options, provide short introductions for each option.
  - Present selectable options with explicit numeric indexes so the user can reply with numbers.

- Candidate search coverage:
  - During new restaurant research, always include hotel-nearby options in addition to major sightseeing and food districts.
  - Treat hotel-nearby options as practical fallback candidates for tight schedules or late arrivals.
  - For hotel-nearby search, confirm hotel address/area/street first, then search in order: street-nearby food before area-nearby food.
  - Do not use hotel-name keyword search as the primary discovery method.
  - Exception: only extracted geographic terms (street/area/city) may be used as standalone queries; never use the full hotel name string.
