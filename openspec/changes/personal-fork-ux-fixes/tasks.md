## 1. ウィンドウドラッグのライセンスゲート解除

- [x] 1.1 `src/components/DragButton.tsx` から `hasActiveLicense` による分岐（ライセンス必須ポップオーバー）を削除し、常に `data-tauri-drag-region={true}` を持つボタンのみをレンダリングする
- [x] 1.2 上記の変更に伴い不要になったインポート（`Popover`, `PopoverContent`, `PopoverTrigger`, `GetLicense`, `useApp`の`hasActiveLicense`, `isOpen`関連の`useState`/`useEffect`/`useWindowResize`の扱い）を整理する
- [x] 1.3 `npm run typecheck` と `npm run lint` を実行し、エラーがないことを確認する
- [ ] 1.4 アプリを起動し、メインオーバーレイのグリップハンドルをマウスでドラッグしてウィンドウが移動できることを目視確認する
- [ ] 1.5 グリップハンドルをクリックしてもライセンス訴求ポップオーバーが表示されないことを確認する

## 2. 有料機能ロックの解除（製品機能を常時利用可能にする）

方針: `hasActiveLicense`分岐を削除し、ロック時ではなく「ライセンスあり」側の挙動のみを残す（DragButtonと同じやり方）。バックエンド(Rust)には触れない。

- [x] 2.1 `src/pages/settings/components/Theme.tsx` — テーマ/透過度コントロールのロック解除（`opacity-60 pointer-events-none`と「(この機能の利用には有効なライセンスが必要です)」文言を削除）
- [x] 2.2 `src/pages/responses/index.tsx` / `ResponseLength.tsx` / `LanguageSelector.tsx` / `AutoScrollToggle.tsx` — 「🔒 プレミアム機能」バナーと各コントロールの`disabled`/早期returnを削除
- [x] 2.3 `src/pages/system-prompts/PluelyPrompts.tsx` — カードのロックアイコン・`opacity-60`・クリック時の早期returnを削除
- [x] 2.4 `src/pages/system-prompts/Generate.tsx` — 「Generate」ボタンを常時表示する（ライセンス案内メッセージへの差し替えを削除)
- [x] 2.5 `src/hooks/useMenuItems.tsx` — サイドバー「サポートに問い合わせ」メニュー項目を常時表示する
- [x] 2.6 `src/pages/screenshot/components/ScreenshotConfigs.tsx` + `src/hooks/useSettings.ts`(`handleScreenshotEnabledChange`) + `src/hooks/useChatCompletion.ts`(:595-619) — 「範囲選択モード」の選択・実行を常時許可する
- [x] 2.7 `src/pages/chats/components/View.tsx` — チャット入力エリア全体のオーバーレイバナーと各コントロールの`disabled={!hasActiveLicense}`を削除
- [x] 2.8 `src/pages/app/components/speech/index.tsx`(:229-238) — 音声キャプチャポップオーバー内のスクリーンショット添付ボタンを常時表示する
- [x] 2.9 `src/pages/shortcuts/components/shortcuts/ShortcutManager.tsx` + `src/lib/storage/shortcuts.storage.ts`(`getAllShortcutActions`) — ショートカットの再割り当て（キー変更）ロックを解除する。**`move_window`自体はRust側`LicenseState`で別途ゲートされているため対象外**（タスク4で現状維持と明記）

## 3. ライセンス購入・登録UIの非表示化

方針: 支払いバックエンドが存在しないため導線自体を削除する。Rust側コマンド(`activate_license_api`等)やユーティリティ関数(`shouldUsePluelyAPI`等)自体は削除せず、UIからの参照のみを外す(到達不能なデッドコードとして残す)。

- [x] 3.1 `src/components/GetLicense.tsx` の呼び出し箇所をすべて削除する(2.1〜2.9および3.2〜3.3の対応時に併せて除去)
- [x] 3.2 `src/components/Promote.tsx`(紹介・クーポン販促カード)の描画箇所を削除する(調査の結果、既存コードベースでは元々どこからも描画されておらず、対応不要と確認済み)
- [x] 3.3 `src/pages/dashboard/components/PluelyApiSetup.tsx` — ライセンスキー入力・有効化/無効化・「Pluely API を有効化」トグル・Pluelyホストモデル選択のセクションをUIから削除する(全セクションが削除対象だったため、コンポーネントファイル自体とダッシュボードからの呼び出しを削除)
- [x] 3.4 `src/pages/dashboard/index.tsx` — ヘッダーの`GetLicense` CTA(`rightSlot`)と「Pluelyライセンスで、より高速な応答・迅速なサポート・プレミアム機能を利用できます。」という説明文を削除する。アクティビティ表示は取得先バックエンドが存在しないため、空表示のままで可(データ移行は行わない)
- [x] 3.5 上記3.1〜3.4により不要になったインポート・propsを整理し、`npm run typecheck` / `npm run lint`でエラーがないことを確認する

## 4. 対象外として明記する項目（システムに絡むため変更しない）

- [x] 4.1 `src-tauri/src/shortcuts.rs`の`LicenseState`・矢印キーでの`move_window`ショートカットのライセンスゲートには触れない。現状(非機能のまま)を維持することをdesign.mdに明記済み — このタスクは「変更しないことの確認」のみ(コードレビュー時に誤って触れていないかを確認する)
- [x] 4.2 `src-tauri/src/activate.rs`・`src-tauri/src/api.rs`のPluely決済/プロキシ関連コマンド、`src-tauri/build.rs`には触れない(同上、確認のみ)

## 5. 今後の個人利用フォーク向けUX要望（バックログ）

<!--
新しい要望が出るたびに、この下に "## 6. <要望名>" のように新しい番号付きグループとタスクを追記していく。
このセクション自体はチェックボックスを持たない索引であり、実装対象タスクではない。
-->

(現時点で追加要望なし)
