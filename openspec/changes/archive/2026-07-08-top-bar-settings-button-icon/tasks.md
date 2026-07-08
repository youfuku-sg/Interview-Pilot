## 1. アイコン変更

- [x] 1.1 `src/pages/app/index.tsx` の import を `SparklesIcon` → `Settings`（lucide-react）に変更する
- [x] 1.2 同ファイルの JSX を `<SparklesIcon className="h-4 w-4" />` → `<Settings className="h-4 w-4" />` に変更する
- [x] 1.3 同ボタンの `title` 属性を `"開発者スペースを開く"` → `"設定を開く"` に変更する

## 2. Spec 更新

- [x] 2.1 `openspec/specs/top-bar-ui/spec.md` のシナリオ「残りのボタンは正常に動作する」内の「開発者スペースボタン（✨）」を「設定ボタン（⚙️）」に更新する

## 3. 動作確認

- [x] 3.1 `npm run dev` でアプリを起動し、トップバーに⚙️（ギアマーク）ボタンが表示されることを確認する
- [x] 3.2 ボタンをクリックするとダッシュボードが開くことを確認する
- [x] 3.3 ボタンにホバーしてツールチップ「設定を開く」が表示されることを確認する
- [x] 3.4 `npm run typecheck` と `npm run lint` がエラーなしで通ることを確認する
