## Context

このリポジトリは Tauri 製アプリで、フロントエンド（TypeScript + React + Vite）と Rust バックエンド（`src-tauri`）から構成される。`package.json` の `scripts` は `dev` / `build`（`tsc && vite build`）/ `preview` / `tauri` のみで、ESLint 等の lint 関連スクリプトや設定ファイルは存在しない。`src-tauri` 側も `cargo fmt` / `cargo clippy` を強制する仕組みはない。

`.github/workflows/publish.yml` は既に `github-actions-installer-release` change でビルド・リリース専用に整理済みであり、`workflow_dispatch` / `main` push / `v*` タグ push で起動する。今回追加する CI は、この `publish.yml` とは別のワークフローとして、より軽量かつ頻繁に（feature ブランチへの push 等でも）実行されることを想定する。

## Goals / Non-Goals

**Goals:**
- フロントエンドの型エラーを CI で検出できるようにする
- フロントエンドの lint エラー（未使用変数、明らかなバグパターンなど）を CI で検出できるようにする最小限の ESLint 構成を導入する
- Rust 側のフォーマット崩れ（`cargo fmt --check`）と明らかな問題（`cargo clippy`）を CI で検出できるようにする
- `publish.yml` と責務を分離し、CI ワークフローはビルド成果物やリリースを生成しない

**Non-Goals:**
- 既存コード全体への lint ルール適用・警告修正（既存コードに大量の warning が出ても、今回はワークフローの導入自体を優先し、ルール調整や一括修正は別途行う）
- Prettier や stylelint など ESLint 以外のフォーマッタ/リンタの追加
- テスト実行（unit test 等）の CI 組み込み。現状テストコード自体が整備されていないため対象外
- `publish.yml` のトリガー条件やビルド内容の変更

## Decisions

1. **ESLint は TypeScript + React 向けの flat config（`eslint.config.js`）で最小構成から導入する**
   - 理由: 現状 lint 設定が一切ないため、まず「動く最小構成」を優先する。`typescript-eslint` の推奨ルールセットと React Hooks 向けルールを基本とし、プロジェクト固有のカスタムルールは持たない。
   - 代替案: 既存の大規模 OSS（例: Pluely 本家）の ESLint 設定を流用する → 本リポジトリの構成・依存バージョンに合わない可能性があり、まず最小構成で CI を通すことを優先する。

2. **CI ワークフローは `publish.yml` と分離した新規ファイル `ci.yml` とする**
   - 理由: `publish.yml` はビルド・署名・Release 添付という重い処理を担い、起動条件も `main` push / タグ push / 手動実行に絞られている。lint は軽量でどのブランチへの push でも回したいため、責務と起動条件が異なるワークフローとして分離する。
   - 代替案: `publish.yml` に lint ジョブを追加する → 起動条件（`main` push / タグ push のみ）では feature ブランチ作業中に lint が回らず、日常的な検出という目的に合わないため不採用。

3. **CI の起動条件は、全ブランチへの push および `main` 向け Pull Request とする**
   - 理由: `docs/仕様/ブランチ・リリース戦略.md` の `feature/*` での作業中から lint エラーに気づけるようにしたい。個人利用で PR 運用が必須ではない現状も踏まえ、push トリガーを主とし、PR 運用を始めた場合にも対応できるよう `pull_request` も合わせて設定する。
   - 代替案: `main` push のみに限定する → feature ブランチでの作業中に気づけず、目的（日常的な検出）を満たさないため不採用。

4. **Rust の依存インストールは `dtolnay/rust-toolchain@stable` に `components: rustfmt, clippy` を指定して行う**
   - 理由: `publish.yml` で既に同アクションを利用しており、構成の一貫性を保てる。
   - 代替案: 個別に `rustup component add` を実行する → アクション経由の方が簡潔でキャッシュとの相性もよいため不採用。

5. **`cargo clippy` は既存コードの warning を許容し、エラー (`-D warnings`) までは強制しない**
   - 理由: 既存コード（Pluely由来）に対して `-D warnings` を課すと大量の既存 warning で CI が最初から赤くなる可能性が高い。まずは `cargo clippy` を実行して結果を可視化することを優先し、エラー化は既存コードの整理が進んでから別途検討する。
   - 代替案: 最初から `-D warnings` で厳格に運用する → 導入初日から CI が通らなくなり実用性を損なうため不採用。Non-Goals にも記載の通り、既存コードへの一括修正は今回のスコープ外。

