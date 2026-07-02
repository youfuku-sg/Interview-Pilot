## 1. フロントエンド lint 環境の導入

- [x] 1.1 `eslint` / `typescript-eslint` / `eslint-plugin-react-hooks` 等を `devDependencies` に追加する
- [x] 1.2 `eslint.config.js` を最小構成（TypeScript + React 向け推奨ルール）で作成する
- [x] 1.3 `package.json` に `lint` スクリプト（`eslint .` 相当）を追加する
- [x] 1.4 `package.json` に `typecheck` スクリプト（`tsc --noEmit` 相当）を追加する

## 2. フロントエンド lint のローカル検証

- [x] 2.1 `npm run lint` をローカルで実行し、既存コードのエラー件数を確認する — 初回 190 件（159 error / 31 warning）
- [x] 2.2 エラーが大量に出るルールがあれば、該当ルールを `warn` にする、または対象外にするなど最小限の調整を行う（調整内容を記録する）— `eslint-plugin-react-hooks` の `recommended` が React Compiler 向け追加ルール（`refs`/`immutability`/`set-state-in-effect`/`purity`/`preserve-caught-error` 相当、計73件）を含んでいたため、古典的な `rules-of-hooks`/`exhaustive-deps` のみ有効化する形に変更。加えて `@typescript-eslint/no-explicit-any`・`@typescript-eslint/no-unused-vars`・`prefer-const`・`no-empty`・`preserve-caught-error`（ESLint コア）を `warn` に緩和。結果 0 error / 127 warning に
- [x] 2.3 `npm run typecheck` をローカルで実行し、型エラーがないことを確認する — エラー0件

## 3. Rust lint 環境の確認

- [ ] 3.1 `cargo fmt --check` をローカルで実行し、既存コードがフォーマット済みか確認する — この開発環境に Rust ツールチェーンが未インストールのためローカル確認不可。CI（タスク5）での確認に委ねる
- [ ] 3.2 フォーマット崩れがあれば `cargo fmt` を実行して揃える — 同上の理由で保留
- [ ] 3.3 `cargo clippy` をローカルで実行し、warning の量を把握する — 同上の理由で保留

## 4. CI ワークフローの作成

- [x] 4.1 `.github/workflows/ci.yml` を新規作成する
- [x] 4.2 起動条件を「任意のブランチへの push」と「`main` 向け Pull Request」に設定する
- [x] 4.3 フロントエンドジョブ（`npm ci` → `npm run typecheck` → `npm run lint`、ubuntu-latest）を定義する
- [x] 4.4 Rust ジョブ（`rustfmt` / `clippy` コンポーネント付き toolchain セットアップ → `cargo fmt --check` → `cargo clippy`、windows-latest。`src-tauri` に Windows 専用コードがあるため `publish.yml` と同じ Windows ランナーを使用）を定義する

## 5. 動作確認

- [x] 5.1 feature ブランチへ push し、`ci.yml` が起動することを確認する（run 28611350280）
- [x] 5.2 意図的に型エラーを含むコミットを push し、フロントエンドジョブが失敗することを確認する（run 28611770686, Type check step で失敗）
- [x] 5.3 意図的に ESLint エラーを含むコミットを push し、フロントエンドジョブが失敗することを確認する（run 28611973508, Type check 成功・Lint step のみ失敗で分離確認）
- [x] 5.4 意図的にフォーマット崩れを含む Rust コミットを push し、`cargo fmt --check` ジョブが失敗することを確認する（run 28611350280 で最初に検出、既存コードの `src-tauri/src/speaker/linux.rs` の import 順序を修正。run 28611770686/28611973508 でも意図的な崩れの再現を確認）
- [x] 5.5 上記の問題を修正したコミットを push し、CI が成功することを確認する（run 28612059616, frontend/rust とも成功）
- [x] 5.6 検証用コミットを取り消す、または修正済みの状態を最終コミットとして残す — 検証用ファイル・変更を revert コミットで取り消し済み

## 6. ドキュメント整備

- [x] 6.1 CI の起動条件・実行内容・ローカルでの再現方法（`npm run lint` 等）を `docs/仕様` 配下に記載する（`docs/仕様/CI.md` を新設）
- [x] 6.2 `docs/仕様/TODO.md` の該当項目があれば反映する — CI/lint に関する既存項目はなし、反映対象なし
