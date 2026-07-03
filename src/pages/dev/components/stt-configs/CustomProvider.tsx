import { UseSettingsReturn } from "@/types";
import { Card, Button, Header } from "@/components";
import { EditIcon, TrashIcon } from "lucide-react";
import { CreateEditProvider } from "./CreateEditProvider";
import { useCustomSttProviders } from "@/hooks";
import curl2Json from "@bany/curl-to-json";

export const CustomProviders = ({ allSttProviders }: UseSettingsReturn) => {
  const customProviderHook = useCustomSttProviders();
  const {
    handleEdit,
    handleDelete,
    deleteConfirm,
    confirmDelete,
    cancelDelete,
  } = customProviderHook;

  return (
    <div className="space-y-2">
      <Header
        title="カスタムSTTプロバイダー"
        description="カスタムSTTプロバイダーを作成・管理します。エンドポイント・認証・レスポンス形式を設定できます。"
      />

      <div className="space-y-2">
        {/* Existing Custom Providers */}
        {allSttProviders.filter((provider) => provider?.isCustom).length >
          0 && (
          <div className="space-y-2">
            {allSttProviders
              .filter((provider) => provider?.isCustom)
              .map((provider) => {
                const json = curl2Json(provider?.curl);

                return (
                  <Card
                    key={provider?.id}
                    className="p-3 border !bg-transparent border-input/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">
                          {json?.url || "無効なcurlコマンド"}
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {`レスポンスパス: ${
                              provider?.responseContentPath || "未設定"
                            }`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {" • "}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ストリーミング: {provider?.streaming ? "はい" : "いいえ"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            provider?.id && handleEdit(provider?.id)
                          }
                          title="プロバイダーを編集"
                        >
                          <EditIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            provider?.id && handleDelete(provider?.id)
                          }
                          title="プロバイダーを削除"
                          className="text-destructive hover:text-destructive"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
      <CreateEditProvider customProviderHook={customProviderHook} />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">
              カスタムSTTプロバイダーを削除
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              本当にこのカスタムSTTプロバイダーを削除しますか?この操作は取り消せません。
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelDelete}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                削除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
