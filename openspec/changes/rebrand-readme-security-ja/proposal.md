## Why

`README.md` と `SECURITY.md` は、fork元である OSS プロジェクト「Pluely」の内容がそのまま残っている。英語であることに加え、商用マーケティング文言(寄付ボタン、作者個人のSNS/雇用勧誘リンク、`pluely.com` へのダウンロードバッジ、ライセンス販売の訴求)や、`docs/仕様/要求仕様書.md` の倫理方針(8.6節: 「検知されない」「隠れて使える」ことを価値として訴求しない)に反するステルス訴求(Invisibility Mode の煽り文句など)が含まれている。本プロジェクトは Interview-Pilot という個人利用前提の面接支援アプリであり、READMEとSECURITY.mdはこの実態と方針に合わせて日本語で書き直す必要がある。

## What Changes

- `README.md` を全面的に日本語で書き直す。タイトル・バナー・バッジ・本文構成を Interview-Pilot(面接支援アプリ)向けに再編する。
- Pluely upstream 向けの商用マーケティング要素(寄付/雇用勧誘バッジ、作者個人SNSリンク、`pluely.com` ダウンロードリンク・バッジ、ライセンス販売訴求、"$15M company" 等の対Cluely比較煽り文句)を削除する。
- `docs/仕様/要求仕様書.md` 8.6節の倫理方針に反する「ステルス」「検知されない」訴求表現を、面接準備・回答補助を目的とした中立的な説明に置き換える。
- 実際に動作する機能(システム音声取得、音声入力、スクリーンショット、ファイル添付、ダッシュボード、チャット履歴、システムプロンプト、各種設定、Dev Space でのカスタムAI/STTプロバイダ設定)の説明は日本語で維持しつつ、Interview-Pilot の実態(個人利用前提、ローカルSTT/ローカルLLM志向、配布・商用化は現時点で想定しない)に沿った文言に調整する。
- Contributing セクションのうち、Pluely運営(バウンティ制度、`support@pluely.com` 宛メール、`pluely.com/contribute`)に依存する内容は、個人プロジェクトの実態に合わせて簡素化または削除する。
- `SECURITY.md` を日本語化し、`github.com/iamsrikanthnani/pluely` への参照や `support@pluely.com` など upstream 固有の連絡先を、本リポジトリ(`youfuku-sg/Interview-Pilot`)向けの内容に置き換える。
- Acknowledgments(Tauri, shadcn/ui, OpenAI等の技術的謝辞)は日本語化のうえ概ね維持する。fork元としての Pluely / Cluely への言及は「本プロジェクトの技術的基盤」という位置づけに整理し、過度な比較煽りは削除する。
- **BREAKING**: なし(ドキュメントのみの変更)。ただし、README内の外部リンク・バッジのうち upstream Pluely 固有のものは意図的に削除するため、これまでREADMEに依存していた外部参照(もしあれば)は失われる。

## Capabilities

### New Capabilities
- `project-documentation`: README.md / SECURITY.md が満たすべき内容要件(言語、ブランディング、倫理方針との整合性)を定義する。

### Modified Capabilities
(なし — `openspec/specs/` にREADME/SECURITYの内容を規定する既存capabilityはない)

## Impact

- 対象ファイル: `README.md`, `SECURITY.md`
- 対象外: `docs/仕様/**`(既に日本語かつプロジェクト固有内容のため対象外)、`CHANGELOG.md`(既に日本語運用中、今回のスコープ外)
- コード・ビルド・実行時動作への影響なし
- `images/app-image.png` など既存アセットの扱いは維持(バナー画像は流用可否のみ確認)
