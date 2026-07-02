## 1. ワークフロー起動条件の変更

- [x] 1.1 `.github/workflows/publish.yml` の `on.push.branches: [main]` を削除する（`on.push.tags: [v*]` と `workflow_dispatch` のみ残す）

## 2. main 上判定ジョブの追加

- [x] 2.1 `verify-tag-on-main` ジョブ（`ubuntu-latest`）を追加する
- [x] 2.2 `fetch-depth: 0` で checkout し、`git fetch origin main` を実行する
- [x] 2.3 `git merge-base --is-ancestor <tag-sha> origin/main` でタグが `main` に含まれるか判定し、`on_main` という job output に結果を出力する
- [x] 2.4 判定結果をログに分かりやすく出力する（含まれる/含まれない、どちらのケースも）

## 3. ビルドジョブの条件化

- [x] 3.1 `publish-tauri` ジョブに `needs: verify-tag-on-main` を追加する
- [x] 3.2 `publish-tauri` ジョブに `if: needs.verify-tag-on-main.outputs.on_main == 'true'` を追加する
- [x] 3.3 `workflow_dispatch` での手動実行時は `verify-tag-on-main` の判定に影響されず、常にビルドが実行されることを確認する（`github.event_name == 'workflow_dispatch'` の場合は判定をスキップして常に true 扱いにする）

## 4. 動作確認

- [ ] 4.1 次回リリースで `release/v<version>` を `main` にマージし、`main` への push だけではビルドが起動しないことを確認する
- [ ] 4.2 続けて `v<version>` タグを push し、`verify-tag-on-main` が成功して Windows ビルドジョブが実行されることを確認する
- [ ] 4.3 `main` に含まれないコミット（例: 一時的な検証用ブランチ）に検証用タグを push し、`verify-tag-on-main` が false と判定して Windows ビルドジョブがスキップされることを確認する
- [ ] 4.4 検証用のタグ・ブランチを削除する
- [ ] 4.5 `workflow_dispatch` による手動実行が引き続き動作することを確認する

## 5. ドキュメント整備

- [x] 5.1 `docs/仕様/GitHub Actions リリース手順.md` の起動条件の説明を更新する
- [ ] 5.2 二重ビルドが解消されたことを記録する
