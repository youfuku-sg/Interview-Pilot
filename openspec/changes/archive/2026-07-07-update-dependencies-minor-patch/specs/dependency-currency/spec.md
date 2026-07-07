## ADDED Requirements

### Requirement: npm dependencies are current within their major version
All npm dependencies declared in `package.json` SHALL be updated to the latest available minor/patch release within their currently adopted major version, except where doing so is blocked by a package's own zero-major versioning constraints (which SHALL be handled by explicitly updating the version range) or where the latest available release is a major version bump (which SHALL be excluded and tracked separately).

#### Scenario: Running npm outdated after the update
- **WHEN** `npm outdated` is run after this change is applied
- **THEN** no listed package shows a `Wanted` version newer than its `Current` version, for packages whose `Latest` remains within the currently adopted major version

#### Scenario: Zero-major package version range
- **WHEN** a dependency such as `@ricky0123/vad-react` has a newer patch release that its current `^0.0.x` range cannot reach
- **THEN** `package.json` is updated to explicitly reference the newer version

### Requirement: Rust dependencies are current within their major version
All Rust dependencies declared in `src-tauri/Cargo.toml` SHALL be updated to the latest available minor/patch release within their currently adopted major version, using the same major-version-boundary and zero-major handling as the npm dependencies.

#### Scenario: Running cargo update
- **WHEN** `cargo update` is run in `src-tauri/` after this change is applied
- **THEN** `Cargo.lock` reflects the latest minor/patch versions available within each crate's currently adopted major version

### Requirement: Post-update verification passes
After dependency versions are updated, the project SHALL still build and pass type-checking and linting.

#### Scenario: Verifying the frontend after updates
- **WHEN** `npm run typecheck`, `npm run lint`, and `npm run build` are run after the dependency updates
- **THEN** all three commands complete without errors
