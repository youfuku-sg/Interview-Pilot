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

(未決定 — 本 change は方針整理と提案が目的であり、以下はユーザー判断待ちの選択肢の整理)

1. **`productName` / パッケージ名の変更**
   - 案A: `"Interview-Pilot"` に変更する(README のリブランドと一貫性を持たせる)
   - 案B: 当面 `"Pluely"` のまま据え置く(個人利用規模のため急がない)
   - 決定はユーザーに委ねる

2. **`identifier` の変更**
   - 現状 `com.srikanthnani.pluely`(fork元の識別子)
   - 変更する場合の候補例: `com.<owner>.interview-pilot` 等
   - リスク: Tauri は `identifier` をアプリの一意識別に使うため、変更すると OS 側(Windows のインストール済みアプリ一覧、将来的な updater)で別アプリとして扱われる可能性がある。個人利用・単一マシンでの運用が前提のため実害は限定的と考えられるが、変更前に一度アンインストールが必要になる可能性がある
   - 決定はユーザーに委ねる

3. **ネイティブウィンドウタイトルの扱い**
   - 現状 `"Pluely - ダッシュボード"`(`window.rs`)、`"Pluely - AI Assistant"`(`tauri.conf.json` の `app.windows[0].title`、未翻訳) — `productName` を変更する場合はタイトルも合わせて更新するのが自然。`app.windows[0].title` は `productName` の変更有無に関わらず、少なくとも日本語化(例: `"Pluely - AIアシスタント"`)は独立して対応できる
   - 決定は上記1と連動する(Pluely 表記の残し方の部分のみ)

4. **MSIインストーラの言語・ウィザード文言(`en-US` サフィックス + インストール中の英語表示)**
   - 案A: `bundle.windows.wix.language` に `"ja-JP"` を設定する。WiX Toolset 3系は `ja-JP.wxl` を標準同梱しており、追加リソース無しで動作する見込み(要実機検証)。ファイル名は `Pluely_<version>_x64_ja-JP.msi` のようになり、`wix.language` は WiX の UI 文言(ライセンス同意・インストール先選択・進捗表示等)にも使われるロケールリソースを兼ねるため、ファイル名とインストール中の表示言語は同じ設定で同時に解決する見込み
   - 案B: 言語設定はそのまま(`en-US`)にし、ファイル名・ウィザード文言の言語にはこだわらない
   - この決定は `productName`/`identifier` の変更(1・2)とは独立して先行実施できる
   - 決定はユーザーに委ねる

5. **NSISインストーラのウィザード文言**
   - 現状 `bundle.windows.nsis.languages` の指定なし(Tauriの既定言語のみが使われ、英語表示になっていると推測される)
   - 案A: `bundle.windows.nsis.languages` に `["Japanese"]`(NSIS の言語識別子)を設定する。tauri-bundlerが同梱するNSISには日本語(`Japanese.nsh`)を含む多数の言語リソースが標準で用意されている見込みだが、実機検証が必要
   - 案B: 対応しない(現状維持)
   - WiX(案4)とは別の設定項目のため、個別に検証・決定する
   - 決定はユーザーに委ねる

6. **アプリ内UIの「Pluely」ブランド名表記の置き換え**
   - 案A: Context に列挙した箇所すべてで「Pluely」を `"Interview-Pilot"` 等の新しい名称に置き換える。ユーザーが「名前変更してほしい」と明示しているため、方向性としては最有力
   - 案B: 一部箇所(例: ロゴ・タイトル等の目立つ箇所)のみ置き換え、`Pluely API`/`PluelyApiSetup` のようにライセンスキー課金機能自体の名称は Pluely 本家サービスを指す固有名詞として残す
   - 論点: 「Pluely API」はコード上 Pluely 本家のクラウドAPIサービスへの実際の接続を指しており(`shouldUsePluelyAPI`、`api_access_key` 等)、表示名を変えても機能の実体(Pluely運営のサービスに接続する)は変わらない。表示名だけ変えると実態と乖離し紛らわしくなる可能性があるため、この機能自体を残すか削除するか(`pluely-cleanup-checklist` スキルが指摘する既存の論点)と合わせて検討する必要がある
   - 決定(置き換え先名称、Pluely API機能の扱い)はユーザーに委ねる

## Risks / Trade-offs

- [Risk] `identifier` を変更すると、既存インストール環境(開発機など)で二重インストール状態になる可能性がある → [Mitigation] 変更前に既存インストールをアンインストールする手順を `docs/仕様/GitHub Actions リリース手順.md` 等に記載する
- [Risk] `productName` 変更後、初回ビルドで生成物名が変わることに伴う周知漏れ(過去のインストーラ名を前提にした手順書等) → [Mitigation] `docs/仕様/GitHub Actions リリース手順.md` の記載を更新する
- [Risk] `wix.language` / `nsis.languages` を日本語に変更した場合、CI(Windows GitHub-hosted runner)上のツールチェーンに日本語ロケールリソースが含まれない、または未検証の不具合がある可能性がある → [Mitigation] 実際にタグ push でビルドして生成物・インストーラの表示を確認するまでは正式決定としない
- [Trade-off] 名称変更を急がず据え置く場合、インストーラ名の Pluely 表記は今後のリリースでも継続する
- [Risk] 「Pluely API」のように機能名として使われている「Pluely」表記まで一律に置き換えると、実際に Pluely 本家サービスへ接続する機能であるという実態と表示名が乖離し、ユーザーが誤解する可能性がある → [Mitigation] 機能名としての「Pluely」と、単なるブランド名としての「Pluely」を区別してユーザーに確認する

## Open Questions

- `productName` / パッケージ名 / `identifier` を変更するかどうか、するとしていつ実施するか(ユーザー判断待ち)
- ウィンドウタイトルの「Pluely」表記を残すか置き換えるか(上記と連動)
- `bundle.windows.wix.language` を `ja-JP` に変更するか(上記と独立して判断可能)
- `bundle.windows.nsis.languages` を日本語に変更するか(上記と独立して判断可能)
- アプリ内UIの「Pluely」表記の置き換え先名称は何にするか(例: `Interview-Pilot`)
- 「Pluely API」等、Pluely 本家サービスに接続する機能自体の名称・扱いをどうするか(表示名のみ変更 / 機能ごと見直し)
