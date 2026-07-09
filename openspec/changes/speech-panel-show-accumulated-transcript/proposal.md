## Why

ヘッドフォンボタンを押したあとのポップオーバー（`ResultsSection`）は `lastTranscription`（直近1件のみ）を使って表示しているため、セッション中の過去の発話が見えない。トップバーでは既に `sessionTranscript`（累積配列）を正しく使っているのに、ポップオーバー側が追いついていないのが原因。加えて文字起こしテキストの前に表示される「システム：」ラベルが不要なノイズになっている。

## What Changes

- **ポップオーバー（`ResultsSection`）内の文字起こし表示を `lastTranscription`（1件）から `sessionTranscript`（累積配列）に切り替える**
  - `SystemAudio` コンポーネントが `sessionTranscript` を `ResultsSection` に渡すよう変更
  - `ResultsSection` の props に `sessionTranscript: string[]` を追加し、通常モードで全発話を縦並びで表示
- **「システム：」プレフィックスを削除する**
  - `ResultsSection` の通常モード表示（`conversationMode === false`）から `<span className="font-semibold">システム:</span>` を除去
  - 会話モードの「システム」ラベル（`<span>システム</span>`）も削除

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `top-bar-transcription-panel`: 音声パネル（ポップオーバー）の文字起こし表示にも `sessionTranscript` 累積配列を使う要件と、「システム：」プレフィックス非表示の要件を追加

## Impact

- `src/pages/app/components/speech/ResultsSection.tsx` — props 変更、表示ロジック変更
- `src/pages/app/components/speech/index.tsx`（`SystemAudio`）— `sessionTranscript` を `ResultsSection` に渡す
