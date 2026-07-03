## Context

Interview Pilot is a React + Tauri desktop app. UI strings are hardcoded in JSX across ~50+ files under `src/pages`, `src/components`, and `src/layouts` (buttons, menus, settings screens, dialogs, toasts, validation/error messages). There is no i18n library in the project today (`package.json` / `src` have no `i18next`, `react-intl`, or `formatjs` dependency). The product now targets Japanese-speaking users exclusively, and the decision (confirmed with the user) is to ship a single fixed Japanese UI rather than build a language-switching system.

## Goals / Non-Goals

**Goals:**
- Every user-facing string rendered by the UI (JSX text nodes, template-literal copy, `placeholder`/`title`/`aria-label`/`alt` attributes, toast/dialog/validation messages) reads in natural Japanese.
- Keep the change content-only: no component logic, props, routing, or state management changes beyond what's needed to substitute a string.
- Keep a consistent terminology/tone across the app (e.g. always ください for polite requests, consistent noun choice for repeated concepts like "Settings" (設定), "Recording" (録音)).

**Non-Goals:**
- No i18n framework (`i18next`, `react-intl`, etc.) and no runtime language switch. English is fully replaced, not toggled.
- No changes to non-UI text: source comments, log/debug output, git history, developer tooling output stay in English.
- No changes to README/docs/CHANGELOG — out of scope per the user's stated scope (UI固定表示のみ).
- No changes to backend/Tauri (Rust) side unless it directly renders end-user-visible text (e.g. native dialog titles) — those are audited but not assumed in scope by default.

## Decisions

- **In-place string replacement over i18n library.** Given the fixed single-language requirement, introducing `i18next`/`react-intl` would add a dependency, a key-management layer, and indirection with no runtime benefit. Decision: replace English literals directly with Japanese literals at their call sites.
  - Alternative considered: extract all strings into a single `src/locales/ja.ts` constants module even without a switcher, for future extensibility. Rejected for this change to keep the diff minimal and reviewable; can be revisited later if a second language is ever required (see Open Questions).
- **Scope boundary = anything rendered to the end user.** Includes JSX text, template strings interpolated into UI, `alt`/`title`/`aria-label`/`placeholder` attributes, `toast(...)`/notification calls, thrown/displayed error messages, and OS-level strings shown to the user (e.g. Tauri window title, tray menu, native notifications) if present in `src-tauri`.
  - Excludes: code comments, console/log statements, internal enum/type identifiers, test names, non-UI config strings.
- **Terminology consistency via a scratch glossary during implementation**, not a formal glossary file (no new capability for it) — the implementer maintains a running list of term→translation mapping while working through files to avoid inconsistent translations of the same concept (e.g. "Recording" always as 録音, not 記録 in one place and 収録 in another).
- **File-by-file, directory-ordered execution** (`src/layouts` → `src/components` → `src/pages`) so shared/low-level components are translated before the pages that compose them, reducing rework.

## Risks / Trade-offs

- [Risk] Missed strings (e.g. deeply nested ternaries, strings built via concatenation) leave residual English → Mitigation: after manual pass, run a repo-wide grep for common English UI patterns (`>[A-Z][a-z]+.*<`, `placeholder="`, `title="`, `toast.(success|error|info)(`) to catch stragglers, and do a manual click-through of each screen.
- [Risk] Layout breakage — Japanese text length/line-wrapping differs from English, may overflow fixed-width buttons/tooltips → Mitigation: visually verify each modified screen (per project convention: run the dev server and check the UI, not just compile).
- [Risk] Inconsistent terminology across independently-edited files → Mitigation: glossary discipline (see Decisions) and a final grep pass for known term variants before calling the change complete.
- [Risk] Tests/snapshots asserting on English copy will fail → Mitigation: update affected test fixtures/snapshots as part of the same change; search `src/**/*.test.*` (if any) for hardcoded English assertions.
- [Trade-off] No language-switch capability is retained if a future non-Japanese-speaking user is needed — acceptable per explicit user scope decision; revisit only if requirements change.

## Migration Plan

Not applicable — this is a UI-copy-only change with no data migration, no API/schema change, and no feature flag. Rollback is a standard git revert of the commits/PR.

## Open Questions

- Should `src-tauri` (Rust) surface any user-visible strings (window title, native menu, tray tooltip, OS notifications)? Needs a quick audit during implementation; if found, they're in scope since they're end-user-visible.
- Should a `src/locales/ja.ts` (or similar) constants module be introduced now to ease a future i18n framework adoption, even without a switcher? Deferred — out of scope unless the user requests it later.
