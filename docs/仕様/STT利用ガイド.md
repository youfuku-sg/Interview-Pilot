# STT（音声文字起こし）利用ガイド

このドキュメントは、アプリのSTT機能の使い方と、ローカルSTTエンジン（whisper.cpp / faster-whisper）導入の検討記録をまとめたものです。仕様の正本は `docs/仕様/要求仕様書.md` §7.4・§7.10、実装の詳細は [local-llm-stt-integration](../../.claude/skills/local-llm-stt-integration/SKILL.md) スキルを参照してください。

## 1. STTプロバイダーの設定

1. メインのオーバーレイ画面 →「開発者スペースを開く」（または ダッシュボード → 開発者スペース、ルート `/dev-space`）を開く。
2. 「STTプロバイダー」セクションで、いずれかを選択する。
   - **組み込みのクラウドプロバイダー**を選んでAPIキーを入力する。
     一覧（`src/config/stt.constants.ts`）: OpenAI Whisper / Groq Whisper / ElevenLabs / Google / Deepgram / Azure / Speechmatics / Rev.ai / IBM Watson。
   - 「カスタムSTTプロバイダーを追加」から**curlコマンド**を貼り付けて自作プロバイダーを登録する。
     - `curl`: `{{AUDIO}}` プレースホルダーを含む文字起こしリクエストのテンプレート（必須）。
     - `responseContentPath`: レスポンスJSONから文字起こしテキストを取り出すドット/ブラケットパス（例: `text`）。
     - ストリーミングのトグルはUI上存在するが未実装（「STTプロバイダーではストリーミングに対応していません。今後対応予定です。」と表示される）。
3. APIキーはローカル保存のみで外部共有はされない。

### 仕様と実装のギャップ

`要求仕様書.md` §7.10（L272-274）は「ローカルSTT（Whisper / faster-whisper / whisper.cpp）優先、クラウドSTTはMVP対象外」と定めているが、実装済みの組み込みプロバイダー一覧は**すべてクラウドAPI**であり、ローカルSTT専用のフォームは存在しない。ローカルエンジンを使う場合は、OpenAI互換の `/v1/audio/transcriptions` エンドポイントを公開するローカルサーバーを立て、それを**カスタムプロバイダー**としてcurl登録する必要がある（§2参照）。

## 2. 使い方（メインオーバーレイ）

- メインオーバーレイ上のヘッドホン/マイクアイコンをクリック、またはグローバルショートカット **`Ctrl/Cmd+Shift+M`** でシステム音声キャプチャを開始/停止する。
- STTの対象は**システム音声（面接官側の音声）**であり、自分のマイク音声の文字起こしはMVPスコープ外（`要求仕様書.md` §7.4）。
- モードは `ModeSwitcher` で2種類切り替え可能。
  - **自動検出**（VAD）: 音声を検知すると自動で録音〜文字起こし。
  - **手動**: `Enter`/`Space`で録音開始、`Enter`（またはStop&Sendボタン）で文字起こし送信、`Escape`で破棄。
- 文字起こし結果は自動的にAI応答生成パイプライン（`fetchAIResponse`）に渡され、結果パネルに表示される。
- プロバイダー未設定の場合は「音声プロバイダーの設定が必要です」というポップアップが出る。
- ショートカットは [Shortcuts設定画面](../../src/pages/shortcuts/) からカスタマイズ可能（デフォルト: `Ctrl/Cmd+Shift+M`）。

### 実装アーキテクチャの補足

- `src-tauri/src/speaker/` はOS依存の**音声キャプチャのみ**を担当し、実際の文字起こしはフロントエンド（`src/lib/functions/stt.function.ts`）からcurlテンプレート経由でHTTPリクエストする形。Rust側にWhisperエンジンは同梱されていない。
- 仕様書が想定する「面接セッション専用画面」（質問抽出・意図分類・回答アシスト・オーバーレイ表示・事後レポート）は未実装で、現状はPluely由来の「システム音声→STT→AIチャット応答」というオーバーレイUIがそのまま使われている。

## 3. ローカルSTT（faster-whisper-server）導入検討

仕様の「ローカル優先」方針（§7.10, §8.4）に沿って、faster-whisperベースのローカルHTTPサーバーを立て、カスタムプロバイダーとして登録する計画。

### 検討したエンジン

