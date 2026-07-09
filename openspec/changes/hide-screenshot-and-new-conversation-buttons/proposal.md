## Why

音声入力（ヘッドフォンボタン）押下後のパネルに「スクリーンショット」ボタンと「新規」ボタンが表示されているが、本アプリの面接支援用途ではこれらを使用しない。不要なUIを非表示にしてパネルをシンプルにする。

## What Changes

- `src/pages/app/components/speech/index.tsx` のスクリーンショットボタンを非表示にする
- `src/pages/app/components/speech/index.tsx` の新規（会話）ボタンを非表示にする

## Capabilities

### New Capabilities
<!-- なし -->

### Modified Capabilities
- `top-bar-ui`: 音声パネル内のアクションボタン表示要件を変更（スクリーンショット・新規ボタンを非表示）

## Impact

- 対象ファイル: `src/pages/app/components/speech/index.tsx`
- UI変更のみ。ロジック・データ・API に影響なし
- 関連する未使用 import（`CameraIcon`、`PlusIcon` など）のクリーンアップが発生する可能性あり
