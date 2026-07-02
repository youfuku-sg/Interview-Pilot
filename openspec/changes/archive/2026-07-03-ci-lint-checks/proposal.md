## Why

現状、コードの静的チェックは手元でしか行われておらず、GitHub Actions には `publish.yml`（ビルド・リリース用）しか存在しない。フロントエンド側は ESLint / Prettier のような lint 設定自体がまだ導入されておらず、型チェックも `npm run build` の中で `tsc` が実行されるのみで、CI 上で独立して検証されていない。Rust 側（`src-tauri`）も `cargo fmt` / `cargo clippy` を CI で強制する仕組みがない。

`docs/仕様/ブランチ・リリース戦略.md` の `feature/*` → `release/v<version>` → `main` という運用が固まりつつある中、push や PR のタイミングで最低限のコード品質チェック（型エラー・lintエラー・フォーマット崩れ）を自動検出できるようにしておきたい。個人開発であっても、リリース直前ではなく日常の push 時点で問題に気づける状態を作る。

## What Changes

- フロントエンドに ESLint 設定を新規導入する（TypeScript + React 向け、現状未設定のため最小構成で追加する）
- `package.json` に lint 実行用スクリプト（例: `lint`）と型チェック専用スクリプト（例: `typecheck`）を追加する
- `.github/workflows/ci.yml` を新規作成し、push（`main` 以外の全ブランチ、または PR 契機）で以下を実行する
  - フロントエンド: `npm ci`、ESLint、TypeScript 型チェック
  - Rust: `cargo fmt --check`、`cargo clippy`
- 既存の `.github/workflows/publish.yml`（ビルド・リリース用）とは責務を分離し、`ci.yml` はビルド成果物を生成しない軽量チェックに限定する
- lint / フォーマットのルール自体（厳格さ、既存コードへの一括適用など）は最小構成から始め、必要に応じて別途調整する

**BREAKING**: 該当なし

## Capabilities

### New Capabilities
- `ci-lint-workflow`: push / PR 時に GitHub Actions でフロントエンド（ESLint・型チェック）と Rust（fmt・clippy）の静的チェックを自動実行する仕組み

### Modified Capabilities
（既存の spec なし。今回が新規 capability 追加のため該当なし）

## Impact

- 影響ファイル: `.github/workflows/ci.yml`（新規）、ESLint 設定ファイル（新規）、`package.json`（scripts 追加）、必要に応じて `.eslintignore` 相当の除外設定
- 影響システム: GitHub Actions（新規ワークフロー追加、`publish.yml` には影響しない）
- 非対象: `publish.yml` の変更、Rust/TypeScript 既存コードへの lint 修正の一括適用、Prettier など追加ツールの導入（必要になれば別 change）
