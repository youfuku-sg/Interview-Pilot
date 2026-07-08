## Why

`top-bar-right-panel-three-rows`（③）で作った右エリア3段に実際のコンテンツを割り当てる。現在の上段・中段は空白のままであり、音声認識・AI回答という Interview-Pilot の主要機能がトップバー上で確認できない。各段に役割を持たせ、設定不備時のエラーも表示することでユーザーが即座に状態を把握できるようにする。

## What Changes

- **上段（文字起こしパネル）**
  - `useSystemAudio` の `lastTranscription` をリアルタイム表示する
  - STTプロバイダー未設定時（`selectedSttProvider.provider` が未設定かつ `pluelyApiEnabled` が false）は「STTプロバイダーが選択されていません」エラーを表示する
  - 音声処理中（`isProcessing`）はローディング表示をする

- **中段・下段（AI回答パネル）**
  - `useSystemAudio` の `lastAIResponse` を表示する（中段に本文、下段はスクロールオーバーフロー対応）
  - AIプロバイダー未設定時（`selectedAIProvider.provider` が未設定かつ `pluelyApiEnabled` が false）は「AIプロバイダーが選択されていません」エラーを表示する
  - AI処理中（`isAIProcessing`）はローディング表示をする

- テキスト入力欄（Completion の Input）は最下段のまま変更しない

## Capabilities

### New Capabilities

- `top-bar-transcription-panel`: 上段に文字起こし結果をリアルタイム表示し、STTプロバイダー未設定時のエラー表示も行う機能

### Modified Capabilities

- `top-bar-ui`: 上段・中段・下段それぞれの表示内容が定義される。プロバイダー未設定エラー表示の要件が追加される

## Impact

- `src/pages/app/index.tsx` — 上段・中段のエリアに `systemAudio` の状態を接続
- `src/contexts/app.context.tsx` — `selectedSttProvider`・`selectedAIProvider`・`pluelyApiEnabled` を参照（既存 export を利用）
- `src/hooks/useSystemAudio.ts` — 返り値 `lastTranscription`・`lastAIResponse`・`isProcessing`・`isAIProcessing` を利用（変更なし）
- 新コンポーネント: `src/pages/app/components/TranscriptionPanel.tsx`（上段）、`src/pages/app/components/AIResponsePanel.tsx`（中段）を作成することが望ましい
