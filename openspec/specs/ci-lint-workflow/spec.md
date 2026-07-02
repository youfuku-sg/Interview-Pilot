## Purpose

push / main向けPRのタイミングで、フロントエンド（型チェック・ESLint）とRust（cargo fmt・clippy）の静的チェックをGitHub Actionsで自動実行する仕組み。

## Requirements

### Requirement: push / PR で CI ワークフローが起動する
`.github/workflows/ci.yml` は、任意のブランチへの push、および `main` を対象とした Pull Request をトリガーとして起動しなければならない (SHALL)。このワークフローはビルド成果物や GitHub Release を生成してはならない (SHALL NOT)。

#### Scenario: feature ブランチへの push で CI が起動する
- **WHEN** `feature/<name>` ブランチにコミットを push する
- **THEN** `ci.yml` ワークフローが起動し、lint・型チェック・Rust チェックのジョブが実行される

#### Scenario: main への Pull Request で CI が起動する
- **WHEN** `main` を対象とした Pull Request を作成、または更新する
- **THEN** `ci.yml` ワークフローが起動する

### Requirement: フロントエンドの型チェックと lint を実行する
CI はフロントエンドの依存関係をインストールしたうえで、TypeScript の型チェック（`tsc --noEmit` 相当）と ESLint を実行しなければならない (SHALL)。型エラーまたは ESLint のエラー（`warn` ではなく `error` として設定されたルール違反）が存在する場合、該当ジョブは失敗しなければならない (SHALL)。

#### Scenario: 型エラーがある場合に CI が失敗する
- **WHEN** TypeScript の型エラーを含むコードが push される
- **THEN** CI の型チェックジョブが失敗する

#### Scenario: ESLint エラーがある場合に CI が失敗する
- **WHEN** ESLint のエラールールに違反するコードが push される
- **THEN** CI の lint ジョブが失敗する

#### Scenario: 問題がない場合に CI が成功する
- **WHEN** 型エラー・ESLint エラーのいずれも含まないコードが push される
- **THEN** CI のフロントエンドチェックジョブは成功する

### Requirement: Rust のフォーマットと clippy チェックを実行する
CI は `src-tauri` に対して `cargo fmt --check` を実行し、フォーマット崩れがある場合はジョブを失敗させなければならない (SHALL)。また `cargo clippy` を実行しなければならない (SHALL)。`cargo clippy` の既存 warning は本要件の範囲ではジョブを失敗させなくてよい (MAY)。

#### Scenario: フォーマット崩れがある場合に CI が失敗する
- **WHEN** `cargo fmt` の結果と異なるフォーマットの Rust コードが push される
- **THEN** CI の `cargo fmt --check` ジョブが失敗する

#### Scenario: フォーマットが正しい場合に CI が成功する
- **WHEN** `cargo fmt`済みの Rust コードが push される
- **THEN** CI の `cargo fmt --check` ジョブは成功する

#### Scenario: clippy が実行される
- **WHEN** Rust コードを含む push が行われる
- **THEN** CI 上で `cargo clippy` が実行され、結果がログに出力される
