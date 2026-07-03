## 1. 方針確認(ユーザー判断待ち)

- [x] 1.1 `productName` / パッケージ名を `"Pluely"` から変更するか、いつ変更するかをユーザーに確認する → `"Interview-Pilot"` に変更する、と回答
- [x] 1.2 `identifier`(`com.srikanthnani.pluely`)を変更するかをユーザーに確認する。変更する場合、既存インストール環境のアンインストール要否も確認する → `com.interview-pilot.app` に変更する、と回答
- [x] 1.3 ネイティブウィンドウタイトルの「Pluely」表記を残すか置き換えるかを、1.1 の決定と合わせて確認する(`window.rs` と `tauri.conf.json` の `app.windows[0].title` の両方が対象) → 1.1 と連動して置き換える
- [x] 1.4 `docs/仕様/ブランチ・リリース戦略.md` の未決事項リストから、この項目を確定事項として反映する
- [x] 1.5 MSIインストーラファイル名の `en-US` サフィックス、および MSI/NSIS インストーラのウィザード文言(ライセンス同意・インストール先選択・進捗表示等)が英語のままである点について、`bundle.windows.wix.language` を `ja-JP` に、`bundle.windows.nsis.languages` を日本語に変更するかをユーザーに確認する(1.1〜1.3 とは独立に判断可能) → 日本語化する、と回答
- [x] 1.6 アプリ内UIに残る「Pluely」ブランド名表記(design.md Context に列挙した箇所)の置き換え先名称をユーザーに確認する → すべて置き換える(`Interview-Pilot` / 汎用名に統一)、ただしユーザー向け表示文言のみで関数名・コンポーネント名・ファイル名・localStorage キー名は対象外、と回答
- [x] 1.7 「Pluely API」等、Pluely 本家サービスに接続する機能自体の名称・扱い(表示名のみ変更するか、機能自体の存続も含めて見直すか)をユーザーに確認する → 表示名を汎用名(「クラウドAPI」)に置き換える。「Pluely既定プロンプト」も「推奨プロンプト」に置き換える、と回答。`Contribute.tsx`/`Promote.tsx`/`support@pluely.com` 等、実際に pluely.com へリンクする文言は実態と乖離するため対象外のまま維持

## 2. 実装(1章の決定内容に基づく — 変更する場合のみ)

- [x] 2.1 `package.json` の `name` を更新する
- [x] 2.2 `src-tauri/Cargo.toml` の `[package] name` / `[lib] name`(該当する場合)を更新する
- [x] 2.3 `src-tauri/tauri.conf.json` の `productName` を更新する
- [x] 2.4 `identifier` を変更する場合、`src-tauri/tauri.conf.json` の `identifier` を更新する
- [x] 2.5 `src-tauri/src/window.rs` のウィンドウタイトルを更新する(1.3 の決定に基づく)
- [x] 2.6 `package-lock.json` / `src-tauri/Cargo.lock` の対応するパッケージ名・バージョン表記を更新する(`package-lock.json` は `npm install` で再生成。`Cargo.lock` はローカルに Rust ツールチェーンがなく `cargo` を実行できなかったため、`name` フィールドのみ手動更新した。次回 Rust 環境でのビルド時に `cargo check` 等で整合性を再確認すること)
- [x] 2.7 (1.3 で日本語化する決定の場合)`src-tauri/tauri.conf.json` の `app.windows[0].title`(`"Pluely - AI Assistant"`)を日本語化する。`productName` の変更有無に関わらず独立して対応可能 → `"Interview-Pilot - AIアシスタント"` に変更
- [x] 2.8 (1.5 で `ja-JP` に変更する決定の場合)`src-tauri/tauri.conf.json` の `bundle` に `"windows": { "wix": { "language": ["ja-JP"] } }` を追加する
- [x] 2.9 (1.5 で NSIS も日本語化する決定の場合)`src-tauri/tauri.conf.json` の `bundle.windows.nsis.languages` に日本語ロケール識別子を追加する → `["Japanese"]`
- [x] 2.10 (1.6 の決定に基づく)アプリ内UIの「Pluely」ブランド名表記を、決定した新しい名称に置き換える。`grep -rn "Pluely" src/ --include="*.tsx" --include="*.ts"` で網羅的に洗い出してから対応する。コンポーネント名(`PluelyApiSetup` 等)・変数名・localStorage キー名(`pluely_license_key` 等)は、UI表示文言の変更とは別に、変更する場合は動作影響(既存ローカルデータとの互換性)を確認する → ユーザー向け表示文言のみ置き換え済み。関数名・コンポーネント名・ファイル名・localStorage キー名・コード内コメント・`console.*` ログは対象外のまま(ユーザー回答どおり)
- [x] 2.11 (1.7 の決定に基づく)Pluely API 機能名の表示・扱いを決定内容に沿って更新する → 表示文言を「クラウドAPI」に統一。`Contribute.tsx`/`Promote.tsx` の pluely.com 本家プログラムへの案内文言は実態を保つため据え置き

## 3. ドキュメント整備

- [x] 3.1 `docs/仕様/GitHub Actions リリース手順.md` に、インストーラファイル名が `productName` / `wix.language` に由来する旨と、新しいファイル名の例を記載する
- [x] 3.2 `docs/仕様/TODO.md` の該当項目にチェックを入れる
- [x] 3.3 `CLAUDE.md` の「Package/binary name is still `pluely`」の記述を更新する

## 4. 検証

- [ ] 4.1 次回リリースでビルドを実行し、生成されるインストーラファイル名が意図した名称になっていることを確認する
- [ ] 4.2 `identifier` を変更した場合、既存インストール環境でのアンインストール・新規インストールの動作を確認する
- [ ] 4.3 `wix.language` を `ja-JP` に変更した場合、CI上のビルドが問題なく完走し、MSIファイル名が `_ja-JP` になることを確認する。実際にMSIを実行し、インストール中のウィザード文言(ライセンス同意・インストール先選択・進捗表示等)が日本語で表示されることを目視確認する
- [ ] 4.4 `nsis.languages` を日本語化した場合、CI上のビルドが問題なく完走することを確認する。実際にNSISインストーラ(`.exe`)を実行し、インストール中のウィザード文言が日本語で表示されることを目視確認する
- [ ] 4.5 アプリを起動し、ダッシュボード・サイドバー・エラー画面・設定画面・権限案内等、design.md Context に列挙した箇所すべてで「Pluely」表記が意図通りに置き換わっていることを目視確認する → `npm run typecheck` / `npm run build` は成功、コード上の置き換えは grep で網羅確認済み。ただし本作業環境には Rust ツールチェーンも GUI もなく実際に Tauri アプリを起動できないため、実機での目視確認は未実施。ユーザー側で `npm run tauri dev` 等で確認すること
- [ ] 4.6 `2.10` で localStorage キー名等を変更した場合、既存の設定・データが引き続き読み込めることを確認する(移行処理が必要な場合は別途対応する)→ localStorage キー名は変更していないため対象外
