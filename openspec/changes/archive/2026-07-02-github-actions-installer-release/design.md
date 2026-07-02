## Context

`.github/workflows/publish.yml` は Pluely 由来のまま残っており、`master` への push をトリガーに `macos-latest`（aarch64 / x86_64）、`ubuntu-22.04`、`windows-latest` の4通りをビルドし、`tauri-apps/tauri-action` で署名付きの Release（updater JSON 込み）を作成しようとする。この動作は Pluely の secret（`API_ACCESS_KEY` 等）と Pluely の updater エンドポイント（`https://pluely.com/api/update`、`src-tauri/tauri.conf.json` の `plugins.updater.endpoints`）に依存しており、このリポジトリではいずれも未設定・未整理。

個人利用前提であり、まずは「GitHub Release から Windows インストーラを取得して動かせる」ことがゴール（`docs/仕様/初期マイルストーン.md` ステップ3・4）。署名や自動更新、マルチプラットフォーム対応は後回しでよいと `docs/仕様/初期マイルストーン.md` 6.3 に明記されている。

## Goals / Non-Goals

**Goals:**
- 手動実行 (`workflow_dispatch`) またはタグ push で GitHub Actions からビルドを起動できる
- Windows 向けインストーラ (NSIS/MSI) を生成し、draft の GitHub Release に添付する
- Pluely 固有の secret 未設定でもワークフローが失敗しない
- 署名なしビルドで完走する
- ワークフロー失敗時にログから原因を追える手順を残す（`docs/仕様/TODO.md` Phase 3 最終項目）

**Non-Goals:**
- macOS / Linux 向けビルド（今回は対象外。将来必要になれば別 change で追加）
- コード署名・Tauri updater JSON 生成（`docs/仕様/初期マイルストーン.md` 6.3 の通り、最初は必須にしない）
- アプリ名 (`productName` / `identifier` / window title) の Interview-Pilot 化（`docs/仕様/初期マイルストーン.md` 6.3「変更タイミングを決める」とあり、別途 TODO 上の未決事項。今回は Pluely の名称のままビルドする）
- ライセンス / analytics 関連コードの削除（`docs/仕様/TODO.md` 0節で明示的に対象外）

## Decisions

1. **起動条件: `workflow_dispatch` + タグ push の併用**
   - 理由: 個人利用でリリース頻度が低く、push のたびに4環境ビルドを走らせる必要がない。手動実行で任意タイミングに試せて、タグ push でも安定して起動できるようにする。
   - 代替案: push トリガーのまま → 開発中の push のたびにビルドが走り無駄が多いため却下。

2. **対象プラットフォームを Windows のみに絞る**
   - 理由: `docs/仕様/初期マイルストーン.md` 6.3「まずは Windows 向けインストーラを優先する」に従う。macOS/Linux の secret・証明書要件を今回のスコープから外し、確実に完走させる。
   - 代替案: 既存の4環境 matrix を維持しつつ Windows だけ確認 → 他環境のビルド失敗でワークフロー全体の可読性が落ちるため、matrix 自体を Windows 単独に縮小する。

3. **secret 注入ステップ（`Create environment file`）を削除、または未設定でも通る形にする**
   - 理由: `API_ACCESS_KEY` / `PAYMENT_ENDPOINT` / `APP_ENDPOINT` / `POSTHOG_API_KEY` はいずれも Pluely のバックエンド／決済／analytics 向けで、このプロジェクトでは使わない。空文字のまま `.env` に書いても実害はないが、存在しない secret への参照を残すとメンテナンス時に誤解を招くため、ステップ自体を削除する。
   - 代替案: secret をこのリポジトリにも設定する → Pluely 由来のバックエンドを個人利用アプリで動かす意味がなく、`docs/仕様/TODO.md` の「Pluely API 依存を整理する」方針にも反するため却下。

4. **署名: `tauri-action` に署名系 env を渡さない（未設定のまま）**
   - 理由: `docs/仕様/初期マイルストーン.md` 6.3「署名なしビルドで始める候補とする」を採用。Windows SmartScreen 警告が出ることは `docs/仕様/初期マイルストーン.md` 7.3 で許容済み。
   - 代替案: 自己署名証明書を用意する → 初期段階の手間に見合わないため見送り、将来必要になれば別 change で対応。

