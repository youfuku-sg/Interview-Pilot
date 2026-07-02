# GitHub Actions リリース手順

## 1. 目的

この文書は、GitHub Actions の `publish` ワークフローで Windows 向けインストーラを作成し、draft の GitHub Release に添付する手順をまとめる。

ブランチ運用、タグ規則、リリース方針は `ブランチ・リリース戦略.md` に従う。

## 2. 前提

- 作業ブランチは `feature/<name>` を使う
- リリース準備が必要な場合は `release/v<version>` を使う
- タグは `v<version>` 形式を使う
- `publish` ワークフローは `main` への push、`v*` タグ push、または手動実行 (`workflow_dispatch`) で起動する
- `main` 以外のブランチ（`master` / `feature/*` / `release/v<version>` を含む）への通常 push では起動しない
- 当面の成果物は Windows 向けインストーラのみとする
- Release は draft として作成する
- Release 本文は `CHANGELOG.md` の該当バージョンのエントリを自動反映する（該当エントリがない場合は固定文言にフォールバックする）
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

default branch へ workflow を反映する前に検証したい場合は、この方法を使う。

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
- `gh` CLI（`gh release view` / `gh api repos/<owner>/<repo>/releases` 等）はワークフロー完了直後、実際には Release が作成済みでも一時的に空の結果を返すことがある（反映遅延）。`gh` で確認できない場合は、GitHub の Releases ページをブラウザで直接確認する

## 8. main ブランチ運用下での検証結果（v0.1.11）

`release-installer-verification` change にて、`release/v0.1.11` → `main` マージ → `v0.1.11` タグ push という実際の手順で以下を確認した。

- `main` push（run `28609307222`）: 成功。draft Release が作成され、Windows インストーラが添付された
- `v0.1.11` タグ push（run `28609316798`）: 成功。同一 Release に反映された
- `feature/*` / `release/v<version>` ブランチへの push ではワークフローが起動しないことを確認した
- Release 本文が `CHANGELOG.md` の `## [0.1.11]` エントリを反映するかは、ユーザーによる GitHub Releases ページの目視確認待ち（`gh` CLI 側は反映遅延で未確認）
