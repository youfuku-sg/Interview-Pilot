## Why

Interview-Pilot is a personal-use, local-first fork of Pluely with no third-party redistribution planned (`docs/仕様/要求仕様書.md` §8.7). The app still ships Pluely's auto-update feature unchanged: it checks `https://pluely.com/api/update`, verifies signatures with Pluely's own pubkey, and links users to `pluely.com/downloads` for manual installs. `openspec/specs/installer-release-workflow/spec.md` already states the release workflow SHALL NOT generate updater JSON, so this app's own releases can never satisfy that endpoint. The updater code is therefore either fully dead (falls back to "up to date" forever) or, worse, could report and link users to Pluely's unrelated upstream releases — a stale, misleading remnant that should be removed rather than left half-wired.

## What Changes

- **BREAKING**: Remove the in-app update-check/download/install UI and its trigger button entirely (no user-facing replacement).
- Remove `tauri-plugin-updater` / `@tauri-apps/plugin-updater` plugin registration and dependencies (Rust and JS).
- Remove the `updater` plugin config and `createUpdaterArtifacts` bundle setting from `src-tauri/tauri.conf.json`.
- Remove any `updater`-related permissions from `src-tauri/capabilities/*.json`.
- No replacement auto-update mechanism is introduced; users will continue to obtain new builds manually (e.g., from draft GitHub Releases per the existing installer-release-workflow).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none — no existing spec in `openspec/specs/` currently governs an auto-update capability; `installer-release-workflow` already forbids generating updater JSON and needs no requirement change)

## Impact

- `src/components/updater/index.tsx` — deleted.
- `src/components/index.ts` — remove `Updater` export/usage.
- Any parent component that renders `<Updater />` — remove the reference.
- `src-tauri/src/lib.rs` — remove `tauri_plugin_updater::Builder::new().build()` registration.
- `src-tauri/Cargo.toml` — remove `tauri-plugin-updater` dependency.
- `package.json` — remove `@tauri-apps/plugin-updater` dependency.
- `src-tauri/tauri.conf.json` — remove `plugins.updater` block and set/remove `bundle.createUpdaterArtifacts`.
- `src-tauri/capabilities/*.json` — remove updater-related permission entries.
- No database, API, or build-pipeline changes beyond the above (installer-release-workflow already excludes updater JSON generation).
