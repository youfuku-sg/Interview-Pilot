## Why

`github-actions-installer-release` により、`v*` タグ push で Windows インストーラをビルドし draft の GitHub Release に添付する経路は一度動作確認済みである。ただしその検証は `master` を起点に行われており、その後 `docs/仕様/ブランチ・リリース戦略.md` に基づくブランチ戦略（安定ブランチ `main`、`feature/*` → `release/v<version>` → 安定ブランチへマージ → `v<version>` タグ push）が固まり、`.github/workflows/publish.yml` のトリガーも `main` への push と `v*` タグ push に変更済みである（`branch-strategy-skill` の設計で確認）。

トリガー条件が変わった以上、実際に「`feature/*` から `release/v<version>` を経て `main` にマージし、タグを push する」という策定済みのリリース手順（`docs/仕様/ブランチ・リリース戦略.md` 7節）の流れに沿ってワークフローが問題なく起動し、成果物が Release に添付されることを、`main` ブランチ運用下で改めて確認しておきたい。前回の検証結果をそのまま信頼せず、実際の運用フローで再検証する。

## What Changes

- `docs/仕様/ブランチ・リリース戦略.md` 7節の初期リリース手順に沿って、`release/v<version>` ブランチを作成しバージョンを更新する
- 作成した `release/v<version>` を `main` にマージする
- `main` への push、および `v<version>` タグの push それぞれで `.github/workflows/publish.yml` が起動することを確認する
- ビルドが成功し、Windows インストーラが draft の GitHub Release に添付されることを `main` ブランチ運用下で確認する
- 確認結果と手順を `docs/仕様` 配下に記録する（`github-actions-installer-release` の検証記録との重複がないよう、`main` 運用に特有の差分のみ追記する）
- 問題が見つかった場合は `.github/workflows/publish.yml` を修正する

**BREAKING**: 該当なし

## Capabilities

### Modified Capabilities
- `installer-release-workflow`: トリガー条件が `main` push を含む形に変わったため、`main` ブランチ運用下でも要件（手動/タグ/main push起動、secret非依存、draft Release添付、失敗時ログ追跡）を満たすことを明示する

## Impact

- 影響ファイル: `.github/workflows/publish.yml`（問題が見つかった場合のみ修正）、`docs/仕様` 配下の検証記録
- 影響システム: GitHub Actions、GitHub Releases、ブランチ運用（`release/v<version>` の実地作成・マージ・削除）
- 非対象: アプリ本体の機能変更、`branch-release-strategy` スキル自体の変更、macOS/Linux ビルドの追加
