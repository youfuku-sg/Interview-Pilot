## Why

This is a personal-use fork of Pluely (see `CLAUDE.md`), with no license server and no paid tier. However, large parts of the inherited UI still gate behavior behind `hasActiveLicense`, a flag that defaults to `false` and can never become `true` in this fork (there is no license-activation flow). As a result, several basic UX behaviors — starting with the ability to drag-move the main overlay window — are silently and permanently disabled, with the UI instead nudging the user toward a "purchase a license" flow that does not apply here.

This change is a running backlog for personal-fork UX papercuts discovered during day-to-day use. Rather than filing a new change per item, items are added here as tasks and implemented incrementally.

## What Changes

- Make the main overlay window draggable with the mouse regardless of `hasActiveLicense`, by decoupling `data-tauri-drag-region` in `src/components/DragButton.tsx` from the license flag.
- Remove the "有効なライセンスが必要です" (license required) popover/CTA on the drag handle, since it points at a purchase flow that doesn't exist in this fork.
- **Remove all paid/paywalled parts of the app** (2件目の要望): unlock every `hasActiveLicense`-gated product feature so it behaves as if always licensed, and remove/hide the license-purchase and Pluely-hosted-API entry points (`GetLicense` CTAs, `Promote.tsx`, the license-key/checkout section of `PluelyApiSetup.tsx`, the Dashboard license CTA) since they point at a payment backend this fork never configures.
  - **BREAKING (intentional)**: features previously locked behind a license (theme/transparency controls, response length/language/auto-scroll, chat input area, Pluely prompt presets, AI prompt generator, screenshot selection mode, shortcut re-binding, support menu item, screenshot-attach button) become unconditionally available.
  - Explicitly **out of scope**: anything gated at the Rust/Tauri backend level tied into OS-level system registration — specifically the arrow-key `move_window` shortcut's `LicenseState` gate in `src-tauri/src/shortcuts.rs`, and the dormant Pluely SaaS API proxy backend (`src-tauri/src/activate.rs`, `src-tauri/src/api.rs`). Per user direction, these may be left as-is (hidden/non-functional) rather than modified, since touching global-shortcut registration and payment-proxy backend code carries risk disproportionate to the benefit in a personal-use fork where they're already unreachable dead ends.

## Capabilities

### New Capabilities
- `personal-fork-ux`: Personal-fork-specific UX behavior that intentionally diverges from upstream Pluely's licensed/paywalled behavior — starting with unconditional window dragging.
- `license-paywall-removal`: Removal/unlocking of Pluely's inherited license-paywall system for this personal-use, no-license-server fork — covers both unlocking gated features and hiding the purchase/license-entry UI, while explicitly leaving system-level (Rust global-shortcut, SaaS-proxy backend) gating untouched.

### Modified Capabilities
(none — no existing `openspec/specs/` capability currently covers window chrome or licensing behavior)

## Impact

- Affected code (drag-fix item): `src/components/DragButton.tsx`, `src/contexts/app.context.tsx` (`hasActiveLicense` source), and potentially the `GetLicense` component's usage in this file.
- Affected code (paywall removal, frontend only): `src/components/Promote.tsx`, `src/components/GetLicense.tsx` (usages removed, component itself may stay unused/removed), `src/pages/settings/components/Theme.tsx`, `src/pages/responses/index.tsx` + `ResponseLength.tsx` + `LanguageSelector.tsx` + `AutoScrollToggle.tsx`, `src/pages/system-prompts/PluelyPrompts.tsx`, `src/pages/system-prompts/Generate.tsx`, `src/hooks/useMenuItems.tsx`, `src/pages/screenshot/components/ScreenshotConfigs.tsx`, `src/hooks/useSettings.ts`, `src/hooks/useChatCompletion.ts`, `src/pages/dashboard/index.tsx`, `src/pages/dashboard/components/PluelyApiSetup.tsx`, `src/pages/chats/components/View.tsx`, `src/pages/app/components/speech/index.tsx`, `src/pages/shortcuts/components/shortcuts/ShortcutManager.tsx`, `src/lib/storage/shortcuts.storage.ts`.
- Explicitly NOT touched: `src-tauri/src/shortcuts.rs` (`LicenseState`, `move_window` gate), `src-tauri/src/activate.rs`, `src-tauri/src/api.rs` Pluely-proxy endpoints, `src-tauri/build.rs` — left as dormant/non-functional, matching current behavior.
- No data model or migration impact.
