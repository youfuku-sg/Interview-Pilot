import { Loader2, TrashIcon } from "lucide-react";
import { Button, Header } from "@/components";
import { UseSettingsReturn } from "@/types";
import { useState } from "react";

export const DeleteChats = ({
  handleDeleteAllChatsConfirm,
  showDeleteConfirmDialog,
  setShowDeleteConfirmDialog,
}: UseSettingsReturn) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAllChats = () => {
    setIsDeleting(true);
    handleDeleteAllChatsConfirm();
    setTimeout(() => {
      setIsDeleting(false);
    }, 2000);
  };

  return (
    <div id="delete-chats" className="space-y-3">
      <Header
        title="チャット履歴を削除"
        description="すべてのチャット会話・履歴を完全に削除します。この操作は取り消せず、ローカルストレージに保存されたすべての会話が削除されます。"
        isMainTitle
      />

      <div className="space-y-2">
        {isDeleting && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-xs text-green-700 font-medium">
              ✅ すべてのチャット履歴を削除しました。
            </p>
          </div>
        )}

        <Button
          onClick={() => setShowDeleteConfirmDialog(true)}
          disabled={isDeleting}
          variant="destructive"
          className="w-full h-11"
          title="すべてのチャット履歴を削除"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              削除中...
            </>
          ) : (
            <>
              <TrashIcon className="h-4 w-4 mr-2" />
              すべてのチャットを削除
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">
              すべてのチャット履歴を削除
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              本当にすべてのチャット履歴を削除しますか?この操作は取り消せず、保存されたすべての会話が完全に削除されます。
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmDialog(false)}
              >
                キャンセル
              </Button>
              <Button variant="destructive" onClick={deleteAllChats}>
                すべて削除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
