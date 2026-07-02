## Context

`README.md`(542行)と `SECURITY.md` は upstream OSS「Pluely」からforkした際の内容がそのまま残っている。README は英語で、Cluely という商用製品への対抗マーケティング、作者個人への寄付/採用勧誘、`pluely.com` への配布導線、ライセンス販売バウンティ制度など、個人利用前提の内部プロジェクトである Interview-Pilot には不要・不適合な内容を多く含む。

`docs/仕様/要求仕様書.md` は本プロジェクトの正式な要求仕様書であり、以下が明記されている:
- 個人利用前提、第三者配布・SaaS化・商用提供は現時点で想定しない(1節, 8.7節)
- 「検知されない」「隠れて使える」ことを価値として訴求しない(8.6節、倫理と利用方針)
- 「Pluely 由来の不要な analytics / license / stealth 文言の整理」が最優先タスクの一つ(13.1節)

README/SECURITYの書き直しは、この要求仕様書に定められた方針をドキュメント面で実行する作業と位置づける。

## Goals / Non-Goals

**Goals:**
- README.md / SECURITY.md を日本語化し、Interview-Pilot の実態(個人利用の面接支援デスクトップアプリ、Tauri+React、GPL-3.0、ローカルSTT/ローカルLLM志向)を正確に説明する。
- upstream Pluely 固有の商用マーケティング要素・ステルス訴求・作者個人への導線を削除する。
- 要求仕様書 8.6節の倫理方針に沿った文言に統一する。
- 実際に存在する機能(README本文の「Features」「Pluely Dashboard」章に記載の各機能)についての説明は、正確性を保ったまま日本語化・維持する。

**Non-Goals:**
- アプリの実装・機能を変更しない(ドキュメントのみ)。
- `docs/仕様/**` 配下のファイルは対象外(既に日本語かつ本プロジェクト向けに作成済み)。
- `CHANGELOG.md` の見直しは対象外(既に日本語運用中、別スコープ)。
- ロゴ・バナー画像など新規アセット制作は行わない(既存 `images/app-image.png` を流用するか、画像セクション自体を削除するかの判断のみ行う)。
- ライセンス変更(GPL-3.0のまま)は行わない。

## Decisions

- **README構成の刷新方針**: 現行の「upstream訴求 → 機能紹介 → Dashboard詳細 → Why Pluely (マーケティング) → Prerequisites → Installation → Contributing (バウンティ) → License → Acknowledgments → Links → Let's Connect」という構成のうち、マーケティング色の強いセクション(Pluely vs Cluely比較表、「Why Pluely?」章の煽り文句、Let's Connectの作者SNS、寄付/採用バッジ)は削除し、「概要 → 機能 → セットアップ → 開発 → ライセンス → 謝辞」程度のシンプルな構成に再編する。
  - 代替案: 既存の見出し構造をそのまま残し文面だけ翻訳する案も検討したが、ユーザーが明示的に「全面書き直し(構成も変更)」を選択しているため採用しない。
- **機能説明セクションの扱い**: 「Features」「Pluely Dashboard」章にある実機能の説明(システム音声取得、音声入力、スクリーンショット、ファイル添付、Chats、System Prompts、App Settings、Responses、Screenshot Settings、Audio Settings、Cursor & Shortcuts、Dev Space)は、内容として有用なため日本語訳して維持する。ただし「Pluely Dashboard」等の製品名を含む見出しは Interview-Pilot 向けに書き換える。
- **ステルス表現の言い換え**: 「Invisibility Mode」「Undetectable Everywhere」「screenshot-proof」「without anyone knowing」等の表現は、要求仕様書8.6節に基づき、「画面共有中も面接相手の画面には映り込まない補助ウィンドウ」といった中立的な機能説明に言い換える。価値訴求としての「バレない」強調はしない。
- **Contributing/バウンティ制度の扱い**: `pluely.com/contribute` のバウンティ制度と `support@pluely.com` 宛の請求フローは本プロジェクトに存在しないため全削除する。個人プロジェクトとしての簡潔な開発メモ(セットアップ手順のみ)に置き換え、外部コントリビューター向けの制度文言は設けない。
- **SECURITY.mdの扱い**: GitHubのprivate vulnerability reporting機能への案内という骨子は流用可能なため維持しつつ、リンク先を `github.com/iamsrikanthnani/pluely` から本リポジトリ(`youfuku-sg/Interview-Pilot`)に差し替え、`support@pluely.com` 等upstream固有の連絡先は削除する(個人利用前提のため、代替の緊急連絡先は設けず、GitHub上の脆弱性報告機能への案内のみとする)。
- **Acknowledgments(謝辞)は技術的謝辞のみ日本語で維持**: Tauri, shadcn/ui, tauri-nspanel, vad-react, 各AIプロバイダへの謝辞は技術的事実として残す。Cluelyへの言及は「本アプリのUIコンセプトの参考」程度の中立的な一文に圧縮し、比較煽り文句($15M company等)は削除する。

## Risks / Trade-offs

- [Risk] README刷新により、upstream Pluelyへの帰属表示(GPL-3.0上の要件ではないが、fork元への礼儀としての言及)が薄くなりすぎる可能性 → Mitigation: Acknowledgments章にPluely/Cluelyへの言及を維持し、fork元であることは明記する。
- [Risk] 機能説明の翻訳時に、実装と乖離した記述(例: 存在しないプロバイダやライセンス機能への言及)をそのまま日本語化してしまう → Mitigation: 各機能セクションを実際の `src/pages` 配下のUI([localize-ui-japanese](openspec/changes/localize-ui-japanese/)で日本語化予定の画面)と突き合わせて確認しながら記述する。
- [Risk] SECURITY.mdの連絡先を削除しすぎると、実際に脆弱性が見つかった際の報告経路が不明瞭になる → Mitigation: GitHubのprivate vulnerability reporting機能への案内は必ず残す。
- [Trade-off] 構成を大きく変えるため、upstream側の更新(Pluely本体のREADME更新)を将来的に追従・マージするのは難しくなる → 個人利用前提のforkであり、upstream追従を前提としないため許容する。

## Migration Plan

該当なし — ドキュメントのみの変更であり、データ移行やロールバック手順は不要。問題があれば当該コミットをgit revertするのみ。

## Open Questions

- `images/app-image.png` のバナー画像をそのまま流用するか、新しいスクリーンショットに差し替えるか、セクション自体を削除するか(実装時に画像内容を確認して判断)。
- README内の「Prerequisites & Dependencies」(Tauri公式ドキュメントへのリンク)は開発者向け情報として維持するかどうか(現状は維持する方向で進めるが、実装時に要確認)。
