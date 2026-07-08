## 1. ウィンドウ高さの変更

- [ ] 1.1 `src/hooks/useWindow.ts` の `newHeight` を `expanded ? 600 : 160` → `expanded ? 600 : 240` に変更する

## 2. 終了ボタンの追加

- [ ] 2.1 `src/pages/app/index.tsx` の左カラムに `PowerIcon` を使った終了ボタンを追加する（`invoke("exit_app")` を呼び出す）
- [ ] 2.2 終了ボタンは設定ボタン（Settings）の下、`DragButton` の上に配置する
- [ ] 2.3 ボタンに `title="アプリを終了"` を付与する

## 3. 動作確認

- [ ] 3.1 `npm run dev` でアプリを起動し、collapsed 時の高さが約240pxになっていることを確認する
- [ ] 3.2 左カラムのアイコン順が「SystemAudio → マイク → 設定 → 終了 → ドラッグ」になっていることを確認する
- [ ] 3.3 終了ボタンを押してアプリが終了することを確認する
- [ ] 3.4 `npm run typecheck` と `npm run lint` がエラーなしで通ることを確認する
