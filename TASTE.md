# TASTE

## Stable Preferences

- Web UI verification workflow:
  - For every modification to static web pages (`index.html`, `assets/*`, or static JSON rendered by UI), run Playwright MCP checks before reporting completion.
  - Minimum check set: page open attempt, DOM snapshot, and browser console messages.
  - If environment constraints block page access, explicitly report the blocker and provide the nearest verifiable evidence.
