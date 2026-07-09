## ADDED Requirements

### Requirement: Speech panel hides screenshot and new-conversation buttons
音声入力パネル（ヘッドフォンボタン押下後のポップオーバー）において、スクリーンショットボタンおよび新規（会話）ボタンは表示してはならない（SHALL NOT）。

#### Scenario: スクリーンショットボタンが表示されない
- **WHEN** ユーザーがヘッドフォン（マイク）ボタンを押して音声入力パネルを開く
- **THEN** スクリーンショットボタンが画面上に存在しない

#### Scenario: 新規ボタンが表示されない
- **WHEN** ユーザーがヘッドフォン（マイク）ボタンを押して音声入力パネルを開く
- **THEN** 新規（会話）ボタンが画面上に存在しない
