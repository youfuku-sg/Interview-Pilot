## 1. Frontend removal

- [ ] 1.1 Delete `src/components/updater/index.tsx`
- [ ] 1.2 Remove the `Updater` export from `src/components/index.ts`
- [ ] 1.3 Remove the `<Updater />` usage and its import from `src/pages/app/index.tsx`
- [ ] 1.4 Remove `@tauri-apps/plugin-updater` and `@tauri-apps/plugin-process` (if no longer used elsewhere) from `package.json` and run `npm install` to update the lockfile

## 2. Backend removal

- [ ] 2.1 Remove `.plugin(tauri_plugin_updater::Builder::new().build())` from `src-tauri/src/lib.rs`
- [ ] 2.2 Remove the `tauri-plugin-updater` dependency from `src-tauri/Cargo.toml` and run `cargo build` to update `Cargo.lock`

## 3. Configuration removal

- [ ] 3.1 Remove the `plugins.updater` block (endpoint/pubkey/windows.installMode) from `src-tauri/tauri.conf.json`
- [ ] 3.2 Remove or set `bundle.createUpdaterArtifacts` appropriately in `src-tauri/tauri.conf.json` (drop the key if the field is optional)
- [ ] 3.3 Remove `"updater:default"` from `src-tauri/capabilities/default.json`
- [ ] 3.4 Remove `"updater:default"` from `src-tauri/capabilities/cross-platform.json`

## 4. Verification

- [ ] 4.1 Run `npm run typecheck` and `npm run lint` and confirm no residual references to the updater component/plugin
- [ ] 4.2 Run `cargo fmt --check` and `cargo clippy` in `src-tauri/` and confirm no residual references to `tauri_plugin_updater`
- [ ] 4.3 Grep the repo for `pluely.com` and `plugin-updater`/`tauri_plugin_updater` to confirm no remaining references outside of git history
- [ ] 4.4 Launch the app in dev mode and confirm it starts without an update-check UI element and without any updater-related console errors
