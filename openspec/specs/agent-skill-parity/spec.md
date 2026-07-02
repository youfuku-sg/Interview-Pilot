## Purpose

`.claude/skills/` と `.codex/skills/` が同一のスキルセットを持つことを定める。このリポジトリは Claude Code と Codex CLI の両方から作業される前提で、`.claude/skills/` と `.codex/skills/` に同名スキルをミラーする運用になっている。

## Requirements

### Requirement: Claude Code and Codex skill directories stay in sync
For every skill intended for use in this repository's workflow, `.claude/skills/<name>/` and `.codex/skills/<name>/` SHALL contain identical content (SKILL.md and any supporting files such as `references/` or `rules/`).

#### Scenario: Comparing an existing shared skill
- **WHEN** the contents of `.claude/skills/<name>/` are compared against `.codex/skills/<name>/` for any skill present in both
- **THEN** the files are identical

#### Scenario: A skill exists only under .claude/skills
- **WHEN** a skill directory exists under `.claude/skills/` but has no counterpart under `.codex/skills/`
- **THEN** it is mirrored to `.codex/skills/<name>/` with identical content, unless it is explicitly scoped to Claude Code only (e.g. it depends on a Claude-Code-only tool)

### Requirement: Mirrored skill files are tracked in git
All skill directories under `.claude/skills/` and `.codex/skills/` that are part of this repository's shared skill set SHALL be committed to git, not left untracked.

#### Scenario: Checking git status for skill directories
- **WHEN** `git status` is run after this change is applied
- **THEN** no skill directory under `.claude/skills/` or `.codex/skills/` appears as untracked
