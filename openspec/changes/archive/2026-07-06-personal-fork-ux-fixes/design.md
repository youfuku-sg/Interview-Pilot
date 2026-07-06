## Context

`src/components/DragButton.tsx` は、メインオーバーレイウィンドウ内にグリップアイコンのボタンを描画するコンポーネントである。その挙動は `hasActiveLicense`(`useApp()` 経由、`src/contexts/app.context.tsx:134` の `useState<boolean>(false)` が発生元で、このフォークには値を `true` にするコードパスが存在しない)によって分岐している。

- `hasActiveLicense === false`(このフォークでは常にこちら): 「この機能を使用するには有効なライセンスが必要です」という文言と `GetLicense` CTA を含む `Popover` を描画する。ボタン自体には `data-tauri-drag-region` が付いていないため、このハンドルからウィンドウをドラッグすることはできない
- `hasActiveLicense === true`(このフォークではデッドコード): `data-tauri-drag-region={hasActiveLicense}` を持つ通常のボタンを描画する。これは Tauri v2 の仕組みで、DOM要素に `data-tauri-drag-region="true"` を付けることでOSネイティブのウィンドウドラッグハンドルになる

ウィンドウ設定(`src-tauri/tauri.conf.json`)は `decorations: false` になっており、OSのタイトルバーが存在しないため、このアプリ内ドラッグハンドルがウィンドウを移動させる唯一の手段になっている。これが機能しない場合、ウィンドウは起動時の位置(画面上部中央)に固定されたままになる。

なお `src/hooks/useWindow.ts:39` には、既に汎用的なドラッグ領域判定処理(`isDragRegion = target.closest('[data-tauri-drag-region="true"]')`)があり、これは `hasActiveLicense` を直接見るのではなく DOM属性を見て動作している。そのため `DragButton.tsx` だけを修正すれば十分であり、`useWindow.ts` 側の変更は不要である。

## Goals / Non-Goals

**Goals:**
- メインオーバーレイのグリップハンドルが、`hasActiveLicense` に関わらず常にドラッグ可能であること
- この特定のコントロールから、存在しない購入フローを宣伝する「ライセンス必須」ポップオーバー/CTAを削除すること
- 変更を `DragButton.tsx` に最小限・局所的にとどめること。`hasActiveLicense` の状態管理そのものには触れない。他に約40箇所の参照元があり、このタスクの対象外であるため

**Non-Goals:**
- ウィンドウの装飾(chrome)・デコレーション・リサイズ挙動を変更すること
- (以下の「ライセンス課金撤去」セクションにより上書きされる — 他の `hasActiveLicense` 参照箇所は、この同じ change 内で明示的に追跡される2件目の要望として、今や対象範囲に含まれる。将来の未定バックログとして放置されるものではない)

## ライセンス課金の撤去(この change 内の2件目の要望)

### Context

コードベース全体の棚卸し(タスク履歴・PRでの議論を参照)の結果、フロントエンドの約19ファイルで `hasActiveLicense` によるゲートが見つかった。加えて、Rust/Tauri側にも独立したライセンスゲートが存在する。

