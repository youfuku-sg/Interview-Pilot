import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
} from "@/components";
import { GenerateSystemPrompt } from "./Generate";
import { SparklesIcon } from "lucide-react";

interface CreateEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    id?: number;
    name: string;
    prompt: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      name: string;
      prompt: string;
    }>
  >;
  onSave: () => void;
  onGenerate: (prompt: string, promptName: string) => void;
  isEditing?: boolean;
  isSaving?: boolean;
}

export const CreateEditDialog = ({
  isOpen,
  onOpenChange,
  form,
  setForm,
  onSave,
  onGenerate,
  isEditing = false,
  isSaving = false,
}: CreateEditDialogProps) => {
  const isFormValid = form.name.trim() && form.prompt.trim();

  const handleSave = () => {
    onSave();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="mt-4 px-6 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                {isEditing ? "システムプロンプトを編集" : "システムプロンプトを作成"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isEditing
                  ? "以下でシステムプロンプトの内容を更新してください。"
                  : "新しいAIの振る舞いと個性を定義します。"}
              </DialogDescription>
            </div>
            <GenerateSystemPrompt onGenerate={onGenerate} />
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              名前
            </label>
            <Input
              placeholder="例: コードレビューの専門家、クリエイティブライター..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={isSaving}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              システムプロンプト
            </label>
            <Textarea
              placeholder="あなたは親切なAIアシスタントです。簡潔かつ正確で、フレンドリーな回答を心がけてください..."
              className="min-h-[200px] max-h-[400px] resize-none overflow-y-auto"
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground/70">
              💡 ヒント: 口調・専門性のレベル・回答形式を具体的に指定しましょう
            </p>
          </div>
        </div>
        <DialogFooter className="px-6 pb-6 shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid || isSaving}>
            {isSaving ? (
              <>
                <SparklesIcon className="h-4 w-4 animate-pulse" />
                {isEditing ? "更新中..." : "作成中..."}
              </>
            ) : isEditing ? (
              "更新"
            ) : (
              "作成"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
