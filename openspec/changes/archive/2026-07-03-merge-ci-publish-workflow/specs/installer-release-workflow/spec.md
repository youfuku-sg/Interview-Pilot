## MODIFIED Requirements

### Requirement: main 上のタグ push でのみビルドを起動する（手動実行を除く）
GitHub Actions のワークフローは `workflow_dispatch`（手動実行）、または `v<version>` タグ push のうち、そのタグが指すコミットが `main` ブランチの履歴に含まれる場合にのみビルドを実行しなければならない (SHALL)。`main` への通常の push（タグを伴わない）ではビルドを起動してはならない (SHALL NOT)。タグが `main` の履歴に含まれない場合、ビルドジョブを実行してはならない (SHALL NOT)。加えて、CI ジョブ(フロントエンドの型チェック・lint、Rust の `cargo fmt --check`・`clippy`)が成功した場合にのみビルドジョブを実行しなければならない (SHALL)。CI ジョブが1つでも失敗した場合、タグが `main` 上にあってもビルドジョブを実行してはならない (SHALL NOT)。

#### Scenario: 手動実行でビルドが起動する
- **WHEN** リポジトリの Actions タブから `publish` に相当するワークフローを手動実行する
- **THEN** ワークフローが起動し、CI ジョブとビルドジョブが実行される

#### Scenario: main 上のタグ push でビルドが起動する
- **WHEN** `release/v<version>` を `main` にマージした後、そのコミットに `v<version>` タグを付けて push する
- **THEN** CI ジョブ(型チェック・lint・fmt・clippy)が成功し、`verify-tag-on-main` ジョブがタグを `main` の履歴に含まれると判定し、Windows 向けビルドジョブが実行される

#### Scenario: main への通常 push ではビルドが起動しない
- **WHEN** タグを伴わずに `main` へコミットを push する
- **THEN** ビルドジョブは実行されない(CI ジョブのみ実行される)

#### Scenario: main に含まれないタグ push ではビルドがスキップされる
- **WHEN** `main` にマージされていないコミット（例: `release/*` ブランチ上のコミット）に対して `v<version>` タグを push する
- **THEN** `verify-tag-on-main` ジョブがタグを `main` の履歴に含まれないと判定し、Windows 向けビルドジョブは実行されない

#### Scenario: 同一リリースでビルドが1回だけ実行される
- **WHEN** `release/v<version>` を `main` にマージして push し、続けて同じコミットに `v<version>` タグを push する
- **THEN** `main` への通常 push ではビルドが起動せず、タグ push 時の1回のみビルドが実行される

#### Scenario: CI が失敗した場合はタグが main 上でもビルドがスキップされる
- **WHEN** lint エラーなど CI ジョブが失敗する状態のコミットに `main` 上で `v<version>` タグを push する
- **THEN** `verify-tag-on-main` ジョブがタグを `main` の履歴に含まれると判定しても、CI ジョブの失敗により Windows 向けビルドジョブは実行されない

### Requirement: main ブランチ運用下でも生成物が draft の GitHub Release に添付される
`v<version>` タグ push によって起動したビルド（CI 成功かつタグが `main` 上にある場合）が成功した場合、Windows インストーラを draft 状態の GitHub Release に添付しなければならない (SHALL)。updater 用 JSON の生成は行わない (SHALL NOT)。

#### Scenario: タグ push 由来のビルド成功後に draft Release ができる
- **WHEN** `main` へのマージ後に push した `v<version>` タグによって CI・ビルドが正常に完了する
- **THEN** GitHub の Releases に draft 状態の新しい Release が作成され、Windows インストーラ（NSIS/MSI）が添付されている

#### Scenario: updater JSON が生成されない
- **WHEN** ワークフローが正常に完了する
- **THEN** Release に updater 用の JSON ファイルは添付されない