- **フロントエンドの機能ゲート**(`hasActiveLicense` を直接参照): テーマ/透過度(`Theme.tsx`)、応答の長さ・言語・自動スクロール(`responses/index.tsx`、`ResponseLength.tsx`、`LanguageSelector.tsx`、`AutoScrollToggle.tsx`)、Pluelyプロンプトプリセット(`PluelyPrompts.tsx`)、AIプロンプト生成(`Generate.tsx`)、サイドバーのサポートメニュー項目(`useMenuItems.tsx`)、スクリーンショット範囲選択モード(`ScreenshotConfigs.tsx`、`useSettings.ts`、`useChatCompletion.ts`)、ダッシュボードのアクティビティ表示+CTA(`dashboard/index.tsx`)、「Pluely API 有効化」トグル(`PluelyApiSetup.tsx`)、チャット入力エリア全体(`chats/components/View.tsx`)、音声ポップオーバー内のスクリーンショット添付ボタン(`speech/index.tsx`)、ショートカット再割り当て(`ShortcutManager.tsx`、`shortcuts.storage.ts`)
- **ライセンス購入・登録UI**(機能ゲートではなく、課金導線そのもの): `GetLicense.tsx`(決済URLへのボタン。上記のほとんどでCTAとして使われている)、`Promote.tsx`(未ライセンスユーザーに表示される紹介・クーポン販促カード)、および `PluelyApiSetup.tsx` 内のライセンスキー入力・有効化/無効化・モデル選択セクション
- **バックエンド(Rust)側のライセンスゲート**(フロントエンドのフラグとは独立): `src-tauri/src/shortcuts.rs` は独自の `LicenseState`(フロントエンドから `set_license_status` 経由で同期される)を持っており、無効時には矢印キーの `move_window` ショートカットを黙って no-op にし、OSレベルへの登録自体もスキップする。`src-tauri/src/activate.rs` と `src-tauri/src/api.rs` の一部は、Pluelyの決済バックエンドに対する実際のチェックアウト/有効化/検証/プロキシ呼び出しを実装しているが、このフォークではそのバックエンドを一切設定していない(`PAYMENT_ENDPOINT`/`API_ACCESS_KEY` は未設定。これは `github-actions-installer-release` change で、これらを注入するCIステップを意図的に削除したことで確認済み)

上記の棚卸しを見た上でのユーザーの明示的な指示: ライセンス購入・登録の導線は、外科的に削除するのではなく、**非表示・使用不能な状態のまま残る**のでよい。また「システムに絡む」箇所(グローバルショートカット登録・バックエンドの決済プロキシ配管)を無理に開放する必要はない。個人利用・非商用のフォークにおいて、グローバルショートカット登録や決済プロキシのコードパスに手を入れるリスクに見合うだけの実益がないため、非機能のまま残すことは許容できる結果である。

### Goals

- 上記に挙げた、フロントエンドで `hasActiveLicense` によりゲートされている**製品機能**はすべて、常にライセンスが有効であるかのように動作すること(完全に利用可能で、暗転・ロック・早期returnがないこと)
- ライセンス購入・登録の**UI導線**(`GetLicense` CTAのレンダリング、`Promote.tsx`、`PluelyApiSetup.tsx` のライセンスキーセクション、ダッシュボードのライセンスCTA)はすべて、UIから削除または非表示にすること。このフォークが動かしていない決済バックエンドへの行き止まりになっているため
- Rust/Tauriバックエンドのコードは変更しないこと。矢印キー `move_window` ショートカットの `LicenseState` ゲート、および Pluely SaaS プロキシバックエンド(`activate.rs`、`api.rs` の該当部分)は現状のまま残す。このフォークでは既に非機能であり、システムレベルの登録コードに触れることなく要件を満たせる

### Non-Goals

- `src-tauri/src/shortcuts.rs`、`src-tauri/src/activate.rs`、`src-tauri/src/api.rs`、`src-tauri/build.rs` の変更
- 矢印キー `move_window` ショートカットの復旧・修正(この change の要望1で解除されるマウスドラッグが、既に本質的なニーズをカバーしている)
- `app.context.tsx` 自体の `hasActiveLicense` の状態管理・配管や、Rustの `secure_storage`/`validate_license_api` 等のコマンドを削除すること。ゲート(参照箇所)を取り除くだけで十分であり、休眠状態のフラグやバックエンドコマンドは、より広範なリファクタのリスクを避けるため未使用のまま残してよい
- 「Pluely API」の概念・トグルの裏側にある関数(`shouldUsePluelyAPI`、`fetchPluelyAIResponse`、`fetchPluelySTT`)のリネーム・削除。有効化のためのUI入口だけを削除し、関数自体は到達不能なデッドコードとして残す(削除はしない)。影響範囲を限定するため

