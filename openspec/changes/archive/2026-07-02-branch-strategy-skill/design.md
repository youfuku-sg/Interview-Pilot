## Context

`docs/仕様/ブランチ・リリース戦略.md` には以下が「推奨」または「候補」として整理されている。

- 安定ブランチは `main`（ローカルと GitHub 側に `main` ブランチ作成済み、default branch 切り替えは未決）
- 通常開発は `feature/<name>`
- リリース準備は `release/v<version>`（1 release = 1 feature、対応する `feature/*` から分岐）
- 緊急修正は `hotfix/v<version>`（安定ブランチから直接分岐して作業可）
- バージョンは semver、`VERSION` ファイルと `CHANGELOG.md` を新設候補
- リリースは draft を基本とし、`v<version>` タグを使う
- 8節に多数の未決事項（既存 `master` の扱い、VERSION/CHANGELOG新設可否、採番方式など）が残っている
- GitHub Actions の起動条件は `main` push、`v<version>` tag push、手動実行とする

このリポジトリには既に openspec 用のスキルが `.claude/skills/openspec-*` と `.codex/skills/openspec-*` に同じ内容でペア登録されている前例があり（`SKILL.md` の frontmatter に `name` / `description` / `license` / `compatibility` / `metadata` を持つ）、今回のスキルもこの構成パターンを踏襲する。

## Goals / Non-Goals

**Goals:**
- `docs/仕様/ブランチ・リリース戦略.md` の「決定済み・推奨」部分をエージェントが参照できるスキルとして両ツール（Claude Code / Codex）に登録する
- 新規作業開始時に、エージェントが安定ブランチ上で直接作業せず、適切な `feature/*` ブランチを案内・作成できるようにする
- `release/*` ブランチでの準備手順（VERSION/CHANGELOG 更新、ビルド確認、マージ後削除）をスキル経由で案内できるようにする
- `hotfix/*` の特例運用（feature を経由せず直接作業可、patch +1）を案内できるようにする
- スキルの内容と `docs/仕様/ブランチ・リリース戦略.md` の間で矛盾が出ないよう、スキル本文は同ドキュメントを正として参照する形にする

**Non-Goals:**
- `docs/仕様/ブランチ・リリース戦略.md` 8節の未決事項（既存 `master` の扱い、GitHub default branch の切り替え時期、`VERSION`/`CHANGELOG.md` 新設の可否、採番方式など）をこのスキルの中で確定させること。未決のものは「未決」として扱い、決め打ちしない
- ブランチ保護ルールや CI 上での強制（GitHub の branch protection、PR 必須化など）の設定。今回はエージェント向けの案内スキルに留める
- 既存の openspec 用スキル（`openspec-propose` など）の変更

## Decisions

1. **スキル名は `branch-release-strategy` とする**
   - 理由: 対象ドキュメント名（ブランチ・リリース戦略）と対応させ、他の `openspec-*` スキルと並んでも用途が分かるようにする。
   - 代替案: `branch-strategy` のみ → リリース手順（VERSION/CHANGELOG/タグ）も対象に含むため、名称からリリースが読み取れる形にした。

2. **`.claude/skills/branch-release-strategy/SKILL.md` と `.codex/skills/branch-release-strategy/SKILL.md` に同一内容を配置する**
   - 理由: 既存の openspec スキル群が同一内容を両ディレクトリに複製する構成を採っており、それに倣うことでツール間の挙動差を避ける。
   - 代替案: 片方に実体を置きシンボリックリンクで共有する → リポジトリの他スキルがコピー方式のため一貫性を優先し、コピー方式を採用する。

3. **スキル本文はドキュメントの要約・手順化にとどめ、原文の丸写しはしない**
   - 理由: `docs/仕様/ブランチ・リリース戦略.md` が更新された際にスキル側だけが古くなる二重管理リスクを減らすため、スキル本文には「詳細は `docs/仕様/ブランチ・リリース戦略.md` を参照」という導線を残し、エージェントが実行時に判断するための要点（ブランチ命名規則、分岐元、マージ後の削除、未決事項は聞く）だけを持たせる。
   - 代替案: ドキュメント全文をスキルに転記する → 更新が二箇所になり乖離しやすいため却下。

4. **未決事項に該当する判断が必要になった場合、スキルはエージェントに「ユーザーへ確認する」よう指示する**
   - 理由: 既存 `master` の扱いや VERSION/CHANGELOG 新設可否などはドキュメント上も未決であり、スキルが独自に決めるとドキュメントとの矛盾が生じる。
   - 代替案: 未決事項もスキルが確定事項として扱う → ドキュメント自身が未決として残しているため採用しない。

5. **スラッシュコマンド (`.claude/commands/`) は今回追加しない**
   - 理由: 提案の主目的は「エージェントがブランチ戦略を踏まえて振る舞えること」であり、Claude Code の Skill 機構は説明文一致や文脈から自動的に発見・呼び出しされる。既存の `opsx/*` コマンドは openspec CLI の複数ステップ操作を明示的に呼び出す用途で、ブランチ戦略の参照はその都度の作業判断に使うものであるため、まずは SKILL.md のみで開始し、必要になれば別途追加する。
   - 代替案: `.claude/commands/branch-strategy.md` も同時に作る → 現時点で明示コマンド化の要望がないため見送り、tasks の Open Questions として残す。

## Risks / Trade-offs

- [Risk] スキルの要点とドキュメント本文が将来ズレる（ドキュメント更新時にスキルの更新が漏れる） → [Mitigation] スキル本文に「詳細・最新版は `docs/仕様/ブランチ・リリース戦略.md` を参照」の一文を明記し、要点部分は変更頻度が低い確定事項（ブランチ種別と命名規則、分岐元、マージ後削除)のみに絞る。
- [Risk] Claude Code と Codex でスキルの解決・呼び出し仕様が異なり、同一内容でも挙動が揃わない可能性がある → [Mitigation] 既存の openspec スキル群が同一パターンで両方に存在し動作実績があるため、そのフォーマットに厳密に合わせる。
- [Risk] 未決事項が多いドキュメントを土台にするため、スキルが「参照はするが決定はしない」状態になり、実際の判断はユーザーに都度確認することになる → [Mitigation] これは意図した設計（Non-Goals参照）であり、未決事項が確定した時点で `docs/仕様/ブランチ・リリース戦略.md` と本スキルを更新する前提とする。

## Migration Plan

1. `.claude/skills/branch-release-strategy/SKILL.md` を作成する
2. 同内容を `.codex/skills/branch-release-strategy/SKILL.md` にも作成する
3. Claude Code / Codex それぞれでスキルが一覧・呼び出し可能なことを確認する
4. `docs/仕様/ブランチ・リリース戦略.md` にスキルへの導線（例: 関連資料節への追記）を追加する

ロールバック: 新規ファイル追加のみでアプリ本体・既存スキルへの変更を伴わないため、追加した `SKILL.md` を削除すれば即座に元の状態に戻せる。

## Open Questions

- `.claude/commands/` へのスラッシュコマンド追加が必要かどうか
- スキルをブランチ作成時に自動起動させる仕組み（hook 等）を別途整備するかどうか
- `docs/仕様/ブランチ・リリース戦略.md` 8節の未決事項が確定した際、スキルの更新をどのタイミングで行うか
