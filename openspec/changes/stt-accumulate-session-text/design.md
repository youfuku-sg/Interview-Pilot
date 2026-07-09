## Context

現状、`useSystemAudio` フックの `speech-detected` イベントハンドラは発話を認識するたびに `setLastTranscription(transcription)` で**上書き**している。VAD が短い無音で発話を区切ることがあるため、ユーザーが意識的にヘッドフォンボタンを止めるまで発話を続けていても、パネルには「最後の1発話分」しか表示されない。

関連ファイル:
- `src/hooks/useSystemAudio.ts` — ステート管理と `speech-detected` ハンドラ
- `src/pages/app/components/TranscriptionPanel.tsx` — パネル表示コンポーネント
- `src/pages/app/index.tsx` — パネルへの Props 受け渡し（`lastTranscription` を参照）

## Goals / Non-Goals

**Goals:**
- `capturing` 中に `speech-detected` が複数回来ても、全発話を1セッションとして累積する
- パネルに発話ブロックを改行区切りで表示する
- セッション（`startCapture` / `stopCapture`）をまたいで累積テキストがリセットされる
- AI 処理のトリガー（`lastTranscription`）は変えない（既存の AI 応答フローへの影響なし）

**Non-Goals:**
- タイムスタンプ付き表示（別途検討）
- 累積テキストの永続化（会話履歴 `conversation.messages` で別途管理済み）
- VAD のパラメータ調整

## Decisions

### 1. `sessionTranscript` ステートを `string[]`（配列）で持つ

**決定**: `string[]` — 各発話を要素として蓄積し、レンダリング時に `\n\n` などで結合する。

**理由**: `string` で単純に連結すると末尾に追記するたびに全文字列を再生成し、区切り文字の扱いも複雑になる。配列であれば React のキーにインデックスを使いやすく、将来的にタイムスタンプなどのメタデータを各要素に付加しやすい。

**検討した代替**: `string`（改行連結）→ シンプルだが分割不可のため不採用。

### 2. `speech-detected` ハンドラで `sessionTranscript` に追記

```ts
setSessionTranscript(prev => [...prev, transcription]);
```

`setLastTranscription` は**削除せず残す**。AI 処理のトリガー（`processWithAI` の引数）は `transcription` 変数を直接使っているため、`lastTranscription` ステートへの依存はない。ただし `handleQuickActionClick` が `lastTranscription` を参照しているため、`setLastTranscription` も引き続き呼ぶ。

### 3. `startCapture` と `stopCapture` でリセット

`startCapture` の最初で `setSessionTranscript([])` をクリアする。`stopCapture` ではリセットしない（停止後もパネルにセッションのテキストを残す現行の `lastTranscription` と同じ方針）。

### 4. `TranscriptionPanel` は `sessionTranscript: string[]` を受け取り改行表示

各要素を `<p>` または `whitespace-pre-wrap` で区切る。スクロールは既存の `overflow-y-auto` で対応。

```tsx
{sessionTranscript.map((line, i) => (
  <p key={i} className="text-xs leading-relaxed mb-1">{line}</p>
))}
```

## Risks / Trade-offs

- **VAD の誤検知で空白や短い音が混入するリスク** → `transcription.trim()` が空の場合はすでにガードされているため問題なし。
- **セッション終了後もテキストが残る** → 現行の `lastTranscription` と同じ方針のため許容。次のセッション開始時にリセット。
- **`conversation.messages` との二重管理** → `sessionTranscript` はあくまで「今見えている表示用バッファ」。永続化や AI 履歴は `conversation.messages` が担うため責務は分かれている。

## Migration Plan

1. `useSystemAudio.ts` に `sessionTranscript` ステート追加
2. `speech-detected` ハンドラで `setSessionTranscript` 追記に変更（`setLastTranscription` は維持）
3. `startCapture` でリセット処理追加
4. `TranscriptionPanel` の Props に `sessionTranscript` 追加、表示ロジック変更
5. 呼び出し元（`app/index.tsx`）で `sessionTranscript` を渡すよう更新
6. `startNewConversation` でも `sessionTranscript` をリセット

ロールバック: `sessionTranscript` を削除し `lastTranscription` に戻すだけで元の動作に戻る。
