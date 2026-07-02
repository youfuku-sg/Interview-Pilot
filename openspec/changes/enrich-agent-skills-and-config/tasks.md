## 1. 既存スキルのパリティ確保

- [ ] 1.1 `.claude/skills/building-components/` を `.codex/skills/building-components/` に内容を完全一致させてコピーする。
- [ ] 1.2 `.claude/skills/vercel-react-best-practices/` を `.codex/skills/vercel-react-best-practices/` に内容を完全一致させてコピーする。
- [ ] 1.3 `.claude/skills/vercel-composition-patterns/` を `.codex/skills/vercel-composition-patterns/` に内容を完全一致させてコピーする。
- [ ] 1.4 `.claude/skills/web-design-guidelines/` を `.codex/skills/web-design-guidelines/` に内容を完全一致させてコピーする。
- [ ] 1.5 `git status` で `.claude/skills/**` と `.codex/skills/**` に未追跡ファイルが残っていないことを確認する。

## 2. 新規スキル: pluely-cleanup-checklist

- [ ] 2.1 `docs/仕様/要求仕様書.md` 13.1節・8.6節を根拠として、`.claude/skills/pluely-cleanup-checklist/SKILL.md` を作成する(既存スキルのfrontmatter規約に合わせ `metadata.sourceDocument` を設定)。
- [ ] 2.2 チェック項目として、`src-tauri/Cargo.toml` の `tauri-plugin-posthog` 等telemetry系依存、`pluely.com` / `iamsrikanthnani` への残存参照、ライセンスキー関連コード、ステルス訴求表現の検出方法(grepコマンド例)を含める。
- [ ] 2.3 `.codex/skills/pluely-cleanup-checklist/SKILL.md` に同一内容をミラーする。

## 3. 新規スキル: tauri-rust-conventions

- [ ] 3.1 `src-tauri/Cargo.toml` の構成(`[dependencies]`, OS別 `[target.'cfg(...)'.dependencies]`)と `src-tauri/src/` の主要ファイル(`window.rs`, `capture.rs`, `api.rs` 等)を調査し、`.claude/skills/tauri-rust-conventions/SKILL.md` を作成する。
- [ ] 3.2 `.codex/skills/tauri-rust-conventions/SKILL.md` に同一内容をミラーする。

## 4. 新規スキル: interview-support-domain

- [ ] 4.1 `docs/仕様/要求仕様書.md` 7章(機能要求)・8.6節(倫理と利用方針)を要約し、`.claude/skills/interview-support-domain/SKILL.md` を作成する(`metadata.sourceDocument` を設定し、詳細は文書を参照させる)。
- [ ] 4.2 `.codex/skills/interview-support-domain/SKILL.md` に同一内容をミラーする。

## 5. 新規スキル: local-llm-stt-integration

- [ ] 5.1 `docs/仕様/要求仕様書.md` 7.10節を根拠に、Dev Spaceのカスタムプロバイダ設定(curlベース)を使ったOllama/LM Studio等ローカルLLM、whisper.cpp等ローカルSTTの接続パターンをまとめ、`.claude/skills/local-llm-stt-integration/SKILL.md` を作成する。
- [ ] 5.2 `.codex/skills/local-llm-stt-integration/SKILL.md` に同一内容をミラーする。

## 6. CLAUDE.md 新設

- [ ] 6.1 技術スタック(Tauri v2 + React 19 + TypeScript + SQLite)、ディレクトリ構成(`src/`, `src-tauri/`, `docs/仕様/`, `openspec/`)を記載する。
- [ ] 6.2 このプロジェクトがPluelyのforkであり、個人利用前提・GPL-3.0であることを明記する。
- [ ] 6.3 OpenSpecワークフロー(`openspec/changes/`の見方、`/opsx:*`コマンド)への言及を追加する。
- [ ] 6.4 `docs/仕様/*.md` 各ファイルの役割を簡潔に一覧化し、詳細はリンク先を参照させる形にする(内容を重複させない)。
- [ ] 6.5 スキルを新規追加・更新する際は `.claude/skills/` と `.codex/skills/` を同時に更新する運用ルールを明記する。

## 7. Claude Code設定の整理

- [ ] 7.1 `.claude/settings.local.json` の許可ルールを一覧化し、安全に共有できるもの(`openspec status *`, `openspec validate *`, `git status`, `npm run *`, `npm outdated *` 等の読み取り専用/定型コマンド)と、個人環境依存・広範な許可(`Bash(*)` 等)を仕分ける。
- [ ] 7.2 仕分けた安全なルールを新設の `.claude/settings.json` に記載し、git管理下に置く。
- [ ] 7.3 `.claude/settings.local.json` から `.claude/settings.json` に移した項目を削除する(重複を避ける)。
- [ ] 7.4 `.claude/settings.json` をコミットし、`.claude/settings.local.json` が引き続きgit管理外であることを確認する。

## 8. 検証

- [ ] 8.1 `.claude/skills/` と `.codex/skills/` の全スキルについて `diff -r` 等で内容が一致していることを確認する。
- [ ] 8.2 `git status` で意図しない未追跡・未コミットファイルが残っていないことを確認する。
- [ ] 8.3 `CLAUDE.md` を読み返し、実際のリポジトリ構成・ドキュメントと齟齬がないか確認する。
