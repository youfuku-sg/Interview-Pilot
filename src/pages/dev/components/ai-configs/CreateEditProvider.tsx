import {
  Card,
  Button,
  Header,
  TextInput,
  Switch,
  Textarea,
  Selection,
} from "@/components";
import { PlusIcon, SaveIcon } from "lucide-react";
import { useCustomAiProviders } from "@/hooks";
import { useApp } from "@/contexts";
import { cn } from "@/lib/utils";

interface CreateEditProviderProps {
  customProviderHook?: ReturnType<typeof useCustomAiProviders>;
}

export const CreateEditProvider = ({
  customProviderHook,
}: CreateEditProviderProps) => {
  const { allAiProviders } = useApp();
  // Use the provided hook instance or create a new one
  const hookInstance = customProviderHook || useCustomAiProviders();

  const {
    showForm,
    setShowForm,
    editingProvider,
    formData,
    setFormData,
    errors,
    handleSave,
    setErrors,
    handleAutoFill,
  } = hookInstance;

  return (
    <>
      {!showForm ? (
        <Button
          onClick={() => {
            setShowForm(true);
            setErrors({});
          }}
          variant="outline"
          className="w-full h-11 border-1 border-input/50 focus:border-primary/50 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          カスタムプロバイダーを追加
        </Button>
      ) : (
        <Card className="p-4 border !bg-transparent border-input/50 ">
          <div className="flex justify-between items-center">
            <Header
              title={editingProvider ? `プロバイダーを編集` : "カスタムプロバイダーを追加"}
              description="AI搭載アプリで使用するカスタムAIプロバイダーを作成します。"
            />

            <div className="w-[120px]">
              <Selection
                options={allAiProviders
                  ?.filter((provider) => !provider?.isCustom)
                  .map((provider) => {
                    return {
                      label: provider?.id || "AIプロバイダー",
                      value: provider?.id || "AIプロバイダー",
                    };
                  })}
                placeholder={"自動入力"}
                onChange={(value) => {
                  handleAutoFill(value);
                }}
              />
            </div>
          </div>

          <div className="">
            {/* Basic Configuration */}
            <div className="space-y-1">
              <Header
                title="curlコマンド *"
                description="AIプロバイダーで使用するcurlコマンドです。"
              />
              <Textarea
                className={cn(
                  "h-74 font-mono text-sm",
                  errors.curl && "border-red-500"
                )}
                placeholder={`curl --location 'http://127.0.0.1:1337/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY or {{API_KEY}}' \
--data '{
        "model": "your-model-name or {{MODEL}}",
        "messages": [
            {
                "role": "system",
                "content": "{{SYSTEM_PROMPT}}"
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "{{TEXT}}"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "data:image/jpeg;base64,{{IMAGE}}"
                        }
                    }
                ]
            }
        ]
    }'`}
                value={formData.curl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, curl: e.target.value }))
                }
              />
              {errors.curl && (
                <p className="text-xs text-red-500 mt-1">{errors.curl}</p>
              )}

              {/* Variable Instructions */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="bg-card border p-3 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-2">
                    💡 重要: カスタム変数を追加するか、APIキー・値を直接埋め込むことができます
                  </p>
                  <p className="text-xs text-muted-foreground">
                    プロバイダー選択時に変数を別途入力する必要はありません。curlコマンドに直接埋め込めます(例: YOUR_API_KEYを実際のキーに置き換える、またはモデル名に{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{MODEL}}"}
                    </code>{" "}
                    を使用する)。
                  </p>
                </div>

                <h4 className="text-sm font-semibold text-foreground">
                  ⚠️ AIプロバイダーに必要な変数:
                </h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                      {"{{TEXT}}"}
                    </code>
                    <span className="text-foreground font-medium">
                      → 必須: ユーザーのテキスト入力
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                      {"{{IMAGE}}"}
                    </code>
                    <span className="text-muted-foreground">
                      → Base64画像データ(data:image/jpeg;base64 プレフィックスなし)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                      {"{{SYSTEM_PROMPT}}"}
                    </code>
                    <span className="text-muted-foreground">
                      → システムプロンプト・指示(任意)
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">クイックセットアップ:</strong>{" "}
                    curlコマンド内の{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      YOUR_API_KEY
                    </code>{" "}
                    を実際のAPIキーに直接置き換えてください。
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      カスタム変数:
                    </strong>{" "}
                    同じ{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{VARIABLE_NAME}}"}
                    </code>{" "}
                    形式で独自の変数を追加でき、このプロバイダーを選択したときに設定できるようになります。
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    💡 ヒント: 基本機能には必須変数(
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{TEXT}}"}
                    </code>
                    、{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{SYSTEM_PROMPT}}"}
                    </code>
                    )を使用してください。プロバイダーが画像入力に対応している場合のみ{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{IMAGE}}"}
                    </code>{" "}
                    を追加してください。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center space-x-2">
            <Header
              title="ストリーミング"
              description="AIプロバイダーからのレスポンスをストリーミングで受け取ります。"
            />
            <Switch
              checked={formData.streaming}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  streaming: checked,
                }))
              }
            />
          </div>
          {/* Response Configuration */}
          <div className="space-y-2">
            <Header
              title="レスポンスコンテンツパス *"
              description="APIレスポンスからコンテンツを抽出するためのパスです。"
            />

            <TextInput
              placeholder="choices[0].message.content"
              value={formData.responseContentPath || ""}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  responseContentPath: value,
                }))
              }
              error={errors.responseContentPath}
              notes="APIレスポンスからコンテンツを抽出するためのパスです。例: choices[0].message.content, text, candidates[0].content.parts[0].text"
            />
          </div>

          <div className="flex justify-end gap-2 -mt-3">
            <Button
              variant="outline"
              onClick={() => setShowForm(!showForm)}
              className="h-11 border-1 border-input/50 focus:border-primary/50 transition-colors"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.curl.trim()}
              className={cn(
                "h-11 border-1 border-input/50 focus:border-primary/50 transition-colors",
                errors.curl && "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              {errors.curl ? (
                "cURLが無効です。もう一度お試しください"
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  プロバイダーを{editingProvider ? "更新" : "保存"}
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};
