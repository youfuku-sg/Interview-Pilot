import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Textarea,
} from "@/components";
import { SparklesIcon } from "lucide-react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface GenerateSystemPromptProps {
  onGenerate: (prompt: string, promptName: string) => void;
}

interface SystemPromptResponse {
  prompt_name: string;
  system_prompt: string;
}

export const GenerateSystemPrompt = ({
  onGenerate,
}: GenerateSystemPromptProps) => {
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      setError("希望する内容を入力してください");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const response = await invoke<SystemPromptResponse>(
        "create_system_prompt",
        {
          userPrompt: userPrompt.trim(),
        }
      );

      if (response.system_prompt && response.prompt_name) {
        onGenerate(response.system_prompt, response.prompt_name);
        setIsOpen(false);
        setUserPrompt("");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "プロンプトの生成に失敗しました";
      setError(errorMessage);
      console.error("Error generating system prompt:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label="AIで生成"
          size="sm"
          variant="outline"
          className="w-fit"
        >
          <SparklesIcon className="h-4 w-4" /> AIで生成
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className="w-96 p-4 border shadow-lg"
      >
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">システムプロンプトを生成</p>
            <p className="text-xs text-muted-foreground">
              希望するAIの振る舞いを説明すると、プロンプトを生成します。
            </p>
          </div>

          <Textarea
            placeholder="例: コードレビューを手伝い、ベストプラクティスを重視するAIが欲しい..."
            className="min-h-[100px] resize-none border-1 border-input/50 focus:border-primary/50 transition-colors"
            value={userPrompt}
            onChange={(e) => {
              setUserPrompt(e.target.value);
              setError(null);
            }}
            disabled={isGenerating}
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={!userPrompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <SparklesIcon className="h-4 w-4 animate-pulse" />
                生成中...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                生成
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
