## Context

現在、トップバー（`App > TranscriptionPanel`）と音声パネルポップオーバー（`SystemAudio > ResultsSection`）で文字起こし表示の実装が分岐している。

- **トップバー**: `sessionTranscript: string[]`（累積配列）を `TranscriptionPanel` に渡して全発話を縦列表示 → 正しく動作している
- **ポップオーバー**: `lastTranscription: string`（直近1件のみ）を `ResultsSection` に渡しており、セッション中の過去の発話が消える

また `ResultsSection` の通常モード（`conversationMode === false`）では、文字起こし行に「システム：」の bold ラベルを付与している。これはユーザーが不要と判断した。

## Goals / Non-Goals

**Goals:**
- ポップオーバー内の文字起こし表示をセッション累積テキスト（全発話）に変更する
- 通常モード・会話モード双方から「システム：」プレフィックス表示を除去する
- トップバー側の実装（`TranscriptionPanel`）は変更しない

**Non-Goals:**
- `sessionTranscript` の蓄積ロジック自体の変更
- ポップオーバーの会話モード（AI回答表示）の仕様変更
- 会話履歴(`conversation.messages`)の表示ラベル変更

## Decisions

### `ResultsSection` に `sessionTranscript` を追加し `lastTranscription` を廃止

`lastTranscription`（単一文字列）の代わりに `sessionTranscript: string[]` を Props に追加する。通常モードでは `sessionTranscript` を `map` して行ごとに `<p>` タグで表示する（`TranscriptionPanel` と同じレイアウト）。

**代替案**: `lastTranscription` を `sessionTranscript.join('\n')` に変換して渡す — 既存 props を壊さずに済むが、表示ロジックの変更は結局必要であり、props の意味が曖昧になるため採用しない。

### `SystemAudio` から `sessionTranscript` を `ResultsSection` へ渡す

`SystemAudio` は既に `props`（`useSystemAudioType`）として `sessionTranscript` を受け取っている。これを `ResultsSection` に追加で渡すだけでよい。`useSystemAudio` フック側の変更は不要。

### 「システム：」ラベルを完全削除

- 通常モード: `<span className="font-semibold">システム:</span>` を除去し、文字起こしテキストのみ表示
- 会話モード: `<span>システム</span>` の小見出しを除去。ただし `HeadphonesIcon` アイコンはレイアウト上残してもよいが、ラベルテキストは消す

## Risks / Trade-offs

- **[Risk] `lastTranscription` prop の削除による型エラー** → `ResultsSection` の props を変更した後、`SystemAudio`（`speech/index.tsx`）での渡し方を同時に修正する。TypeScript のコンパイルエラーで漏れを検出できる。
- **[Risk] 会話モードの「システム」ラベル削除でコンテキストが分かりにくくなる** → `HeadphonesIcon` が依然として表示されるため視覚的な区別は維持される。許容範囲と判断。
