## Context

`npm outdated` を実行した結果、34パッケージが最新でないことを確認した。多くは `npm update`(package.jsonのsemver範囲内での更新)で解決できるが、一部は範囲そのものが最新を除外しているため対応が異なる:

1. **`npm update` で解決できるもの**: `package.json` の `^` 範囲が既にLatestを含んでおり、`node_modules` と `package-lock.json` を更新するだけで最新化できるもの。(例: 各 `@radix-ui/*`, `@tauri-apps/*`, `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `tailwind-merge`, `tw-animate-css`, `react-error-boundary`, `@bany/curl-to-json`, `@tailwindcss/vite`, `@types/react`, `@types/react-dom` 等)
2. **`package.json` 側のバージョン指定変更が必要なもの**: npmのcaretはメジャーが `0` のパッケージ(ゼロメジャー)では非常に狭い範囲しか許可しない。`@ricky0123/vad-react` は `^0.0.30` のため `0.0.36` へは `npm update` だけでは届かず、`package.json` の指定を明示的に `^0.0.36`(または `~0.0.36`)へ変更する必要がある。
3. **現行メジャー内で既に最新のため対象外**: `@vitejs/plugin-react`(4.7.0が4系最新)、`lucide-react`(0.539.0が0系最新)、`recharts`(2.15.4が2系最新)、`typescript`(5.8.3が5系最新)は、次に上げるとメジャーバンプになるため今回は据え置く。
4. **メジャーバンプが必要なもの(今回は対象外)**: `recharts`(2→3)、`shiki`(3→4)、`streamdown`(1→2)、`lucide-react`(0.x→1.x)、`typescript`(5→6)、`vite`(7→8)、`@vitejs/plugin-react`(4→6)、`@types/node`(24→26)。これらは別チケットで個別に検証する。

Rust側(`src-tauri/Cargo.toml`)はこの実行環境にcargoがインストールされておらず、`cargo outdated` 等での事前調査ができていない。ただし `Cargo.toml` の依存指定の多くは `tauri = "2"`, `serde_json = "1"` のようにメジャーのみ、または `tauri-plugin-updater = "2.9.0"` のように具体的パッチバージョンを指定しており、Cargoのデフォルトのcaret的解釈により `cargo update` だけでメジャー内の最新へ更新できる見込みが高い。`xcap = "0.0.12"` はnpmの0.0.x同様Cargoでも0.0.xは非常に狭い範囲しか許可しないため、`cargo update` で上がらない場合は `Cargo.toml` の明示的な変更が必要になる可能性がある。

## Goals / Non-Goals

**Goals:**
- npm依存を、現行メジャー範囲内で最新のマイナー/パッチに揃える。
- Rust依存を、現行メジャー範囲内で最新のマイナー/パッチに揃える(実装時にRustツールチェーンのある環境で実施)。
- 更新後、ビルド・型チェック・lintが通ることを確認する。

**Non-Goals:**
- メジャーバージョンアップは行わない(上記4.のリストは別チケット化する)。
- 依存の追加・削除は行わない(バージョン更新のみ)。`tauri-plugin-posthog` 等の要否見直しは別スコープ。
- Node.js / Rustツールチェーン自体のバージョンアップは対象外。

## Decisions

- **npm更新は `npm update` を基本とし、ゼロメジャーパッケージのみ `package.json` を個別編集する**。理由: `npm update` は既存のsemver範囲を尊重するため安全だが、`^0.0.x` はnpmの仕様上ほぼ更新できないため例外的に手動対応する。
- **Rust側は `cargo update` を基本とし、同様にゼロメジャークレート(`xcap` 等)は個別確認する**。実装時にcargoの利用可能な環境(CI、または開発者のRustツールチェーン導入済み環境)で実施する。
- **メジャーバンプは本チケットに含めない**。理由: ユーザーが「マイナー/パッチのみ先行」を明示的に選択したため。メジャーは破壊的変更の検証コストが個別に異なり、まとめて片付けると問題切り分けが困難になる。

## Risks / Trade-offs

- [Risk] マイナー/パッチ更新でも、依存先のバグや非互換な挙動変更が紛れ込む可能性がある → Mitigation: 更新後に `npm run typecheck` / `npm run lint` / `npm run build` を実行し、UIの主要フロー(録音、スクリーンショット、チャット、設定画面)を手動で一通り確認する。
- [Risk] `package-lock.json` / `Cargo.lock` の差分が大きくなり、レビューが煩雑になる → Mitigation: このチケット単体でコミットを分離し、他の変更(UI日本語化やREADME書き直し)とは別コミット/別PRにする。
- [Risk] Rust側はこの環境で検証できないため、実装時に別環境が必要 → Mitigation: tasks.mdにcargoツールチェーン導入手順を明記し、実装者が対応可能な環境で作業する前提とする。

## Migration Plan

該当なし — 依存バージョン更新のみで、データ移行は発生しない。問題が出た場合は `package-lock.json` / `Cargo.lock` を含めてコミット単位でrevertする。
