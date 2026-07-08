import { useState } from "react";
import {
  InfoIcon,
  ChevronDownIcon,
  KeyboardIcon,
  AudioWaveformIcon,
  MicIcon,
  CameraIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningProps {
  isVadMode: boolean;
}

export const Warning = ({ isVadMode }: WarningProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isMac = navigator.platform.toLowerCase().includes("mac");
  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <InfoIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">ヘルプ・キーボードショートカット</span>
        </div>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Current Mode Info */}
          <div className="flex items-start gap-2 p-2 rounded-md bg-primary/5">
            {isVadMode ? (
              <AudioWaveformIcon className="w-4 h-4 text-primary mt-0.5" />
            ) : (
              <MicIcon className="w-4 h-4 text-primary mt-0.5" />
            )}
            <div>
              <p className="text-xs font-medium">
                {isVadMode ? "自動検出モード" : "手動モード"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {isVadMode
                  ? "システム音声から発話が自動検出されます。誰かが話すと自動でキャプチャされ、文字起こしされます。"
                  : "録音ボタンを押すかキーボードショートカットで手動で録音を操作します。"}
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <KeyboardIcon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                キーボードショートカット
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">下にスクロール</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                  ↓
                </kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">上にスクロール</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                  ↑
                </kbd>
              </div>
              {!isVadMode && (
                <>
                  <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                    <span className="text-muted-foreground">開始/停止</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                      Enter
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                    <span className="text-muted-foreground">録音開始</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                      Space
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                    <span className="text-muted-foreground">破棄</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                      Esc
                    </kbd>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">表示切替</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                  {modKey}+K
                </kbd>
              </div>
            </div>
          </div>

          {/* Screenshot Feature */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CameraIcon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                スクリーンショット機能
              </span>
            </div>
            <div className="p-2 rounded-md bg-primary/5 text-[10px] text-muted-foreground space-y-1">
              <p>
                スクリーンショット: 現在の画面をキャプチャして、次の文字起こしに添付します。
              </p>
              <p>
                AIは文字起こしされた音声とスクリーンショット画像の両方を受け取るため、画面の内容を踏まえた回答ができます。
              </p>
              <p className="text-[9px] opacity-70">
                スクリーンショットはメッセージ送信後に自動的にクリアされます。
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="text-[10px] text-muted-foreground space-y-1 pt-2 border-t border-border/50">
            <p>
              <strong>ヒント:</strong> 面接中はハンズフリーで使える自動検出モードがおすすめです。
            </p>
            <p>
              <strong>ヒント:</strong> 文字起こしする内容を細かく制御したい場合は手動モードを使用してください。
            </p>
            <p>
              <strong>ヒント:</strong> クイックアクションを使うと、フォローアップの指示をワンクリックで送信できます。
            </p>
            <p>
              <strong>ヒント:</strong> スクリーンショットを使うと、画面の内容をAIと共有してより適切な回答を得られます。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
