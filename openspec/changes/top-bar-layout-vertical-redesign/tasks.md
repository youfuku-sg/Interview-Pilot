## 1. ウィンドウ高さの変更

- [ ] 1.1 `src/hooks/useWindow.ts` の `newHeight` を `expanded ? 600 : 54` → `expanded ? 600 : 160` に変更する

## 2. トップバーのレイアウト改修

- [ ] 2.1 `src/pages/app/index.tsx` の `Card` 内のルート `flex-row` 構造を「左カラム + 右エリア」の2カラム構成に変更する
- [ ] 2.2 左カラム（`w-10 flex flex-col items-center gap-2 py-1`）を追加し、`SystemAudio`・`Audio`（マイク）・設定ボタン・`DragButton` をそこに縦並びで配置する
- [ ] 2.3 右エリア（`flex-1 flex flex-col justify-center`）を追加し、`Completion` の `Input` 部分を配置する
- [ ] 2.4 音声キャプチャ中（`systemAudio.capturing === true`）のブランチも新2カラム構造に合わせて修正する（左カラムにステータスインジケーター、右エリアに `AudioVisualizer`）

## 3. Completion コンポーネントの調整

- [ ] 3.1 `src/pages/app/components/completion/index.tsx` で `Audio`（マイクボタン）を左カラムから参照できるよう export するか、`index.tsx` 側で直接 `Audio` を左カラムに配置する形にリファクタリングする
- [ ] 3.2 `src/pages/app/components/completion/Input.tsx` の入力欄コンテナが右エリアの高さに対して縦中央揃えになることを確認する（`h-full items-center` 等）

## 4. 動作確認

- [ ] 4.1 `npm run dev` でアプリを起動し、トップバーの collapsed 時の高さが約160pxになっていることを確認する
- [ ] 4.2 左カラムにアイコンが縦並びで表示されることを確認する
- [ ] 4.3 右エリアにテキスト入力欄が表示され、横幅いっぱいに広がっていることを確認する
- [ ] 4.4 音声キャプチャ開始・停止で表示が正しく切り替わることを確認する
- [ ] 4.5 ポップオーバー（AI回答・音声パネル）の展開・収縮が正常に動作することを確認する
- [ ] 4.6 `npm run typecheck` と `npm run lint` がエラーなしで通ることを確認する
