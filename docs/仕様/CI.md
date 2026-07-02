# CI（Lint / 型チェック）

## 1. 目的

この文書は、GitHub Actions の `ci` ワークフローで行うフロントエンド・Rust の静的チェックについてまとめる。

ビルド・リリース用の `publish` ワークフローとは別に、日常のコード変更を検証する軽量なチェックとして用意している。手順は `GitHub Actions リリース手順.md` を参照。

## 2. 起動条件

- 任意のブランチへの push
- `main` を対象とした Pull Request

`publish` ワークフロー（`main` push / `v*` タグ push / 手動実行のみ）とは異なり、`feature/*` や `release/v<version>` への push でも毎回起動する。

## 3. ジョブ構成

### 3.1 frontend（`ubuntu-latest`）

1. `npm ci`
2. `npm run typecheck`（`tsc --noEmit`）
3. `npm run lint`（`eslint .`）

### 3.2 rust（`windows-latest`）

`src-tauri` に Windows 専用コード（`cfg(windows)` 等）があるため、`publish` ワークフローと同じ Windows ランナーを使用する。

1. `dtolnay/rust-toolchain@stable`（`rustfmt` / `clippy` コンポーネント付き）
2. `cargo fmt --check`（`src-tauri` ディレクトリ）
3. `cargo clippy`（`src-tauri` ディレクトリ）

## 4. 失敗時の扱い

| チェック | 失敗時の扱い |
| --- | --- |
| `tsc --noEmit`（型エラー） | ジョブ失敗 |
| `eslint`（error ルール違反） | ジョブ失敗 |
| `cargo fmt --check`（フォーマット崩れ） | ジョブ失敗 |
| `cargo clippy`（warning） | ジョブは失敗しない（結果はログに出力されるのみ） |

`clippy` を warning 許容にしている理由、ESLint の一部ルールを `warn` に緩和している理由は `openspec/changes/ci-lint-checks/design.md`（アーカイブ後は `openspec/changes/archive/` 配下）を参照。

## 5. ローカルでの再現方法

```bash
npm run typecheck
npm run lint

cd src-tauri
cargo fmt --check
cargo clippy
```

Rust ツールチェーンがローカルに無い場合は、`cargo fmt` / `cargo clippy` の確認は CI 上の結果を参照する。

## 6. 導入時に緩和した ESLint ルール

初回導入時点で既存コードに大量のエラーが出たため、以下を `warn` に緩和している（是正は別途行う）。

- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-unused-vars`
- `prefer-const`
- `no-empty`
- `preserve-caught-error`（ESLint コアルール）

また `eslint-plugin-react-hooks` は `recommended` config を使わず、`react-hooks/rules-of-hooks` と `react-hooks/exhaustive-deps` の2ルールのみを有効化している。同パッケージの `recommended` は React Compiler 向けの追加ルール（`refs` / `immutability` / `set-state-in-effect` / `purity` 等）を含み、React Compiler を使用していない本プロジェクトでは対象外とした。

## 7. 変更履歴

- 2026-07-03: 初版作成
