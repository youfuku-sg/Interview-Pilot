## Context

現在のトップバー（`src/pages/app/index.tsx`）は `Card` 内に `flex-row` で横並びしており、collapsed 時のウィンドウ高さは **54px**（`useWindow.ts` の `set_window_height` で制御）。expanded 時は 600px に伸びる。

現行の要素配置:
```
[SystemAudio] [AudioVisualizer or [Completion(Audio + Input)] [SparklesBtn]] [DragButton]
```

目標のレイアウト:
```
┌──────────────────────────────────┐
│ [SysAudio] │                     │
│ [Mic]      │  テキスト入力エリア  │
│ [Settings] │  （縦幅いっぱい）    │
│ [Drag]     │                     │
└──────────────────────────────────┘
```

collapsed 高さを **54 × 3 = 約162px** に変更する。

## Goals / Non-Goals

**Goals:**
- トップバーの collapsed 高さを 54px → 160px 程度に変更する
- Card レイアウトを `flex-row`（横1行）から「左カラム（アイコン縦スタック）＋右エリア（入力）」の `flex-row` + 内部 `flex-col` に変更する
- 左カラム: `SystemAudio`（ヘッドフォン）・`Audio`（マイク）・設定ボタン・`DragButton` を縦に並べる
- 右エリア: `Input` コンポーネントが縦幅いっぱいを占めるようにする
- 音声キャプチャ中も同じ2カラム構造を維持する

**Non-Goals:**
- expanded（popover 展開時）の 600px 高さは変更しない
- ボタンの機能・アイコン種類の変更はこの変更では行わない（別 change で対応）
- テキスト入力欄を `<textarea>` に変えるなどの機能変更は行わない

## Decisions

### collapsed 高さを 160px に設定

54 × 3 = 162px。切りよく **160px** を採用する。`useWindow.ts` の `const newHeight = expanded ? 600 : 54` を `expanded ? 600 : 160` に変更する。

### 左カラムの幅は固定 (`w-10` / 40px)

アイコンボタンは `size="icon"` で 32〜36px 程度。左カラムを `w-10`（40px）の固定幅にし、右エリアが `flex-1` で残りを占める。

### Input の高さ

`Input` コンポーネントは現在 `<input>` 要素（1行）。右エリアが `h-full` になっても入力欄自体はデザインを変えず中央揃えにとどめる。将来的に `<textarea>` 化したい場合は別 change で実施。

### 音声キャプチャ中のレイアウト

現在 `systemAudio.capturing` が `true` のとき `AudioVisualizer + StatusIndicator` を横並びで表示している。新レイアウトでは左カラムにステータスインジケーターを縦に、右エリアに `AudioVisualizer` を配置する。

## Risks / Trade-offs

- **リスク: ウィンドウ高さ変更によるドラッグ操作への影響** → `DragButton` を左カラムの末尾に配置すれば問題なし。`data-tauri-drag-region` は引き続き機能する。
- **リスク: MutationObserver によるポップオーバー監視との干渉** → collapsed/expanded の切り替えロジック自体は変えないため影響なし。高さの数値変更のみ。
- **トレードオフ: Input が1行のまま** → 縦幅が増えても入力欄は1行のままで余白が生じる。視覚的にスッキリさせるため Input を中央揃え (`items-center`) で配置する。
