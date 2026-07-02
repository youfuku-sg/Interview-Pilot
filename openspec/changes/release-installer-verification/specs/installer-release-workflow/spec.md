## MODIFIED Requirements

### Requirement: 手動・タグ push・main push でビルドを起動できる
GitHub Actions の `publish` ワークフローは `workflow_dispatch`（手動実行）、タグ push (`v*`)、または安定ブランチ `main` への push をトリガーとして起動できなければならない (SHALL)。`main` 以外のブランチ（`master` / `feature/*` / `release/v<version>` / `hotfix/v<version>` を含む）への push では起動してはならない (SHALL NOT)。

#### Scenario: 手動実行でビルドが起動する
- **WHEN** リポジトリの Actions タブから `publish` ワークフローを手動実行する
- **THEN** ワークフローが起動し、Windows 向けビルドジョブが実行される

#### Scenario: release ブランチを main にマージした際にビルドが起動する
- **WHEN** `docs/仕様/ブランチ・リリース戦略.md` 7節の手順に従い、`release/v<version>` ブランチを `main` にマージして push する
- **THEN** `publish` ワークフローが起動し、Windows 向けビルドジョブが実行される

#### Scenario: タグ push でビルドが起動する
- **WHEN** `main` にマージ後、`v<version>` タグを push する
- **THEN** `publish` ワークフローが起動し、Windows 向けビルドジョブが実行される

#### Scenario: main 以外への push ではビルドが起動しない
- **WHEN** `feature/*` または `release/v<version>` ブランチにコミットを push する（`main` へのマージやタグを伴わない）
- **THEN** `publish` ワークフローは起動しない

### Requirement: main ブランチ運用下でも生成物が draft の GitHub Release に添付される
`main` への push またはタグ push によって起動したビルドが成功した場合も、Windows インストーラを draft 状態の GitHub Release に添付しなければならない (SHALL)。updater 用 JSON の生成は行わない (SHALL NOT)。

#### Scenario: main push 由来のビルド成功後に draft Release ができる
- **WHEN** `release/v<version>` を `main` にマージした push によってワークフローが正常に完了する
- **THEN** GitHub の Releases に draft 状態の新しい Release が作成され、Windows インストーラ（NSIS/MSI）が添付されている

#### Scenario: タグ push 由来のビルド成功後に draft Release ができる
- **WHEN** `main` へのマージ後に push した `v<version>` タグによってワークフローが正常に完了する
- **THEN** GitHub の Releases に draft 状態の新しい Release が作成され、Windows インストーラ（NSIS/MSI）が添付されている
