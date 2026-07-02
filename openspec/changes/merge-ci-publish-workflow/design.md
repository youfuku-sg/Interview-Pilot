## Context

現在、`.github/workflows/` には2つの独立したワークフローがある。

`ci.yml`:
```yaml
on:
  push:
  pull_request:
    branches:
      - "main"

jobs:
  frontend: ...  # typecheck, lint
  rust: ...      # cargo fmt --check, clippy
```

`publish.yml`(`publish-trigger-tag-on-main-only` change で `verify-tag-on-main` ジョブを追加済み):
```yaml
on:
  workflow_dispatch:
  push:
    tags:
      - "v*"

jobs:
  verify-tag-on-main: ...  # タグが main の履歴に含まれるか判定
  publish-tauri:
    needs: verify-tag-on-main
    if: needs.verify-tag-on-main.outputs.on_main == 'true'
    ...  # Windows ビルド・draft Release 作成
```

`v<version>` タグを `main` 上のコミットに push すると、GitHub Actions の `on.push` の評価により `ci.yml`(トリガー条件に `tags` の制限がないため任意の push にマッチ)と `publish.yml` の両方が同時にキックされる。この2つのワークフローには依存関係がなく、`ci.yml` の失敗を待たずに `publish.yml` の Windows ビルド・Release 作成が完走してしまう。

## Goals / Non-Goals

**Goals:**
- `ci.yml` と `publish.yml` を1つのワークフローファイルに統合する
- `publish-tauri`(Windows ビルド・Release 作成)は `frontend` と `rust` の CI ジョブが成功し、かつ `verify-tag-on-main` がタグを `main` 上と判定した場合のみ実行されるようにする
- 既存の `ci.yml` のトリガー条件(任意ブランチへの push、`main` 向け PR)と `publish.yml` のトリガー条件(`v*` タグ push、`workflow_dispatch`)を維持しつつ、1ファイルにまとめる
- `workflow_dispatch` による手動実行時も `frontend` / `rust` の CI ジョブが実行され、ゲートとして機能するようにする

**Non-Goals:**
- CI ジョブ(`frontend` / `rust`)自体のチェック内容の変更(型チェック・lint・fmt・clippy の対象や設定変更)
- `verify-tag-on-main` / `publish-tauri` の判定ロジック自体の変更(`publish-trigger-tag-on-main-only` で実装済みのロジックをそのまま流用する)
- macOS / Linux 向け CI・ビルドの追加

## Decisions

1. **`ci.yml` に統合し、`publish.yml` を削除する(逆ではなく)**
   - 理由: `ci.yml` のトリガー条件(任意 push + PR)は `publish.yml` のトリガー条件(タグ push + 手動実行)を包含する上位互換の関係にある(タグ push も `push` イベントの一種であり、`ci.yml` の無条件 `push:` に元々マッチしていた)。ワークフロー名 `ci` を残し、その中に条件付きで `publish` 相当のジョブを追加する構成の方が自然。
   - 代替案: `publish.yml` に統合し `ci.yml` を削除する → ワークフロー名が `publish` になり、「あらゆる push で CI が走る」という実態と名前が一致しなくなるため不採用。

2. **`publish-tauri` の `if` に `success()` を明示する**
   - 理由: GitHub Actions では、ジョブに `needs` を指定していてもカスタムの `if` 条件を書くと、デフォルトの `success()` ゲート(すべての `needs` ジョブが成功していること)は自動適用されなくなり、明示的に書く必要がある。`if: needs.verify-tag-on-main.outputs.on_main == 'true'` だけでは、理論上 `frontend` / `rust` が失敗していても `verify-tag-on-main` さえ成功していれば `publish-tauri` が実行されてしまう。
   - 実装: `if: success() && needs.verify-tag-on-main.outputs.on_main == 'true'`
   - 代替案: `needs` を `verify-tag-on-main` のみとし、`frontend` / `rust` の成功確認を省略する → CI 失敗時に誤ってビルド・Release が作られる問題を解消できないため不採用。