| エンジン | 特徴 |
|---|---|
| **faster-whisper-server**（採用予定） | OpenAI互換 `/v1/audio/transcriptions` をより忠実に実装。CTranslate2ベースでCPU/GPU両対応。 |
| whisper.cpp server | C++実装で軽量・依存少なめ。エンドポイント仕様はビルドバージョンにより差異があるため要確認。 |

### 環境調査結果（2026-07-03 時点、WSL2/Ubuntu 26.04）

- Python 3.14.4 のみインストール済み。pipなし（`pip3`未検出、`python3 -m pip` も未導入）。
- faster-whisper / ctranslate2 が Python 3.14 に対応しているか未検証（対応が追いついていないリスクあり）。
- Docker DesktopはWindows側に導入済みだが、**WSL2統合が無効**（このディストロが未チェック）。
- GPU未検出（`nvidia-smi`なし）→ CPU推論想定。
- `sudo` は対話的パスワード入力が必須で、エージェントからの非対話実行は不可。

### 採用したセットアップ方針

Python環境構築（pip未導入・3.14の互換性不明）よりも、**Docker Desktop の WSL統合を有効化し、公式Dockerイメージで起動する方式**を採用した。Python環境の互換性問題を回避できるため。

faster-whisper-serverは後継プロジェクト **speaches**（`ghcr.io/speaches-ai/speaches`）に改名されており、こちらの公式イメージを使用する。

### 手順（実施済み・2026-07-03）

1. **[ユーザー操作]** Windows側 Docker Desktop → Settings → Resources → WSL Integration →「Enable integration with my default WSL distro」をオン、対象ディストロ（Ubuntu 26.04）を有効化 → Apply & Restart。
2. WSL側で `docker` コマンドが使えることを確認。

   ```bash
   docker version
   docker ps
   ```

3. CPU版speachesイメージをpull。

   ```bash
   docker pull ghcr.io/speaches-ai/speaches:latest-cpu
   ```

