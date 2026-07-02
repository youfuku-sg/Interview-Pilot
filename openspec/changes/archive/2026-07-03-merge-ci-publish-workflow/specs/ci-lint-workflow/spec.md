## MODIFIED Requirements

### Requirement: push / PR で CI ワークフローが起動する
`.github/workflows/ci.yml` は、任意のブランチへの push、`main` を対象とした Pull Request、および手動実行 (`workflow_dispatch`) をトリガーとして起動しなければならない (SHALL)。CI チェックジョブ(フロントエンドの型チェック・lint、Rust の `cargo fmt --check`・`clippy`)自体はビルド成果物や GitHub Release を生成してはならない (SHALL NOT)。同一ファイル内にビルド成果物・GitHub Release を生成するジョブが存在する場合、その起動条件・挙動は `installer-release-workflow` capability の定義に従う。

#### Scenario: feature ブランチへの push で CI が起動する
- **WHEN** `feature/<name>` ブランチにコミットを push する
- **THEN** `ci.yml` ワークフローが起動し、lint・型チェック・Rust チェックのジョブが実行される

#### Scenario: main への Pull Request で CI が起動する
- **WHEN** `main` を対象とした Pull Request を作成、または更新する
- **THEN** `ci.yml` ワークフローが起動する

#### Scenario: 手動実行で CI ジョブが起動する
- **WHEN** リポジトリの Actions タブから `ci.yml` ワークフローを手動実行する
- **THEN** lint・型チェック・Rust チェックのジョブが実行される
