## ADDED Requirements

### Requirement: 生成物のファイル名がアプリの productName に追従する
`publish` ワークフローが生成する Windows インストーラのファイル名は、`src-tauri/tauri.conf.json` の `productName` の値に由来しなければならない (SHALL)。`productName` を変更した場合、次回以降のビルドで生成されるインストーラファイル名にその変更が反映されなければならない (SHALL)。

#### Scenario: productName 変更後のビルドでファイル名が更新される
- **WHEN** `productName` を `"Pluely"` から別の値に変更したコミットに対してタグ push によるビルドが成功する
- **THEN** 生成される Windows インストーラ(NSIS/MSI)のファイル名が新しい `productName` の値を反映している

#### Scenario: productName 未変更時は既存の命名が維持される
- **WHEN** `productName` を変更していない状態でビルドが成功する
- **THEN** 生成されるインストーラファイル名は従来通り `productName` の値(`Pluely`)とバージョンから構成される
