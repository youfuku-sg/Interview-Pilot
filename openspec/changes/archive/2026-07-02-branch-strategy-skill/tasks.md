## 1. スキル本文の作成

- [x] 1.1 `docs/仕様/ブランチ・リリース戦略.md` から、確定/推奨事項（ブランチ種別・命名規則・分岐元・マージ後削除・タグ規則）を要約する
- [x] 1.2 同ドキュメント8節の未決事項一覧を整理し、スキルが「ユーザーに確認する」対象として案内する文言を作る
- [x] 1.3 7節の初期リリース手順（`feature/*` → `release/*` → VERSION/CHANGELOG更新 → ビルド → draft release → 動作確認 → マージ → ブランチ削除）を手順案内としてまとめる

## 2. Claude Code 用スキルの作成

- [x] 2.1 `.claude/skills/branch-release-strategy/SKILL.md` を作成する（`name` / `description` / `license` / `compatibility` / `metadata` の frontmatter を既存 `openspec-*` スキルの形式に合わせる）
- [x] 2.2 `description` に、ブランチ作成・リリース準備・バージョン管理に関する作業がトリガーになる旨を明記する
- [x] 2.3 本文に 1章で整理した要約・未決事項の扱い・リリース手順を記載する
- [x] 2.4 本文に「詳細・最新版は `docs/仕様/ブランチ・リリース戦略.md` を参照」の導線を入れる

## 3. Codex 用スキルの作成

- [x] 3.1 `.claude/skills/branch-release-strategy/SKILL.md` の内容をもとに `.codex/skills/branch-release-strategy/SKILL.md` を作成する
- [x] 3.2 Codex 側のスキル frontmatter 形式に合わせて必要な差分のみ調整する（既存の `.codex/skills/openspec-*` との形式差分を確認する）
- [x] 3.3 Claude Code 側と案内内容が実質的に同一であることを確認する

## 4. 動作確認

- [ ] 4.1 Claude Code でスキル一覧にスキル名が表示されることを確認する
- [ ] 4.2 Claude Code に新規作業の開始を依頼し、`feature/*` ブランチ作成が案内されることを確認する
- [ ] 4.3 Codex でも同様にスキルが解決され、同じ案内が得られることを確認する

## 5. ドキュメント整備

- [x] 5.1 `docs/仕様/ブランチ・リリース戦略.md` にスキルへの導線（関連資料・運用メモとしての追記）を加える
- [x] 5.2 `docs/仕様/TODO.md` の該当項目（環境構築・ブランチ戦略遵守に関するもの）があれば反映する
