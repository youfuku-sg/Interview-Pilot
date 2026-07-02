## Context

このリポジトリは `.claude/skills/<name>/SKILL.md` と `.codex/skills/<name>/SKILL.md` を1対1でミラーする運用が既に確立している(`branch-release-strategy`, `openspec-*` 系スキルで内容が完全一致していることを確認済み)。一方、`building-components`, `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines` の4スキルは `.claude/skills/` にのみ存在し、`git status` 上も未追跡(`??`)のままである。これらは汎用的なUIコンポーネント開発ガイドであり、今回のPluely由来UIの改修作業でも参照され得るため、まずこのパリティ欠落を解消する。

`CLAUDE.md` はプロジェクトルートに存在しない。Claude Codeはこのファイルを自動的に読み込んでプロジェクトコンテキストとして利用するため、存在しないと毎回のセッションでリポジトリ構造(Tauri+React構成、`docs/仕様/`配下の正式仕様書群、OpenSpecワークフロー)をゼロから把握し直すことになる。

`.claude/settings.local.json` は `git ls-files` で確認した限り未追跡ファイルであり、`Bash(*)` という極めて広い許可を含む個人環境の設定である。これは他のセッションや将来のコラボレーターには引き継がれない。一方、`openspec new *` / `openspec status *` / `openspec validate *` / `git commit -m ' *` のような、このリポジトリのワークフロー(OpenSpec運用、branch-release-strategyのgitフロー)に沿った定型コマンドは、チーム共有の `.claude/settings.json` に載せる価値がある。

## Goals / Non-Goals

**Goals:**
- `.claude/skills/` と `.codex/skills/` のスキルセットを一致させる。
- 今回の案件(Pluely→Interview-Pilot改修)に特有の知識をスキル化し、両ツールから参照できるようにする。
- `CLAUDE.md` を新設し、Claude Codeがこのリポジトリの前提(技術スタック、`docs/仕様/`、OpenSpecワークフロー)を把握できるようにする。
- チーム/リポジトリ共通で安全な許可ルールを `.claude/settings.json` に切り出し、個人依存の広範な許可は `.claude/settings.local.json` に残す。

**Non-Goals:**
- Codex CLI の `prompts/`(スラッシュコマンド相当、`~/.codex/prompts/`)の整備は対象外。今回はskillsディレクトリのみを扱う。
- 既存スキル(`openspec-*`, `branch-release-strategy`)の内容変更は対象外(パリティは既に取れているため)。
- Claude Codeのhooks設定(実行前後フック)の新設は対象外。今回は permissions の整理と `CLAUDE.md` 新設に限定する。
- `.claude/settings.local.json` を完全に空にすることは求めない。個人環境依存の許可は残してよい。

## Decisions

- **スキルのミラーは内容を完全一致させる方式を踏襲する**。既存の `branch-release-strategy` 等と同じく、`.claude/skills/<name>/` の内容(SKILL.md本体および`references/`・`rules/`等のサブディレクトリ)をそのまま `.codex/skills/<name>/` にコピーする。理由: 既存運用との一貫性を保ち、どちらのツールで作業しても同じガイダンスが得られるようにするため。
- **新規4スキルは、既存スキルのfrontmatter規約(`name`, `description`, `license`, `metadata.author`, `metadata.version`, 該当すれば`metadata.sourceDocument`)に揃える**。`docs/仕様/要求仕様書.md` を参照するスキル(`pluely-cleanup-checklist`, `interview-support-domain`, `local-llm-stt-integration`)は `metadata.sourceDocument` にその参照先を明記し、`branch-release-strategy` スキル同様、詳細は文書側を正とし、スキルは要約と「いつ参照すべきか」のトリガーに徹する。
- **`pluely-cleanup-checklist` は検出可能な具体項目を含める**: `src-tauri/Cargo.toml` の `tauri-plugin-posthog`(analytics)、`README.md`/`SECURITY.md`/`package.json`/`Cargo.toml` に残る `pluely.com` / `iamsrikanthnani` / ライセンスキー関連コードなど、grepで発見できる残骸を列挙し、コード変更時に確認する運用にする。[rebrand-readme-security-ja](../rebrand-readme-security-ja/) や [update-dependencies-minor-patch](../update-dependencies-minor-patch/) の実装時にも活用できる。
- **`CLAUDE.md` は `init` スキルのアウトプット相当を手動で整理して作る**: 自動生成コマンドに頼らず、技術スタック(Tauri v2 + React 19 + TypeScript + SQLite)、ディレクトリ構成(`src/`, `src-tauri/`, `docs/仕様/`, `openspec/`)、このプロジェクトが個人利用前提でGPL-3.0のPluely forkであること、OpenSpecワークフロー(`openspec/changes/`の見方)を簡潔にまとめる。既存の `docs/仕様/*.md` への参照リンクを中心とし、内容を重複させない。
- **settings.jsonへの許可ルール切り出しは「読み取り専用または明確にスコープされたコマンドのみ」を基準に選別する**。`.claude/settings.local.json` にある `Bash(*)` のような無制限の許可はチーム共有ファイルには含めない。`openspec status *` / `openspec validate *` / `git status` 相当の安全なコマンド、および `npm run *` / `npm outdated *` のようなこのプロジェクトの定型スクリプトを候補とする。判断に迷うものは `update-config` スキルの方針(読み取り専用は許可、書き込み/破壊的操作は個人設定に残す)に従う。

## Risks / Trade-offs

- [Risk] `.codex/skills/` へのミラー後、片方だけを更新して内容がズレていく(ドリフト) → Mitigation: 将来スキル内容を更新する際は両ディレクトリを同時に更新する運用ルールを `CLAUDE.md` に明記する。
- [Risk] `pluely-cleanup-checklist` に列挙した「残骸」項目が実装が進むにつれて陳腐化する → Mitigation: 具体的なファイルパスは例示に留め、"`grep -ri pluely.com`のようなコマンドで都度確認する"という手順を中心に書く。
- [Risk] `.claude/settings.json` に許可ルールを移す際、意図せず広い権限を共有設定にしてしまう → Mitigation: 移す項目は個別に列挙し、`Bash(*)` 等の無制限許可は明示的に対象外とする。
- [Trade-off] 新規4スキル(Pluely脱却、Tauri/Rust規約、面接支援ドメイン、ローカルLLM/STT連携)は今回のOpenSpec変更で骨子を作るのみで、詳細な実装知識は今後の開発を通じて追記していく前提とする。初版は薄い内容になる可能性がある。

## Migration Plan

該当なし — ドキュメント・設定ファイルのみの追加/整理であり、ロールバックは該当コミットのgit revertで対応できる。
