## 1. 準備

- [ ] 1.1 `README.md` の各セクションを、維持/日本語化/削除/書き換えのいずれにするか一覧化する(design.md の Decisions を土台にする)。
- [ ] 1.2 `src/pages` 配下の実際のUI・機能(dashboard, chats, system-prompts, settings, audio, screenshot, shortcuts, dev)と、README「Features」「Pluely Dashboard」章の記述を突き合わせ、実装と乖離している記述を洗い出す。
- [ ] 1.3 `images/app-image.png` を確認し、バナー画像として流用するか、セクションごと削除するか判断する。

## 2. README.md 書き直し

- [ ] 2.1 タイトル・バナー・バッジ(Open Source / Tauri / React / License のみ維持し、寄付・採用・pluely.com系バッジは削除)を Interview-Pilot 向けに書き換える。
- [ ] 2.2 冒頭の製品紹介文を、Cluely対抗煽りを排し、面接支援アプリとしての説明に書き換える。
- [ ] 2.3 「Download」章(pluely.com/GitHub Releaseバッジ)を削除し、必要であれば `docs/仕様/ブランチ・リリース戦略.md` に沿ったビルド・入手方法の説明に置き換える。
- [ ] 2.4 「Ultra Lightweight」「Pluely vs Original Cluely」比較表章を削除する。
- [ ] 2.5 「Features」章(Invisibility Mode, System Audio Capture, Voice Input, Screenshot Capture, File Attachments)を日本語化し、ステルス訴求表現を要求仕様書8.6節に沿った中立的な説明へ言い換える。
- [ ] 2.6 「Pluely Dashboard」章(Dashboard, Chats, System Prompts, App Settings, Responses, Screenshot Settings, Audio Settings, Cursor & Shortcuts, Dev Space)を日本語化し、見出しをInterview-Pilot向けに書き換える。ライセンスキー等、本プロジェクトに存在しない機能への言及があれば削除・修正する。
- [ ] 2.7 「Why Pluely?」章(Complete Invisibility, Privacy-First Architecture, Blazing Fast Performance, Complete Control, Always Ready)を日本語化し、マーケティング色の強い比較煽りは削除、ステルス表現は言い換える。プライバシー・パフォーマンスの事実説明は維持する。
- [ ] 2.8 「Prerequisites & Dependencies」「Installation & Setup」章を日本語化し、リポジトリURL・クローンコマンドを本リポジトリ(`youfuku-sg/Interview-Pilot`)向けに修正する。
- [ ] 2.9 「Contributing」章からバウンティ制度・`support@pluely.com`宛請求フロー・寄付/採用勧誘を削除し、個人プロジェクトとしての簡潔な開発メモに置き換える(または章自体を削除する)。
- [ ] 2.10 「License」章を日本語化する(GPL-3.0のまま)。
- [ ] 2.11 「Acknowledgments」章を日本語化し、Pluely/Cluelyへの言及は中立的なfork元表記に整理、比較煽り文句は削除する。
- [ ] 2.12 「Links」「Let's Connect」章から作者個人SNS・pluely.com/cluely.comリンクを削除し、必要な項目(本リポジトリのIssues等)のみ日本語で残す。
- [ ] 2.13 末尾の "Made with ❤️ by ..." 等、upstream作者個人へのクレジット文言を削除または本プロジェクトの実態に合わせて修正する。

## 3. SECURITY.md 書き直し

- [ ] 3.1 本文を日本語化する。
- [ ] 3.2 GitHubのprivate vulnerability reporting機能への案内リンクを、本リポジトリ(`youfuku-sg/Interview-Pilot`)の Security タブを指すよう修正する。
- [ ] 3.3 `support@pluely.com` 等upstream固有の連絡先を削除する(代替の緊急連絡先を新設する場合はユーザーに確認する)。

## 4. 検証

- [ ] 4.1 `README.md` / `SECURITY.md` 全文を通読し、upstream Pluely固有の内容(URL、メールアドレス、SNSリンク、バウンティ制度、ステルス訴求)が残っていないか grep で確認する(`pluely.com`, `srikanthnani`, `iamsrikanthnani`, `cluely.com` 等)。
- [ ] 4.2 記載した機能説明が実際のアプリの挙動と一致しているか、対応するUIコンポーネント(`src/pages/**`)を確認する。
- [ ] 4.3 `docs/仕様/要求仕様書.md` 8.6節(倫理と利用方針)に反する表現が残っていないか最終確認する。
- [ ] 4.4 README内のリンク(GitHub Issues、LICENSE、Tauri公式ドキュメント等)が実際に有効かを確認する。
