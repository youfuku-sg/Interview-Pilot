## 1. フロントエンド lint 環境の導入

- [ ] 1.1 `eslint` / `typescript-eslint` / `eslint-plugin-react-hooks` 等を `devDependencies` に追加する
- [ ] 1.2 `eslint.config.js` を最小構成（TypeScript + React 向け推奨ルール）で作成する
- [ ] 1.3 `package.json` に `lint` スクリプト（`eslint .` 相当）を追加する
- [ ] 1.4 `package.json` に `typecheck` スクリプト（`tsc --noEmit` 相当）を追加する

## 2. フロントエンド lint のローカル検証

- [ ] 2.1 `npm run lint` をローカルで実行し、既存コードのエラー件数を確認する
- [ ] 2.2 エラーが大量に出るルールがあれば、該当ルールを `warn` にする、または対象外にするなど最小限の調整を行う（調整内容を記録する）
- [ ] 2.3 `npm run typecheck` をローカルで実行し、型エラーがないことを確認する

## 3. Rust lint 環境の確認

- [ ] 3.1 `cargo fmt --check` をローカルで実行し、既存コードがフォーマット済みか確認する
- [ ] 3.2 フォーマット崩れがあれば `cargo fmt` を実行して揃える
- [ ] 3.3 `cargo clippy` をローカルで実行し、warning の量を把握する

## 4. CI ワークフローの作成

- [ ] 4.1 `.github/workflows/ci.yml` を新規作成する
- [ ] 4.2 起動条件を「任意のブランチへの push」と「`main` 向け Pull Request」に設定する
- [ ] 4.3 フロントエンドジョブ（`npm ci` → `npm run typecheck` → `npm run lint`）を定義する
- [ ] 4.4 Rust ジョブ（`rustfmt` / `clippy` コンポーネント付き toolchain セットアップ → `cargo fmt --check` → `cargo clippy`）を定義する

## 5. 動作確認

- [ ] 5.1 feature ブランチへ push し、`ci.yml` が起動することを確認する
- [ ] 5.2 意図的に型エラーを含むコミットを push し、フロントエンドジョブが失敗することを確認する
- [ ] 5.3 意図的に ESLint エラーを含むコミットを push し、フロントエンドジョブが失敗することを確認する
- [ ] 5.4 意図的にフォーマット崩れを含む Rust コミットを push し、`cargo fmt --check` ジョブが失敗することを確認する
- [ ] 5.5 上記の問題を修正したコミットを push し、CI が成功することを確認する
- [ ] 5.6 検証用コミットを取り消す、または修正済みの状態を最終コミットとして残す

## 6. ドキュメント整備

- [ ] 6.1 CI の起動条件・実行内容・ローカルでの再現方法（`npm run lint` 等）を `docs/仕様` 配下に記載する
- [ ] 6.2 `docs/仕様/TODO.md` の該当項目があれば反映する
