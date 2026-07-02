## 1. ワークフローの統合

- [x] 1.1 `.github/workflows/publish.yml` の `verify-tag-on-main` ジョブを `.github/workflows/ci.yml` に移植する
- [x] 1.2 `.github/workflows/publish.yml` の `publish-tauri` ジョブを `.github/workflows/ci.yml` に移植する
- [x] 1.3 `publish-tauri` ジョブに `needs: [frontend, rust, verify-tag-on-main]` を追加する
- [x] 1.4 `publish-tauri` ジョブの `if` を `success() && needs.verify-tag-on-main.outputs.on_main == 'true'` にする
- [x] 1.5 `ci.yml` の `on` に `workflow_dispatch` を追加する(既存の `push` / `pull_request` は維持)
- [x] 1.6 `.github/workflows/publish.yml` を削除する

## 2. ドキュメント整備

- [x] 2.1 `docs/仕様/GitHub Actions リリース手順.md` の記載を、ワークフローファイルが `ci.yml` に一本化されたこと・CI 成功が起動条件に加わったことを反映する形に更新する
- [x] 2.2 `docs/仕様/CI.md` の記載を、`ci.yml` が条件付きで Windows ビルド・Release 作成ジョブも含むことが分かる形に更新する

## 3. 動作確認

- [x] 3.1 次回リリースで `release/v<version>` を `main` にマージし、`main` への通常 push では `verify-tag-on-main` / `publish-tauri` が起動しない(CI ジョブのみ実行される)ことを確認する(v0.1.17: `main` push の run `28620738061` で `verify-tag-on-main` は `skipped`、`publish-tauri` は起動せず)
- [x] 3.2 続けて `v<version>` タグを push し、`frontend` → `rust` → `verify-tag-on-main` が成功したうえで `publish-tauri` が実行され、draft Release が作成されることを確認する(v0.1.17タグ push、run `28620767431`: 4ジョブすべて成功、draft Release にインストーラ2点をアップロード済み)
- [x] 3.3 `main` に含まれないコミットへの検証用タグ push で `publish-tauri` がスキップされることを確認する(`v0.1.17-test-not-on-main` タグ、run `28620786906`: `frontend`/`rust` は成功、`verify-tag-on-main` が `on_main=false` と判定し `publish-tauri` は `skipped`)
- [x] 3.4 検証用のタグ・ブランチを削除する(`v0.1.17-test-not-on-main` タグ・`tmp/verify-v2-not-on-main` ブランチを削除済み)
- [ ] 3.5 `workflow_dispatch` による手動実行で `frontend` / `rust` / `verify-tag-on-main` / `publish-tauri` が一通り実行されることを確認する(Claude Code の `gh` トークンには `workflow_dispatch` 発火権限がなく自動検証不可。GitHub の Actions タブからユーザー自身による確認が必要)

**インシデント記録(アーカイブ後判明)**: 1.6 の `.github/workflows/publish.yml` 削除は `rm` コマンドではファイルを消したものの、その後の `git add` にこのファイルを含め忘れたためコミットされていなかった。そのため `v0.1.17` タグ push で `ci.yml`(新)と `publish.yml`(旧・CI非依存)の両方が起動し、Windows ビルドが二重実行され、`v0.1.17` の draft Release にインストーラが重複アップロードされた。`hotfix/v0.1.18` で削除を正しくコミットして修正した。詳細は `docs/仕様/GitHub Actions リリース手順.md` の検証結果セクションを参照。
