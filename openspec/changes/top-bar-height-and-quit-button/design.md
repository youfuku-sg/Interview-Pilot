## Context

v0.5.6 でトップバーを2カラム構成（左アイコン列 + 右テキスト入力）に改修し、collapsed 高さを 54px → 160px に拡大した。ユーザーから「もう少し広くしてほしい」「アプリを終了するボタンを左カラムに追加してほしい（ドラッグより上）」というフィードバックがあった。

## Goals / Non-Goals

**Goals:**

- collapsed 時の縦幅を 160px → 240px（1.5倍）に拡大する
- 左カラムの下部に終了ボタンを追加する（DragButton の直上）
- 終了ボタンは既存の `exit_app` Tauri コマンドを呼び出す

**Non-Goals:**

- expanded 時（600px）の高さは変更しない
- ダッシュボードの終了動線は削除しない
- アイコンデザインのカスタマイズ

## Decisions

### 縦幅: 160 → 240px

`src/hooks/useWindow.ts` の `newHeight` を `expanded ? 600 : 160` → `expanded ? 600 : 240` に変更する。

### 終了ボタンの配置

左カラムの現在の順序:
1. SystemAudio
2. Audio（マイク）
3. 設定ボタン
4. **QuitButton**（新規追加）← ここに挿入
5. DragButton

アイコンには `lucide-react` の `PowerIcon` を使用する。`title="アプリを終了"` を付与する。

### 終了処理: `exit_app` コマンドを再利用

`src/hooks/useMenuItems.tsx` で既に `invoke("exit_app")` が使われており、`src-tauri/src/shortcuts.rs` に `exit_app` コマンドが実装済み。新規 Tauri コマンドの追加は不要。

`app/index.tsx` にインラインで `Button` + `PowerIcon` + `invoke("exit_app")` を実装する（専用コンポーネントを作るほどの規模ではない）。

## Risks / Trade-offs

- **誤操作リスク**: 終了ボタンを誤タップするとアプリが即終了する。現状は確認ダイアログなし（シンプルさ優先）。将来的に追加可能。
- `exit_app` は既存実装の流用のため、動作は実績あり。
