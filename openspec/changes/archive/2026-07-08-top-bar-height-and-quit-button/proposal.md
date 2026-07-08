## Why

トップバーの縦幅（160px）がやや小さく、アイコンが窮屈に感じられる。また、アプリを終了するにはダッシュボードを経由しなければならず操作コストが高い。縦幅を1.5倍（240px）に拡大し、左カラムの一番下に終了ボタンを追加することで、視認性と操作性をさらに向上させる。

## What Changes

- トップバーの collapsed 時の縦幅を現状の約160pxから約240px（1.5倍）に拡大する
- 左カラムの最下段に終了ボタン（PowerIcon）を追加する
- ドラッグハンドル（DragButton）は終了ボタンのさらに下に配置する（終了ボタン → DragButton の順）
- 終了ボタン押下でアプリプロセスを終了する（`process::exit(0)` 相当の Tauri コマンド）

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `top-bar-ui`: collapsed 時の縦幅要件が 160px → 240px に変わる。左カラムのアイコン構成に終了ボタンが追加され、並び順が変わる

## Impact

- `src/hooks/useWindow.ts` — `newHeight` を `expanded ? 600 : 160` → `expanded ? 600 : 240` に変更
- `src/pages/app/index.tsx` — 左カラムに `QuitButton`（仮名）を追加、DragButton の前に配置
- `src-tauri/src/` — `quit_app` コマンド（またはフロントから `process::exit` を呼ぶ既存手段）の確認・追加
