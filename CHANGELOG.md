# Changelog

このファイルは [Keep a Changelog](https://keepachangelog.com/) 形式に準ずる。過去のリリース（v0.1.10 より前）は遡って記載しない。形式・運用方針は `docs/仕様/ブランチ・リリース戦略.md` 4.3節を参照。

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
