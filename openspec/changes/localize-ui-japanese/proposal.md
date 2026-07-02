## Why

Interview Pilot's UI is currently English-only, with user-facing strings hardcoded directly in JSX (buttons, menus, settings screens, dialogs, toasts, error messages). The target users for this build are Japanese speakers, so the interface needs to read naturally in Japanese. Since only a single fixed language is required (no runtime language switching), the simplest and lowest-risk path is to replace the hardcoded English strings with Japanese text in place, rather than introducing an i18n framework.

## What Changes

- Replace all user-facing English strings in `src/pages`, `src/components`, `src/layouts`, and any other UI-rendering code with Japanese equivalents.
- Cover static JSX text, dynamic/template strings (e.g. `` `${count} item(s) selected` ``), `placeholder`/`title`/`aria-label`/`alt` attributes, toast/notification messages, and validation/error messages.
- Preserve existing keyboard shortcut glyphs (e.g. `⌘`, `Ctrl`) and non-linguistic UI tokens (icons, key names) as-is.
- Leave code identifiers, comments, log messages, and developer-facing (non-UI) strings in English — only user-visible text changes.
- **BREAKING**: none for functionality; this is a content-only change, but it does change visible copy that any existing screenshots, docs, or tests asserting on English UI text will need to account for.

## Capabilities

### New Capabilities
- `ui-localization`: The application's UI SHALL display all user-facing text in Japanese by default.

### Modified Capabilities
(none — no existing `openspec/specs/` capability governs UI copy)

## Impact

- Affected code: all React components under `src/pages/**`, `src/components/**`, `src/layouts/**` that render user-facing text (~50+ files based on initial scan).
- No new dependencies (no i18n library is introduced per scope decision).
- No API, storage, or data-model changes.
- Any tests or docs that assert on specific English UI copy will need updating alongside the affected components.
