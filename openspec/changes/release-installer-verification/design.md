## Context

`github-actions-installer-release` の実装・検証は、当時 `master` を作業ブランチとして行われた。その後 `docs/仕様/ブランチ・リリース戦略.md` に基づき、安定ブランチを `main` とする方針（`branch-strategy-skill` 設計内で確定事項として扱われている）が固まり、`.github/workflows/publish.yml` のトリガーも `on.push.branches: [main]` を含む形に既に変更されている。ローカル・リモートともに `main` ブランチは作成済みだが、GitHub 側の default branch はまだ `master` のままである（`remotes/origin/HEAD -> origin/master`）。

`docs/仕様/ブランチ・リリース戦略.md` 7節の初期リリース手順は「`feature/<name>` → `release/v<version>` → 安定ブランチへマージ → `v<version>` タグ」の流れを想定しているが、この流れを実際に `main` 相手に一通り実施して、ワークフローが起動しビルド・Release添付まで成功することはまだ確認していない。

## Goals / Non-Goals

**Goals:**
- `release/v<version>` ブランチ作成 → バージョン更新 → `main` へのマージ、という実際の手順で `publish` ワークフローが起動することを確認する
- `main` へのマージ push と、その後の `v<version>` タグ push の両方で正しく起動することを確認する
- ビルドが成功し、Windows インストーラが draft Release に添付されることを確認する
- 問題があれば `.github/workflows/publish.yml` を修正し、`main` ブランチ運用下で確実に動く状態にする

**Non-Goals:**
- GitHub の default branch を `main` に切り替えること（`docs/仕様/ブランチ・リリース戦略.md` 8節の未決事項であり、本 change のスコープ外）
- 既存 `master` ブランチの削除や整理
- 実機での Windows インストール確認（`github-actions-installer-release` の Migration Plan で「必要に応じて後続 change」とされていたが、本 change は「main運用下でのビルド・Release添付」の再検証に限定し、実機インストールは別途扱う）
- macOS / Linux 対応の追加

## Decisions

1. **`master` ではなく実際に `release/v<version>` → `main` の流れで検証する**
   - 理由: トリガー条件が `main` push に変わったため、`master` 上での再検証では意味がない。ブランチ戦略で定めた実際の手順（feature → release → main マージ → タグ）をそのままなぞることで、手順自体の実用性も同時に確認できる。
   - 代替案: `main` へ直接コミットして push するだけで確認する → ブランチ戦略が想定する実運用（release ブランチ経由）を検証できないため不採用。

2. **確認範囲は「Release に成果物が添付されるところまで」とする**
   - 理由: `github-actions-installer-release` の Migration Plan で既に同様の切り分けがされており、実機インストール確認は別関心事として扱う。今回の主眼はトリガー条件変更後の再検証であり、範囲を広げすぎない。
   - 代替案: 実機インストールまで含める → 本 change の目的（main運用下でのビルド起動・Release添付の確認）から外れるため見送る。

3. **問題が見つかった場合のみ `.github/workflows/publish.yml` を修正する**
   - 理由: 既に `github-actions-installer-release` でトリガー条件は変更済みのため、今回は「動くことの確認」が主目的。もし `main` push や タグ push で想定通り起動しない、または Release添付に失敗する場合のみ、原因に応じて修正する。
   - 代替案: 事前に workflow を再設計する → 現状の設定が既に想定通りである可能性が高く、まずは実地確認を優先する。

## Risks / Trade-offs

- [Risk] `release/v<version>` ブランチでのバージョン更新対象（`package.json` / `src-tauri/Cargo.toml` / `src-tauri/tauri.conf.json`）の同期方法が `docs/仕様/ブランチ・リリース戦略.md` 8節でまだ未決（`VERSION` ファイル新設可否等）のため、検証のたびに手動で個別ファイルを更新する必要がある → [Mitigation] 本 change では既存の3ファイルの `version` を手動で合わせる運用とし、`VERSION` ファイル導入は別途の未決事項として扱う。
- [Risk] `main` push トリガーと `v*` タグ push トリガーが両方設定されているため、マージ push とタグ push で二重にビルドが走る（GitHub Actions の実行時間・成果物の重複） → [Mitigation] 想定内の挙動として許容する。個人利用規模でのコスト影響は小さいため、今回は許容し、気になる場合は別 change でタグ push のみに絞ることを検討する。
- [Risk] GitHub の default branch が `master` のままのため、`release/v<version>` から `main` への PR/マージ操作が直感的でない可能性がある → [Mitigation] `git merge` によるローカルマージ＋push、または明示的に `main` を対象にした PR 作成で対応する。

## Migration Plan

1. `feature/github-actions-installer-release`（または新規 `feature/*`）から `release/v<version>` ブランチを作成する
2. `package.json` / `src-tauri/Cargo.toml` / `src-tauri/tauri.conf.json` のバージョンを更新する
3. `release/v<version>` を `main` にマージし、push する
4. `main` push によって `publish` ワークフローが起動することを確認する
5. ビルド成功後、draft Release に Windows インストーラが添付されていることを確認する
6. `v<version>` タグを push し、タグ push でも同様にワークフローが起動・成功・Release添付されることを確認する
7. `release/v<version>` ブランチを削除する（`docs/仕様/ブランチ・リリース戦略.md` 3.4節の方針通り）
8. 確認結果を `docs/仕様` 配下に記録する

ロールバック: 確認過程で問題が見つかり `.github/workflows/publish.yml` を修正した場合も、変更はワークフロー定義のみでアプリ本体・データベースには影響しないため、必要であれば変更前の状態に戻せる。

## Open Questions

- `main` push とタグ push の二重トリガーを維持するか、タグ push のみに絞るか
- `release/v<version>` でのバージョン同期を手動で続けるか、`VERSION` ファイルや同期スクリプトを導入するか（`docs/仕様/ブランチ・リリース戦略.md` 8節の未決事項）
- GitHub の default branch を `main` に切り替えるタイミング
