## Why

`npm outdated` の時点で、`package.json` の依存パッケージ34件が古いバージョンのまま固定されている。`src-tauri/Cargo.toml` のRust依存も同様に更新確認ができていない(実行環境にcargo未インストールのため未調査)。セキュリティ修正・バグ修正を含む可能性のあるマイナー/パッチ更新を取り込み、依存関係を健全な状態に保つ。

## What Changes

- `package.json` の依存パッケージのうち、現在のメジャーバージョン範囲内で最新のマイナー/パッチへ更新する(`npm update` で解決できるもの、および `^0.0.x` 等のnpmのゼロメジャー特有のcaret制約により明示的なバージョン指定変更が必要なもの)。
- `src-tauri/Cargo.toml` のRust依存を、現在のメジャーバージョン範囲内で `cargo update` により最新のマイナー/パッチへ更新する。
- メジャーバージョンアップ(例: `recharts` 2→3, `shiki` 3→4, `streamdown` 1→2, `lucide-react` 0.x→1.x, `typescript` 5→6, `vite` 7→8, `@vitejs/plugin-react` 4→6, `@types/node` 24→26)は本変更の対象外とし、破壊的変更の検証が必要な別チケットとして切り出す。
- 更新後、`npm run build` / `npm run typecheck` / `npm run lint` が通ることを確認する。Rust側は `cargo build`(可能な環境があれば)で確認する。
- **BREAKING**: なし(マイナー/パッチ更新のみを対象とするため、破壊的変更は想定しない。ただし依存先のマイナーバージョンでの非互換動作が万一あれば個別対応する)。

## Capabilities

### New Capabilities
- `dependency-currency`: npm/Cargo依存パッケージが、現在採用しているメジャーバージョン範囲内で最新のマイナー/パッチに保たれていることを定める。

### Modified Capabilities
(なし)

## Impact

- 対象ファイル: `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`
- ビルド・実行時の依存バージョンが変わるため、アプリ全体(UI・音声処理・スクリーンショット・DB等)への回帰確認が必要。
- Rust側は本環境にcargoが未インストールのため、実装時に別途Rustツールチェーンのある環境での作業が必要。
