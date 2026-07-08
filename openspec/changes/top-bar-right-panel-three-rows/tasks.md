## 1. 前提確認

- [ ] 1.1 `top-bar-layout-vertical-redesign`（②）が実装済みであることを確認する（右エリアが `flex-1 flex flex-col` で存在していること）

## 2. 右エリアの3分割実装

- [ ] 2.1 `src/pages/app/index.tsx` の右エリア `div` の中身を以下の3段構造に変更する
  ```tsx
  {/* 上段: 将来用 */}
  <div data-slot="top-panel" className="flex-1 border-b border-border/40" />
  {/* 中段: 将来用 */}
  <div data-slot="middle-panel" className="flex-1 border-b border-border/40" />
  {/* 下段: テキスト入力 */}
  <div className="shrink-0 flex items-center px-1">
    <Completion isHidden={isHidden} />
  </div>
  ```
- [ ] 2.2 右エリアのコンテナ `div` のクラスを `flex-1 flex flex-col` に変更し、`justify-center` を削除する（3段レイアウトで不要になるため）

## 3. 動作確認

- [ ] 3.1 `npm run dev` でアプリを起動し、右エリアが上・中・下の3段に分かれて表示されることを確認する
- [ ] 3.2 テキスト入力欄が最下段に表示されることを確認する
- [ ] 3.3 上段・中段が空白で均等な高さになっていることを確認する
- [ ] 3.4 各段の間に境界線が表示されることを確認する
- [ ] 3.5 テキスト入力・AI回答・音声キャプチャの各操作が正常に動作することを確認する
- [ ] 3.6 `npm run typecheck` と `npm run lint` がエラーなしで通ることを確認する
