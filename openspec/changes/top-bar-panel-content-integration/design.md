## Context

`src/pages/app/index.tsx` の `App` コンポーネントは `useApp()` から `systemAudio`（`useSystemAudio` の返り値）を受け取っている。`systemAudio` には `lastTranscription`・`lastAIResponse`・`isProcessing`・`isAIProcessing` が含まれる。

プロバイダー設定状態は `useApp as useAppContext` から取得できる:
- `selectedSttProvider.provider` — STTプロバイダーID（未設定時は空文字）
- `selectedAIProvider.provider` — AIプロバイダーID（未設定時は空文字）
- `pluelyApiEnabled` — Pluely クラウド API が有効かどうか（true なら STT/AI ともに設定不要）

現在 `useAppContext` は `customizable` のみ参照しており、`selectedSttProvider` 等も同じ場所から取得可能。

## Goals / Non-Goals

**Goals:**
- 上段に `TranscriptionPanel` コンポーネントを作成し、`lastTranscription`・`isProcessing`・STT設定状態を受け取って表示する
- 中段（`AIResponsePanel`）に `lastAIResponse`・`isAIProcessing`・AI設定状態を渡して表示する
- 未設定エラーは各パネル内にインラインで表示する（モーダルや別ウィンドウは不要）
- `capturing` が false（音声キャプチャ停止中）でも文字起こし・AI回答の「最後の結果」は表示し続ける

**Non-Goals:**
- 中段・下段の高さ分割変更は行わない（③の構造をそのまま使う）
- AI回答のストリーミング表示の詳細な UI 設計は別途行う（今回はシンプルなテキスト表示）
- STT/AI 設定への導線（「設定へ移動」ボタン等）はこの change では実装しない

## Decisions

### コンポーネント分割

上段・中段をそれぞれ独立コンポーネントにする。理由: `index.tsx` が肥大化しないように、かつ将来のコンテンツ拡張時に差し替えやすくする。

**`TranscriptionPanel`** (`src/pages/app/components/TranscriptionPanel.tsx`):
```tsx
props: {
  lastTranscription: string;
  isProcessing: boolean;
  sttReady: boolean;  // selectedSttProvider.provider !== "" || pluelyApiEnabled
}
```
表示ロジック:
1. `!sttReady` → エラーメッセージ「STTプロバイダーが選択されていません」
2. `isProcessing` → ローディングインジケーター
3. `lastTranscription` あり → テキスト表示
4. すべて空 → 無音（何も表示しない、またはプレースホルダー）

**`AIResponsePanel`** (`src/pages/app/components/AIResponsePanel.tsx`):
```tsx
props: {
  lastAIResponse: string;
  isAIProcessing: boolean;
  aiReady: boolean;  // selectedAIProvider.provider !== "" || pluelyApiEnabled
}
```
表示ロジック:
1. `!aiReady` → エラーメッセージ「AIプロバイダーが選択されていません」
2. `isAIProcessing` → ローディングインジケーター
3. `lastAIResponse` あり → テキスト表示（`Markdown` コンポーネント使用）
4. すべて空 → 空白

### エラー表示スタイル

既存の `bg-orange-50 text-orange-600` パターン（`useSystemAudio` の既存エラー表示に合わせる）でインライン表示する。アイコンは `AlertCircleIcon`（既存コードで使用済み）を流用する。

### 中段と下段の関係

中段と下段は両方 AI 表示エリアだが、この change では中段のみ `AIResponsePanel` を配置し、下段（テキスト入力欄）はそのままとする。AI 回答が長い場合は中段内でスクロールする（`overflow-y-auto`）。

## Risks / Trade-offs

- **リスク: `pluelyApiEnabled` の判定** → Pluely API が有効な場合はプロバイダー設定不要なので、エラーを出さないよう `sttReady = !!sttProvider || pluelyEnabled` の判定を必ず入れる。
- **リスク: capturing が false のとき `lastTranscription` が残る** → `stopCapture` で `lastTranscription` がリセットされる（`useSystemAudio.ts:627`）ため、キャプチャ停止と同時に上段が空白になる。これは意図した動作として許容する。
- **トレードオフ: AI回答を中段のみに表示** → 下段はテキスト入力欄のまま。AI 回答が長い場合、中段の高さ（約 53px）では見づらい。将来的に中段の高さ拡張や別ウィンドウ展開を検討する。
