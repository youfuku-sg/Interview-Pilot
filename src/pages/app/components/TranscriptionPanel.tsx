import { AlertCircleIcon, LoaderIcon } from "lucide-react";

type Props = {
  lastTranscription: string;
  isProcessing: boolean;
  sttReady: boolean;
};

export const TranscriptionPanel = ({
  lastTranscription,
  isProcessing,
  sttReady,
}: Props) => {
  if (!sttReady) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-orange-600">
        <AlertCircleIcon className="w-4 h-4 shrink-0" />
        <span className="text-xs font-medium">
          STTプロバイダーが選択されていません
        </span>
      </div>
    );
  }

  if (lastTranscription) {
    return (
      <div className="h-full px-3 py-2 overflow-y-auto">
        <p className="text-xs leading-relaxed">{lastTranscription}</p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 animate-pulse">
        <LoaderIcon className="w-4 h-4 animate-spin shrink-0" />
        <span className="text-xs font-medium">文字起こし中...</span>
      </div>
    );
  }

  return null;
};
