## Why

トップ画面（フローティングバー）に表示されているスクリーンショットボタンと画像ファイル添付ボタンは、Interview-Pilot の主要ユースケース（面接支援・テキスト質問応答）では使用しないため、UIのノイズとなっている。不要なボタンを非表示にしてバーをシンプルにする。

## What Changes

- `src/pages/app/components/completion/index.tsx` から `<Screenshot />` と `<Files />` の描画を除去する
- `Screenshot.tsx` / `Files.tsx` コンポーネントおよびそれらが使用するフック・型は削除せず保持する（将来の復活に備えて）
- `Completion` コンポーネントの props から `Screenshot` / `Files` 関連のフィールドは引き続き useCompletion から取得されるが、レンダリングに使われなくなる

## Capabilities

### New Capabilities
<!-- なし -->

### Modified Capabilities
- `top-bar-ui`: トップバーに表示するボタンセットを削減する（スクショ・ファイル添付を非表示化）

## Impact

- 影響ファイル: `src/pages/app/components/completion/index.tsx`
- 削除対象コンポーネント: なし（ファイルは残す）
- 影響なし: Audio、Input、DragButton、開発者スペースボタン（SparklesIcon）、SystemAudio、AudioVisualizer、StatusIndicator
