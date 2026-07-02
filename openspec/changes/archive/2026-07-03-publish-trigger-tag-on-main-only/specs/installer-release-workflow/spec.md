## MODIFIED Requirements

### Requirement: main 上のタグ push でのみビルドを起動する（手動実行を除く）
GitHub Actions の `publish` ワークフローは `workflow_dispatch`（手動実行）、または `v<version>` タグ push のうち、そのタグが指すコミットが `main` ブランチの履歴に含まれる場合にのみビルドを実行しなければならない (SHALL)。`main` への通常の push（タグを伴わない）ではビルドを起動してはならない (SHALL NOT)。タグが `main` の履歴に含まれない場合、ビルドジョブを実行してはならない (SHALL NOT)。

#### Scenario: 手動実行でビルドが起動する
- **WHEN** リポジトリの Actions タブから `publish` ワークフローを手動実行する
- **THEN** ワークフローが起動し、Windows 向けビルドジョブが実行される

#### Scenario: main 上のタグ push でビルドが起動する
- **WHEN** `release/v<version>` を `main` にマージした後、そのコミットに `v<version>` タグを付けて push する
- **THEN** `verify-tag-on-main` ジョブがタグを `main` の履歴に含まれると判定し、Windows 向けビルドジョブが実行される

#### Scenario: main への通常 push ではビルドが起動しない
- **WHEN** タグを伴わずに `main` へコミットを push する
- **THEN** `publish` ワークフローは起動しない

#### Scenario: main に含まれないタグ push ではビルドがスキップされる
- **WHEN** `main` にマージされていないコミット（例: `release/*` ブランチ上のコミット）に対して `v<version>` タグを push する
- **THEN** `verify-tag-on-main` ジョブがタグを `main` の履歴に含まれないと判定し、Windows 向けビルドジョブは実行されない

#### Scenario: 同一リリースでビルドが1回だけ実行される
- **WHEN** `release/v<version>` を `main` にマージして push し、続けて同じコミットに `v<version>` タグを push する
- **THEN** `main` への通常 push ではビルドが起動せず、タグ push 時の1回のみビルドが実行される
