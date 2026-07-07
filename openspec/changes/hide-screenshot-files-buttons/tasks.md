## 1. Completion コンポーネントの修正

- [x] 1.1 `src/pages/app/components/completion/index.tsx` から `Screenshot` と `Files` の import を削除する
- [x] 1.2 同ファイルから `<Screenshot {...completion} />` と `<Files {...completion} />` の描画行を削除する

## 2. 動作確認

- [x] 2.1 `npm run typecheck` を実行してエラーがないことを確認する
- [ ] 2.2 アプリを起動してトップバーにスクリーンショットボタンとファイル添付ボタンが表示されないことを確認する
- [ ] 2.3 マイクボタン・テキスト入力・開発者スペースボタン・ドラッグハンドルが正常に動作することを確認する
