import {
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Header,
} from "@/components";
import { UseSettingsReturn } from "@/types";
import { LaptopMinimalIcon, MousePointer2Icon } from "lucide-react";

export const ScreenshotConfigs = ({
  screenshotConfiguration,
  handleScreenshotModeChange,
  handleScreenshotPromptChange,
  handleScreenshotEnabledChange,
}: UseSettingsReturn) => {
  return (
    <div id="screenshot" className="space-y-3">
      <div className="space-y-3">
        {/* Screenshot Capture Mode: Selection and Screenshot */}
        <div className="space-y-2">
          <div className="flex flex-col">
            <Header
              title="キャプチャ方法"
              description={
                screenshotConfiguration.enabled
                  ? "スクリーンショットモード: ワンクリックで画面全体をすばやくキャプチャします。"
                  : "範囲選択モード: ドラッグして特定の範囲を選択してキャプチャします。"
              }
            />
          </div>
          <Select
            value={screenshotConfiguration.enabled ? "screenshot" : "selection"}
            onValueChange={(value) =>
              handleScreenshotEnabledChange(value === "screenshot")
            }
          >
            <SelectTrigger className="w-full h-11 border-1 border-input/50 focus:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                {screenshotConfiguration.enabled ? (
                  <LaptopMinimalIcon className="size-4" />
                ) : (
                  <MousePointer2Icon className="size-4" />
                )}
                <div className="text-sm font-medium">
                  {screenshotConfiguration.enabled
                    ? "スクリーンショットモード"
                    : "範囲選択モード"}
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selection">
                <div className="flex items-center gap-2">
                  <MousePointer2Icon className="size-4" />
                  <div className="font-medium">範囲選択モード</div>
                </div>
              </SelectItem>
              <SelectItem value="screenshot" className="flex flex-row gap-2">
                <LaptopMinimalIcon className="size-4" />
                <div className="font-medium">スクリーンショットモード</div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mode Selection: Auto and Manual */}
        <div className="space-y-2">
          <div className="flex flex-col">
            <Header
              title="処理モード"
              description={
                screenshotConfiguration.mode === "manual"
                  ? "スクリーンショットは自動的に添付ファイルに追加されます。その後、自分のプロンプトと一緒に送信できます。複数枚キャプチャして後でまとめて送信することも可能です。"
                  : "スクリーンショットはカスタムプロンプトを使ってAIに自動送信されます。手動操作は不要ですが、一度に送信できるスクリーンショットは1枚のみです。"
              }
            />
          </div>
          <Select
            value={screenshotConfiguration.mode}
            onValueChange={handleScreenshotModeChange}
          >
            <SelectTrigger className="w-full h-11 border-1 border-input/50 focus:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  {screenshotConfiguration.mode === "auto" ? "自動" : "手動"}
                  モード
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">
                <div className="font-medium">手動モード</div>
              </SelectItem>
              <SelectItem value="auto">
                <div className="font-medium">自動モード</div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Prompt Input - Only show when auto mode is selected */}
        {screenshotConfiguration.mode === "auto" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">自動プロンプト</Label>
            <Input
              placeholder="スクリーンショット自動解析用のプロンプトを入力..."
              value={screenshotConfiguration.autoPrompt}
              onChange={(e) => handleScreenshotPromptChange(e.target.value)}
              className="w-full h-11 border-1 border-input/50 focus:border-primary/50 transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              スクリーンショット撮影時にこのプロンプトが自動的に使用されます
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground/70">
        <p>
          💡 <strong>ヒント:</strong>{" "}
          {screenshotConfiguration.enabled
            ? "スクリーンショットモードはワンクリックで画面全体をキャプチャします。"
            : "範囲選択モードでは特定の範囲を選んでキャプチャできます。"}{" "}
          自動モードはすばやい解析に、手動モードはより細かい制御に向いています。
        </p>
      </div>
    </div>
  );
};
