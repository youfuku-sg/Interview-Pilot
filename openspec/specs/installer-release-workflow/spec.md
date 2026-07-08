## Purpose

GitHub Actions で Windows 向けインストーラをビルドし、GitHub Release (draft) に添付するまでの一連の流れ。

## Requirements

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

### Requirement: Windows インストーラを未設定 secret に依存せず生成できる
ワークフローは Windows 向けインストーラのビルドにあたり、このリポジトリで未設定の Pluely 由来 secret（`API_ACCESS_KEY` / `PAYMENT_ENDPOINT` / `APP_ENDPOINT` / `POSTHOG_API_KEY`）を参照してはならない (SHALL NOT)。また署名鍵（`TAURI_SIGNING_PRIVATE_KEY` 等）が未設定でもビルドが失敗してはならない (SHALL NOT)。

#### Scenario: secret 未設定でもビルドが完走する
- **WHEN** リポジトリの Secrets に Pluely 由来の値や署名鍵が一切設定されていない状態でワークフローを実行する
- **THEN** ビルドジョブがエラーなく完走し、インストーラ成果物が生成される

### Requirement: main ブランチ運用下でも生成物が draft の GitHub Release に添付される
`v<version>` タグ push によって起動したビルド（CI 成功かつタグが `main` 上にある場合）が成功した場合、Windows インストーラを draft 状態の GitHub Release に添付しなければならない (SHALL)。updater 用 JSON の生成は行わない (SHALL NOT)。

#### Scenario: タグ push 由来のビルド成功後に draft Release ができる
- **WHEN** `main` へのマージ後に push した `v<version>` タグによって CI・ビルドが正常に完了する
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

### Requirement: 生成物のファイル名がアプリの productName に追従する
`publish` ワークフローが生成する Windows インストーラのファイル名は、`src-tauri/tauri.conf.json` の `productName` の値に由来しなければならない (SHALL)。`productName` を変更した場合、次回以降のビルドで生成されるインストーラファイル名にその変更が反映されなければならない (SHALL)。

#### Scenario: productName 変更後のビルドでファイル名が更新される
- **WHEN** `productName` を `"Pluely"` から別の値に変更したコミットに対してタグ push によるビルドが成功する
- **THEN** 生成される Windows インストーラ(NSIS/MSI)のファイル名が新しい `productName` の値を反映している

#### Scenario: productName 未変更時は既存の命名が維持される
- **WHEN** `productName` を変更していない状態でビルドが成功する
- **THEN** 生成されるインストーラファイル名は従来通り `productName` の値(`Pluely`)とバージョンから構成される

### Requirement: MSIインストーラのファイル名が設定した言語に追従する
`bundle.windows.wix.language` を設定した場合、生成される MSI インストーラのファイル名の言語サフィックスにその設定が反映されなければならない (SHALL)。設定しない場合、Tauri/WiX の既定言語(`en-US`)がそのまま使われる (MAY)。

#### Scenario: wix.language を ja-JP に設定した場合
- **WHEN** `bundle.windows.wix.language` に `"ja-JP"` を設定したコミットに対してタグ push によるビルドが成功する
- **THEN** 生成される MSI インストーラのファイル名が `_ja-JP` サフィックスを含む

#### Scenario: wix.language 未設定時は既定言語が使われる
- **WHEN** `bundle.windows.wix.language` を設定していない状態でビルドが成功する
- **THEN** 生成される MSI インストーラのファイル名は従来通り `_en-US` サフィックスを含む

### Requirement: インストール中のウィザード文言が設定した言語で表示される
`bundle.windows.wix.language` および `bundle.windows.nsis.languages` を日本語ロケールに設定した場合、生成される MSI / NSIS インストーラの実行時に表示されるウィザード文言(ライセンス同意画面、インストール先選択、進捗表示等)が日本語で表示されなければならない (SHALL)。設定しない場合、Tauri/WiX/NSIS の既定言語(英語)がそのまま使われる (MAY)。

#### Scenario: 日本語ロケール設定後にインストーラのウィザードが日本語で表示される
- **WHEN** `bundle.windows.wix.language` に `"ja-JP"`、`bundle.windows.nsis.languages` に日本語ロケールを設定したビルドで生成された MSI / NSIS インストーラを実行する
- **THEN** インストールウィザードの文言が日本語で表示される

#### Scenario: 言語設定未変更時は既定言語(英語)のまま
- **WHEN** `bundle.windows.wix.language` / `bundle.windows.nsis.languages` を設定していないビルドで生成されたインストーラを実行する
- **THEN** インストールウィザードの文言は従来通り英語で表示される
