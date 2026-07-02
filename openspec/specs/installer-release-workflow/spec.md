## Purpose

GitHub Actions で Windows 向けインストーラをビルドし、GitHub Release (draft) に添付するまでの一連の流れ。

## Requirements

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

### Requirement: Windows インストーラを未設定 secret に依存せず生成できる
ワークフローは Windows 向けインストーラのビルドにあたり、このリポジトリで未設定の Pluely 由来 secret（`API_ACCESS_KEY` / `PAYMENT_ENDPOINT` / `APP_ENDPOINT` / `POSTHOG_API_KEY`）を参照してはならない (SHALL NOT)。また署名鍵（`TAURI_SIGNING_PRIVATE_KEY` 等）が未設定でもビルドが失敗してはならない (SHALL NOT)。

#### Scenario: secret 未設定でもビルドが完走する
- **WHEN** リポジトリの Secrets に Pluely 由来の値や署名鍵が一切設定されていない状態でワークフローを実行する
- **THEN** ビルドジョブがエラーなく完走し、インストーラ成果物が生成される

### Requirement: main ブランチ運用下でも生成物が draft の GitHub Release に添付される
`main` への push またはタグ push によって起動したビルドが成功した場合も、Windows インストーラを draft 状態の GitHub Release に添付しなければならない (SHALL)。updater 用 JSON の生成は行わない (SHALL NOT)。

#### Scenario: main push 由来のビルド成功後に draft Release ができる
- **WHEN** `release/v<version>` を `main` にマージした push によってワークフローが正常に完了する
- **THEN** GitHub の Releases に draft 状態の新しい Release が作成され、Windows インストーラ（NSIS/MSI）が添付されている

#### Scenario: タグ push 由来のビルド成功後に draft Release ができる
- **WHEN** `main` へのマージ後に push した `v<version>` タグによってワークフローが正常に完了する
- **THEN** GitHub の Releases に draft 状態の新しい Release が作成され、Windows インストーラ（NSIS/MSI）が添付されている

#### Scenario: updater JSON が生成されない
- **WHEN** ワークフローが正常に完了する
- **THEN** Release に updater 用の JSON ファイルは添付されない

### Requirement: 失敗時にログから原因を追える
ワークフローが失敗した場合、GitHub Actions の実行ログから失敗ステップと原因を特定できなければならない (SHALL)。この手順は `docs/仕様` 配下のドキュメントに記載しなければならない (SHALL)。

#### Scenario: ビルド失敗時にログを確認する
- **WHEN** ワークフローのいずれかのステップが失敗する
- **THEN** `docs/仕様` に記載された手順に従って、失敗したステップと標準出力/エラーをログから特定できる

### Requirement: Release 本文に CHANGELOG の該当バージョンの内容が反映される
`publish` ワークフローが作成する GitHub Release の本文は、`CHANGELOG.md` 内の該当バージョン（ビルド対象コミットの `package.json` の `version`）のエントリを反映しなければならない (SHALL)。`CHANGELOG.md` に該当バージョンのエントリが存在しない場合は、固定の説明文言にフォールバックしなければならない (SHALL)。

#### Scenario: CHANGELOG にエントリがある場合
- **WHEN** `CHANGELOG.md` にビルド対象バージョン（例: `0.1.10`）の `## [0.1.10]` エントリが存在する状態でビルドが成功する
- **THEN** 作成される GitHub Release の本文に、そのエントリの内容（`### Added` 等の箇条書きを含む）が反映される

#### Scenario: CHANGELOG にエントリがない場合
- **WHEN** `CHANGELOG.md` にビルド対象バージョンのエントリが存在しない状態でビルドが成功する
- **THEN** 作成される GitHub Release の本文は、固定の説明文言（インストーラのダウンロード・確認を促す内容）になる
