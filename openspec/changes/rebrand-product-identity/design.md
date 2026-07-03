## Context

現在の識別子・名称関連の設定:

- `package.json`: `"name": "pluely"`
- `src-tauri/Cargo.toml`: `[package] name = "pluely"`、`[lib] name = "pluely_lib"`(該当箇所があれば)
- `src-tauri/tauri.conf.json`: `"productName": "Pluely"`、`"identifier": "com.srikanthnani.pluely"`
- `src-tauri/src/window.rs`: メインダッシュボードウィンドウの `.title("Pluely - ダッシュボード")`(2箇所、macOS/その他OS分岐)
- `src-tauri/src/capture.rs`: スクリーンキャプチャオーバーレイの `.title("画面キャプチャ")`(すでに Pluely 表記なし)
- `src-tauri/tauri.conf.json` の `app.windows[0].title`: `"Pluely - AI Assistant"`(メインオーバーレイウィンドウの初期タイトル。`localize-ui-japanese` change の翻訳パスから漏れており未翻訳のまま)
- `src-tauri/tauri.conf.json` の `bundle` に `windows.wix.language` の指定なし。Tauri/WiX のデフォルト言語(`en-US`)が使われており、これが MSI インストーラファイル名の `_en-US` サフィックスと、MSIインストーラのウィザード文言(ライセンス同意・インストール先選択・進捗表示等)が英語のままである原因
- `src-tauri/tauri.conf.json` の `bundle` に `windows.nsis.languages` の指定なし。NSIS(`.exe`)インストーラのウィザード文言も英語のまま。ユーザーが実際にインストールを実行して確認・指摘
- アプリ内UIに残る「Pluely」ブランド名表記。ユーザーが実際にダッシュボードを操作して確認・指摘。主な出現箇所(2026-07-03 時点、`grep -rn "Pluely" src/ --include="*.tsx" --include="*.ts"` による網羅ではなく代表例):
  - `src/components/Sidebar.tsx`: サイドバー上部のロゴ文字列 `"Pluely"`
  - `src/layouts/ErrorLayout.tsx`: エラー画面のロゴ文字列 `"Pluely"`
  - `src/pages/dashboard/index.tsx`: ページ説明文(`"Pluelyライセンスで..."`)
  - `src/pages/dashboard/components/Usage.tsx`: カード見出し `"Pluelyの利用状況"`、説明文 `"今月のPluely APIの利用状況"`
  - `src/pages/dashboard/components/PluelyApiSetup.tsx`: セクション見出し・説明文(`"Pluelyは○個のモデルに対応"` 等)、コンポーネント名自体も `PluelyApiSetup`
  - `src/pages/settings/components/AutostartToggle.tsx`: 説明文(`"システム起動時にPluelyを自動的に開きます"` 等)
  - `src/pages/app/components/speech/PermissionFlow.tsx`: 権限案内文言(`"Pluelyを有効にしてください"` 等)
  - `src/pages/shortcuts/components/Cursor.tsx`: 説明文(`"Pluelyのカーソル表示を制御します"`)
  - `src/hooks/useMenuItems.tsx`: footer メニュー項目 `"Pluelyを終了"`
  - `src/hooks/useChatCompletion.ts` / `src/hooks/useCompletion.ts`: 画面収録権限の案内文言内
  - `src/pages/audio/index.tsx`: フォールバック説明文
  - `src/components/Contribute.tsx` / `src/components/Promote.tsx` / `src/components/DragButton.tsx`: Pluely 本家のライセンスキー課金・紹介マーケティング文言内(これら機能自体の削除要否は別スコープ、`localize-ui-japanese` で「現状のまま日本語化する」と決定済み)
  - 上記は代表例であり、実装時に改めて網羅的な grep を行う

Tauri のビルド成果物(Windows インストーラ)のファイル名は `productName` とバージョンから自動生成される(`Pluely_<version>_x64_en-US.msi` 等)。`localize-ui-japanese` change で UI 内の日本語化は完了しているが、「Pluely」というアプリ名自体の扱いは意図的にスコープ外としていた(README/SECURITY のリブランドも同様に、パッケージ名・identifier の変更は対象外)。NSIS インストーラ(`_x64-setup.exe`)は現状ロケールサフィックスを含んでいないため、`en-US` の影響を受けているのは MSI のみ。

`docs/仕様/ブランチ・リリース戦略.md` の「未決事項」に「いつ Pluely から Interview-Pilot へアプリ識別名を変更するか」が明記されており、この change ではまだ結論を出さず、ユーザーの判断を仰ぐための整理を行う。

## Goals / Non-Goals

**Goals:**
- `productName` / パッケージ名 / `identifier` の変更要否と、変更する場合の影響範囲を整理する
- 変更する場合、Windows インストーラのファイル名が Interview-Pilot 由来になるようにする
- `identifier` 変更に伴うリスク(既存インストールとの互換性、将来の自動アップデート機構への影響)を洗い出す
- アプリ内UIに残る「Pluely」ブランド名表記(ロゴ・タイトル・見出し・説明文等)の置き換え候補を洗い出し、置き換え先の名称・「Pluely API」等の機能名の扱いをユーザーに確認する

**Non-Goals:**
- アプリアイコン・ロゴなど新規ビジュアルアセットの制作(別スコープ)
- macOS / Linux 向けの `identifier` 挙動の検証(現状 Windows インストーラのみが対象、他OSは将来のリリース時に合わせて確認)
- ライセンス変更(GPL-3.0 のまま)

## Decisions

