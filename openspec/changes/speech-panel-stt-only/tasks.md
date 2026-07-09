## 1. useSystemAudio.ts — AIエラーのサイレント化

- [ ] 1.1 `processWithAI` 内の「AIプロバイダーが選択されていません」エラーセット処理を削除し、`return` のみに変更する（`src/hooks/useSystemAudio.ts` 約492行目）
- [ ] 1.2 同じく「AIプロバイダーの設定が見つかりません」のエラーセット処理も同様に `return` のみに変更する（約499行目）

## 2. ResultsSection.tsx — タイトル・アイコン変更

- [ ] 2.1 `SparklesIcon` を `FileTextIcon` に差し替える（import 行を更新、`src/pages/app/components/speech/ResultsSection.tsx`）
- [ ] 2.2 セクションタイトルの `"AIの回答"` を `"文字起こし"` に変更する（`conversationMode ? "会話" : "文字起こし"`）

## 3. AIResponsePanel.tsx — 未設定エラー表示の削除

- [ ] 3.1 `!aiReady` のガードブロック（オレンジ色の警告表示）を削除し、`null` を返すようにする（`src/pages/app/components/AIResponsePanel.tsx`）

## 4. 動作確認

- [ ] 4.1 AIプロバイダー未設定の状態でヘッドフォンボタンを押し、STTが動作してもエラーが出ないことを確認する
- [ ] 4.2 音声パネル内の結果セクションタイトルが「文字起こし」になっていることを確認する
- [ ] 4.3 トップバー中段に「AIプロバイダーが選択されていません」エラーが表示されないことを確認する
- [ ] 4.4 AIプロバイダーを設定した状態では従来通り AI 回答が表示されることを確認する
