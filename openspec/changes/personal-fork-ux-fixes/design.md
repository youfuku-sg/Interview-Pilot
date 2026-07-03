## Context

`src/components/DragButton.tsx` renders a grip-icon button in the main overlay window. Its behavior branches on `hasActiveLicense` (from `useApp()`, sourced from `src/contexts/app.context.tsx:134`, `useState<boolean>(false)` with no code path that ever sets it `true` in this fork):

- `hasActiveLicense === false` (always, in this fork): renders a `Popover` with copy "この機能を使用するには有効なライセンスが必要です" and a `GetLicense` CTA. The button itself has no `data-tauri-drag-region`, so the window cannot be dragged from this handle.
- `hasActiveLicense === true` (dead code in this fork): renders a plain button with `data-tauri-drag-region={hasActiveLicense}`, which is how Tauri's native window-drag is wired up (any DOM element with `data-tauri-drag-region="true"` becomes a drag handle for the OS window, per Tauri v2 docs).

Window config (`src-tauri/tauri.conf.json`) has `decorations: false` — there is no OS title bar to drag from, so this in-app drag handle is the only way to reposition the window. Without it, the window is stuck wherever it spawns (top-center).

Separately, `src/hooks/useWindow.ts:39` already has generic drag-region handling (`isDragRegion = target.closest('[data-tauri-drag-region="true"]')`) that works off the DOM attribute, not off `hasActiveLicense` directly — so fixing `DragButton.tsx` alone is sufficient; no changes needed in `useWindow.ts`.

## Goals / Non-Goals

**Goals:**
- The grip handle in the main overlay is always draggable, independent of `hasActiveLicense`.
- Remove the license-required popover/CTA from this specific control, since it advertises a purchase flow that doesn't exist in this fork.
- Keep the change minimal and localized to `DragButton.tsx` — don't touch the `hasActiveLicense` state/plumbing itself, since ~40 other call sites depend on it and are out of scope for this task.

**Non-Goals:**
- Changing window chrome, decorations, or resize behavior.
- (Superseded by the "License paywall removal" section below — the other `hasActiveLicense` call sites are now in scope as a second, explicitly-tracked item in this same change, not left as an open-ended future backlog.)

## License paywall removal (2nd request in this change)

### Context

A full-codebase inventory (see task history / PR discussion) found `hasActiveLicense`-gated behavior in ~19 frontend files plus a parallel, independent license gate on the Rust/Tauri side:

- **Frontend feature gates** (`hasActiveLicense` read directly): Theme/transparency (`Theme.tsx`), response length/language/auto-scroll (`responses/index.tsx`, `ResponseLength.tsx`, `LanguageSelector.tsx`, `AutoScrollToggle.tsx`), Pluely prompt presets (`PluelyPrompts.tsx`), AI prompt generator (`Generate.tsx`), sidebar support menu item (`useMenuItems.tsx`), screenshot selection mode (`ScreenshotConfigs.tsx`, `useSettings.ts`, `useChatCompletion.ts`), Dashboard activity view + CTA (`dashboard/index.tsx`), the "Pluely API 有効化" toggle (`PluelyApiSetup.tsx`), the entire chat input area (`chats/components/View.tsx`), the screenshot-attach button in the audio popover (`speech/index.tsx`), and shortcut re-binding (`ShortcutManager.tsx`, `shortcuts.storage.ts`).
- **License-purchase/entry UI** (not a feature gate, but the paywall UI itself): `GetLicense.tsx` (checkout-URL button, used as the CTA in most of the above), `Promote.tsx` (referral/coupon promo card shown to unlicensed users), and the license-key entry/activate/deactivate/model-select section inside `PluelyApiSetup.tsx`.
- **Backend (Rust) license gates**, independent of the frontend flag: `src-tauri/src/shortcuts.rs` has its own `LicenseState` (synced from the frontend via `set_license_status`) that silently no-ops the arrow-key `move_window` shortcut and skips its OS-level registration when inactive; `src-tauri/src/activate.rs` and parts of `src-tauri/src/api.rs` implement the actual checkout/activate/validate/proxy calls to Pluely's payment backend, which this fork never configures (`PAYMENT_ENDPOINT`/`API_ACCESS_KEY` are unset, confirmed via the `github-actions-installer-release` change that deliberately removed the CI step injecting them).

