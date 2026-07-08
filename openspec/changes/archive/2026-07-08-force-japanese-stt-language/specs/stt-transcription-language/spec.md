## ADDED Requirements

### Requirement: STT recognition language defaults to Japanese
The application SHALL send STT requests in a way that fixes the recognition language to Japanese for supported providers.

#### Scenario: OpenAI-compatible STT receives Japanese language hint
- **WHEN** the application transcribes audio through a multipart/form-data STT provider that does not already specify a language field
- **THEN** the STT request includes `language=ja`

#### Scenario: Existing explicit STT language setting is preserved
- **WHEN** the configured STT provider curl already contains an explicit language field
- **THEN** the application does not overwrite that explicit language value while building the request

#### Scenario: Long Japanese speech stays in Japanese recognition mode
- **WHEN** a longer Japanese utterance is sent to a supported STT provider through the application
- **THEN** the request uses Japanese recognition instead of relying only on provider-side automatic language detection

### Requirement: STT setup examples use Japanese language codes
STT provider setup examples SHALL use Japanese language codes by default so that newly configured providers are Japanese-oriented.

#### Scenario: OpenAI-compatible provider example includes Japanese language
- **WHEN** the user views or selects an OpenAI-compatible STT curl example in Dev Space
- **THEN** the example includes a Japanese language field such as `language=ja`

#### Scenario: Provider examples with locale-specific fields use Japanese locale
- **WHEN** the user views a provider example that uses locale-style language configuration
- **THEN** the example uses a Japanese locale such as `ja-JP`
