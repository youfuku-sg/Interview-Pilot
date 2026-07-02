## Why

`.github/workflows/ci.yml`(lint・型チェック・`cargo fmt`・`clippy`)と `.github/workflows/publish.yml`(Windows インストーラビルド・GitHub Release 作成)は別ファイルに分かれており、トリガー条件に依存関係がない。`v<version>` タグを `main` 上のコミットに push すると、`ci.yml` と `publish.yml` の両方が同時に(互いを待たずに)起動する。そのため、CI(lint/型チェック/フォーマット/clippy)が失敗するようなコードにタグを打ってしまった場合でも、`publish` 側は CI の結果を待たずに Windows ビルドと draft Release 作成まで完走してしまう。

## What Changes

- `.github/workflows/ci.yml` と `.github/workflows/publish.yml` を1つのワークフローファイルに統合する(`ci.yml` に統合し、`publish.yml` は削除する)
- 統合後のワークフローは以下の4ジョブで構成する
  - `frontend`: 型チェック・ESLint(既存 `ci.yml` の内容を維持)
  - `rust`: `cargo fmt --check`・`clippy`(既存 `ci.yml` の内容を維持)
  - `verify-tag-on-main`: タグが `main` の履歴に含まれるか判定(既存 `publish.yml` の内容を維持)
  - `publish-tauri`: Windows インストーラのビルドと draft Release 作成(既存 `publish.yml` の内容を維持)
- `publish-tauri` ジョブに `needs: [frontend, rust, verify-tag-on-main]` を追加し、`frontend` と `rust` が成功し、かつ `verify-tag-on-main` がタグを `main` 上と判定した場合のみ実行されるようにする(`if: success() && needs.verify-tag-on-main.outputs.on_main == 'true'`)
- `frontend` / `rust` ジョブのトリガー条件(任意ブランチへの push、`main` 向け PR)は変更しない。加えて `workflow_dispatch` でも実行されるようにし、手動実行時も CI がゲートとして機能するようにする
- `verify-tag-on-main` / `publish-tauri` のトリガー条件(`v*` タグ push、`workflow_dispatch`)は変更しない

**BREAKING**: 該当なし。ワークフロー定義のみの変更で、アプリ本体・データベースには影響しない。

## Capabilities

### Modified Capabilities
- `installer-release-workflow`: Windows ビルド・Release 作成の起動条件に「CI(lint/型チェック/フォーマット/clippy)の成功」を追加する
- `ci-lint-workflow`: ワークフロー定義ファイルを `ci.yml` に一本化し、`workflow_dispatch` でも起動できるようにする

## Impact

- 影響ファイル: `.github/workflows/ci.yml`(拡張)、`.github/workflows/publish.yml`(削除)
- 影響システム: GitHub Actions(ワークフローファイル数の削減、CI失敗時の誤リリース防止)
- 非対象: アプリ本体の変更
