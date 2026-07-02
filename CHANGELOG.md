# Changelog

このファイルは [Keep a Changelog](https://keepachangelog.com/) 形式に準ずる。過去のリリース（v0.1.10 より前）は遡って記載しない。形式・運用方針は `docs/仕様/ブランチ・リリース戦略.md` 4.3節を参照。

## [0.1.10] - 2026-07-02

### Added

- GitHub Actions で Windows 向けインストーラをビルドし、draft の GitHub Release に添付する `publish` ワークフローを整備
- `branch-release-strategy` スキルを Claude Code / Codex に登録

### Changed

- `.github/workflows/publish.yml` の起動条件を `main` push / `v<version>` タグ push / 手動実行に変更
- Pluely 由来の secret 依存・署名依存・updater JSON 生成をビルドから除去（署名なしビルドで開始）
