## Why

`docs/仕様/ブランチ・リリース戦略.md` にブランチ運用（`main`/`feature/*`/`release/v<version>`/`hotfix/v<version>`）、バージョン戦略、リリース手順案が整理されているが、現状はドキュメントとして存在するのみで、実際の作業時に Claude Code / Codex がこれを踏まえて振る舞う仕組みがない。このままではエージェントが `feature/*` を切らずに安定ブランチへ直接作業したり、`release/*` の手順（VERSION/CHANGELOG 更新、ビルド確認、マージ後のブランチ削除など）を踏まずに進めてしまう恐れがある。

アプリ本体の改修（日本語化・機能追加）に着手する前に、まず開発環境側でブランチ戦略を守れる状態を作りたい。具体的には、`docs/仕様/ブランチ・リリース戦略.md` の内容を Claude Code (`.claude/skills/`) と Codex (`.codex/skills/`) の両方にスキルとして登録し、エージェントが作業開始時・ブランチ作成時・リリース準備時にこの戦略を参照・遵守できるようにする。

## What Changes

- `docs/仕様/ブランチ・リリース戦略.md` の内容をもとにした新規スキルを作成する
- スキルは以下を支援する内容とする
  - 現在のブランチ名が戦略（`main` / `feature/<name>` / `release/v<version>` / `hotfix/v<version>`）に沿っているかの確認
  - 新規作業開始時に適切な種類のブランチ（`feature/*` など）を安定ブランチから切るための案内
  - `release/*` ブランチでの準備手順（`VERSION` / `CHANGELOG.md` 更新、ビルド確認、マージ後の削除）の案内
  - `hotfix/*` の運用（安定ブランチから直接作業してよい、patch を +1 する）の案内
- スキルを `.claude/skills/<skill-name>/SKILL.md` として作成し、Claude Code から呼び出せるようにする
- 同内容のスキルを `.codex/skills/<skill-name>/SKILL.md` として作成し、Codex からも呼び出せるようにする
- 必要に応じて `.claude/commands/` にスラッシュコマンドのエントリを追加する（既存の `opsx/*` の構成に倣う）
- `docs/仕様/ブランチ・リリース戦略.md` の「8. 未決事項」のうち、スキル運用に必要な最小限の前提（安定ブランチ名、タグ規則、ワークフロー起動条件）はドキュメント側で決まっている範囲のみを参照し、未決のまま残っている項目はスキル内で決め打ちしない

## Capabilities

### New Capabilities
- `branch-strategy-skill`: Claude Code / Codex 双方から呼び出せる、`docs/仕様/ブランチ・リリース戦略.md` に基づくブランチ・リリース運用支援スキル

### Modified Capabilities
（既存の spec なし。今回が新規 capability 追加のため該当なし）

## Impact

- 影響ファイル: `.claude/skills/<skill-name>/SKILL.md`（新規）、`.codex/skills/<skill-name>/SKILL.md`（新規）、必要に応じて `.claude/commands/<skill-name>.md`（新規）
- 影響システム: Claude Code のスキル解決、Codex のスキル解決
- 非対象: アプリ本体（`src/` / `src-tauri/`）の変更、`.github/workflows/publish.yml` の再変更、`docs/仕様/ブランチ・リリース戦略.md` 8節の未決事項そのものの決定（別途ユーザーが判断する）
