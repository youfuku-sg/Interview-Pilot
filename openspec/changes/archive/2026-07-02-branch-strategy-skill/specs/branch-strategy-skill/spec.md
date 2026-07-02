## ADDED Requirements

### Requirement: Claude Code からブランチ・リリース戦略スキルを参照できる
Claude Code は `.claude/skills/branch-release-strategy/SKILL.md` としてスキルを解決できなければならない (SHALL)。スキルの `description` には、ブランチ作成・リリース準備に関する作業がトリガーになることが明記されていなければならない (SHALL)。

#### Scenario: 新規作業開始時にスキルが案内される
- **WHEN** ユーザーが Claude Code に新しい作業（例: 機能追加）の開始を依頼する
- **THEN** エージェントは `branch-release-strategy` スキルを参照し、安定ブランチから `feature/<name>` を切ることを案内する

### Requirement: Codex からも同一内容のスキルを参照できる
Codex は `.codex/skills/branch-release-strategy/SKILL.md` としてスキルを解決できなければならない (SHALL)。この内容は `.claude/skills/branch-release-strategy/SKILL.md` と実質的に同一の案内内容でなければならない (SHALL)。

#### Scenario: Codex 側でも同じ案内が得られる
- **WHEN** Codex 上で同様に新しい作業の開始を依頼する
- **THEN** `.codex/skills/branch-release-strategy/SKILL.md` の内容に基づき、Claude Code と同じブランチ運用（`feature/*` から開始、`release/*` の手順、`hotfix/*` の特例）が案内される

### Requirement: スキルは確定事項と未決事項を区別して案内する
スキルは `docs/仕様/ブランチ・リリース戦略.md` で「推奨」または確定として記載された内容（ブランチ種別・命名規則・分岐元・マージ後削除・タグ規則 `v<version>`、workflow 起動条件）を案内しなければならない (SHALL)。同ドキュメント8節に未決事項として記載された内容（既存 `master` の扱い、GitHub default branch の切り替え時期、`VERSION`/`CHANGELOG.md` 新設可否、採番方式、署名方針、アプリ名変更時期）については、スキルが独自に決定してはならず (SHALL NOT)、ユーザーに確認するよう案内しなければならない (SHALL)。

#### Scenario: 未決事項に関する判断が必要になった場合
- **WHEN** 作業中に既存 `master` の扱いなど、`docs/仕様/ブランチ・リリース戦略.md` 8節に記載された未決事項に関わる判断が必要になる
- **THEN** エージェントはスキルの案内に従い、独自に決定せずユーザーに確認する

### Requirement: リリース準備手順を案内できる
スキルは `release/v<version>` ブランチでの作業時に、`docs/仕様/ブランチ・リリース戦略.md` 7節の初期案手順（`VERSION`/`CHANGELOG.md` 更新、GitHub Actions 実行、draft release 添付、動作確認、安定ブランチへのマージ、`release/*` 削除）の順序を案内しなければならない (SHALL)。

#### Scenario: リリース準備ブランチでの作業案内
- **WHEN** ユーザーが `release/v<version>` ブランチでの作業を Claude Code または Codex に依頼する
- **THEN** エージェントはスキルの案内に基づき、7節の手順順序（バージョン更新 → ビルド → draft release 確認 → マージ → ブランチ削除）を提示する
