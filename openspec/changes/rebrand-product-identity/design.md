## Context

現在の識別子・名称関連の設定:

- `package.json`: `"name": "pluely"`
- `src-tauri/Cargo.toml`: `[package] name = "pluely"`、`[lib] name = "pluely_lib"`(該当箇所があれば)
- `src-tauri/tauri.conf.json`: `"productName": "Pluely"`、`"identifier": "com.srikanthnani.pluely"`
- `src-tauri/src/window.rs`: メインダッシュボードウィンドウの `.title("Pluely - ダッシュボード")`(2箇所、macOS/その他OS分岐)
- `src-tauri/src/capture.rs`: スクリーンキャプチャオーバーレイの `.title("画面キャプチャ")`(すでに Pluely 表記なし)

Tauri のビルド成果物(Windows インストーラ)のファイル名は `productName` とバージョンから自動生成される(`Pluely_<version>_x64_en-US.msi` 等)。`localize-ui-japanese` change で UI 内の日本語化は完了しているが、「Pluely」というアプリ名自体の扱いは意図的にスコープ外としていた(README/SECURITY のリブランドも同様に、パッケージ名・identifier の変更は対象外)。

`docs/仕様/ブランチ・リリース戦略.md` の「未決事項」に「いつ Pluely から Interview-Pilot へアプリ識別名を変更するか」が明記されており、この change ではまだ結論を出さず、ユーザーの判断を仰ぐための整理を行う。

## Goals / Non-Goals

**Goals:**
- `productName` / パッケージ名 / `identifier` の変更要否と、変更する場合の影響範囲を整理する
- 変更する場合、Windows インストーラのファイル名が Interview-Pilot 由来になるようにする
- `identifier` 変更に伴うリスク(既存インストールとの互換性、将来の自動アップデート機構への影響)を洗い出す

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
   - 現状 `"Pluely - ダッシュボード"` — `productName` を変更する場合はタイトルも合わせて更新するのが自然
   - 決定は上記1と連動する

## Risks / Trade-offs

- [Risk] `identifier` を変更すると、既存インストール環境(開発機など)で二重インストール状態になる可能性がある → [Mitigation] 変更前に既存インストールをアンインストールする手順を `docs/仕様/GitHub Actions リリース手順.md` 等に記載する
- [Risk] `productName` 変更後、初回ビルドで生成物名が変わることに伴う周知漏れ(過去のインストーラ名を前提にした手順書等) → [Mitigation] `docs/仕様/GitHub Actions リリース手順.md` の記載を更新する
- [Trade-off] 名称変更を急がず据え置く場合、インストーラ名の Pluely 表記は今後のリリースでも継続する

## Open Questions

- `productName` / パッケージ名 / `identifier` を変更するかどうか、するとしていつ実施するか(ユーザー判断待ち)
- ウィンドウタイトルの「Pluely」表記を残すか置き換えるか(上記と連動)