3. **`verify-tag-on-main` は `frontend` / `rust` と並列実行し、`needs` を持たせない**
   - 理由: `verify-tag-on-main` は git の祖先関係を確認するだけの軽量ジョブで、`frontend` / `rust` の結果に依存しない。並列実行することでワークフロー全体の所要時間を短縮できる(`verify-tag-on-main` は数秒〜数十秒で完了する想定)。
   - 代替案: `verify-tag-on-main` にも `needs: [frontend, rust]` を付ける → 判定自体は CI 結果と独立しているため、直列化する理由がなく、無駄な待ち時間が増えるだけなので不採用。

4. **`frontend` / `rust` ジョブのトリガーに `workflow_dispatch` を追加する**
   - 理由: 手動実行(`workflow_dispatch`)でも `publish-tauri` が `needs: [frontend, rust, verify-tag-on-main]` に依存する以上、`frontend` / `rust` も同じトリガーで起動できる必要がある。既存の `ci.yml` は `workflow_dispatch` を持たないため、これを追加しないと手動実行時に `publish-tauri` が「`frontend` / `rust` が起動していない」状態で `needs` を満たせず失敗またはスキップしてしまう。
   - 代替案: `workflow_dispatch` 実行時は `frontend` / `rust` をスキップする条件を作る → 手動実行時に CI ゲートが機能しなくなり、Goals(手動実行時も CI がゲートとして機能する)に反するため不採用。

## Risks / Trade-offs

- [Risk] `frontend` / `rust` の実行時間が加わることで、タグ push から Release 作成までの合計時間が伸びる(現状: `verify-tag-on-main` 数十秒 + Windows ビルド約13〜14分 → 変更後: `frontend`/`rust`(並列、数分程度)+ Windows ビルド約13〜14分) → [Mitigation] `frontend` / `rust` は `verify-tag-on-main` や Windows ビルドと並列実行されるため、直列に加算されるのは `frontend`/`rust` の完了を待つ分のみ。個人利用規模では許容範囲とする。
- [Risk] `ci.yml` の既存の PR 向けトリガー(`pull_request: branches: [main]`)と、統合後の `publish-tauri` ジョブが同一ワークフロー内に同居することで、PR 実行時に `verify-tag-on-main` や `publish-tauri` が誤って実行されないか誤解が生じやすい → [Mitigation] `verify-tag-on-main` の `if` 条件(タグ push または `workflow_dispatch` のみ)を維持し、PR イベントでは自動的にスキップされることをタスクで確認する。
- [Risk] `needs` の追加によりジョブ数が増え、GitHub Actions の実行ログが複雑に見える → [Mitigation] ジョブ名を `frontend` / `rust` / `verify-tag-on-main` / `publish-tauri` のまま維持し、既存の命名を崩さない。

## Migration Plan

1. `.github/workflows/ci.yml` に `verify-tag-on-main` / `publish-tauri` ジョブを追加する(`publish.yml` の内容を移植)
2. `publish-tauri` に `needs: [frontend, rust, verify-tag-on-main]` と `if: success() && needs.verify-tag-on-main.outputs.on_main == 'true'` を設定する
3. `frontend` / `rust` のトリガーに `workflow_dispatch` を追加する
4. `.github/workflows/publish.yml` を削除する
5. 次回リリースで実際にタグ push を行い、`frontend` → `rust` → `verify-tag-on-main` → `publish-tauri` の一連の流れが1つのワークフロー実行として動くことを確認する
6. CI が意図的に失敗する状態(例: lint エラー)でタグを push し、`publish-tauri` がスキップされることを確認する

ロールバック: ワークフロー定義のみの変更のため、`.github/workflows/ci.yml` を変更前の状態に戻し `publish.yml` を復元すれば即座に復帰できる。

## Open Questions

(なし)
