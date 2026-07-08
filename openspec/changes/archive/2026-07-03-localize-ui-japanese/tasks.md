## 1. Preparation

- [x] 1.1 Grep the codebase for user-facing English strings (JSX text, `placeholder=`, `title=`, `aria-label=`, `alt=`, `toast.(success|error|info)(`, template literals rendered in JSX) under `src/pages`, `src/components`, `src/layouts` and produce a working file list to translate.
- [x] 1.2 Start a scratch term glossary (English → Japanese) for recurring concepts (e.g. Settings/設定, Recording/録音, Save/保存, Cancel/キャンセル) to keep terminology consistent across files.
- [x] 1.3 Check `src-tauri` (`window.rs`, `capture.rs`, `api.rs`, `tauri.conf.json`) for any user-visible strings (window title, native menu/tray labels, OS notifications); add any found to the translation scope. (Translated native window titles in `window.rs`/`capture.rs`; `Err(...)` strings surfaced via `invoke()` left as-is per design's stated backend boundary — most are propagated through frontend hooks that already have their own translated fallback messages)

## 2. Layouts

- [x] 2.1 Translate user-facing strings in `src/layouts/PageLayout.tsx` (no hardcoded strings — title/description come from callers)
- [x] 2.2 Translate user-facing strings in `src/layouts/DashboardLayout.tsx` (no hardcoded strings)
- [x] 2.3 Translate user-facing strings in `src/layouts/ErrorLayout.tsx`

## 3. Shared components

- [x] 3.1 Translate user-facing strings in `src/components/ui/**` (shared primitives: dialog, buttons, inputs, etc.)
- [x] 3.2 Translate user-facing strings in `src/components/Header/**` (no hardcoded strings)
- [x] 3.3 Translate user-facing strings in `src/components/Empty/**` (no hardcoded strings)
- [x] 3.4 Translate user-facing strings in `src/components/TextInput/**` (no hardcoded strings)
- [x] 3.5 Translate user-facing strings in `src/components/Selection/**`
- [x] 3.6 Translate user-facing strings in `src/components/Markdown/**`
- [x] 3.7 Translate user-facing strings in `src/components/updater/**`
- [x] 3.8 (added) Translate remaining `src/components/**` not explicitly listed above: `Sidebar.tsx`, `Contribute.tsx`, `Promote.tsx`, `GetLicense.tsx`, `DragButton.tsx`, `Overlay.tsx` — plus `src/hooks/useMenuItems.tsx` (sidebar nav labels) and `src/config/shortcuts.ts` (shortcut names/descriptions), which are the actual source of several components' rendered strings

## 4. Pages — app / recording flow

- [x] 4.1 Translate user-facing strings in `src/pages/app/**` (including `components/completion`, `components/speech` subfolders)
- [x] 4.2 Translate user-facing strings in `src/pages/audio/**`
- [x] 4.3 Translate user-facing strings in `src/pages/screenshot/**`

## 5. Pages — settings & configuration

- [x] 5.1 Translate user-facing strings in `src/pages/settings/**`
- [x] 5.2 Translate user-facing strings in `src/pages/system-prompts/**`
- [x] 5.3 Translate user-facing strings in `src/pages/shortcuts/**`

## 6. Pages — history & dashboard

- [x] 6.1 Translate user-facing strings in `src/pages/dashboard/**`
- [x] 6.2 Translate user-facing strings in `src/pages/responses/**` (including `src/lib/response-settings.constants.ts` — response length titles/descriptions and language picker names)
- [x] 6.3 Translate user-facing strings in `src/pages/chats/**`
- [x] 6.4 Translate user-facing strings in `src/pages/dev/**` (reachable from end-user UI via sidebar "開発者スペース" nav item and the in-app "Open Dev Space" button, so translated)
- [x] 6.5 (added) Translate user-facing error messages surfaced via `error` state in `src/hooks/useChatCompletion.ts`, `src/hooks/useCompletion.ts`, `src/hooks/useSystemAudio.ts`, `src/hooks/useVersion.ts`, and thrown `Error` messages in `src/lib/functions/stt.function.ts`, `src/lib/functions/ai-response.function.ts`, `src/lib/database/system-prompt.action.ts` that propagate to UI via `error instanceof Error ? error.message : ...` patterns
- [x] 6.6 (added) Set `moment.locale("ja")` globally in `src/main.tsx` so relative-time strings (`moment(...).fromNow()`) and date formats render in Japanese instead of defaulting to English

## 7. Verification

- [x] 7.1 Re-run the grep from 1.1 to confirm no residual English UI strings remain (excluding intentionally-untranslated tokens like `Ctrl`, icon names, code identifiers, comments, logs). Confirmed clean; only remaining hit was inside a commented-out (non-rendered) JSX block in `ShortcutManager.tsx`.
- [x] 7.2 Update any test fixtures/snapshots that assert on the old English copy. N/A — no test files exist in this project.
- [x] 7.3 Start the dev server and click through each screen (dashboard, app/recording flow, settings, system prompts, shortcuts, responses, chats) to confirm Japanese text renders correctly and no layout breaks from text-length changes. **Partial**: `npm run typecheck` and `npm run build` both succeed; `npm run dev` serves without errors. Could not visually click through screens or take screenshots — no browser/GUI automation tool was available in this environment, and the Tauri native shell (which the app depends on for `invoke()` calls made at module load in `main.tsx`) requires a native build/display not available here. **User should visually verify in the actual app before considering this fully done**, especially for layout/text-overflow issues from longer Japanese strings.
- [x] 7.4 Review the glossary for consistent terminology across all translated files; fix any inconsistencies found. Spot-checked recurring terms (キャンセル/削除/プロバイダー/読み込み中/録音) — no inconsistencies found.
