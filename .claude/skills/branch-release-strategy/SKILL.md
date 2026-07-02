---
name: branch-release-strategy
description: Follow the repository branch and release strategy when starting work, creating branches, preparing releases, choosing versions, updating VERSION/CHANGELOG, tagging releases, handling hotfixes, or ensuring incidental repository diffs such as OpenSpec files are committed before release.
license: MIT
metadata:
  author: Interview-Pilot
  version: "1.1"
  sourceDocument: "docs/仕様/ブランチ・リリース戦略.md"
---

Use this skill whenever work touches branch creation, branch naming, release preparation, versioning, changelog work, GitHub Release creation, release tags, or emergency fixes.

Details and the latest source of truth live in `docs/仕様/ブランチ・リリース戦略.md`. Read that document when the task depends on current release policy or an unresolved decision.

## Core Rules

- Treat `main` as the recommended stable branch in guidance, while remembering that the current `master` to `main` migration is not finalized.
- Do not use `develop`.
- Use `feature/<name>` for normal development.
- Use `release/v<version>` for release preparation.
- Use `hotfix/v<version>` for emergency fixes.
- Use semantic versions in `MAJOR.MINOR.PATCH` form.
- Use `v<version>` for release tags when tags are needed.
- Run release/build automation from `main` pushes, `v<version>` tag pushes, or manual workflow dispatch.
- Keep one feature focused on one purpose where practical.
- Do not leave incidental diffs or untracked files behind during release work. Commit them before release/tag operations even when they are not part of the main code change.
- After merging `release/*` or `hotfix/*` into the stable branch, delete the release or hotfix branch.

## Starting Normal Work

Before changing implementation files for ordinary development:

1. Check the current branch with `git branch --show-current`.
2. If already on an appropriate `feature/<name>` branch, continue there.
3. If on the stable branch (`main`, or `master` until the migration decision is made), create a focused `feature/<name>` branch from the stable branch.
4. If on an unrelated branch, pause and ask the user whether to switch, create a new feature branch, or continue intentionally.

Prefer branch names that describe the work, for example `feature/japanese-ui`, `feature/personal-docs`, or `feature/release-workflow`.

## Incidental Diffs

Before creating a `release/*` or `hotfix/*` branch, merging into the stable branch, creating a release tag, or declaring release work complete:

1. Run `git status --short`.
2. Identify diffs and untracked files that are not part of the primary implementation, such as OpenSpec artifacts, planning docs, release notes, skill files, or verification records.
3. Commit those files unconditionally instead of leaving them unstaged or untracked. Prefer a separate focused commit, for example `Record release verification plan` or `Update release strategy skill`.
4. Include generated/planning files when they explain, validate, or complete the work, especially files under `openspec/`.
5. Do not commit build outputs, secrets, local environment files, or dependency directories that should be ignored. If such files appear, report them and leave them uncommitted.

This repository favors a clean release history over leaving supporting artifacts outside git. Do not pause to ask whether to commit incidental OpenSpec or documentation diffs; commit them.

## Release Preparation

Use `release/v<version>` for release preparation. The expected initial flow is:

1. Finish the focused work on `feature/<name>`.
2. Create `release/v<version>` from the corresponding `feature/*` branch.
3. Update `VERSION` and `CHANGELOG.md` if the user has confirmed those files should exist for this release.
4. Run the relevant build through GitHub Actions, using manual workflow dispatch or a `v<version>` tag push for release builds.
5. Attach build artifacts to a draft GitHub Release.
6. Install and verify the produced artifact.
7. Merge the release branch into the stable branch if verification passes.
8. Create a `v<version>` tag when the release flow calls for a tag.
9. Delete the `release/*` branch after merge.

The repository strategy currently favors `1 release = 1 feature`; avoid bundling multiple unrelated features into one release unless the user explicitly chooses that.

## Hotfixes

Use `hotfix/v<version>` only for emergency fixes.

- Branch directly from the stable branch.
- It is acceptable to work directly on `hotfix/*` without a separate `feature/*` branch.
- Increment the patch version by 1 unless the user chooses a different version.
- Merge back to the stable branch after verification.
- Delete the `hotfix/*` branch after merge.

## Unresolved Decisions

Do not decide these items independently. If a task requires one of them, ask the user and record or follow their answer:

- Whether and when to switch the stable branch from `master` to `main`.
- How to handle the existing `master` branch.
- Whether to create a root `VERSION` file.
- Whether to create a root `CHANGELOG.md`.
- Whether version numbers are manual or generated automatically.
- Whether GitHub Releases should be draft, prerelease, or public.
- Whether to build Windows first or all three OS targets together.
- Whether to produce Tauri updater JSON.
- Whether unsigned builds are acceptable for the current release.
- When to rename app identity from Pluely to Interview-Pilot.

## Agent Behavior

- Mention this strategy before creating or changing branches.
- Keep branch and release guidance aligned with `docs/仕様/ブランチ・リリース戦略.md`.
- When the document says an item is a recommendation or candidate rather than a final decision, present it that way.
- If the current repository state conflicts with the recommended strategy, explain the conflict and ask before making branch-level changes.
