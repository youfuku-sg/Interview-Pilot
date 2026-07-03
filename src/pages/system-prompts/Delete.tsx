import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteSystemPromptProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: number | undefined;
  promptName: string;
  onDelete: (id: number) => Promise<void>;
}

export const DeleteSystemPrompt = ({
  isOpen,
  onOpenChange,
  promptId,
  promptName,
  onDelete,
}: DeleteSystemPromptProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!promptId) return;

    try {
      setIsDeleting(true);
      await onDelete(promptId);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete system prompt:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <DialogTitle>システムプロンプトを削除</DialogTitle>
              <DialogDescription className="mt-1">
                「{promptName}」を削除してもよろしいですか?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-3">
          <p className="text-sm text-muted-foreground">
            この操作は取り消せません。システムプロンプトはデータベースから完全に削除されます。
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