### Decisions

**決定: 各フロントエンドの機能ゲートについて、`hasActiveLicense` の条件分岐を削除し、「ライセンスあり」側の挙動だけを残す**(要望1の `DragButton.tsx` と同じやり方を踏襲する)。対象: `Theme.tsx`、`responses/index.tsx` とその3つのサブコンポーネント、`PluelyPrompts.tsx`、`Generate.tsx`、`useMenuItems.tsx`、`ScreenshotConfigs.tsx` + `useSettings.ts` + `useChatCompletion.ts`、`View.tsx`、`speech/index.tsx`、`ShortcutManager.tsx`(再割り当てのみ)+ `shortcuts.storage.ts` の `getAllShortcutActions`。
検討した代替案: 各呼び出し箇所を編集する代わりに、`const hasActiveLicense = true` という単一の定数/フラグを導入する案 — 却下。約19ファイルが「嘘の値」に黙って依存し続ける状態になり、誤って元に戻されやすく、それでもなお削除が必要な `GetLicense`/ロックアイコンのデッドUI分岐が残ってしまうため

**決定: `dashboard/index.tsx` のアクティビティ取得は、実質的にゲートされたままにする。取得先がこのフォークに存在しないPluelyバックエンドのエンドポイントを指しているため。ただし「ライセンスが必要」という見せ方は取り除く。** `get_activity`(Rust)はPluelyがホストする利用状況エンドポイントを呼び出すものであり、代わりに表示できるローカルなアクティビティ源がないため、そもそも「解除」できるものがない。ページヘッダーの `GetLicense` CTA と「Pluelyライセンスで...」というマーケティング文言を削除し、アクティビティ表示部分は空表示のままにするか、簡単な説明文に差し替える。実際にデータが表示されるようになるかのように見せかけることはしない

**決定: ライセンス購入・登録UIは、暗転させたままにするのではなく、完全に削除する。** `GetLicense.tsx` の利用箇所、`Promote.tsx`、および `PluelyApiSetup.tsx` 内のライセンスキー入力・有効化/無効化・決済・モデル選択ブロックは、それぞれの親コンポーネントのレンダーツリーから削除する。これはUIレベルの削除(JSXと、今や不要になったハンドラ/importの削除)であり、裏側のRustコマンドや `pluely.api.ts` 自体の削除ではない。上記のNon-Goalsの通り、バックエンドの配管はそのまま残り、UIから参照されなくなるだけである

**決定: `src-tauri/` 配下には一切手を入れない。** ユーザーの明示的な指示により、システムレベル/グローバルショートカットおよび決済バックエンドのコードには触れない。矢印キーの `move_window` ショートカットは(現状と変わらず)非機能のままとなる。これはこの change で修正すべきバグではなく、受け入れ済みの意図的なギャップである

## Risks / Trade-offs

## Decisions

**決定: 常に通常のドラッグ可能なボタンを描画し、`DragButton.tsx` 内のライセンスゲート分岐を削除する。**
デフォルト値を変えたり、このフォーク用に特別扱いをしたりするのではなく、`if (!hasActiveLicense) { ... }` の分岐そのものを削除し、コンポーネントが `data-tauri-drag-region={true}` を持つ単一の無条件レンダーパスだけになるようにする。これは `CLAUDE.md`/`pluely-cleanup-checklist` が示す「Pluely時代のライセンスゲートは回避するのではなく削除する」という方針に直接合致しており、決して `true` にならない `hasActiveLicense` を参照する死んだ条件分岐コードを残さずに済む。
検討した代替案: 分岐はそのまま残し、両方のケースで `data-tauri-drag-region={true}` を強制する案 — 却下。実質的に到達しないポップオーバーや、未使用のimport(`Popover`、`GetLicense`)という紛らわしいデッドコードが残り、将来読む人がその理由を考え込むことになるため

