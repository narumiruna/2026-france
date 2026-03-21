# Repository Guidelines

## Project Structure & Module Organization
This repository is documentation-first and currently contains planning materials for a France food-research project.

- `README.md`: minimal project entry point.
- `docs/OBJECTIVES.md`: project goals and expected outputs.
- `docs/WORKFLOW.md`: research workflow and data-collection process.
- `docs/STRUCTURE.md`: intended information architecture (currently being defined).
- `docs/PREFERENCES.md`: personal dining preferences (currently being defined).
- `docs/references/`: reference-only materials (do not edit unless explicitly requested).

Keep each document focused on one purpose. Put process updates in `WORKFLOW.md`, goals in `OBJECTIVES.md`, and user taste signals in `PREFERENCES.md`.

## Build, Test, and Development Commands
There is no build pipeline yet. Use lightweight documentation workflows:

- `rg --files`: list tracked files quickly.
- `rg "<keyword>" docs/`: search existing decisions before adding new text.
- `git status`: verify only intended files are changed.

If automation is added later (lint/test), document commands here and keep examples runnable from repo root.

## Coding Style & Naming Conventions
Primary artifact is Markdown documentation.

- All documentation must be written in Taiwan Traditional Chinese (`zh-TW`).
- Restaurant names may remain in French or English when that is the official or commonly used name.
- Prefer short sections with descriptive `##` headings.
- Use bullet lists for rules and checklists; avoid long narrative blocks.
- File names should be uppercase thematic names in `docs/` (for example, `OBJECTIVES.md`).

## Testing Guidelines
No formal test framework is configured yet. Treat quality as document consistency checks:

- Cross-check new statements against existing files in `docs/`.
- Ensure workflow steps are actionable and ordered.
- Verify references point to valid local paths.

## Commit & Pull Request Guidelines
Current history is minimal (`Initial commit`, `add doc`). Follow a clear, imperative style:

- Commit message format: `<verb> <scope>` (for example, `add workflow notes`, `update objectives`).
- Keep commits focused on one document purpose.
- PRs should include:
  - What changed.
  - Why the change is needed.
  - Any follow-up tasks or open questions.

## Contributor Notes
- Do not edit `docs/references/ISESHIMA_AGENTS.md` unless explicitly instructed.
- Prefer incremental updates over large rewrites to keep review simple.
- Research progress tracking is mandatory: after any restaurant research completion or meaningful status change, update `docs/PROGRESS.md` in the same session.

## GOTCHA and TASTE Auto-Update Workflow
Follow these rules every session:

1. Session start checks:
   - Check whether `GOTCHA.md` and `TASTE.md` exist in the project root.
   - If present, read relevant entries before proposing fixes or recommendations.

2. Auto-create `GOTCHA.md` on mistakes:
   - If an implementation/debugging mistake happens and `GOTCHA.md` does not exist, create it immediately.
   - Add a new entry in the same session describing only non-obvious, experience-derived pitfalls.
   - Keep each entry actionable: symptom, root cause, and prevention rule.

3. Auto-create or update `TASTE.md` on stable preferences:
   - If the user expresses a reusable preference and `TASTE.md` does not exist, create it immediately.
   - Add or update entries in the same session with concrete decision rules.
   - Store only stable, repeatable preferences (not one-off requests).

4. Scope and quality:
   - Do not duplicate foundational rules already defined in `AGENTS.md`.
   - Keep entries concise and enforceable.
