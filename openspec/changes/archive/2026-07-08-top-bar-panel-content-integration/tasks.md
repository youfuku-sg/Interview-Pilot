## 1. 前提確認

- [x] 1.1 `top-bar-layout-vertical-redesign`（②）と `top-bar-right-panel-three-rows`（③）が実装済みであることを確認する

## 2. TranscriptionPanel コンポーネントの作成

- [x] 2.1 `src/pages/app/components/TranscriptionPanel.tsx` を新規作成する
  - props: `lastTranscription: string`, `isProcessing: boolean`, `sttReady: boolean`
  - `!sttReady` → `AlertCircleIcon` + 「STTプロバイダーが選択されていません」（orange スタイル）
  - `isProcessing` → `Loader2` スピナー + 「文字起こし中...」
  - `lastTranscription` あり → テキスト表示
  - それ以外 → 何も表示しない

## 3. AIResponsePanel コンポーネントの作成

- [x] 3.1 `src/pages/app/components/AIResponsePanel.tsx` を新規作成する
  - props: `lastAIResponse: string`, `isAIProcessing: boolean`, `aiReady: boolean`
  - `!aiReady` → `AlertCircleIcon` + 「AIプロバイダーが選択されていません」（orange スタイル）
  - `isAIProcessing` → `Loader2` スピナー + 「AI回答を生成中...」
  - `lastAIResponse` あり → `Markdown` コンポーネントでレンダリング（`overflow-y-auto`）
  - それ以外 → 何も表示しない

## 4. App コンポーネントへの統合

- [x] 4.1 `src/pages/app/index.tsx` で `useApp as useAppContext` から `selectedSttProvider`・`selectedAIProvider`・`pluelyApiEnabled` を取得する
- [x] 4.2 `sttReady` と `aiReady` のフラグを算出する
  ```ts
  const sttReady = !!selectedSttProvider.provider || pluelyApiEnabled;
  const aiReady = !!selectedAIProvider.provider || pluelyApiEnabled;
  ```
- [x] 4.3 右エリアの上段 (`data-slot="top-panel"`) に `<TranscriptionPanel>` を配置する
  ```tsx
  <TranscriptionPanel
    lastTranscription={systemAudio.lastTranscription}
    isProcessing={systemAudio.isProcessing}
    sttReady={sttReady}
  />
  ```
- [x] 4.4 右エリアの中段 (`data-slot="middle-panel"`) に `<AIResponsePanel>` を配置する
  ```tsx
  <AIResponsePanel
    lastAIResponse={systemAudio.lastAIResponse}
    isAIProcessing={systemAudio.isAIProcessing}
    aiReady={aiReady}
  />
  ```
- [x] 4.5 `src/pages/app/components/index.ts` に `TranscriptionPanel`・`AIResponsePanel` を export に追加する

## 5. 動作確認

- [x] 5.1 `npm run dev` でアプリを起動し、STTプロバイダー未設定時に上段にエラーが表示されることを確認する
- [x] 5.2 AIプロバイダー未設定時に中段にエラーが表示されることを確認する
- [x] 5.3 音声キャプチャ中に文字起こしが上段に表示されることを確認する
- [x] 5.4 文字起こし完了後にAI回答が中段に表示されることを確認する
- [x] 5.5 ローディング表示（文字起こし中・AI生成中）が正しく動作することを確認する
- [x] 5.6 `npm run typecheck` と `npm run lint` がエラーなしで通ることを確認する
