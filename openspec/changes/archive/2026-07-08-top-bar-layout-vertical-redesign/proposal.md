## Why

現在のトップバーは横1行レイアウト（アイコン群 + テキスト入力欄）であり、操作ボタンが小さく密集しているため使いにくい。縦幅を拡大してアイコンを左カラムに縦並び・テキスト入力を右の広いエリアに配置することで、視認性と操作性を大幅に向上させる。

## What Changes

- トップバー全体の縦幅を現状の約3倍に拡大する
- レイアウトを「横1行」から「左カラム（アイコン縦並び）＋右エリア（テキスト入力）」の2カラム構成に変更する
- 左カラムに配置するアイコン: SystemAudioボタン・マイクボタン（Audio）・設定ボタン（SparklesIcon）・ドラッグハンドル
- 右エリアにテキスト入力欄（Completion の Input 部分）を配置し、縦幅いっぱいを使えるようにする
- 音声キャプチャ中のレイアウト（AudioVisualizer + StatusIndicator）も新構造に合わせて調整する

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `top-bar-ui`: トップバーのレイアウト構造が横1行から左カラム＋右エリアの2カラムに変わる。縦幅・アイコン配置・テキスト入力エリアのサイズ要件が変わる

## Impact

- `src/pages/app/index.tsx` — Card 内のレイアウト構造を全面改修
- `src/pages/app/components/completion/Input.tsx` — テキスト入力欄が縦方向に伸びることへの対応
- `src/hooks/useWindow.ts`（または類似）— ウィンドウの初期高さ設定の変更が必要な場合あり
