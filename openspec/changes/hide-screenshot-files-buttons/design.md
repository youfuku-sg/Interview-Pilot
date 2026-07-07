## Context

トップバーは `src/pages/app/index.tsx` が描画する `<Completion>` コンポーネントを中心に構成されている。`Completion` は `src/pages/app/components/completion/index.tsx` で `<Audio>`, `<Input>`, `<Screenshot>`, `<Files>` の4要素を並べている。このうち `<Screenshot>` と `<Files>` を非表示にする。

## Goals / Non-Goals

**Goals:**
- `<Screenshot>` と `<Files>` をトップバーから取り除き、UIをシンプルにする
- コンポーネントファイル（Screenshot.tsx / Files.tsx）は削除しない（将来の再利用余地を残す）
- 既存の Audio・Input の動作・レイアウトを変えない

**Non-Goals:**
- Screenshot.tsx / Files.tsx そのものの削除
- useCompletion フックの変更（Screenshot/Files 関連のロジックは引き続きフック内に残る）
- 設定による表示/非表示の切り替え機能

## Decisions

**`index.tsx` からの描画除去のみ行う**

`Screenshot` と `Files` のレンダリングを `completion/index.tsx` から削除するだけで実装完了。コンポーネント自体は import ごと削除してよい（Vite のツリーシェイクで未使用コードはバンドルから除外される）。

代替として CSS で `hidden` にする方法もあるが、不要な DOM 要素・イベントハンドラを生成し続けるため、import 削除が適切。

## Risks / Trade-offs

- **useCompletion の戻り値に Screenshot/Files 関連フィールドが残る** → 未使用変数の lint 警告が出る可能性があるが、フック自体を変更しないため許容。将来の再有効化コストを低く保てる。
- **ロールバック** → `index.tsx` の変更を revert するだけで即座に復元可能。リスクは最小。
