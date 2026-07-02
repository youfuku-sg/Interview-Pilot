## Purpose

本案件(Pluelyベースの面接支援アプリ改修)に固有の知識を提供する新規スキル群の内容要件を定める。Pluely由来コードの整理、Tauri/Rust実装、面接支援ドメインロジック、ローカルLLM/STT連携を支援するプロジェクト固有スキルを提供する。

## Requirements

### Requirement: Pluely cleanup checklist skill exists
A skill named `pluely-cleanup-checklist` SHALL exist (mirrored per [[agent-skill-parity]]) that helps identify leftover upstream-Pluely analytics, license, and stealth-marketing content that `docs/仕様/要求仕様書.md` section 13.1 identifies as a top priority to remove.

#### Scenario: Reviewing code that touches dependencies or user-facing copy
- **WHEN** a change touches `src-tauri/Cargo.toml`, `package.json`, `README.md`, `SECURITY.md`, or UI copy
- **THEN** the `pluely-cleanup-checklist` skill's guidance is available to check for remaining upstream analytics/telemetry dependencies, license-key code, or stealth-framed marketing language

### Requirement: Tauri/Rust conventions skill exists
A skill named `tauri-rust-conventions` SHALL exist (mirrored per [[agent-skill-parity]]) documenting this repository's `src-tauri/` structure, OS-specific conditional compilation pattern, plugin list, and Cargo dependency conventions.

#### Scenario: Implementing a Rust-side change
- **WHEN** a change is made under `src-tauri/`
- **THEN** the `tauri-rust-conventions` skill's guidance is available to describe the expected structure and conventions

### Requirement: Interview-support domain skill exists
A skill named `interview-support-domain` SHALL exist (mirrored per [[agent-skill-parity]]) summarizing the functional requirements (要求仕様書 section 7) and ethical policy (要求仕様書 section 8.6) relevant to implementing question extraction, intent classification, and answer-support features.

#### Scenario: Implementing an interview-support feature
- **WHEN** a change implements question extraction, intent classification, or answer-support logic
- **THEN** the `interview-support-domain` skill's guidance is available summarizing the relevant domain requirements and the ethical constraints from section 8.6

### Requirement: Local LLM/STT integration skill exists
A skill named `local-llm-stt-integration` SHALL exist (mirrored per [[agent-skill-parity]]) describing how to connect local LLM providers (e.g. Ollama, LM Studio) and local STT providers (e.g. whisper.cpp) via the existing Dev Space custom-provider mechanism, per 要求仕様書 section 7.10.

#### Scenario: Configuring a local AI or STT provider
- **WHEN** a change integrates a local LLM or local STT provider
- **THEN** the `local-llm-stt-integration` skill's guidance is available describing the recommended connection pattern
