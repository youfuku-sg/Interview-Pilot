import { Card, DragButton, CustomCursor, Button } from "@/components";
import {
  SystemAudio,
  Audio,
  CompletionInput,
  AudioVisualizer,
  StatusIndicator,
} from "./components";
import { useApp } from "@/hooks";
import { useApp as useAppContext } from "@/contexts";
import { useCompletion } from "@/hooks";
import { Settings } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorLayout } from "@/layouts";
import { getPlatform } from "@/lib";

const App = () => {
  const { isHidden, systemAudio } = useApp();
  const { customizable } = useAppContext();
  const completion = useCompletion();
  const platform = getPlatform();

  const openDashboard = async () => {
    try {
      await invoke("open_dashboard");
    } catch (error) {
      console.error("Failed to open dashboard:", error);
    }
  };

  return (
    <ErrorBoundary
      fallbackRender={() => {
        return <ErrorLayout isCompact />;
      }}
      resetKeys={["app-error"]}
      onReset={() => {
        console.log("Reset");
      }}
    >
      <div
        className={`w-screen h-screen flex overflow-hidden justify-center items-start ${
          isHidden ? "hidden pointer-events-none" : ""
        }`}
      >
        <Card className="w-full flex flex-row gap-2 p-2">
          {/* 左カラム: アイコン縦並び */}
          <div className="w-10 flex flex-col items-center gap-2 py-1 shrink-0">
            <SystemAudio {...systemAudio} />
            <Audio {...completion} />
            <Button
              size={"icon"}
              className="cursor-pointer"
              title="設定を開く"
              onClick={openDashboard}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <DragButton />
          </div>

          {/* 右エリア: テキスト入力 or 音声キャプチャUI */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            {systemAudio?.capturing ? (
              <div className="flex flex-col gap-2 justify-center h-full">
                <div className="flex flex-1 items-center gap-2">
                  <AudioVisualizer isRecording={systemAudio?.capturing} />
                </div>
                <div className="flex items-center gap-2">
                  <StatusIndicator
                    setupRequired={systemAudio.setupRequired}
                    error={systemAudio.error}
                    isProcessing={systemAudio.isProcessing}
                    isAIProcessing={systemAudio.isAIProcessing}
                    capturing={systemAudio.capturing}
                  />
                </div>
              </div>
            ) : (
              <CompletionInput isHidden={isHidden} completion={completion} />
            )}
          </div>
        </Card>
        {customizable.cursor.type === "invisible" && platform !== "linux" ? (
          <CustomCursor />
        ) : null}
      </div>
    </ErrorBoundary>
  );
};

export default App;
