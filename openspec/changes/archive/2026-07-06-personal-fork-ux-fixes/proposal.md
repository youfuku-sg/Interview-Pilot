## Why

これは Pluely の個人利用フォークであり(`CLAUDE.md` 参照)、ライセンスサーバーも有料プランも存在しない。しかし継承したUIの多くは、いまだに `hasActiveLicense` というフラグで挙動をゲートしたままになっている。このフラグはデフォルトで `false` であり、このフォークにはライセンス有効化フローが存在しないため、決して `true` になることがない。その結果、メインオーバーレイウィンドウをマウスでドラッグ移動する機能をはじめとする基本的なUX動作が、静かに、かつ恒久的に無効化されており、UIは代わりに、このフォークには存在しない「ライセンス購入」フローへユーザーを誘導し続けている。

この change は、日々の利用の中で見つかった「個人フォーク向けUXの細かな不満点(papercuts)」を継続的に記録していくバックログである。項目が見つかるたびに新しい change を起票するのではなく、この change の中にタスクとして追記し、順次実装していく。

## What Changes

- メインオーバーレイウィンドウを、`hasActiveLicense` の値に関わらずマウスでドラッグ移動できるようにする。`src/components/DragButton.tsx` の `data-tauri-drag-region` をライセンスフラグから切り離す
- ドラッグハンドル上の「有効なライセンスが必要です」ポップオーバー/CTA(行動喚起ボタン)を削除する。このフォークには存在しない購入フローを指しているため
- **有料機能・課金導線をすべて解除・撤去する**(この change 内の2件目の要望): `hasActiveLicense` でゲートされている全ての製品機能を、常にライセンス有効であるかのように動作させる。また、このフォークでは設定されない決済バックエンドを指す、ライセンス購入・Pluelyホストサービスへの導線(`GetLicense` CTA、`Promote.tsx`、`PluelyApiSetup.tsx` のライセンスキー・決済セクション、ダッシュボードのライセンスCTA)を削除・非表示化する
  - **BREAKING(意図的な破壊的変更)**: これまでライセンスでロックされていた機能——テーマ/透過度コントロール、応答の長さ・言語・自動スクロール設定、チャット入力エリア、Pluelyプロンプトプリセット、AIプロンプト生成、スクリーンショット範囲選択モード、ショートカット再割り当て、サイドバーのサポートメニュー項目、音声ポップオーバーのスクリーンショット添付ボタン——が無条件に利用可能になる
  - 明示的に**対象外**とする項目: OSレベルのシステム登録に絡んでいて、Rust/Tauriバックエンド側でゲートされている箇所。具体的には、矢印キーの `move_window` ショートカットにある `LicenseState` ゲート(`src-tauri/src/shortcuts.rs`)、および休眠状態の Pluely SaaS APIプロキシバックエンド(`src-tauri/src/activate.rs`、`src-tauri/src/api.rs`)を指す。ユーザーの指示により、これらは(非表示・非機能のまま)現状維持でよいこととする。グローバルショートカット登録や決済プロキシのバックエンドコードに手を入れることは、個人利用フォークにおいて既に到達不能なデッドエンドと化しているこれらの箇所に対しては、得られる利益に比べてリスクが大きすぎるため

## Capabilities

### New Capabilities
- `personal-fork-ux`: 個人利用フォーク固有のUX挙動。upstream の Pluely が持つ「ライセンス制限付き」の挙動から意図的に逸脱する。まずは無条件のウィンドウドラッグから着手する
- `license-paywall-removal`: この個人利用・ライセンスサーバー無しのフォーク向けに、Pluely由来のライセンス課金システムを解除・撤去する。ロックされている機能の解除と、購入・ライセンス登録UIの非表示化の両方をカバーする。一方で、システムレベル(Rustのグローバルショートカット、SaaSプロキシバックエンド)のゲートには明示的に触れない

### Modified Capabilities
(なし — ウィンドウ挙動やライセンス関連挙動を現在カバーしている `openspec/specs/` 内のcapabilityは存在しない)

## Impact

- 影響コード(ドラッグ修正分): `src/components/DragButton.tsx`、`src/contexts/app.context.tsx`(`hasActiveLicense` の発生元)、および同ファイル内で使われている `GetLicense` コンポーネントの利用箇所
- 影響コード(課金撤去分、フロントエンドのみ): `src/components/Promote.tsx`、`src/components/GetLicense.tsx`(利用箇所を削除。コンポーネント自体は未使用のまま残る可能性あり)、`src/pages/settings/components/Theme.tsx`、`src/pages/responses/index.tsx` + `ResponseLength.tsx` + `LanguageSelector.tsx` + `AutoScrollToggle.tsx`、`src/pages/system-prompts/PluelyPrompts.tsx`、`src/pages/system-prompts/Generate.tsx`、`src/hooks/useMenuItems.tsx`、`src/pages/screenshot/components/ScreenshotConfigs.tsx`、`src/hooks/useSettings.ts`、`src/hooks/useChatCompletion.ts`、`src/pages/dashboard/index.tsx`、`src/pages/dashboard/components/PluelyApiSetup.tsx`、`src/pages/chats/components/View.tsx`、`src/pages/app/components/speech/index.tsx`、`src/pages/shortcuts/components/shortcuts/ShortcutManager.tsx`、`src/lib/storage/shortcuts.storage.ts`
- 明示的に対象外: `src-tauri/src/shortcuts.rs`(`LicenseState`、`move_window` ゲート)、`src-tauri/src/activate.rs`、`src-tauri/src/api.rs` のPluelyプロキシエンドポイント、`src-tauri/build.rs` — 現状(休眠・非機能)のまま維持する
- データモデル・マイグレーションへの影響なし
