## 1. npm依存の更新

- [x] 1.1 `npm update` を実行し、以下のパッケージを現行メジャー内の最新へ更新する(`npm outdated` でWanted=Latestを確認済み): `@bany/curl-to-json`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-popover`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-slider`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@tailwindcss/vite`, `@tauri-apps/api`, `@tauri-apps/cli`, `@tauri-apps/plugin-autostart`, `@tauri-apps/plugin-global-shortcut`, `@tauri-apps/plugin-http`, `@tauri-apps/plugin-opener`, `@tauri-apps/plugin-process`, `@tauri-apps/plugin-sql`, `@tauri-apps/plugin-updater`, `@types/node`(24系最新まで、26系は対象外), `@types/react`, `@types/react-dom`, `react`, `react-dom`, `react-error-boundary`, `react-router-dom`, `shiki`(3系最新まで、4系は対象外), `streamdown`(1系最新まで、2系は対象外), `tailwind-merge`, `tailwindcss`, `tw-animate-css`, `vite`(7系最新まで、8系は対象外)。
  - 実施済み(v0.5.1)。ただし `@tauri-apps/api` / `@tauri-apps/plugin-opener` / `@tauri-apps/plugin-sql` は、対応するRust側crateがこの環境では追従更新できず `tauri build` がバージョン不一致で失敗したため、v0.5.2(hotfix)で更新前バージョン(2.8.0 / 2.4.0 / 2.3.0)に戻し済み。`@tauri-apps/plugin-updater` はPluely自動アップデータ削除(remove-pluely-updater, v0.5.0)により既に依存から除去済みのため対象外。
- [ ] 1.2 `@ricky0123/vad-react` は `^0.0.30` のcaret制約のため `npm update` で上がらない。`package.json` を `^0.0.36` に手動変更してから `npm install` する。
  - 未実施。0.0.36はReact 18を要求するpeer依存があり、本プロジェクトはReact 19系のため据え置いた。
- [x] 1.3 `package.json` を確認し、`@vitejs/plugin-react`(4.7.0が4系最新)、`lucide-react`(0.539.0が0系最新)、`recharts`(2.15.4が2系最新)、`typescript`(5.8.3が5系最新)は今回変更不要であることを確認する(メジャーアップのみが残っているため対象外)。
- [x] 1.4 更新後の `npm outdated` を再実行し、現行メジャー内での更新漏れがないことを確認する。

## 2. Rust依存の更新

- [ ] 2.1 実装環境にRustツールチェーン(`rustc` / `cargo`)を導入する(未導入の場合)。
  - 未実施。本セッションの実装環境に`cargo`が無く、導入も行わなかった。
- [ ] 2.2 `src-tauri/` で `cargo update` を実行し、`Cargo.lock` を現行メジャー内の最新へ更新する。
- [ ] 2.3 `xcap = "0.0.12"` など0.0.x系クレートについて、`cargo update` で更新されない場合は crates.io で最新の0.0.x版を確認し、`Cargo.toml` の指定を手動で更新する。
- [ ] 2.4 その他の主要クレート(`tauri`, `tauri-plugin-updater`, `tauri-plugin-http`, `tauri-plugin-shell`, `tauri-plugin-sql`, `tauri-plugin-autostart`, `tauri-plugin-macos-permissions`, `cpal`, `hound`, `tokio`, `reqwest`, `image`, `uuid`, `ringbuf`, `cidre`, `wasapi`, `libpulse-binding`, `libpulse-simple-binding`)がメジャーバンプなしで最新化されていることを crates.io と見比べて確認する。
  - 2.2-2.4は未実施。cargoが使える環境での後続作業として残る。

## 3. 検証

- [x] 3.1 `npm run typecheck` が通ることを確認する。
- [x] 3.2 `npm run lint` が通ることを確認する。
- [x] 3.3 `npm run build` が通ることを確認する。
- [x] 3.4 Rustツールチェーンのある環境で `cargo build`(または `npm run tauri build`)が通ることを確認する。
  - ローカルではなくGitHub Actions CI(`publish-tauri`ジョブ、v0.5.2タグ)で`tauri build`成功を確認。
- [ ] 3.5 開発サーバーを起動し、録音、スクリーンショット、チャット、設定画面など主要フローを手動で一通り確認し、依存更新による回帰がないことを確認する。
  - 未実施。ユーザーがv0.5.2のドラフトGitHub Releaseのインストーラで実機検証する予定。

## 4. 後続タスクの切り出し

- [ ] 4.1 メジャーバージョンアップが必要な依存(`recharts` 2→3, `shiki` 3→4, `streamdown` 1→2, `lucide-react` 0.x→1.x, `typescript` 5→6, `vite` 7→8, `@vitejs/plugin-react` 4→6, `@types/node` 24→26)を、別のOpenSpec変更として起票するかどうかユーザーに確認する。
  - 未実施(本会話内では確認していない)。
