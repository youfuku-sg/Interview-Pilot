## Context

Interview-Pilot の MVP は日本語面接支援を主用途とし、音声認識はローカル STT（Whisper / faster-whisper / whisper.cpp など）を OpenAI 互換 `/v1/audio/transcriptions` 形式で使う方針である。現状の STT 接続は `src/lib/functions/stt.function.ts` が保存済み provider の curl 文字列を `@bany/curl-to-json` で解析し、multipart/form-data またはバイナリ/JSON リクエストへ変換して送信する。

Whisper 系 STT は `language` を指定しない場合に自動言語判定を行う。短い日本語では日本語として認識されても、長い発話では英語へ誤判定されることがあるため、個人利用前提では日本語固定を既定動作にする。

## Goals / Non-Goals

**Goals:**
- STT リクエストが日本語認識を明示するようにする。
- OpenAI 互換の multipart/form-data STT では `language=ja` を送る。
- Google/Azure など言語コード形式が異なる既存テンプレートも日本語向けにする。
- 既存のカスタム provider 抽象（curl + responseContentPath）を維持する。
- 既存 curl に `language` / `languageCode` が明示されている場合は、ユーザーの明示設定を尊重できる実装にする。

**Non-Goals:**
- 実行時の言語切り替え UI は追加しない。
- 多言語 STT の精密な provider 別設定は追加しない。
- Tauri/Rust 側に provider 固有の分岐や新規プラグインを追加しない。
- クラウド STT を既定経路にする変更は行わない。

## Decisions

1. **OpenAI 互換 multipart/form-data には STT 関数側で `language=ja` を補完する。**
   - Rationale: ユーザーが設定済みのローカル STT curl を毎回編集しなくても、既定で日本語固定になる。
   - Alternative considered: テンプレートだけ変更する。既存プロバイダーや手動入力済み curl には効かないため不十分。
   - Implementation direction: `fetchSTT` の form 生成時、formData 由来のキーに `language` がなければ `form.append("language", "ja")` を追加する。

2. **既存 curl に言語指定がある場合は上書きしない。**
   - Rationale: ユーザーが `language=ja` 以外を明示した既存設定を破壊しない。また provider によって `languageCode` や URL query を使う場合がある。
   - Alternative considered: 全リクエストを無条件に `ja` へ上書きする。個人利用の目的には合うが、既存 provider 設定の期待を壊しやすい。
   - Implementation direction: form key を大文字小文字非依存で確認し、`language` が存在する場合は補完しない。JSON/URL query 形式はテンプレート更新を中心に扱う。

3. **同梱 STT provider テンプレートと Dev Space の placeholder は日本語向けに更新する。**
   - Rationale: 新規設定時に英語指定テンプレートをコピーしてしまう事故を防ぐ。
   - Alternative considered: 実行時補完のみ。設定画面上の例が英語のままだと、原因調査時に混乱しやすい。
   - Implementation direction: OpenAI/Groq 互換例は `-F language=ja`、Google は `languageCode: "ja-JP"`、Azure query は `language=ja-JP`、Speechmatics は `language: "ja"` にする。

## Risks / Trade-offs

- [Risk] Provider が `language` フィールドを受け付けない場合、multipart/form-data への補完でエラーになる可能性がある。 → Mitigation: 既存 curl に言語指定がある場合は上書きせず、問題が出る provider では明示設定で調整できる余地を残す。
- [Risk] バイナリ/JSON 型 provider では汎用的な補完が難しい。 → Mitigation: 今回の主対象である OpenAI 互換ローカル STT を優先し、その他はテンプレートを日本語化する。
- [Risk] 日本語以外の音声を試す場合の認識精度が下がる。 → Mitigation: 本プロジェクトの現行用途は日本語個人利用であり、多言語切り替えは Non-Goal として別変更に分離する。

## Migration Plan

1. `fetchSTT` の multipart/form-data 組み立てに `language=ja` の補完を追加する。
2. 同梱 STT provider テンプレートと STT 設定 UI placeholder を日本語向けに更新する。
3. 既存の STT 表示/AI 処理フローに影響がないことを typecheck/build で確認する。
4. 必要に応じて、既に保存済みのカスタム STT curl はユーザーが `-F language=ja` を追記できることを設定 UI で確認する。

Rollback は、`language=ja` 補完とテンプレート変更を戻せばよい。データベースや設定スキーマの移行は不要。

## Open Questions

- 将来的に日本語固定ではなく「既定は日本語、詳細設定で変更可」にするかは別途検討する。
