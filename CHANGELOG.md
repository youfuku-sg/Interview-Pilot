# Changelog

このファイルは [Keep a Changelog](https://keepachangelog.com/) 形式に準ずる。過去のリリース（v0.1.10 より前）は遡って記載しない。形式・運用方針は `docs/仕様/ブランチ・リリース戦略.md` 4.3節を参照。

## [0.1.16] - 2026-07-03

### Changed

- `README.md` を Pluely upstream 由来の英語・商用マーケティング文言(寄付/雇用勧誘バッジ、作者個人SNSリンク、`pluely.com` ダウンロードリンク・バッジ、ライセンス販売訴求)から、Interview-Pilot(個人利用前提の面接支援アプリ)向けの日本語説明に全面的に書き直した。`docs/仕様/要求仕様書.md` 8.6節の倫理方針に反する「ステルス」「検知されない」訴求表現も中立的な説明に置き換えた
- `SECURITY.md` を日本語化し、upstream リポジトリ・連絡先への参照を本リポジトリ向けの内容に置き換えた
- 完了済みの OpenSpec change(`rebrand-readme-security-ja`, `enrich-agent-skills-and-config`)を `openspec/changes/archive/` にアーカイブし、対応する capability spec を `openspec/specs/` に同期した

### Fixed

- `.github/workflows/publish.yml` の起動条件を `main` push OR `v<version>` タグ push から、`v<version>` タグ push かつそのタグの指すコミットが `main` の履歴に含まれる場合のみ（AND条件）に変更した。`release/v<version>` を `main` にマージした直後に対応するタグを push すると、同一コミットに対してビルドが2回（main push分・タグ push分）走ってしまう問題を解消した
- 判定用に `verify-tag-on-main` ジョブ（`ubuntu-latest`）を追加し、`git merge-base --is-ancestor` でタグが `main` 上にあるかを確認してから Windows ビルドジョブを実行するようにした。`main` に含まれないタグ push（例: `release/*` ブランチ上での誤タグ）ではビルドをスキップする。`workflow_dispatch`（手動実行）はこの判定の対象外とする

## [0.1.15] - 2026-07-03

### Added

- Claude Code / Codex CLI 向けの案件固有エージェントスキル4件（`pluely-cleanup-checklist`, `tauri-rust-conventions`, `interview-support-domain`, `local-llm-stt-integration`）を `.claude/skills/` と `.codex/skills/` に追加
- プロジェクト概要・技術スタック・ディレクトリ構成・OpenSpecワークフローをまとめた `CLAUDE.md` を新設
- チーム/リポジトリ共通で安全な許可ルールを収録する `.claude/settings.json`（git管理下）を新設

### Changed

- `.claude/skills/` にのみ存在していた4スキル（`building-components`, `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`）を `.codex/skills/` にミラーし、パリティを回復
- `.claude/settings.local.json` から、読み取り専用・定型コマンドの許可ルールを `.claude/settings.json` に移動

### Fixed

- `package.json` / `src-tauri/Cargo.toml` のみバージョンを更新し `src-tauri/tauri.conf.json` / `package-lock.json` の更新を漏らしたため、実際のアプリバージョンが `0.1.13` のままビルドされ、既存の `v0.1.13` draft release に誤ってインストーラがアップロードされる問題があった。`v0.1.14` は正式リリースされておらず欠番とし、本リリースで全バージョンフィールドを揃えて修正した

## [0.1.13] - 2026-07-03

### Changed

- `feature/*` を安定ブランチへ直接マージすることを禁止し、`main` へのあらゆる push（ドキュメント整理や OpenSpec アーカイブを含む）は必ず `release/v<version>` を経由するよう `docs/仕様/ブランチ・リリース戦略.md` と `branch-release-strategy` スキルを更新

## [0.1.12] - 2026-07-03

### Added

- GitHub Actions で lint / 型チェックを実行する `ci` ワークフローを新設（push全ブランチ + main向けPRで起動）
- ESLint を導入（TypeScript + React 向け最小構成）

### Changed

- `src-tauri/src/speaker/linux.rs` の import 順序を `cargo fmt` に合わせて修正

## [0.1.11] - 2026-07-03

### Added

- `CHANGELOG.md` を新設し、Keep a Changelog 風の形式で運用を開始

### Changed

- `publish` ワークフローの GitHub Release 本文を、固定文言から `CHANGELOG.md` の該当バージョンのエントリを抽出する方式に変更（該当エントリがない場合は従来の固定文言にフォールバック）

## [0.1.10] - 2026-07-02

### Added

- GitHub Actions で Windows 向けインストーラをビルドし、draft の GitHub Release に添付する `publish` ワークフローを整備
- `branch-release-strategy` スキルを Claude Code / Codex に登録

### Changed

- `.github/workflows/publish.yml` の起動条件を `main` push / `v<version>` タグ push / 手動実行に変更
- Pluely 由来の secret 依存・署名依存・updater JSON 生成をビルドから除去（署名なしビルドで開始）
