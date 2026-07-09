## ADDED Requirements

### Requirement: 録音セッション中の発話を累積する
`useSystemAudio` フックは `capturing` が `true` の間に受信した `speech-detected` イベントの文字起こし結果を、セッションごとに配列（`sessionTranscript`）として順序付きで蓄積しなければならない（SHALL）。各発話は既存の値を上書きせず末尾に追記される。

#### Scenario: 1回目の発話を記録する
- **WHEN** ヘッドフォンボタンを押して録音を開始した後、最初の発話が認識される
- **THEN** `sessionTranscript` は認識されたテキストを1要素として持つ

#### Scenario: 2回目以降の発話を追記する
- **WHEN** 同一セッション中に2回目以降の発話が認識される
- **THEN** `sessionTranscript` は既存の要素を保持したまま新しい発話を末尾に追加する

#### Scenario: 空の文字起こし結果は無視する
- **WHEN** `speech-detected` イベントの文字起こし結果が空文字または空白のみである
- **THEN** `sessionTranscript` に要素は追加されない

### Requirement: セッション開始時に累積テキストをリセットする
`startCapture` が呼ばれたとき、`sessionTranscript` を空配列にリセットしなければならない（SHALL）。

#### Scenario: 新しい録音セッションを開始するとリセットされる
- **WHEN** ユーザーがヘッドフォンボタンを押して新しい録音セッションを開始する
- **THEN** 前のセッションの `sessionTranscript` はクリアされ、空の状態から累積を始める

### Requirement: 新規会話開始時に累積テキストをリセットする
`startNewConversation` が呼ばれたとき、`sessionTranscript` を空配列にリセットしなければならない（SHALL）。

#### Scenario: 新規会話を開始するとセッションテキストがクリアされる
- **WHEN** ユーザーが新規会話を開始する操作を行う
- **THEN** `sessionTranscript` は空配列にリセットされる
