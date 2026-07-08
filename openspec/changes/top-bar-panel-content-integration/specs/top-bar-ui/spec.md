## MODIFIED Requirements

### Requirement: Top bar right panel content assignment
トップバー右エリアの3段には以下のコンテンツを割り当てる。上段は文字起こしパネル、中段はAI回答パネル、下段はテキスト入力欄とする。

#### Scenario: 上段が文字起こしパネルとして機能する
- **WHEN** 音声キャプチャが有効でトップバーが表示される
- **THEN** 上段に最新の文字起こし結果が表示される

#### Scenario: 中段がAI回答パネルとして機能する
- **WHEN** 文字起こし後にAI処理が完了する
- **THEN** 中段にAIの回答テキストが表示される

#### Scenario: AIプロバイダー未設定時にエラーを表示する
- **WHEN** AIプロバイダーが設定されておらず、かつ Pluely API が無効の状態でトップバーが表示される
- **THEN** 中段に「AIプロバイダーが選択されていません」というエラーメッセージが表示される

#### Scenario: AI処理中にローディングを表示する
- **WHEN** 文字起こし完了後にAI処理（`isAIProcessing`）が実行されている
- **THEN** 中段にローディングインジケーターが表示される

#### Scenario: 下段はテキスト入力欄のままである
- **WHEN** トップバーが表示される
- **THEN** 下段にテキスト入力欄（`Completion` の `Input`）が表示される
