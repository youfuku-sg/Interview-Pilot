# GitHub Actions リリース手順

## 1. 目的

この文書は、GitHub Actions の `publish` ワークフローで Windows 向けインストーラを作成し、draft の GitHub Release に添付する手順をまとめる。

ブランチ運用、タグ規則、リリース方針は `ブランチ・リリース戦略.md` に従う。

## 2. 前提

- 作業ブランチは `feature/<name>` を使う
- リリース準備が必要な場合は `release/v<version>` を使う
- タグは `v<version>` 形式を使う
- `publish` ワークフローは `master` への通常 push では起動しない
- 起動方法は、手動実行または `v*` タグ push とする
- 当面の成果物は Windows 向けインストーラのみとする
- Release は draft として作成する
- Tauri updater 用 JSON は生成しない
- コード署名は当面設定しない

## 3. 手動実行手順

1. GitHub の対象リポジトリを開く
2. `Actions` タブを開く
3. 左側の workflow 一覧から `publish` を選ぶ
4. `Run workflow` を押す
5. 実行対象のブランチを選ぶ
6. `Run workflow` を確定する
7. 実行ログで `publish-tauri` job が開始されることを確認する

## 4. タグ push 実行手順

1. リリース対象のコミットが入ったブランチを確認する
2. `v<version>` 形式でタグを作成する
3. タグを GitHub に push する
4. GitHub の `Actions` タブで `publish` が起動したことを確認する

例:

```bash
git tag v0.1.10
git push origin v0.1.10
```

## 5. 成功時の確認

ワークフローが成功したら、以下を確認する。

- `publish-tauri` job が成功している
- GitHub Releases に draft release が作成されている
- draft release の名前が `Interview-Pilot v<version>` になっている
- Windows 向けインストーラが添付されている
- updater 用 JSON が添付されていない

## 6. 失敗時のログ確認

ワークフローが失敗した場合は、以下の順で原因を追う。

1. GitHub の `Actions` タブを開く
2. 失敗した `publish` の実行を開く
3. `publish-tauri` job を開く
4. 赤いアイコンが付いた失敗ステップを開く
5. ステップ末尾のエラーを確認する
6. 必要に応じて、直前のステップの標準出力も確認する

よく見るポイント:

- `Install frontend deps`: `npm ci` の依存関係エラー
- `Build & publish`: Tauri のビルドエラー、Rust のコンパイルエラー、Release 作成エラー
- `GITHUB_TOKEN` の権限: Release 作成に必要な `contents: write` が有効か

## 7. 注意点

- 署名なしビルドのため、Windows SmartScreen の警告が出る可能性がある
- draft release の内容を確認してから、必要に応じて公開する
- macOS / Linux 向け成果物は今回の対象外とする
