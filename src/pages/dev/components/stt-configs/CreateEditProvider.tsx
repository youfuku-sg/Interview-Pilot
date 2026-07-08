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
import { useCustomSttProviders } from "@/hooks";
import { useApp } from "@/contexts";
import { cn } from "@/lib/utils";

interface CreateEditProviderProps {
  customProviderHook?: ReturnType<typeof useCustomSttProviders>;
}

export const CreateEditProvider = ({
  customProviderHook,
}: CreateEditProviderProps) => {
  const { allSttProviders } = useApp();
  // Use the provided hook instance or create a new one
  const hookInstance = customProviderHook || useCustomSttProviders();

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
          カスタムSTTプロバイダーを追加
        </Button>
      ) : (
        <Card className="p-4 border border-input/50 bg-transparent">
          <div className="flex justify-between items-center">
            <Header
              title={
                editingProvider
                  ? `STTプロバイダーを編集`
                  : "カスタムSTTプロバイダーを追加"
              }
              description="STT搭載アプリで使用するカスタムSTTプロバイダーを作成します。"
            />
            <div className="w-[120px]">
              <Selection
                options={allSttProviders
                  ?.filter((provider) => !provider?.isCustom)
                  .map((provider) => {
                    return {
                      label: provider?.id || "STTプロバイダー",
                      value: provider?.id || "STTプロバイダー",
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
                description="STTプロバイダーで使用するcurlコマンドです。OpenAI互換の文字起こしでは日本語固定用に language=ja を含めてください。"
              />
              <Textarea
                className={cn(
                  "h-74 font-mono text-sm",
                  errors.curl && "border-red-500"
                )}
                placeholder={`curl -X POST "https://api.openai.com/v1/audio/transcriptions" \\
      -H "Authorization: Bearer {{API_KEY}}" \\
      -F "file={{AUDIO}}" \\
      -F "model={{MODEL}}" \\
      -F "language=ja"`}
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
                  ⚠️ STTプロバイダーに必要な変数:
                </h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                      {"{{AUDIO}}"}
                    </code>
                    <span className="text-foreground font-medium">
                      → 必須: Base64エンコードされた音声データ、または
                      multipart/form-data(-F や --form)を使用する場合はwavファイルとしての音声ファイル
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
                    💡 ヒント: {" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{AUDIO}}"}
                    </code>{" "}
                    変数はSTT機能に必須です。日本語面接支援では、OpenAI互換のmultipart/form-dataに
                    <code className="bg-muted px-1 rounded text-xs mx-1">
                      language=ja
                    </code>
                    も含めると長い発話が英語として誤判定されにくくなります。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-0">
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
                disabled={true}
              />
            </div>
            <span className="text-xs italic text-red-500">
              STTプロバイダーではストリーミングに対応していません。今後対応予定です。
            </span>
          </div>
          {/* Response Configuration */}
          <div className="space-y-2">
            <Header
              title="レスポンスコンテンツパス *"
              description="APIレスポンスからコンテンツを抽出するためのパスです。"
            />

            <TextInput
              placeholder="text"
              value={formData.responseContentPath || ""}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  responseContentPath: value,
                }))
              }
              error={errors.responseContentPath}
              notes="APIレスポンスからコンテンツを抽出するためのパスです。例: text, transcript, results[0].alternatives[0].transcript"
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
