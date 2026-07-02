## 1. release ブランチの準備

- [x] 1.1 現在の feature ブランチから `release/v<version>` ブランチを作成する
- [x] 1.2 `package.json` のバージョンを更新する
- [x] 1.3 `src-tauri/Cargo.toml` のバージョンを更新する
- [x] 1.4 `src-tauri/tauri.conf.json` のバージョンを更新する
- [x] 1.5 `CHANGELOG.md` 新設の要否を決定し（`docs/仕様/ブランチ・リリース戦略.md` 8節の未決事項だった）、`CHANGELOG.md` を新設して `v0.1.10` のエントリを記載する

## 2. main へのマージと push トリガーの確認

- [x] 2.1 `release/v<version>` を `main` にマージする
- [x] 2.2 `main` を push し、`publish` ワークフローが起動することを確認する（run 28582867885, main push, success）
- [x] 2.3 Actions のログでビルドが全ステップ成功することを確認する
- [x] 2.4 draft の GitHub Release が作成され、Windows インストーラが添付されていることを確認する — GitHub Releases ページ上でユーザーが目視確認。Release・インストーラー・本文（旧固定文言）いずれも存在していた。`gh api` が直後に空配列を返したのは反映遅延（キャッシュ）によるものと判断し、実害なしとする

## 3. タグ push トリガーの確認

- [x] 3.1 `v<version>` タグを push する
- [x] 3.2 `publish` ワークフローが起動することを確認する（run 28583049138, tag v0.1.10 push, success）
- [x] 3.3 Actions のログでビルドが全ステップ成功することを確認する
- [x] 3.4 draft の GitHub Release が作成され、Windows インストーラが添付されていることを確認する — 2.4 と同一の Release で確認済み（main push とタグ push は同一コミットのため同じ Release を指す）

## 4. トリガー対象外の確認

- [x] 4.1 `feature/*` または `release/v<version>` ブランチへの push では `publish` ワークフローが起動しないことを確認する

## 5. 問題対応

- [x] 5.1 起動しない・ビルド失敗・Release添付されないなどの問題が見つかった場合、`.github/workflows/publish.yml` を修正する — トリガー・ビルド・Release添付は問題なし。修正が必要だったのは releaseBody（5.3）のみ
- [x] 5.2 修正した場合は再度該当トリガーで動作確認する — `release/v0.1.11` で main push・タグ push の両方を再実行し、成功を確認済み（run 28609307222, 28609316798）
- [x] 5.3 `releaseBody` を固定文言から `CHANGELOG.md` の該当バージョンのエントリを抽出する形に変更する（該当エントリがない場合は既存の固定文言にフォールバック）
- [ ] 5.4 5.3 の変更後、実際に Release 本文に CHANGELOG の内容が反映されることを確認する — ユーザーによる `v0.1.11` Release ページの目視確認待ち（`gh` CLI 側は反映遅延で未確認）

## 6. 後片付けと記録

- [x] 6.1 `release/v<version>` ブランチを削除する（`release/v0.1.11` をローカル・リモートともに削除済み）
- [x] 6.2 確認結果（起動条件ごとの成否、見つかった問題と対応）を `docs/仕様` 配下に記録する
- [x] 6.3 `docs/仕様/TODO.md` の該当項目があれば反映する
