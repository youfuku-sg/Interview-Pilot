## 1. 方針確認(ユーザー判断待ち)

- [ ] 1.1 `productName` / パッケージ名を `"Pluely"` から変更するか、いつ変更するかをユーザーに確認する
- [ ] 1.2 `identifier`(`com.srikanthnani.pluely`)を変更するかをユーザーに確認する。変更する場合、既存インストール環境のアンインストール要否も確認する
- [ ] 1.3 ネイティブウィンドウタイトルの「Pluely」表記を残すか置き換えるかを、1.1 の決定と合わせて確認する(`window.rs` と `tauri.conf.json` の `app.windows[0].title` の両方が対象)
- [ ] 1.4 `docs/仕様/ブランチ・リリース戦略.md` の未決事項リストから、この項目を確定事項として反映する
- [ ] 1.5 MSIインストーラファイル名の `en-US` サフィックス、および MSI/NSIS インストーラのウィザード文言(ライセンス同意・インストール先選択・進捗表示等)が英語のままである点について、`bundle.windows.wix.language` を `ja-JP` に、`bundle.windows.nsis.languages` を日本語に変更するかをユーザーに確認する(1.1〜1.3 とは独立に判断可能)

## 2. 実装(1章の決定内容に基づく — 変更する場合のみ)

- [ ] 2.1 `package.json` の `name` を更新する
- [ ] 2.2 `src-tauri/Cargo.toml` の `[package] name` / `[lib] name`(該当する場合)を更新する
- [ ] 2.3 `src-tauri/tauri.conf.json` の `productName` を更新する
- [ ] 2.4 `identifier` を変更する場合、`src-tauri/tauri.conf.json` の `identifier` を更新する
- [ ] 2.5 `src-tauri/src/window.rs` のウィンドウタイトルを更新する(1.3 の決定に基づく)
- [ ] 2.6 `package-lock.json` / `src-tauri/Cargo.lock` の対応するパッケージ名・バージョン表記を更新する
- [ ] 2.7 (1.3 で日本語化する決定の場合)`src-tauri/tauri.conf.json` の `app.windows[0].title`(`"Pluely - AI Assistant"`)を日本語化する。`productName` の変更有無に関わらず独立して対応可能
- [ ] 2.8 (1.5 で `ja-JP` に変更する決定の場合)`src-tauri/tauri.conf.json` の `bundle` に `"windows": { "wix": { "language": ["ja-JP"] } }` を追加する
- [ ] 2.9 (1.5 で NSIS も日本語化する決定の場合)`src-tauri/tauri.conf.json` の `bundle.windows.nsis.languages` に日本語ロケール識別子を追加する

## 3. ドキュメント整備

- [ ] 3.1 `docs/仕様/GitHub Actions リリース手順.md` に、インストーラファイル名が `productName` / `wix.language` に由来する旨と、新しいファイル名の例を記載する
- [ ] 3.2 `docs/仕様/TODO.md` の該当項目にチェックを入れる
- [ ] 3.3 `CLAUDE.md` の「Package/binary name is still `pluely`」の記述を更新する

## 4. 検証

- [ ] 4.1 次回リリースでビルドを実行し、生成されるインストーラファイル名が意図した名称になっていることを確認する
- [ ] 4.2 `identifier` を変更した場合、既存インストール環境でのアンインストール・新規インストールの動作を確認する
- [ ] 4.3 `wix.language` を `ja-JP` に変更した場合、CI上のビルドが問題なく完走し、MSIファイル名が `_ja-JP` になることを確認する。実際にMSIを実行し、インストール中のウィザード文言(ライセンス同意・インストール先選択・進捗表示等)が日本語で表示されることを目視確認する
- [ ] 4.4 `nsis.languages` を日本語化した場合、CI上のビルドが問題なく完走することを確認する。実際にNSISインストーラ(`.exe`)を実行し、インストール中のウィザード文言が日本語で表示されることを目視確認する
