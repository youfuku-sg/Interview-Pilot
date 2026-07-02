## Why

`.github/workflows/publish.yml` は `on.push` に `branches: [main]` と `tags: [v*]` を両方設定している。GitHub Actions の `push` トリガーはこれらを OR 条件として扱うため、`release/v<version>` を `main` にマージして push した直後に `v<version>` タグを push すると、同じコミット・同じバージョンに対してビルドが2回（main push分・タグ push分）走ってしまう。実際に `v0.1.12` / `v0.1.13` のリリースでそれぞれ2回ずつ、Windows ビルド（1回あたり約13〜14分）が実行された。

`branch-release-strategy` スキルの更新（本セッションの直前の変更）により「`main` への push は必ず `release/v<version>` を経由し、必ず `v<version>` タグを伴う」ことが確定した。つまり `main` push は常に対応するタグ push とセットで発生する。この前提のもとで、`main` push トリガーを維持する意味は薄く、二重ビルドの原因になっている。

## What Changes

- `.github/workflows/publish.yml` の起動条件を、`v<version>` タグ push が **かつ** そのタグの指すコミットが `main` に含まれている場合にのみビルドを実行する形（AND 条件）に変更する
- 具体的には、`on.push` から `branches: [main]` を削除し `tags: [v*]` のみを残す。加えて、タグ push で起動した際に、対象コミットが `main` の履歴に含まれるかを確認するステップをジョブの先頭に追加し、含まれない場合はビルドをスキップする
- `main` に含まれない場所（例: `release/*` ブランチ上で誤って `v*` タグを打ってしまった場合）へのタグ push では、ビルドが実行されないようにする
- `workflow_dispatch`（手動実行）は現状維持する

**BREAKING**: 該当なし。ワークフロー定義のみの変更で、アプリ本体・データベースには影響しない。

## Capabilities

### Modified Capabilities
- `installer-release-workflow`: 起動条件を「`main` push OR タグ push」から「タグ push AND 対象コミットが `main` に含まれる」に変更する

## Impact

- 影響ファイル: `.github/workflows/publish.yml`
- 影響システム: GitHub Actions（ビルド回数の削減、CI 実行時間の削減）
- 非対象: アプリ本体の変更、`ci.yml`（lint/型チェック用ワークフロー）の変更
