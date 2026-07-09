## 1. ResultsSection の props 変更

- [ ] 1.1 `ResultsSection` の Props 型から `lastTranscription: string` を削除し、`sessionTranscript: string[]` を追加する
- [ ] 1.2 `ResultsSection` 通常モード（`conversationMode === false`）の表示を `sessionTranscript.map(...)` に書き換える（`<p>` タグで1行ずつ表示、`<span>システム:</span>` を除去）
- [ ] 1.3 `ResultsSection` 会話モード（`conversationMode === true`）の「システム」ラベルテキスト（`<span>システム</span>`）を除去する
- [ ] 1.4 `hasResponse` と `hasHistory` などの既存ロジックが `sessionTranscript` の有無で正しく動作することを確認する（`!hasResponse && !lastTranscription` → `!hasResponse && sessionTranscript.length === 0` に変更）

## 2. SystemAudio コンポーネントから ResultsSection へ sessionTranscript を渡す

- [ ] 2.1 `src/pages/app/components/speech/index.tsx` の `ResultsSection` に `sessionTranscript={props.sessionTranscript}` を追加し、`lastTranscription` の渡し方を削除する

## 3. 型チェックと動作確認

- [ ] 3.1 `npm run typecheck` を実行し TypeScript エラーがないことを確認する
- [ ] 3.2 アプリを起動してヘッドフォンボタンを押し、複数の発話が累積表示されることを確認する
- [ ] 3.3 「システム：」プレフィックスが通常モード・会話モード双方で表示されないことを確認する