(2026-07-03 ユーザー判断により確定)

1. **`productName` / パッケージ名の変更**
   - 決定: `"Interview-Pilot"` に変更する。`package.json` の `name` は npm 慣習に合わせ `"interview-pilot"`、`src-tauri/Cargo.toml` の `[package] name` も `"interview-pilot"`、`[lib] name` は Windows 上でのバイナリ名衝突回避のため `"interview_pilot_lib"` とした

2. **`identifier` の変更**
   - 決定: `com.srikanthnani.pluely` から `com.interview-pilot.app` に変更する
   - リスク: Tauri は `identifier` をアプリの一意識別に使うため、変更により OS 側(Windows のインストール済みアプリ一覧、将来的な updater)で別アプリとして扱われる可能性がある。既存インストール環境がある場合は、新しい identifier でのインストール前に旧 Pluely 名義のインストールをアンインストールしておくこと(未検証、次回リリース時に確認)

3. **ネイティブウィンドウタイトルの扱い**
   - 決定: 上記1と連動して置き換える。`window.rs` の2箇所を `"Interview-Pilot - ダッシュボード"` に、`tauri.conf.json` の `app.windows[0].title` を `"Interview-Pilot - AIアシスタント"`(日本語化も合わせて実施)に変更した

4. **MSIインストーラの言語・ウィザード文言(`en-US` サフィックス + インストール中の英語表示)**
   - 決定: `bundle.windows.wix.language` に `["ja-JP"]` を設定する。ファイル名は `Interview-Pilot_<version>_x64_ja-JP.msi` になる見込み。WiX Toolset が `ja-JP.wxl` を標準同梱しているかどうか、インストール中のウィザード文言が実際に日本語表示されるかは次回リリースのビルドで実機検証する(タスク4.3)

5. **NSISインストーラのウィザード文言**
   - 決定: `bundle.windows.nsis.languages` に `["Japanese"]` を設定する。tauri-bundler 同梱の NSIS が日本語リソースを標準で持っているか、実際にウィザード文言が日本語表示されるかは次回リリースのビルドで実機検証する(タスク4.4)

6. **アプリ内UIの「Pluely」ブランド名表記の置き換え**
   - 決定: Context に列挙したユーザー向け表示文言(JSX にレンダリングされる文字列)はすべて「Interview-Pilot」または汎用名に置き換える
   - 決定: 関数名(`shouldUsePluelyAPI` 等)・コンポーネント名(`PluelyApiSetup`、`PluelyPrompts` 等)・ファイル名(`pluely.api.ts` 等)・localStorage キー名(`pluely_license_key` 等)・コード内コメント・`console.*` ログは対象外とする(表示文言のみのリネームに留め、差分と既存ローカルデータへの影響を最小化する)
   - 決定: 「Pluely API」は実際に Pluely 本家のクラウドAPIサービスへ接続する機能(`shouldUsePluelyAPI`、`api_access_key` 等)を指すが、表示名は汎用名「クラウドAPI」に統一する
   - 決定: 「Pluely既定プロンプト」(`fetch_prompts` で Pluely 本家が提供するプロンプト一覧を取得する機能)は「推奨プロンプト」という汎用名に置き換える
   - 決定: `Contribute.tsx` / `Promote.tsx`(pluely.com/contribute・pluely.com/promote への実際のリンクを含む Pluely 本家のマーケティング機能)、および `support@pluely.com` 等の実在する連絡先は、ブランド名の置き換え対象外とする。これらは実際に pluely.com 上のサービスを指しており、表示名だけ変えると実態と乖離し利用者に誤解を与えるため

## Risks / Trade-offs

- [Risk] `identifier` を変更すると、既存インストール環境(開発機など)で二重インストール状態になる可能性がある → [Mitigation] 変更前に既存インストールをアンインストールする手順を `docs/仕様/GitHub Actions リリース手順.md` 等に記載する
- [Risk] `productName` 変更後、初回ビルドで生成物名が変わることに伴う周知漏れ(過去のインストーラ名を前提にした手順書等) → [Mitigation] `docs/仕様/GitHub Actions リリース手順.md` の記載を更新する
- [Risk] `wix.language` / `nsis.languages` を日本語に変更した場合、CI(Windows GitHub-hosted runner)上のツールチェーンに日本語ロケールリソースが含まれない、または未検証の不具合がある可能性がある → [Mitigation] 実際にタグ push でビルドして生成物・インストーラの表示を確認するまでは正式決定としない
- [Trade-off] 名称変更を急がず据え置く場合、インストーラ名の Pluely 表記は今後のリリースでも継続する
- [Risk] 「Pluely API」のように機能名として使われている「Pluely」表記まで一律に置き換えると、実際に Pluely 本家サービスへ接続する機能であるという実態と表示名が乖離し、ユーザーが誤解する可能性がある → [Mitigation] 機能名としての「Pluely」と、単なるブランド名としての「Pluely」を区別してユーザーに確認する

## Open Questions

すべて Decisions セクションのとおり確定した(2026-07-03)。残る未検証事項はタスク4章(検証)を参照:

- `wix.language` / `nsis.languages` を日本語化した場合の実機での見た目(次回リリースビルドで確認)
- `identifier` 変更後の既存インストール環境への影響(アンインストール要否の実機確認)
- 実際に Tauri アプリを起動しての「Pluely」表記置き換えの目視確認(本 change の実装はコード上・grep 上の確認のみで、Rust ツールチェーン/GUI が無い作業環境のため実機起動での確認は未実施)
