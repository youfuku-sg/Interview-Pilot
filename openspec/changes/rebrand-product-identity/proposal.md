## Why

`package.json` の `name`、`src-tauri/Cargo.toml` の `[package] name` / `[lib] name`、`src-tauri/tauri.conf.json` の `productName` / `identifier` は、fork元の Pluely のまま未変更である。この結果、`publish` ワークフロー(`ci.yml` の `publish-tauri` ジョブ)が生成する Windows インストーラのファイル名が `Pluely_0.2.0_x64_en-US.msi` / `Pluely_0.2.0_x64-setup.exe` のように、Interview-Pilot ではなく Pluely の名前のままになる。v0.2.0 リリースで実際にユーザーがこれを確認し、指摘があった。`docs/仕様/TODO.md` にも「`productName` / `identifier` / window title の変更タイミングを決める」が未チェック項目として残っている。

加えて、MSIインストーラのファイル名にある `en-US`(WiX の言語設定に由来)も、アプリが日本語UI専用になっている実態に合っていないとの指摘があった。また `src-tauri/tauri.conf.json` の `app.windows[0].title`(`"Pluely - AI Assistant"`)は、`localize-ui-japanese` change での日本語化パスから漏れており、未翻訳のまま残っている。

さらに、実際にインストーラを実行したユーザーから、インストール中に表示されるウィザード文言(ライセンス同意画面、インストール先選択、進捗表示等)も英語のままであるとの指摘があった。これは NSIS/WiX が生成するインストーラ自体のUI文言であり、アプリ本体の翻訳(`localize-ui-japanese`)の対象外だった。

加えて、実際にダッシュボードを操作したユーザーから、アプリ内の随所(サイドバーのロゴ・ダッシュボードのタイトルと説明文・API利用状況カード・設定画面の説明文・権限案内・ショートカット説明・エラー画面のロゴ等)に fork 元の「Pluely」というブランド名がそのまま多数残っているとの指摘があった。`localize-ui-japanese` change では文言の日本語化のみを行い、「Pluely」というブランド名自体の置き換えは意図的にスコープ外としていたため、翻訳後も英語表記の「Pluely」がUI全体に残っている。ユーザーはこれも名称変更してほしいとの意向を示しており、`docs/仕様/ブランチ・リリース戦略.md` の未決事項(「いつ Pluely から Interview-Pilot へアプリ識別名を変更するか」)に対する実質的な回答(変更したい)と受け取れる。

## What Changes

- `package.json` の `name`、`src-tauri/Cargo.toml` の `[package] name` / `[lib] name`、`src-tauri/tauri.conf.json` の `productName` を Interview-Pilot 向けの名称に変更する方針を検討し、実装タスクに落とし込む
- `identifier`(`com.srikanthnani.pluely`)の変更要否を検討する。**BREAKING**: `identifier` を変更する場合、既存インストール環境からの自動アップデート・アンインストールに影響する可能性があるため、変更する場合は移行方針も合わせて検討する
- ネイティブウィンドウタイトル(`src-tauri/src/window.rs` の `"Pluely - ダッシュボード"` 等、および `src-tauri/tauri.conf.json` の `app.windows[0].title`)の扱いを検討する。「Pluely」表記自体を残すか置き換えるかは `docs/仕様/ブランチ・リリース戦略.md` の未決事項(「いつ Pluely から Interview-Pilot へアプリ識別名を変更するか」)に関わるため、本 change ではまず方針の整理と提案を行い、ユーザーの判断を仰ぐ
- MSIインストーラファイル名の `en-US` サフィックスの扱いを検討する(`bundle.windows.wix.language` を `ja-JP` 等に変更する案を含む)。WiX の `ja-JP` ロケールリソースでインストーラUI自体も日本語化されるかどうかを事前に調査する
- インストール中に表示されるウィザード文言(NSIS: `bundle.windows.nsis.languages` 等、WiX: `bundle.windows.wix.language` と共通の可能性あり)を日本語化する方法を調査し、対応方針を検討する。NSIS/WiX ともに日本語ロケールリソースが標準同梱されているかどうかは実機検証が必要
- 変更後、Windows インストーラのファイル名・インストール中のウィザード文言が Interview-Pilot / 日本語版として意図通りになることを確認する
- アプリ内UIに残る「Pluely」ブランド名表記(サイドバーロゴ、エラー画面ロゴ、ダッシュボードのタイトル・説明文、`Pluely API`/`Pluely Usage`/`Pluely Access` 等のセクション名・カード見出し、設定画面・権限案内・ショートカット説明・footer の「Pluelyを終了」等)を置き換え候補としてリストアップする。置き換え先の名称(例: `Interview-Pilot`)、「Pluely API」のように Pluely 本家のクラウドAPI機能を指す名称をどう扱うか(機能名自体を残すか、別の呼称にするか)はユーザーの判断を仰ぐ

**BREAKING**: `identifier` を変更した場合、Windows 上で既存の Pluely 名義でのインストール状態と新しい identifier のインストールが別アプリとして扱われる可能性がある(未検証、design.md で調査する)。

## Capabilities

### New Capabilities
- `product-branding`: アプリ内でユーザーに表示されるブランド名表記(ロゴ、タイトル、セクション見出し、説明文等)に関する要件を定義する

### Modified Capabilities
- `installer-release-workflow`: ビルド成果物(インストーラファイル名)が `productName` に由来することを明記し、`productName` 変更後もビルド・Release作成が問題なく動作することを保証する要件を追加する

## Impact

- 影響ファイル: `package.json`、`package-lock.json`、`src-tauri/Cargo.toml`、`src-tauri/Cargo.lock`、`src-tauri/tauri.conf.json`、`src-tauri/src/window.rs`、`src-tauri/src/capture.rs`(ウィンドウタイトル)、および UI 内で「Pluely」を表示している `src/components/Sidebar.tsx`・`src/layouts/ErrorLayout.tsx`・`src/pages/dashboard/**`・`src/pages/settings/components/AutostartToggle.tsx`・`src/pages/app/components/speech/PermissionFlow.tsx`・`src/pages/shortcuts/components/Cursor.tsx`・`src/hooks/useMenuItems.tsx`・`src/hooks/useChatCompletion.ts`・`src/hooks/useCompletion.ts`・`src/pages/audio/index.tsx` 等(網羅的な洗い出しは design.md / 実装時に再度 grep で確認する)
- 影響システム: GitHub Actions `publish` ワークフローが生成するインストーラファイル名・GitHub Release名
- 非対象: README.md / SECURITY.md(`rebrand-readme-security-ja` で対応済み)、UI内の日本語化そのもの(`localize-ui-japanese` で対応済み。本 change はブランド名の置き換えのみを扱う)、Pluely由来のライセンスキー課金・紹介マーケティング機能(Contribute/Promote/GetLicense/PluelyApiSetup)自体の削除要否(別スコープ、`localize-ui-japanese` 実施時にユーザーが「現状のまま日本語化する」と決定済み。名称表記の置き換えとは別軸の判断)
- 未決事項: 実装タイミング(次回リリースか、別途調整するか)、`identifier` 変更の要否と影響範囲は `docs/仕様/ブランチ・リリース戦略.md` の未決事項リストにあり、ユーザーの判断が必要。UI内の「Pluely」置き換え先の名称、「Pluely API」等の機能名の扱いも同様
