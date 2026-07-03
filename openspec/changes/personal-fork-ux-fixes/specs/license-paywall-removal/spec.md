## ADDED Requirements

### Requirement: Previously license-gated product features are always usable
Frontend features that were conditionally locked behind `hasActiveLicense` SHALL behave as if always licensed, since this fork has no license server and `hasActiveLicense` can never legitimately become `true`. This applies to: theme/window-transparency controls, response length/language/auto-scroll settings, the chat input area (attachments, mic, screenshot, send), Pluely prompt presets, the AI prompt generator, the sidebar support menu item, screenshot selection-capture mode, the screenshot-attach button in the audio popover, and keyboard-shortcut re-binding.

#### Scenario: User changes theme and transparency without a license
- **WHEN** the user opens Settings and adjusts the theme or window-transparency controls
- **THEN** the controls are fully interactive and apply the change, with no "requires a license" messaging or disabled state

#### Scenario: User customizes response length, language, or auto-scroll
- **WHEN** the user opens the Responses settings page and changes response length, response language, or auto-scroll
- **THEN** the change is applied, with no premium-feature banner or disabled controls

#### Scenario: User uses the full chat input area
- **WHEN** the user opens the chat page
- **THEN** the input area (attachments, mic, screenshot, textarea, send button) is fully usable, with no license-required overlay banner

#### Scenario: User selects a Pluely prompt preset or generates a prompt with AI
- **WHEN** the user clicks a prompt preset card or the AI prompt generator
- **THEN** the action proceeds normally, with no lock icon, dimmed styling, or "ロック解除" CTA

#### Scenario: User uses screenshot selection-capture mode
- **WHEN** the user switches the screenshot setting to selection ("範囲選択") mode and captures
- **THEN** the capture proceeds normally, with no "requires a license" error

#### Scenario: User re-binds a keyboard shortcut
- **WHEN** the user opens Shortcuts settings and attempts to change the key binding for a customizable shortcut (other than `move_window`)
- **THEN** the "変更" control is enabled and the rebinding succeeds, with no lock icon or "カスタマイズにはライセンスが必要です" messaging

### Requirement: License-purchase and Pluely-hosted-API entry points are removed from the UI
Since this fork never configures a payment backend, the UI SHALL NOT present license-purchase or license-key-entry affordances that dead-end at a non-existent backend. This includes: the `GetLicense` checkout-URL CTA (in all its usages), the referral/coupon promo card (`Promote.tsx`), and the license-key entry / activate / deactivate / "Pluely API 有効化" toggle / Pluely-hosted-model-selection section of the Dashboard's Pluely API setup screen.

#### Scenario: No license purchase CTA appears anywhere in the app
- **WHEN** the user navigates through Settings, Dashboard, Responses, System Prompts, Shortcuts, or the chat/overlay UI
- **THEN** no button or link initiates a license checkout flow, and no "有効なライセンスが必要です" messaging is shown

#### Scenario: Dashboard no longer offers license-key entry
- **WHEN** the user opens the Dashboard
- **THEN** there is no license-key input field, activate/deactivate control, or "Pluely API 有効化" toggle

### Requirement: System-level (Rust/Tauri) license gating is explicitly left unchanged
Backend/system-level code that enforces license state SHALL NOT be modified by this change, even though it remains non-functional in this fork. This includes the arrow-key `move_window` global-shortcut gate in `src-tauri/src/shortcuts.rs`'s `LicenseState`, and the Pluely payment/checkout/proxy backend in `src-tauri/src/activate.rs` and the corresponding parts of `src-tauri/src/api.rs`.

#### Scenario: Arrow-key window-move shortcut remains non-functional
- **WHEN** the user binds and triggers the `move_window` arrow-key shortcut
- **THEN** it continues to silently no-op (unchanged from current behavior), since mouse-based window dragging (delivered separately by the `personal-fork-ux` capability) already covers the underlying need and the Rust-side gate is intentionally left untouched
