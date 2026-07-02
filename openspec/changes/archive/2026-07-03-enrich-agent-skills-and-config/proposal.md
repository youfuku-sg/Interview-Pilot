## Why

このリポジトリは Claude Code と Codex CLI の両方から作業される前提で、`.claude/skills/` と `.codex/skills/` に同名スキルをミラーする運用になっている(例: `branch-release-strategy` は両ディレクトリで内容が一致)。しかし現状、`.claude/skills/` には `building-components`, `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines` の4スキールが存在する一方、`.codex/skills/` にはミラーされておらず、さらにこの4件はgit未追跡(未コミット)のまま残っている。また、今回のPluelyベースの面接支援アプリ改修という案件固有の作業(Pluely由来コードの整理、Tauri/Rust実装、面接支援ドメインロジック、ローカルLLM/STT連携)を支援するプロジェクト固有スキルが存在しない。加えて、Claude Codeの設定は `.claude/settings.local.json`(gitignore対象・個人設定)に全ての許可ルールが集約されており、チームやセッションを跨いで再利用すべき設定と、個人環境依存の設定が区別されていない。プロジェクトを説明する `CLAUDE.md` も存在しない。

## What Changes

- `.claude/skills/` にあり `.codex/skills/` に存在しない4スキル(`building-components`, `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`)を `.codex/skills/` にミラーし、既存の未コミットファイルも含めてコミットする。
- 今回の案件向けに以下の新規スキルを作成し、`.claude/skills/` と `.codex/skills/` の両方に同一内容でミラー配置する。
  - `pluely-cleanup-checklist`: `docs/仕様/要求仕様書.md` 13.1節が最優先とする「Pluely 由来の不要な analytics / license / stealth 文言の整理」を、コード変更のたびに確認できるチェックリスト化する(`tauri-plugin-posthog` 等のtelemetry系依存の検出observationを含む)。
  - `tauri-rust-conventions`: `src-tauri/` の構成、OS別条件分岐(`cfg(target_os = ...)`)、プラグイン一覧、Cargo依存の扱いなど、このリポジトリ固有のRust/Tauri実装規約をまとめる。
  - `interview-support-domain`: `docs/仕様/要求仕様書.md` 7章(機能要求)・8.6節(倫理と利用方針)を参照しやすい形に要約し、質問抽出・意図分類・回答支援ロジックを実装する際にドメイン知識と禁止事項を参照できるようにする。
  - `local-llm-stt-integration`: 要求仕様書 7.10節に基づき、Ollama/LM Studio等のローカルLLMや whisper.cpp 等のローカルSTTを既存のDev Space(カスタムAI/STTプロバイダ設定)経由で接続する際の方針・実装パターンをまとめる。
- `CLAUDE.md` を新設し、プロジェクト概要・技術スタック・ディレクトリ構成・関連ドキュメント(`docs/仕様/`)・OpenSpecワークフローなど、Claude Codeがこのリポジトリで作業する際に前提として持つべき情報をまとめる。
- `.claude/settings.local.json` の許可ルールを棚卸しし、チーム/リポジトリ共通で安全に共有できるもの(読み取り専用コマンドや `openspec`/`git`/`npm` の定型コマンド等)を新設する `.claude/settings.json`(git管理下)に移し、個人環境依存・広範な許可(`Bash(*)` 等)は `.claude/settings.local.json` に残す。
- **BREAKING**: なし(エージェント設定・ドキュメントのみの変更で、アプリの実行時挙動には影響しない)。

## Capabilities

### New Capabilities
- `agent-skill-parity`: `.claude/skills/` と `.codex/skills/` が同一のスキルセットを持つことを定める。
- `project-specific-agent-skills`: 本案件(Pluelyベースの面接支援アプリ改修)に固有の知識を提供する新規スキル群の内容要件を定める。
- `claude-code-project-config`: `CLAUDE.md` の存在と、共有設定(`settings.json`)と個人設定(`settings.local.json`)の分離方針を定める。

### Modified Capabilities
(なし)

## Impact

- 対象: `.claude/skills/**`, `.codex/skills/**`, `.claude/settings.json`(新設), `.claude/settings.local.json`(棚卸し・削減), `CLAUDE.md`(新設)
- アプリ本体のコード・ビルド・実行時挙動への影響なし。
- 今後 [localize-ui-japanese](../localize-ui-japanese/), [rebrand-readme-security-ja](../rebrand-readme-security-ja/), [update-dependencies-minor-patch](../update-dependencies-minor-patch/) を実装する際、および要求仕様書に基づく今後の機能開発において、Claude Code / Codex 双方が一貫したガイダンスを参照できるようになる。