The user's explicit direction after seeing this inventory: it's fine if the license-purchase/entry surfaces end up **hidden and unusable** rather than surgically deleted, and anything that "システムに絡む" (touches system-level registration/backend plumbing) should not be forced open — leaving it non-functional is an acceptable outcome, since forcing it open risks destabilizing OS-level shortcut registration for no real benefit in a personal, non-commercial fork.

### Goals

- Every frontend `hasActiveLicense`-gated **product feature** listed above behaves as if always licensed (fully usable, no dimming/locking/early-return).
- Every license-purchase/entry **UI surface** (`GetLicense` CTA renders, `Promote.tsx`, the license-key section of `PluelyApiSetup.tsx`, the Dashboard license CTA) is removed or hidden from the UI, since it dead-ends at a payment backend this fork doesn't run.
- No changes to Rust/Tauri backend code. The `move_window` arrow-key shortcut's `LicenseState` gate and the Pluely SaaS-proxy backend (`activate.rs`, relevant parts of `api.rs`) are left exactly as-is — already non-functional in this fork, which satisfies the requirement without touching system-level registration code.

### Non-Goals

- Modifying `src-tauri/src/shortcuts.rs`, `src-tauri/src/activate.rs`, `src-tauri/src/api.rs`, or `src-tauri/build.rs`.
- Restoring or fixing the arrow-key `move_window` shortcut (mouse-drag, unlocked by request #1 in this change, already covers the underlying need).
- Deleting the `hasActiveLicense` state/plumbing in `app.context.tsx` itself, or the Rust `secure_storage`/`validate_license_api`/etc. commands — removing the *reads* (gates) is sufficient; the dormant state and backend commands can remain unused rather than risk a wider refactor.
- Renaming or removing the "Pluely API" concept/toggle's underlying functions (`shouldUsePluelyAPI`, `fetchPluelyAIResponse`, `fetchPluelySTT`) — only the UI entry point to enable it is removed; the functions become unreachable dead code, not deleted, to limit blast radius.

### Decisions

**Decision: For each frontend feature gate, delete the `hasActiveLicense` conditional and keep the "licensed" behavior as the only behavior** (mirrors the `DragButton.tsx` approach from request #1). Applies to: `Theme.tsx`, `responses/index.tsx` + its 3 sub-components, `PluelyPrompts.tsx`, `Generate.tsx`, `useMenuItems.tsx`, `ScreenshotConfigs.tsx` + `useSettings.ts` + `useChatCompletion.ts`, `View.tsx`, `speech/index.tsx`, `ShortcutManager.tsx` (re-binding only) + `shortcuts.storage.ts`'s `getAllShortcutActions`.
Alternative considered: introduce a single `const hasActiveLicense = true` constant/flag instead of editing every call site — rejected because it leaves ~19 files silently depending on a lie, is easy to accidentally revert, and still ships dead `GetLicense`/lock-icon UI branches that need removing anyway.

**Decision: `dashboard/index.tsx`'s activity fetch stays gated in effect, since it targets a Pluely backend endpoint that doesn't exist for this fork — but drop the "requires license" framing.** `get_activity` (Rust) calls a Pluely-hosted usage-stats endpoint; there's nothing to unlock since there's no local activity source to show instead. Remove the `GetLicense` CTA from the page header and the "Pluelyライセンスで..." marketing copy; leave the activity section either empty/omitted or replaced with a short explanatory note, rather than pretending it will now show real data.

**Decision: Remove the license-purchase/entry UI outright rather than leave it dimmed.** `GetLicense.tsx` usages, `Promote.tsx`, and the license-key/activate/deactivate/checkout/model-select block in `PluelyApiSetup.tsx` are removed from their parent components' render trees. This is a UI-level removal (delete JSX + now-dead handlers/imports), not a deletion of the underlying Rust commands or `pluely.api.ts` — per the Non-Goals above, the backend plumbing stays in place but becomes unreferenced from the UI.

**Decision: Do not touch anything in `src-tauri/`.** Per explicit user direction, system-level/global-shortcut and payment-backend code is left untouched. The arrow-key `move_window` shortcut remains non-functional (already the case today); this is an accepted, intentional gap, not a bug to fix in this change.

## Risks / Trade-offs

## Decisions

**Decision: Always render the plain draggable button; delete the license-gated branch in `DragButton.tsx`.**
Rather than flipping a default or special-casing this fork, remove the `if (!hasActiveLicense) { ... }` branch entirely so the component has one unconditional render path with `data-tauri-drag-region={true}`. This directly matches the guidance in `CLAUDE.md`/`pluely-cleanup-checklist` to remove Pluely-era license-gating rather than work around it, and avoids leaving dead conditional code that references a `hasActiveLicense` value that can never be `true`.
Alternative considered: keep the branch but force `data-tauri-drag-region={true}` in both cases — rejected because it leaves confusing dead code (an unreachable-in-practice popover) and unused imports (`Popover`, `GetLicense`) that a future reader would have to puzzle through.

**Decision (request #1 only): Do not touch `hasActiveLicense` itself or other call sites for the drag-button fix.**
At the time of request #1, the other 40+ call sites were out of scope. Request #2 (see "License paywall removal" above) now explicitly brings the frontend call sites into scope, so this decision applies only to keeping request #1's diff minimal — it does not mean those call sites stay locked forever.

## Risks / Trade-offs

- [Risk] Removing the `Popover`/`GetLicense` import usage in `DragButton.tsx` may leave now-unused imports if not cleaned up → Mitigation: remove unused imports as part of the same edit; run `npm run lint` / `npm run typecheck` to confirm.
- [Risk] Other code may rely on `DragButton` being non-interactive/hidden when unlicensed (e.g., a screenshot test or layout assumption) → Mitigation: grep for `DragButton` usage before editing to confirm it's only rendered in the one overlay layout; manually verify the overlay in the running app after the change (per repo convention of testing UI changes live).
- [Trade-off] This creates a small, deliberate behavior divergence from upstream Pluely (window is draggable without a license) — acceptable per `CLAUDE.md`: this fork has "no third-party redistribution planned" and is not bound by upstream's monetization model.
- [Risk] Removing `hasActiveLicense` conditionals across ~19 files is mechanically repetitive and easy to do inconsistently (e.g. missing an unused import, leaving a dangling `isLocked`-style prop) → Mitigation: go file-by-file per the task list, `npm run typecheck` + `npm run lint` after each group, not just at the end.
- [Risk] Removing the `PluelyApiSetup.tsx` license section might leave `pluelyApiEnabled` in a confusing half-state (toggle removed from UI, but the underlying `localStorage` flag / Rust fallback code paths still exist) → Mitigation: since the toggle UI is gone, `pluelyApiEnabled` can never be set to `true` again through normal use going forward; existing `true` values from before this change are a pre-existing edge case, not something this change needs to migrate (no data migration performed, per Non-Goals).
- [Trade-off] Leaving `src-tauri/` untouched means the arrow-key `move_window` shortcut and the Pluely SaaS-proxy backend remain present but permanently unreachable dead code in the Rust binary — accepted per explicit user direction, to avoid the higher risk of touching global-shortcut registration and payment-proxy code paths for a personal fork.

## Migration Plan

No data migration. Ship as a normal frontend change:
1. Edit `DragButton.tsx` per Decisions above.
2. `npm run typecheck` and `npm run lint`.
3. Manually verify in the running app: launch, confirm the grip handle drags the window, confirm no license popover appears.
4. No rollback concerns beyond a normal git revert.

## Open Questions

- Should the `GetLicense`/license-key UI be removed project-wide, or intentionally kept for other surfaces (e.g. as a no-op placeholder in case a future non-commercial "settings profile" concept reuses it)? Deferred — out of scope here, candidate for a future backlog task in this change or a dedicated cleanup change.
