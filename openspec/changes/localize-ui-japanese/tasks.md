## 1. Preparation

- [ ] 1.1 Grep the codebase for user-facing English strings (JSX text, `placeholder=`, `title=`, `aria-label=`, `alt=`, `toast.(success|error|info)(`, template literals rendered in JSX) under `src/pages`, `src/components`, `src/layouts` and produce a working file list to translate.
- [ ] 1.2 Start a scratch term glossary (English → Japanese) for recurring concepts (e.g. Settings/設定, Recording/録音, Save/保存, Cancel/キャンセル) to keep terminology consistent across files.
- [ ] 1.3 Check `src-tauri` (`window.rs`, `capture.rs`, `api.rs`, `tauri.conf.json`) for any user-visible strings (window title, native menu/tray labels, OS notifications); add any found to the translation scope.

## 2. Layouts

- [ ] 2.1 Translate user-facing strings in `src/layouts/PageLayout.tsx`
- [ ] 2.2 Translate user-facing strings in `src/layouts/DashboardLayout.tsx`
- [ ] 2.3 Translate user-facing strings in `src/layouts/ErrorLayout.tsx`

## 3. Shared components

- [ ] 3.1 Translate user-facing strings in `src/components/ui/**` (shared primitives: dialog, buttons, inputs, etc.)
- [ ] 3.2 Translate user-facing strings in `src/components/Header/**`
- [ ] 3.3 Translate user-facing strings in `src/components/Empty/**`
- [ ] 3.4 Translate user-facing strings in `src/components/TextInput/**`
- [ ] 3.5 Translate user-facing strings in `src/components/Selection/**`
- [ ] 3.6 Translate user-facing strings in `src/components/Markdown/**`
- [ ] 3.7 Translate user-facing strings in `src/components/updater/**`

## 4. Pages — app / recording flow

- [ ] 4.1 Translate user-facing strings in `src/pages/app/**` (including `components/completion`, `components/speech` subfolders)
- [ ] 4.2 Translate user-facing strings in `src/pages/audio/**`
- [ ] 4.3 Translate user-facing strings in `src/pages/screenshot/**`

## 5. Pages — settings & configuration

- [ ] 5.1 Translate user-facing strings in `src/pages/settings/**`
- [ ] 5.2 Translate user-facing strings in `src/pages/system-prompts/**`
- [ ] 5.3 Translate user-facing strings in `src/pages/shortcuts/**`

## 6. Pages — history & dashboard

- [ ] 6.1 Translate user-facing strings in `src/pages/dashboard/**`
- [ ] 6.2 Translate user-facing strings in `src/pages/responses/**`
- [ ] 6.3 Translate user-facing strings in `src/pages/chats/**`
- [ ] 6.4 Translate user-facing strings in `src/pages/dev/**` (only if reachable from normal end-user UI; skip if purely internal/dev-only tooling not shown to end users)

## 7. Verification

- [ ] 7.1 Re-run the grep from 1.1 to confirm no residual English UI strings remain (excluding intentionally-untranslated tokens like `Ctrl`, icon names, code identifiers, comments, logs).
- [ ] 7.2 Update any test fixtures/snapshots that assert on the old English copy.
- [ ] 7.3 Start the dev server and click through each screen (dashboard, app/recording flow, settings, system prompts, shortcuts, responses, chats) to confirm Japanese text renders correctly and no layout breaks from text-length changes.
- [ ] 7.4 Review the glossary for consistent terminology across all translated files; fix any inconsistencies found.
