## Context

`.github/workflows/publish.yml` は現在:

```yaml
on:
  workflow_dispatch:
  push:
    branches:
      - "main"
    tags:
      - "v*"
```

GitHub Actions の `push` トリガーは `branches` と `tags` を独立した条件として評価し、どちらか一方に一致すれば起動する（OR）。`branch-release-strategy` スキルの更新により、`main` への push は必ず `release/v<version>` マージ由来であり、必ず対応する `v<version>` タグが作成・push される運用に統一された。そのため、同一コミットに対して「main push」「tag push」の2つのイベントが発生し、`publish` ワークフローが2回起動してしまう（実測: `v0.1.12`・`v0.1.13` でそれぞれ2回、1回あたり約13〜14分の Windows ビルド）。

ユーザーからは「AND条件（タグが `main` 上にある場合のみ）で動くようにしたい」という要望がある。

## Goals / Non-Goals

**Goals:**
- `v<version>` タグ push を起点としつつ、そのタグが指すコミットが `main` の履歴に含まれる場合にのみビルド・Release作成を実行する
- `main` に含まれないタグ push（例: `release/*` ブランチ上で誤ってタグを打った場合）ではビルドを実行しない
- 二重ビルドを解消し、CI 実行時間を実質半減させる
- `workflow_dispatch`（手動実行）は影響を受けず、従来通り任意のブランチで実行できる

**Non-Goals:**
- `release/v<version>` ブランチ自体からのビルド（マージ前のプレビュービルド）の追加。今回は「`main` 上のタグ」のみに絞る
- タグが `main` 上にない場合の通知・アラート機構の追加（ログ上でスキップ理由が分かれば十分とする）
- `ci.yml`（lint/型チェック用ワークフロー）への変更

## Decisions

1. **`on.push` から `branches: [main]` を削除し、`tags: [v*]` のみを残す**
   - 理由: トリガーそのものを「タグ push」に一本化することで、同一コミットに対する二重起動を構造的に防ぐ。
   - 代替案: `concurrency` グループでコミット単位の重複実行をキャンセルする → 2回のジョブ起動自体は防げず、片方が cancel されるだけで無駄なジョブ起動ログが残る。今回は起動条件そのものを絞る方を優先する。

2. **タグが `main` 上にあるかどうかを、ジョブ内の明示的なチェックで判定する（AND 条件をコードで実装する）**
   - 理由: GitHub Actions の `push` トリガー自体には「タグ AND ブランチ」を直接表現する構文がない。実行時にチェックを行う以外に、宣言的にこの条件を表現する方法がない。
   - 実装: `verify-tag-on-main` という軽量ジョブ（`ubuntu-latest`）を追加し、`git fetch origin main` 後に `git merge-base --is-ancestor <tag-sha> origin/main` を実行して判定する。結果を `on_main` という job output として公開する。
   - 代替案: GitHub API (`GET /repos/{owner}/{repo}/commits/{sha}/branches-where-head` 等) を使う → `gh` CLI 経由でも同等のことは可能だが、`git merge-base --is-ancestor` の方が追加の API 呼び出しや認証を必要とせず、既存の checkout の仕組みだけで完結するため、こちらを採用する。

3. **判定ジョブを分離し、条件を満たさない場合は本体の Windows ビルドジョブ自体をスキップする**
   - 理由: `windows-latest` でのビルドは重く時間がかかる（約13〜14分）。`main` 上にないタグであることが分かった時点で、軽量な `ubuntu-latest` ジョブだけで早期に判定し、無駄な Windows ビルドを起動しないようにする。
   - 実装: `publish-tauri` ジョブに `needs: verify-tag-on-main` と `if: needs.verify-tag-on-main.outputs.on_main == 'true'` を追加する。
   - 代替案: `publish-tauri` ジョブの最初のステップとしてチェックを行い、条件を満たさなければそのステップ以降を `if` でスキップする → `windows-latest` ランナーの起動自体（課金・待ち時間）は発生してしまうため、ジョブ分離の方が無駄が少ない。

4. **チェック用の checkout は `fetch-depth: 0`（全履歴）を使う**
   - 理由: `git merge-base --is-ancestor` で正しく判定するには、タグのコミットと `main` 双方の履歴が必要。デフォルトの浅い checkout（`fetch-depth: 1`）では履歴が足りず誤判定する可能性がある。
   - 代替案: 必要な分だけ `--deepen` する → リポジトリ規模が小さく履歴も長くないため、シンプルに全履歴取得で確実性を優先する。

## Risks / Trade-offs

- [Risk] `verify-tag-on-main` ジョブのロジックに不具合があると、正当な `main` 上のタグでもビルドがスキップされてしまう可能性がある → [Mitigation] tasks で実際に `main` 上のタグ push（正常系）と `main` に含まれないタグ push（異常系）の両方を検証する。
- [Risk] ジョブを分離したことで、GitHub Actions の実行ログが2ジョブに分かれ、初見では分かりにくくなる → [Mitigation] `verify-tag-on-main` のジョブ名・ステップ名を分かりやすくし、スキップ時のログメッセージを明示する。
- [Risk] 将来 `release/v<version>` ブランチ上でのプレビュービルドが必要になった場合、今回の設計（`main` 限定）を見直す必要がある → [Mitigation] Non-Goals に明記済み。必要になれば別 change で対応する。

## Migration Plan

1. `.github/workflows/publish.yml` の `on.push.branches` を削除する
2. `verify-tag-on-main` ジョブを追加する
3. `publish-tauri` ジョブに `needs` / `if` を追加する
4. `main` 上のタグ push（例: 次回リリース）でビルドが実行されることを確認する
5. `main` に含まれないコミットへのタグ push（検証用）でビルドがスキップされることを確認する
6. 検証用のタグ・ブランチを削除する

ロールバック: ワークフロー定義のみの変更のため、`.github/workflows/publish.yml` を変更前の状態に戻せば即座に復帰できる。

## Open Questions

- `release/*` ブランチからのプレビュービルドを将来必要とするか（Non-Goals 参照、必要になれば別 change）
