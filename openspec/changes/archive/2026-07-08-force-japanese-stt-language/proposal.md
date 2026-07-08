## Why

日本語の音声でも、発話が長くなると STT 側の自動言語判定により英語として文字起こしされることがある。Interview-Pilot は当面ユーザー本人の日本語面接支援に使うため、STT の認識言語を日本語に固定して誤認識を減らす。

## What Changes

- STT リクエストでサポートされる言語指定を日本語（`ja` / `ja-JP` 相当）に固定する。
- OpenAI 互換のローカル STT（Whisper / faster-whisper / whisper.cpp など）では、multipart/form-data に `language=ja` を含める。
- 既存の curl + responseContentPath によるカスタムプロバイダー機構は維持し、プロバイダー固有の新規バックエンド分岐は追加しない。
- STT 設定 UI のテンプレート/説明を、日本語固定で使う前提に更新する。
- **BREAKING**: 既定動作として STT は日本語認識を優先する。日本語以外の音声を主用途にする設定は今回の対象外とする。

## Capabilities

### New Capabilities
- `stt-transcription-language`: STT の認識言語を日本語に固定し、長い発話でも英語へ自動判定されないようにする挙動を定義する。

### Modified Capabilities

## Impact

- Affected code: `src/lib/functions/stt.function.ts`, `src/config/stt.constants.ts`, `src/pages/dev/components/stt-configs/CreateEditProvider.tsx`
- Affected behavior: システム音声および音声入力から STT プロバイダーへ送るリクエスト内容
- Dependencies: 追加依存なし。既存の curl 解析・カスタム STT プロバイダー機構を利用する。
- Testing: OpenAI 互換 STT のリクエストに `language=ja` が含まれること、既に明示された日本語指定を壊さないこと、既存の文字起こし表示フローが維持されることを確認する。
