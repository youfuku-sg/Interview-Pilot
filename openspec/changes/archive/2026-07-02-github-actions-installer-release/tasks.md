## 1. ワークフロー起動条件の変更

- [x] 1.1 `.github/workflows/publish.yml` の `on.push.branches: [master]` を削除する
- [x] 1.2 `on.workflow_dispatch` を追加する
- [x] 1.3 `on.push.tags` （例: `app-v*`）を追加する

## 2. ビルド対象を Windows に絞る

- [x] 2.1 `strategy.matrix.include` から macOS・Ubuntu の要素を削除し、`windows-latest` のみ残す
- [x] 2.2 Ubuntu 向けの `Install system deps (Ubuntu)` ステップを削除する
- [x] 2.3 macOS 向けの Rust ターゲット分岐（`aarch64-apple-darwin,x86_64-apple-darwin`）を削除する

## 3. Pluely 固有の secret / 署名依存を除去

- [x] 3.1 `Create environment file` ステップ（`API_ACCESS_KEY` / `PAYMENT_ENDPOINT` / `APP_ENDPOINT` / `POSTHOG_API_KEY` を書き込む部分）を削除する
- [x] 3.2 `tauri-action` ステップの `env` から上記4つの secret 参照を削除する
- [x] 3.3 `tauri-action` ステップの `env` から `TAURI_SIGNING_PRIVATE_KEY` / `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` を削除する（署名なしビルドにする）

## 4. Release 設定の調整

- [x] 4.1 `tauri-action` の `includeUpdaterJson` を `false` にする（または該当行を削除する）
- [x] 4.2 `updaterJsonPreferNsis` を削除する
- [x] 4.3 `releaseDraft: true` を維持する
- [x] 4.4 `releaseName` / `releaseBody` の Pluely / macOS 前提の文言を、Windows インストーラ向けの内容に書き換える
- [x] 4.5 `src-tauri/tauri.conf.json` の `bundle.createUpdaterArtifacts` を `false` にし、署名鍵なしで updater artifact 生成を要求しないようにする

## 5. 動作確認

- [x] 5.1 `v*` タグ push でワークフローを実行する（`workflow_dispatch` は workflow が default branch に入った後に利用する）
- [x] 5.2 Actions のログでビルドが全ステップ成功することを確認する
- [x] 5.3 draft の GitHub Release が作成され、Windows インストーラ（NSIS/MSI）が添付されていることを確認する
- [x] 5.4 Release に updater 用 JSON が含まれていないことを確認する

## 6. ドキュメント整備

- [x] 6.1 ワークフローの起動方法（`workflow_dispatch` の実行手順）を `docs/仕様` 配下に記載する
- [x] 6.2 ワークフロー失敗時にログから原因を追う手順を `docs/仕様` 配下に記載する
- [x] 6.3 `docs/仕様/TODO.md` の Phase 3 該当項目にチェックを入れる
