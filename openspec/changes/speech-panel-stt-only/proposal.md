## Why

ヘッドフォンボタンを押して開く音声パネル（`SystemAudio` ポップオーバー）は STT（音声→テキスト変換）の確認画面として使いたいが、現状は STT 完了直後に AI 処理を試みてエラーを出したり、「AIの回答」というタイトルが表示されたりと、AI 前提の設計になっている。このパネルを STT 専用の表示にシンプル化し、AI プロバイダー未設定時に余分なエラーが出ない体験にする。

## What Changes

- `useSystemAudio.ts` の `processWithAI` 呼び出し: AI プロバイダーが未設定の場合はエラーをセットせず、文字起こし結果のみを表示して処理を終了する
- `ResultsSection.tsx` のセクションタイトル: "AIの回答" / "会話" → "文字起こし" / "会話"（通常モードのラベルを変更）
- `AIResponsePanel.tsx` (トップバー中段): "AIプロバイダーが選択されていません" エラー表示を削除し、AI プロバイダー未設定時は何も表示しない

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `top-bar-ui`: 中段 AI 回答パネルの「AIプロバイダー未設定時エラー表示」要件を削除する（AIプロバイダー未設定時は空白）
- `top-bar-transcription-panel`: 音声パネル内の結果セクションタイトルを「AIの回答」から「文字起こし」に変更する要件を追加する

## Impact

- `src/pages/app/components/AIResponsePanel.tsx` — `!aiReady` 時の警告ブロックを削除
- `src/pages/app/components/speech/ResultsSection.tsx` — セクションタイトルを変更
- `src/hooks/useSystemAudio.ts` — `processWithAI` 内の AI プロバイダー未設定チェックを「エラーをセットせず return するだけ」に変更
- `openspec/specs/top-bar-ui/spec.md` — 「AIプロバイダー未設定時にエラーを表示する」シナリオを削除
- `openspec/specs/top-bar-transcription-panel/spec.md` — 音声パネル結果タイトルに関する要件を追加
