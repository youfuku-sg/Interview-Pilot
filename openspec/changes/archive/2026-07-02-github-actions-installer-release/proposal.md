## Why

現状の `.github/workflows/publish.yml` は Pluely 由来のまま残っており、master への push で自動的に4プラットフォーム分のビルド・署名付きリリースを行おうとする。Pluely の secret（`API_ACCESS_KEY` / `PAYMENT_ENDPOINT` / `APP_ENDPOINT` / `POSTHOG_API_KEY` / `TAURI_SIGNING_PRIVATE_KEY` 等）や Pluely 自身の updater エンドポイント（`https://pluely.com/api/update`）に依存しており、このリポジトリでは未設定のため、そのまま実行すると失敗するか、意図しない外部送信が発生する。

個人利用前提の Interview-Pilot として、まずは手元でビルドしなくても GitHub Release からインストーラを取得できる状態を作りたい（`docs/仕様/初期マイルストーン.md` ステップ3、`docs/仕様/TODO.md` Phase 3）。今回は日本語化より先に、このビルド/リリース経路を先に整備する。

## What Changes

- `.github/workflows/publish.yml` を Windows 向けインストーラ生成を優先する形に作り直す（macOS / Linux は対象外にする、または明示的に除外する）
- ワークフローの起動条件を「push to master」から「手動実行 (`workflow_dispatch`) または tag push」に変更する
- Pluely 固有の secret 依存（`API_ACCESS_KEY` / `PAYMENT_ENDPOINT` / `APP_ENDPOINT` / `POSTHOG_API_KEY`）を洗い出し、未設定でもビルドが失敗しない形に整理する（当面は環境変数注入自体を外す）
- `TAURI_SIGNING_PRIVATE_KEY` による署名を必須にせず、署名なしビルドで開始できるようにする
- `includeUpdaterJson` を無効化するか、Pluely の updater エンドポイントに依存しない形にする（updater JSON 生成は今回の対象外とする）
- Release 作成を draft のままにする
- リリース本文・タグ名などの Pluely 固有文言（`releaseName: "Pluely v..."` 等）を Interview-Pilot 向けに調整する
- ワークフローの実行手順・確認手順を `docs/仕様` または README から参照できるように記載する

**BREAKING**: 該当なし（このワークフローはまだ実運用されていないため、既存の外部利用者への影響はない）

## Capabilities

### New Capabilities
- `installer-release-workflow`: GitHub Actions で Windows 向けインストーラをビルドし、GitHub Release (draft) に添付するまでの一連の流れ

### Modified Capabilities
（既存の spec なし。今回が最初の capability 追加のため該当なし）

## Impact

- 影響ファイル: `.github/workflows/publish.yml`, `src-tauri/tauri.conf.json`, `package.json`, `src-tauri/Cargo.toml`, 必要に応じて `VERSION` / `CHANGELOG.md`
- 影響システム: GitHub Actions、GitHub Releases
- 非対象: アプリ本体の UI 文言変更、機能削除、ライセンス関連コードの削除、analytics / telemetry の削除、データベース変更、ローカル STT / ローカル LLM 接続実装（`docs/仕様/TODO.md` 0節、`docs/仕様/初期マイルストーン.md` 3節）
