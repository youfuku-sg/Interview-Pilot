## Purpose

`CLAUDE.md` の存在と、共有設定(`.claude/settings.json`)と個人設定(`.claude/settings.local.json`)の分離方針を定める。プロジェクトを説明する `CLAUDE.md` と、チーム/リポジトリ共通で安全に共有できる許可ルールを、個人環境依存の広範な許可ルールと区別して管理できるようにする。

## Requirements

### Requirement: CLAUDE.md exists and documents the project
A `CLAUDE.md` file SHALL exist at the repository root, describing the project's technology stack, directory layout, the role of `docs/仕様/`, and the OpenSpec workflow used in this repository.

#### Scenario: Starting a new Claude Code session in this repository
- **WHEN** a Claude Code session starts in this repository
- **THEN** `CLAUDE.md` is present and provides enough context to identify the tech stack, key directories, and the OpenSpec change workflow without reading the full codebase

### Requirement: Shared and personal Claude Code permissions are separated
Broadly-scoped or environment-specific permission rules (such as an unrestricted `Bash(*)` allow) SHALL remain in `.claude/settings.local.json` (untracked, personal), while narrowly-scoped, safe, repository-workflow-specific permission rules SHALL be moved to a git-tracked `.claude/settings.json`.

#### Scenario: Reviewing .claude/settings.json
- **WHEN** `.claude/settings.json` is reviewed after this change is applied
- **THEN** it exists, is tracked in git, and contains only narrowly-scoped or read-only permission rules (no unrestricted `Bash(*)`-style allow)

#### Scenario: A new contributor clones the repository
- **WHEN** a new contributor or a fresh Claude Code session starts in this repository without any pre-existing personal settings
- **THEN** the repository-shared safe permissions from `.claude/settings.json` are already available, reducing repeated permission prompts for common, safe repository workflows
