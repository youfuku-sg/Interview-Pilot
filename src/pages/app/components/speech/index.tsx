import { useState, useEffect } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ScrollArea,
} from "@/components";
import {
  HeadphonesIcon,
  AlertCircleIcon,
  LoaderIcon,
  AudioLinesIcon,
  XIcon,
} from "lucide-react";
import { ModeSwitcher } from "./ModeSwitcher";
import { RecordingPanel } from "./RecordingPanel";
import { ResultsSection } from "./ResultsSection";
import { SettingsPanel } from "./SettingsPanel";
import { PermissionFlow } from "./PermissionFlow";
import { QuickActions } from "./QuickActions";
import { Warning } from "./Warning";
import { useSystemAudioType } from "@/hooks";
import { cn } from "@/lib/utils";

export const SystemAudio = (props: useSystemAudioType) => {
  const {
    capturing,
    isProcessing,
    isAIProcessing,
    lastTranscription,
    lastAIResponse,
    error,
    setupRequired,
    startCapture,
    stopCapture,
    isPopoverOpen,
    setIsPopoverOpen,
    useSystemPrompt,
    setUseSystemPrompt,
    contextContent,
    setContextContent,
    conversation,
    resizeWindow,
    quickActions,
    addQuickAction,
    removeQuickAction,
    isManagingQuickActions,
    setIsManagingQuickActions,
    showQuickActions,
    setShowQuickActions,
    handleQuickActionClick,
    vadConfig,
    updateVadConfiguration,
    isRecordingInContinuousMode,
    recordingProgress,
    manualStopAndSend,
    startContinuousRecording,
    ignoreContinuousRecording,
    scrollAreaRef,
  } = props;

  // View mode toggle
  const [conversationMode, setConversationMode] = useState(false);

  const isVadMode = vadConfig.enabled;
  const hasResponse = lastAIResponse || isAIProcessing;

  // Keyboard shortcut for Cmd+K to toggle view mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPopoverOpen) return;

      // Cmd+K or Ctrl+K to toggle view mode
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setConversationMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPopoverOpen]);

  const handleToggleCapture = async () => {
    if (capturing) {
      await stopCapture();
    } else {
      await startCapture();
    }
  };

  const handleModeChange = (vadEnabled: boolean) => {
    updateVadConfiguration({
      ...vadConfig,
      enabled: vadEnabled,
    });
  };

  const getButtonIcon = () => {
    if (setupRequired) return <AlertCircleIcon className="text-orange-500" />;
    if (error && !setupRequired)
      return <AlertCircleIcon className="text-red-500" />;
    if (isProcessing) return <LoaderIcon className="animate-spin" />;
    if (capturing)
      return <AudioLinesIcon className="text-green-500 animate-pulse" />;
    return <HeadphonesIcon />;
  };

  const getButtonTitle = () => {
    if (setupRequired) return "セットアップが必要です - クリックして手順を確認";
    if (error && !setupRequired) return `エラー: ${error}`;
    if (isProcessing) return "音声を文字起こし中...";
    if (capturing) return "システム音声のキャプチャを停止";
    return "システム音声のキャプチャを開始";
  };

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={(open) => {
        if (capturing && !open) {
          return;
        }
        setIsPopoverOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          size="icon"
          title={getButtonTitle()}
          onClick={handleToggleCapture}
          className={cn(
            capturing && "bg-green-50 hover:bg-green-100",
            error && "bg-red-100 hover:bg-red-200"
          )}
        >
          {getButtonIcon()}
        </Button>
      </PopoverTrigger>

      {(capturing || setupRequired || error) && (
        <PopoverContent
          align="end"
          side="bottom"
          className="select-none w-screen p-0 border shadow-lg overflow-hidden border-input/50"
          sideOffset={8}
        >
          <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            {/* Header - Mode Switcher + Actions */}
            <div className="flex-shrink-0 p-3 border-b border-border/50">
              <div className="flex items-center justify-between gap-2">
                {/* Mode Switcher */}
                {!setupRequired && (
                  <ModeSwitcher
                    isVadMode={isVadMode}
                    onModeChange={handleModeChange}
                    disabled={
                      isRecordingInContinuousMode ||
                      isProcessing ||
                      isAIProcessing
                    }
                  />
                )}
                {setupRequired && (
                  <h2 className="font-semibold text-sm">セットアップが必要です</h2>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Close Button */}
                  {!capturing && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      title="閉じる"
                      onClick={() => {
                        setIsPopoverOpen(false);
                        resizeWindow(false);
                      }}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
              <div className="p-2 space-y-2">
                {/* Error Display */}
                {error && !setupRequired && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircleIcon className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-medium text-red-800">
                        エラー
                      </p>
                      <p className="text-[10px] text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Setup Required - Permission Flow */}
                {setupRequired ? (
                  <PermissionFlow
                    onPermissionGranted={() => {
                      startCapture();
                    }}
                    onPermissionDenied={() => {
                      // Keep showing setup instructions
                    }}
                  />
                ) : (
                  <>
                    {/* Recording Panel */}
                    <RecordingPanel
                      isVadMode={isVadMode}
                      isRecording={isRecordingInContinuousMode}
                      isProcessing={isProcessing}
                      isAIProcessing={isAIProcessing}
                      recordingProgress={recordingProgress}
                      maxDuration={vadConfig.max_recording_duration_secs}
                      onStartRecording={startContinuousRecording}
                      onStopAndSend={manualStopAndSend}
                      onIgnore={ignoreContinuousRecording}
                    />

                    {/* AI Response */}
                    <ResultsSection
                      lastTranscription={lastTranscription}
                      lastAIResponse={lastAIResponse}
                      isAIProcessing={isAIProcessing}
                      conversation={conversation}
                      conversationMode={conversationMode}
                      setConversationMode={setConversationMode}
                    />

                    {/* Settings Panel */}
                    <SettingsPanel
                      vadConfig={vadConfig}
                      onUpdateVadConfig={updateVadConfiguration}
                      useSystemPrompt={useSystemPrompt}
                      setUseSystemPrompt={setUseSystemPrompt}
                      contextContent={contextContent}
                      setContextContent={setContextContent}
                    />

                    {/* Help/Keyboard Shortcuts */}
                    <Warning isVadMode={isVadMode} />
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {!setupRequired && hasResponse && (
              <div className="flex-shrink-0 border-t border-border/50 p-2">
                <QuickActions
                  actions={quickActions}
                  onActionClick={handleQuickActionClick}
                  onAddAction={addQuickAction}
                  onRemoveAction={removeQuickAction}
                  isManaging={isManagingQuickActions}
                  setIsManaging={setIsManagingQuickActions}
                  show={showQuickActions}
                  setShow={setShowQuickActions}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
