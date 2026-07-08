## Why

`top-bar-layout-vertical-redesign`（②）で作った右エリアは現在テキスト入力欄のみを配置している。将来のコンテンツ（例: 直近の文字起こし表示、AI回答プレビューなど）を受け入れられるよう、右エリアを上段・中段・下段の3つの横枠に分割し、拡張性を確保する。

## What Changes

- `src/pages/app/index.tsx` の右エリアを縦3分割の構造に変更する
  - **上段**: 将来のコンテンツ用空白エリア（プレースホルダーのみ、今は何も表示しない）
  - **中段**: 将来のコンテンツ用空白エリア（プレースホルダーのみ）
  - **下段**: テキスト入力欄（`Completion` の `Input` コンポーネント）
- 高さ配分は上段・中段が小さめ（`flex-1`）、下段が入力欄の高さに合わせる（`auto`）とする

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `top-bar-ui`: 右エリアの内部構造が1段から3段（上・中・下）に変わる。テキスト入力欄が最下段に固定される要件が追加される

## Impact

- `src/pages/app/index.tsx` — 右エリアの JSX を3分割に修正
- `top-bar-layout-vertical-redesign` change（②）が実装済みであることを前提とする
