## ADDED Requirements

### Requirement: 手動またはタグ push でビルドを起動できる
GitHub Actions の `publish` ワークフローは `workflow_dispatch`（手動実行）またはタグ push をトリガーとして起動できなければならない (SHALL)。`master` ブランチへの通常の push では起動してはならない (SHALL NOT)。

#### Scenario: 手動実行でビルドが起動する
- **WHEN** リポジトリの Actions タブから `publish` ワークフローを手動実行する
- **THEN** ワークフローが起動し、Windows 向けビルドジョブが実行される

#### Scenario: 通常の push ではビルドが起動しない
- **WHEN** `master` ブランチにコミットを push する（タグを伴わない）
- **THEN** `publish` ワークフローは起動しない

### Requirement: Windows インストーラを未設定 secret に依存せず生成できる
ワークフローは Windows 向けインストーラのビルドにあたり、このリポジトリで未設定の Pluely 由来 secret（`API_ACCESS_KEY` / `PAYMENT_ENDPOINT` / `APP_ENDPOINT` / `POSTHOG_API_KEY`）を参照してはならない (SHALL NOT)。また署名鍵（`TAURI_SIGNING_PRIVATE_KEY` 等）が未設定でもビルドが失敗してはならない (SHALL NOT)。

#### Scenario: secret 未設定でもビルドが完走する
- **WHEN** リポジトリの Secrets に Pluely 由来の値や署名鍵が一切設定されていない状態でワークフローを実行する
- **THEN** ビルドジョブがエラーなく完走し、インストーラ成果物が生成される

### Requirement: 生成物が draft の GitHub Release に添付される
ワークフローは成功時に、生成した Windows インストーラを draft 状態の GitHub Release に添付しなければならない (SHALL)。updater 用 JSON の生成は行わない (SHALL NOT)。

#### Scenario: ビルド成功後に draft Release ができる
- **WHEN** ワークフローが正常に完了する
- **THEN** GitHub の Releases に draft 状態の新しい Release が作成され、Windows インストーラ（NSIS/MSI）が添付されている

#### Scenario: updater JSON が生成されない
- **WHEN** ワークフローが正常に完了する
- **THEN** Release に updater 用の JSON ファイルは添付されない

### Requirement: 失敗時にログから原因を追える
ワークフローが失敗した場合、GitHub Actions の実行ログから失敗ステップと原因を特定できなければならない (SHALL)。この手順は `docs/仕様` 配下のドキュメントに記載しなければならない (SHALL)。

#### Scenario: ビルド失敗時にログを確認する
- **WHEN** ワークフローのいずれかのステップが失敗する
- **THEN** `docs/仕様` に記載された手順に従って、失敗したステップと標準出力/エラーをログから特定できる
