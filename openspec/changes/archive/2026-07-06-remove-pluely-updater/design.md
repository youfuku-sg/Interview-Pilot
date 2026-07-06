## Context

Interview-Pilot inherited Pluely's Tauri auto-updater end-to-end: a React `Updater` component that calls `@tauri-apps/plugin-updater`'s `check()`/`downloadAndInstall()`, a Rust-side `tauri_plugin_updater::Builder::new().build()` registration, and a `plugins.updater` block in `src-tauri/tauri.conf.json` pointing at `https://pluely.com/api/update` with Pluely's own minisign pubkey. `openspec/specs/installer-release-workflow/spec.md` already forbids generating updater JSON from this project's own release workflow (`SHALL NOT`), so the endpoint this app queries can never be backed by this project's releases — it only ever talks to Pluely's real update server. Per `docs/仕様/要求仕様書.md` §8.7, this app has no redistribution plan, so there is no release channel for the updater to legitimately serve anyway.

## Goals / Non-Goals

**Goals:**
- Remove all updater-related code paths (frontend UI, Rust plugin registration, config, dependencies, capability permissions) so no component references Pluely's update infrastructure.
- Leave no dangling imports/exports or unused dependencies after removal.
- Document (via spec) that this app intentionally has no auto-update mechanism, so a future contributor doesn't reintroduce a half-wired version pointed at the wrong endpoint.

**Non-Goals:**
- Building a replacement auto-update mechanism against this project's own GitHub Releases (a separate future change if ever desired).
- Changing `installer-release-workflow`'s existing "no updater JSON" requirement — it already matches the desired end state and needs no edit.

## Decisions

- **Delete rather than disable.** Comment-out or feature-flagging would leave dead code and Pluely-branded strings (`pluely.com`) in the tree, which conflicts with the [pluely-cleanup-checklist](.claude/skills/pluely-cleanup-checklist/SKILL.md) skill's intent. A clean removal is simpler and matches "no redistribution planned."
- **No replacement update-check UI.** Since there's no release channel this app controls that publishes updater manifests, any "check for updates" affordance would either always report "up to date" (misleading) or need to be wired to a real endpoint later — out of scope here.
- **Document the absence as a spec requirement**, not just a code diff. Adding a small `manual-update-distribution` capability spec records the decision (no auto-update; users fetch installers manually from draft GitHub Releases) so it's traceable and future changes touching updater code have a spec to check against.

## Risks / Trade-offs

- [Users lose any expectation of in-app update notifications] → Acceptable: no such notifications currently work correctly anyway (they'd point to Pluely's own releases, not this app's). Manual updates via GitHub Releases remain available per `installer-release-workflow`.
- [Future contributor may want auto-update again] → Mitigated by the new spec requirement making the current state explicit and discoverable, rather than an unexplained gap.

## Migration Plan

1. Remove frontend component and its usages.
2. Remove Rust plugin registration and Cargo dependency.
3. Remove JS dependency and tauri.conf.json updater config/bundle flag.
4. Remove updater permissions from capabilities files.
5. Run `npm run typecheck`, `npm run lint`, `cargo fmt --check`, `cargo clippy` to confirm no residual references.
6. No data migration or rollback concerns — purely additive-free removal of unused code paths.

## Open Questions

None.