5. **updater: `includeUpdaterJson` と `bundle.createUpdaterArtifacts` を無効化し、`tauri.conf.json` の updater エンドポイントは変更しない**
   - 理由: updater JSON 生成には有効な署名鍵と到達可能なエンドポイントが必要。今回は Release からの手動インストールのみが目標のため、Release 添付用の updater JSON と bundler の updater artifact 生成を止める。
   - 補足: 実際の Actions 検証で、`bundle.createUpdaterArtifacts: true` のままだと `plugins.updater.pubkey` に反応して `TAURI_SIGNING_PRIVATE_KEY` が要求されることが分かったため、署名なしビルドの成立に必要な最小変更として `false` にする。
   - 代替案: `tauri.conf.json` の `updater.endpoints` / `pubkey` や plugin 登録も同時に見直す → スコープが広がり、アプリ実行時の updater 機能整理（`docs/仕様/TODO.md` で別途扱う対象）に踏み込むため今回は見送る。

6. **Release は draft のまま、リリース名/本文の Pluely 文言のみ最小限差し替え**
   - 理由: `docs/仕様/初期マイルストーン.md` 6.3「Release は draft を基本候補とする」。本文の "Pluely v..." や macOS 向け案内はそのまま残すと混乱するため、Windows 向けの記述に絞って書き換える。UI 文言や README の本格的な日本語化・個人利用化は別 Phase（Phase 1/2）で扱う。

## Risks / Trade-offs

- [Risk] Windows のみに縮小することで、将来 macOS/Linux 対応が必要になった際に matrix 定義をゼロから作り直すことになる → [Mitigation] 既存の matrix 定義（各プラットフォームの `args` や `system deps` 手順）は git 履歴に残るため、必要になった時点で復元・参照できる。
- [Risk] 署名なしビルドのため Windows SmartScreen の警告が出て、初回起動時に「詳細情報」からの実行が必要になる → [Mitigation] `docs/仕様/初期マイルストーン.md` 7.3 に既知事項として記載済み。インストール手順に注記を残す。
- [Risk] secret 注入ステップを削除すると、将来 Pluely API 連携を復活させたくなった場合に手順を再構築する必要がある → [Mitigation] 削除する行は Pluely 固有のバックエンド・決済・analytics 向けであり、`docs/仕様/TODO.md` Phase 7「不要機能の整理」でも削除方向が既定路線のため、復活の想定は薄い。
- [Risk] `productName` が `Pluely` のまま Release されるため、成果物ファイル名やインストール後のアプリ名が Interview-Pilot と紐付かず分かりにくい → [Mitigation] `docs/仕様/初期マイルストーン.md` 6.3 でも「変更タイミングを決める」対象として未決のため今回は現状維持とし、TODO の「早めに決めたいこと」に既に記載がある通り別途判断する。

## Migration Plan

1. `.github/workflows/publish.yml` を書き換える（トリガー変更、matrix を Windows のみに、secret 注入ステップ削除、署名 env 削除、`includeUpdaterJson: false`、リリース本文調整）
2. ワークフローを `workflow_dispatch` で手動実行し、Actions のログを確認する
3. 生成された Windows インストーラが draft Release に添付されることを確認する
4. ダウンロードしたインストーラで実際にインストール・起動できることを確認する（`docs/仕様/初期マイルストーン.md` ステップ4 に相当するが、本 change では「Release に成果物が添付されるところまで」を完了条件とし、実機インストール確認は必要に応じて後続 change または手動確認とする）
5. 手順を `docs/仕様` 配下（例: `ブランチ・リリース戦略.md` または新規メモ）に記録する

ロールバック: ワークフロー変更のみで、アプリ本体・データベースへの変更は伴わないため、`.github/workflows/publish.yml` を元に戻せば即座に旧状態に復帰できる。

## Open Questions

- タグ push を採用する場合のタグ命名規則（例: `app-v__VERSION__` を踏襲するか）をどうするか
- `productName` / `identifier` / window title を Interview-Pilot に変更するタイミング（`docs/仕様/TODO.md` Phase 3 に既存の未決事項として記載あり、本 change では現状維持を前提とする）
- macOS / Linux ビルドを再度対象に含めるかどうか、含める場合の secret・署名要件の扱い
