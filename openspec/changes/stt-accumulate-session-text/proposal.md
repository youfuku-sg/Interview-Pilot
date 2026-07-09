## Why

VAD（音声区間検出）が無音を検知するたびに `lastTranscription` を上書きするため、ヘッドフォンボタンを押して録音セッションを継続していても直前の発話しかパネルに残らない。録音セッション中の全発話を1つの連続したテキストとして蓄積・表示することで、面接中に自分が話した内容の流れを確認できるようにする。

## What Changes

- `useSystemAudio` フックに「セッション累積テキスト（`sessionTranscript`）」のステートを追加し、`capturing` フラグが立っている間は `speech-detected` ごとに追記する（上書きしない）。
- `TranscriptionPanel` コンポーネントに `sessionTranscript` を渡し、発話ブロックを改行区切りで表示する。
- `stopCapture` / `startCapture` 時に `sessionTranscript` をリセットし、セッション間でテキストが混在しないようにする。
- `lastTranscription`（最後の1発話）は AI 処理のトリガーとして内部的に引き続き使用するが、**パネル表示には使わない**。

## Capabilities

### New Capabilities

- `stt-session-transcript`: 録音セッション開始〜停止の間に認識した全発話を時系列に蓄積し、改行区切りで表示する能力。

### Modified Capabilities

- `top-bar-transcription-panel`: 表示するテキストソースが `lastTranscription`（最終1発話）から `sessionTranscript`（セッション全文）に変わる。

## Impact

- `src/hooks/useSystemAudio.ts` — `sessionTranscript` ステート追加・`speech-detected` ハンドラの追記ロジック・`startCapture`/`stopCapture` でのリセット。
- `src/pages/app/components/TranscriptionPanel.tsx` — Props に `sessionTranscript` を追加し改行レンダリング。
- `src/pages/app/index.tsx` または `TranscriptionPanel` を呼び出している箇所 — Props 追加に伴う受け渡し更新。
- 既存の `top-bar-transcription-panel` spec に行動変化（Breaking ではないが要件追加）。
