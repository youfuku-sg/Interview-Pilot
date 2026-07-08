import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { Markdown } from "@/components";

type Props = {
  lastAIResponse: string;
  isAIProcessing: boolean;
  aiReady: boolean;
};

export const AIResponsePanel = ({
  lastAIResponse,
  isAIProcessing,
  aiReady,
}: Props) => {
  if (!aiReady) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-orange-600">
        <AlertCircleIcon className="w-4 h-4 shrink-0" />
        <span className="text-xs font-medium">
          AIプロバイダーが選択されていません
        </span>
      </div>
    );
  }

  if (isAIProcessing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 animate-pulse">
        <LoaderIcon className="w-4 h-4 animate-spin shrink-0" />
        <span className="text-xs font-medium">AI回答を生成中...</span>
      </div>
    );
  }

  if (lastAIResponse) {
    return (
      <div className="px-3 py-2 overflow-y-auto h-full">
        <Markdown>{lastAIResponse}</Markdown>
      </div>
    );
  }

  return null;
};
