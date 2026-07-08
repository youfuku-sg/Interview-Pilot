## Why

トップバーのダッシュボード（設定）を開くボタンが `SparklesIcon`（✨）になっており、「何のボタンか分からない」という問題がある。ギアマーク（`SettingsIcon`）に変更することで、ボタンの目的を一目で伝える。

## What Changes

- `src/pages/app/index.tsx` のダッシュボード起動ボタンのアイコンを `SparklesIcon` から `SettingsIcon` に変更する
- 同ボタンの `title` 属性を「開発者スペースを開く」から「設定を開く」に変更する

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `top-bar-ui`: 開発者スペースボタンのアイコンを ✨（SparklesIcon）から ⚙️（SettingsIcon）に変更し、ラベル・title も「設定を開く」に統一する

## Impact

- `src/pages/app/index.tsx`（アイコン import と JSX の変更のみ）
- `openspec/specs/top-bar-ui/spec.md`（シナリオ内のアイコン説明を更新）