4. コンテナを起動（ポート8000を公開。既存のwordpress/mysqlコンテナと衝突しないことを確認済み）。モデルを永続化する名前付きボリュームと、CORS許可(`ALLOW_ORIGINS`)を付ける。

   ```bash
   docker volume create speaches-models
   docker run -d --name speaches-stt \
     -p 8000:8000 \
     -e ALLOW_ORIGINS='["*"]' \
     -v speaches-models:/home/ubuntu/.cache/huggingface \
     ghcr.io/speaches-ai/speaches:latest-cpu
   ```

   > **`ALLOW_ORIGINS`が必須な理由**: Tauriアプリの`fetchSTT`（[stt.function.ts:188](../../src/lib/functions/stt.function.ts#L188)）はURLに`http`が含まれる場合、Rust側の`tauriFetch`ではなく**ブラウザの`fetch()`**を使う。これはwebview（オリジン例: `http://tauri.localhost`）から見て`http://127.0.0.1:8000`へのクロスオリジンリクエストになるため、サーバー側がCORSヘッダーを返さないとブラウザ側でブロックされ、`Network error: Failed to fetch`になる。speachesはデフォルトで`allow_origins=None`（CORS無効）なので、`ALLOW_ORIGINS='["*"]'`を明示する必要がある。
   >
   > **モデルを永続化する理由**: ボリュームを付けずに`docker run`すると、ダウンロードしたモデルはコンテナの書き込み層に保存されるため、`docker rm`でコンテナを削除すると消え、次回起動時に再ダウンロードが必要になる。`speaches-models`ボリュームをHugging Faceキャッシュディレクトリ（`/home/ubuntu/.cache/huggingface`）にマウントしておけば、コンテナを作り直してもモデルは残る。

   再起動後も自動起動させたい場合は `--restart unless-stopped` を追加する。

5. 起動確認。

   ```bash
   curl -s http://localhost:8000/health
   # => OK
   ```

6. 文字起こしモデルをダウンロード（多言語対応、日本語含む）。speachesはモデル未指定だと空リストなので、`POST /v1/models/{model_id}` でHugging Face上のfaster-whisperモデルを明示的に取得する。

   ```bash
   curl -s -X POST "http://localhost:8000/v1/models/Systran/faster-whisper-small"
   # => Model 'Systran/faster-whisper-small' downloaded

   curl -s http://localhost:8000/v1/models
   # => {"data":[{"id":"Systran/faster-whisper-small", ... "language":["en","zh","de",...,"ja",...]}]}
   ```

7. 文字起こしエンドポイントの動作確認（テスト用のダミーwavを送信）。

   ```bash
   curl -s -X POST http://localhost:8000/v1/audio/transcriptions \
     -F "file=@test.wav" \
     -F "model=Systran/faster-whisper-small" \
     -F "response_format=json"
   # => {"text":""}   （無音/トーン音声のため空文字。JSON形式でtextフィールドが返ることを確認）
   ```

8. Dev Space → STTプロバイダー → カスタムプロバイダー追加で、以下を登録する。

   - **curl**:
     ```
     curl -X POST 'http://127.0.0.1:8000/v1/audio/transcriptions' \
       --form 'file=@{{AUDIO}}' \
       --form 'model=Systran/faster-whisper-small' \
       --form 'response_format=json'
     ```
   - **responseContentPath**: `text`

   > **注意**: `--location`フラグは使わないこと。`@bany/curl-to-json`（アプリ内のcurlパーサー）は`--location`付きだとURLを`url`キーではなく`location`キーに格納してしまい、`src/lib/functions/stt.function.ts`側は`curlJson.url`しか見ないため、URLが空文字列として扱われて`http://tauri.localhost/`宛にリクエストが飛んでしまう（`Network error: error sending request for url (http://tauri.localhost/)`）。また`-X POST`を明示しないと`curl2Json`はメソッドを`GET`と誤判定するため、必ず`-X POST`を付けること。
   - 保存後は「STTプロバイダーを選択」で作成したカスタムプロバイダー自体を選択する必要がある（保存だけでは有効化されない）。選択し忘れると組み込みの「OpenAI Whisper」が選ばれたままになり、`{{API_KEY}}`が未置換のまま`api.openai.com`に送られて`HTTP 401`になる。
   - URL末尾に余分な`/`を付けない（`.../transcriptions/`のように末尾スラッシュを付けるとFastAPI側がルート不一致で`HTTP 404: {"detail":"Not Found"}`を返す）。

9. コンテナ起動時に`ALLOW_ORIGINS`環境変数が必要だった（手順4で対応済み）。理由は上記コラム参照。

### つまずいたポイントのまとめ

| 症状 | 原因 | 対処 |
|---|---|---|
| `Network error: error sending request for url (http://tauri.localhost/)` | curlに`--location`を使い、`curl2Json`がURLを`location`キーに格納 → `curlJson.url`が空 | `--location`を使わず`curl -X POST '<url>' ...`の形にする |
| `HTTP 401: Incorrect API key provided: {{API_KEY}}` | 「STTプロバイダーを選択」で組み込みの「OpenAI Whisper」が選ばれたままだった | 作成したカスタムプロバイダーを明示的に選択し直す |
| `Network error: Failed to fetch` | speachesの`allow_origins=None`でCORSブロック（webview origin → `http://127.0.0.1:8000`のクロスオリジン） | `docker run`に`-e ALLOW_ORIGINS='["*"]'`を追加 |
| `HTTP 404: {"detail":"Not Found"}` | curl内のURL末尾に余分な`/`が付いていた | URLを`.../transcriptions`（スラッシュなし）に修正 |
| `設定画面でAIプロバイダーを選択してください` | STT自体は成功。次のAI回答生成ステップでプロバイダー未設定のため（`useCompletion.ts`のクライアント側チェック） | STTのセットアップは完了。AIプロバイダー設定は別タスクとして後日対応 |

### コンテナの停止・再開・削除（参考）

```bash
docker stop speaches-stt      # 停止
docker start speaches-stt     # 再開
docker logs -f speaches-stt   # ログ確認
docker rm -f speaches-stt     # 削除（モデルも消えるため再ダウンロードが必要）
```

### ステータス

**STT導入・動作確認は完了**（2026-07-03）。アプリのDev Spaceにカスタムプロバイダーとして登録し、システム音声キャプチャ→文字起こしが正常に動作することを確認済み。

次の段階として、AI回答生成用のプロバイダー（ローカルLLMまたはクラウドAPI）の設定が別タスクとして残っている。設定しない限り、STT成功後に「設定画面でAIプロバイダーを選択してください」というエラーで止まる（これはSTTの不具合ではなく、後続のAI応答生成ステップ側の未設定によるもの）。