6. **ESLint も同様に、初回導入時点では CI を「失敗させる」設定にするが、既存コードに大量のエラーが出る場合は最小限のルール緩和を許容する**
   - 理由: 新規 lint 導入の目的は「今後のコード変更で問題を検出できるようにする」ことであり、初回時点で大量のエラーが出て CI が実用にならないなら、ルールをその場で最小限緩めて通す（該当ルールを `warn` にする、または `.eslintignore` で一時的に除外する等）。どのルールを緩めたかは tasks 実施時に記録する。
   - 代替案: 既存コードを全て修正してからルールを厳格にする → 今回のスコープ（CIの土台を作る）を超えるため不採用。

7. **`eslint-plugin-react-hooks` は `recommended` config をそのまま使わず、`rules-of-hooks` / `exhaustive-deps` の2ルールのみ有効化する**
   - 理由: 実際に導入してみたところ、同パッケージの最新版（v7系）の `recommended` は React Compiler 向けの追加ルール（`refs` / `immutability` / `set-state-in-effect` / `purity`、および ESLint コアの `preserve-caught-error`）まで含んでおり、これらだけで約73件のエラーが発生した。本プロジェクトは React Compiler を使用していないため、これらのルールを有効化する動機がなく、Decision 1 で想定していた「React Hooks 向けルール」の範囲を超えていた。
   - 代替案: これらも Decision 6 同様に `warn` へ緩和して残す → 使う予定のない React Compiler 前提のルールをそもそも有効化しない方が構成として自然なため、`recommended` を展開せず該当2ルールのみを明示的に指定する形にした。

## Risks / Trade-offs

- [Risk] ESLint 未設定のプロジェクトに最小構成を導入すると、既存コードで想定より多くのエラー/警告が出て CI が使い物にならない可能性がある → [Mitigation] Decision 6 の通り、その場でルールを最小限緩めて「CIが通る最小構成」を優先し、厳格化は別 change で段階的に行う。
- [Risk] `main` push と `pull_request` の両方をトリガーにすると、PR からのマージ時に同じコミットに対して二重に CI が走る可能性がある → [Mitigation] 個人利用規模でのコスト影響は小さく、今回は許容する。気になる場合は `concurrency` 設定で同一 ref の重複実行をキャンセルすることを別途検討する。
- [Risk] `cargo clippy` を warning 許容にすると、CI が緑でも実際には問題が残っている可能性があり、チェックの実効性が下がる → [Mitigation] Non-Goals として明記の通り、今回は「仕組みの導入」を優先し、警告のエラー化は既存コード整理後の別 change で行う前提とする。

## Migration Plan

1. ESLint と `typescript-eslint` 関連パッケージを `devDependencies` に追加する
2. `eslint.config.js` を最小構成で作成する
3. `package.json` に `lint` / `typecheck` スクリプトを追加する
4. ローカルで `npm run lint` / `npm run typecheck` を実行し、大量エラーが出る場合は Decision 6 に従いルールを調整する
5. `.github/workflows/ci.yml` を作成し、push / pull_request トリガーでフロントエンド（lint・typecheck）と Rust（fmt・clippy）のジョブを定義する
6. feature ブランチへ push して CI が起動し、各ジョブが実行されることを確認する
7. 意図的に lint エラー・型エラー・フォーマット崩れを混入させたコミットで CI が失敗することを確認し、その後修正して緑になることを確認する

ロールバック: 新規ファイル追加（`ci.yml`、ESLint 設定、`package.json` の scripts 追加）のみで、既存の `publish.yml` やアプリの実行時コードには影響しないため、追加ファイルを削除すれば元の状態に戻せる。

## Open Questions

- PR 運用（`pull_request` トリガー）を今後実際に使うか、push トリガーのみで十分か
- `cargo clippy` / ESLint を将来的にエラー化（`-D warnings` 相当）するタイミング
- Node.js / Rust のバージョンを `publish.yml` と共通のマトリクス・キャッシュ設定にすべきか
