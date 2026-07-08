## Context

トップバー（`src/pages/app/index.tsx`）のダッシュボードを開くボタンは現在 `SparklesIcon`（✨）を使用している。このアイコンは「AI」「魔法」を連想させ、「設定を開く」という操作の意味と乖離している。変更は単一ファイル・2行の修正で完結する。

## Goals / Non-Goals

**Goals:**
- アイコンを `SparklesIcon` → `SettingsIcon`（ギアマーク）に変更し、ボタンの用途を直感的に伝える
- `title` 属性を「設定を開く」に更新し、ツールチップと実際の動作を一致させる
- `top-bar-ui` spec のシナリオ記述を新アイコンに合わせて更新する

**Non-Goals:**
- ボタンの動作（`openDashboard()`）変更は行わない
- ボタンのサイズ・スタイル変更は行わない
- ダッシュボード画面自体の変更は行わない

## Decisions

### `SettingsIcon` を選択

lucide-react にはギア系アイコンが複数存在する（`Settings`、`Settings2`、`Cog`）。既存コードで `Settings` が `useMenuItems.tsx` のメニュー項目「アプリ設定」に使われており、同じアイコンを使うことで視覚的な一貫性が生まれる。`Settings`（= `SettingsIcon`）を採用する。

### import の整理

`src/pages/app/index.tsx` は現在 `SparklesIcon` を lucide-react からインポートしている。これを `Settings` に差し替えるだけで良い。他のファイルへの影響はない。

## Risks / Trade-offs

- **リスク: 既存 spec との不整合** → `top-bar-ui/spec.md` のシナリオに「（✨）」という記述がある。tasks の中で同時に更新する。
- **リスク: なし（機能変更なし）** → アイコン差し替えのみで、ロジックに触れないため退行リスクは最小限。
