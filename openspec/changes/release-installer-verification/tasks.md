## 1. release ブランチの準備

- [x] 1.1 現在の feature ブランチから `release/v<version>` ブランチを作成する
- [x] 1.2 `package.json` のバージョンを更新する
- [x] 1.3 `src-tauri/Cargo.toml` のバージョンを更新する
- [x] 1.4 `src-tauri/tauri.conf.json` のバージョンを更新する

## 2. main へのマージと push トリガーの確認

- [ ] 2.1 `release/v<version>` を `main` にマージする
- [ ] 2.2 `main` を push し、`publish` ワークフローが起動することを確認する
- [ ] 2.3 Actions のログでビルドが全ステップ成功することを確認する
- [ ] 2.4 draft の GitHub Release が作成され、Windows インストーラが添付されていることを確認する

## 3. タグ push トリガーの確認

- [ ] 3.1 `v<version>` タグを push する
- [ ] 3.2 `publish` ワークフローが起動することを確認する
- [ ] 3.3 Actions のログでビルドが全ステップ成功することを確認する
- [ ] 3.4 draft の GitHub Release が作成され、Windows インストーラが添付されていることを確認する

## 4. トリガー対象外の確認

- [ ] 4.1 `feature/*` または `release/v<version>` ブランチへの push では `publish` ワークフローが起動しないことを確認する

## 5. 問題対応

- [ ] 5.1 起動しない・ビルド失敗・Release添付されないなどの問題が見つかった場合、`.github/workflows/publish.yml` を修正する
- [ ] 5.2 修正した場合は再度該当トリガーで動作確認する

## 6. 後片付けと記録

- [ ] 6.1 `release/v<version>` ブランチを削除する
- [ ] 6.2 確認結果（起動条件ごとの成否、見つかった問題と対応）を `docs/仕様` 配下に記録する
- [ ] 6.3 `docs/仕様/TODO.md` の該当項目があれば反映する