**決定(要望1に限る): ドラッグボタンの修正にあたっては、`hasActiveLicense` 自体や他の参照箇所には触れない。**
要望1の時点では、他の40箇所以上の参照箇所は対象外だった。要望2(上記「ライセンス課金の撤去」)により、フロントエンドの参照箇所は今や明示的に対象範囲に入っている。この決定はあくまで要望1の差分を最小限に保つためのものであり、それらの参照箇所を永久にロックしたままにするという意味ではない

## Risks / Trade-offs

- [リスク] `DragButton.tsx` 内で `Popover`/`GetLicense` のimportを使わなくなった際、整理し忘れると未使用importが残る → 対策: 同じ編集の中で未使用importを削除する。`npm run lint` / `npm run typecheck` で確認する
- [リスク] 他のコードが「未ライセンス時は `DragButton` が操作不能/非表示である」ことを前提にしている可能性がある(例: スクリーンショットテストやレイアウト上の想定) → 対策: 編集前に `DragButton` の利用箇所を grep し、1つのオーバーレイレイアウトでのみ描画されていることを確認する。変更後は実際に起動しているアプリでオーバーレイを目視確認する(UI変更は実機で確認するという本リポジトリの慣習に従う)
- [トレードオフ] これにより upstream の Pluely から小さいが意図的な挙動の差異が生まれる(ライセンスなしでウィンドウがドラッグ可能になる) — `CLAUDE.md` により許容される。このフォークは「サードパーティへの再配布を予定しない」ため、upstreamの収益化モデルに縛られない
- [リスク] 約19ファイルにわたる `hasActiveLicense` 条件分岐の削除は機械的な繰り返し作業であり、一貫性を欠きやすい(未使用importの消し忘れ、`isLocked` 系propsの残留など) → 対策: タスクリストに沿ってファイルごとに進め、最後にまとめてではなく、各グループの後に `npm run typecheck` + `npm run lint` を実行する
- [リスク] `PluelyApiSetup.tsx` のライセンスセクションを削除すると、`pluelyApiEnabled` が中途半端な状態になる可能性がある(UIからトグルは消えるが、裏側の `localStorage` フラグやRustのフォールバック処理は残り続ける) → 対策: トグルUIが無くなるため、今後通常の利用を通じて `pluelyApiEnabled` が再び `true` になることはない。この change 以前から `true` になっていた既存値は、この change でマイグレーションすべき対象ではなく、既存の想定外ケースとして扱う(Non-Goalsの通り、データマイグレーションは行わない)
- [トレードオフ] `src-tauri/` 配下に触れないことで、矢印キー `move_window` ショートカットと Pluely SaaS プロキシバックエンドは、Rustバイナリ内に存在はするが恒久的に到達不能なデッドコードとして残る — ユーザーの明示的な指示により許容する。個人フォークにおいて、グローバルショートカット登録や決済プロキシのコードパスに手を入れる、より高いリスクを避けるため

## Migration Plan

データマイグレーションはなし。通常のフロントエンド変更として進める。
1. 上記の決定に沿って `DragButton.tsx` を編集する
2. `npm run typecheck` と `npm run lint` を実行する
3. 実際に起動しているアプリで目視確認する: 起動し、グリップハンドルでウィンドウがドラッグできること、ライセンスポップオーバーが表示されないことを確認する
4. 通常の `git revert` 以上のロールバック上の懸念はない

## Open Questions

- `GetLicense`/ライセンスキーUIをプロジェクト全体から削除すべきか、それとも他の画面(例: 将来の非商用「設定プロファイル」的な概念が再利用する場合に備えたno-opのプレースホルダーとして)に意図的に残すべきか? → 保留。ここではスコープ外とし、この change 内の将来のバックログタスク、または専用のクリーンアップ change の候補とする
