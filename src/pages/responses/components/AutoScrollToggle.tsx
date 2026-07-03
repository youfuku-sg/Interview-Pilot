import { Switch, Label, Header } from "@/components";
import { useApp } from "@/contexts";
import { useState, useEffect } from "react";
import { getResponseSettings, updateAutoScroll } from "@/lib";

export const AutoScrollToggle = () => {
  const { hasActiveLicense } = useApp();
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  useEffect(() => {
    const settings = getResponseSettings();
    setAutoScroll(settings.autoScroll);
  }, []);

  const handleSwitchChange = (checked: boolean) => {
    if (!hasActiveLicense) {
      return;
    }
    setAutoScroll(checked);
    updateAutoScroll(checked);
  };

  return (
    <div className="space-y-4">
      <Header
        title="自動スクロールの動作"
        description="回答が自動的に一番下までスクロールするかどうかを制御します。この設定はすぐに反映され、ストリーミング中の回答が最新の内容まで自動スクロールするかどうかを制御します"
        isMainTitle
      />

      <div className="flex items-center justify-between p-4 border rounded-xl">
        <div className="flex items-center space-x-3">
          <div>
            <Label className="text-sm font-medium">
              {autoScroll ? "自動スクロール: 有効" : "自動スクロール: 無効"}
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {autoScroll
                ? "回答が届くたびに自動的に一番下までスクロールします"
                : "回答が届いても現在のスクロール位置を維持します"}
            </p>
          </div>
        </div>
        <Switch
          checked={autoScroll}
          onCheckedChange={handleSwitchChange}
          disabled={!hasActiveLicense}
          title={`自動スクロールを${!autoScroll ? "有効" : "無効"}に切り替え`}
          aria-label={`自動スクロールを${
            autoScroll ? "無効" : "有効"
          }に切り替え`}
        />
      </div>
    </div>
  );
};
