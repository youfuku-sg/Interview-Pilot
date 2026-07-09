## 1. useSystemAudio フック — ステート追加

- [ ] 1.1 `useSystemAudio.ts` に `sessionTranscript` (`string[]`) ステートを追加する
- [ ] 1.2 `startCapture` の先頭で `setSessionTranscript([])` を呼んでリセットする
- [ ] 1.3 `startNewConversation` でも `setSessionTranscript([])` を呼んでリセットする

## 2. useSystemAudio フック — speech-detected ハンドラ変更

- [ ] 2.1 `speech-detected` ハンドラ内で `setLastTranscription` の後に `setSessionTranscript(prev => [...prev, transcription])` を追記する（上書きから追記へ）
- [ ] 2.2 `useSystemAudio` の戻り値に `sessionTranscript` を追加する

## 3. TranscriptionPanel コンポーネント更新

- [ ] 3.1 `TranscriptionPanel` の Props に `sessionTranscript: string[]` を追加する
- [ ] 3.2 `lastTranscription` を使ったテキスト表示ロジックを `sessionTranscript` に切り替える
- [ ] 3.3 `sessionTranscript` の各要素を `<p>` タグで改行表示するレンダリングを実装する（`key={i}` は index を使用）
- [ ] 3.4 `sessionTranscript` が空の場合に `null` を返す分岐をそのまま維持する

## 4. 呼び出し元の更新

- [ ] 4.1 `TranscriptionPanel` を呼び出している箇所（`src/pages/app/index.tsx` 等）を特定する
- [ ] 4.2 `sessionTranscript` を `useSystemAudio` から取得して `TranscriptionPanel` に渡す
- [ ] 4.3 不要になった `lastTranscription` の Props 受け渡しを削除する（AI 処理側は内部ステートのまま維持）

## 5. 動作確認

- [ ] 5.1 `npm run typecheck` でエラーがないことを確認する
- [ ] 5.2 ヘッドフォンボタン押下 → 複数回発話 → パネルに改行区切りで全発話が表示されることを確認する
- [ ] 5.3 ボタンを止めて再度押すと前のセッションテキストがクリアされることを確認する
- [ ] 5.4 AI レスポンス機能（`processWithAI`）が引き続き正常に動作することを確認する
