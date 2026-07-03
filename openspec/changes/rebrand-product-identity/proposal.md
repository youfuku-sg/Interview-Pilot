## Why

`package.json` の `name`、`src-tauri/Cargo.toml` の `[package] name` / `[lib] name`、`src-tauri/tauri.conf.json` の `productName` / `identifier` は、fork元の Pluely のまま未変更である。この結果、`publish` ワークフロー(`ci.yml` の `publish-tauri` ジョブ)が生成する Windows インストーラのファイル名が `Pluely_0.2.0_x64_en-US.msi` / `Pluely_0.2.0_x64-setup.exe` のように、Interview-Pilot ではなく Pluely の名前のままになる。v0.2.0 リリースで実際にユーザーがこれを確認し、指摘があった。`docs/仕様/TODO.md` にも「`productName` / `identifier` / window title の変更タイミングを決める」が未チェック項目として残っている。

## What Changes

- `package.json` の `name`、`src-tauri/Cargo.toml` の `[package] name` / `[lib] name`、`src-tauri/tauri.conf.json` の `productName` を Interview-Pilot 向けの名称に変更する方針を検討し、実装タスクに落とし込む
- `identifier`(`com.srikanthnani.pluely`)の変更要否を検討する。**BREAKING**: `identifier` を変更する場合、既存インストール環境からの自動アップデート・アンインストールに影響する可能性があるため、変更する場合は移行方針も合わせて検討する
- ネイティブウィンドウタイトル(`src-tauri/src/window.rs` の `"Pluely - ダッシュボード"` 等)の扱いを検討する。「Pluely」表記自体を残すか置き換えるかは `docs/仕様/ブランチ・リリース戦略.md` の未決事項(「いつ Pluely から Interview-Pilot へアプリ識別名を変更するか」)に関わるため、本 change ではまず方針の整理と提案を行い、ユーザーの判断を仰ぐ
- 変更後、Windows インストーラのファイル名が Interview-Pilot 由来の名称になることを確認する

**BREAKING**: `identifier` を変更した場合、Windows 上で既存の Pluely 名義でのインストール状態と新しい identifier のインストールが別アプリとして扱われる可能性がある(未検証、design.md で調査する)。

## Capabilities

### New Capabilities
(なし)

### Modified Capabilities
- `installer-release-workflow`: ビルド成果物(インストーラファイル名)が `productName` に由来することを明記し、`productName` 変更後もビルド・Release作成が問題なく動作することを保証する要件を追加する

## Impact

- 影響ファイル: `package.json`、`package-lock.json`、`src-tauri/Cargo.toml`、`src-tauri/Cargo.lock`、`src-tauri/tauri.conf.json`、`src-tauri/src/window.rs`、`src-tauri/src/capture.rs`(ウィンドウタイトル)
- 影響システム: GitHub Actions `publish` ワークフローが生成するインストーラファイル名・GitHub Release名
- 非対象: README.md / SECURITY.md(`rebrand-readme-security-ja` で対応済み)、UI内の日本語文言(`localize-ui-japanese` で対応済み)
- 未決事項: 実装タイミング(次回リリースか、別途調整するか)、`identifier` 変更の要否と影響範囲は `docs/仕様/ブランチ・リリース戦略.md` の未決事項リストにあり、ユーザーの判断が必要
