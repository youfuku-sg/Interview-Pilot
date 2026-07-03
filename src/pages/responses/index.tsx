import {
  ResponseLength,
  LanguageSelector,
  AutoScrollToggle,
} from "./components";
import { PageLayout } from "@/layouts";
import { useApp } from "@/contexts";

const Responses = () => {
  const { hasActiveLicense } = useApp();

  return (
    <PageLayout
      title="回答設定"
      description="AIによる回答の生成・表示方法をカスタマイズします"
    >
      {!hasActiveLicense && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-[10px] lg:text-sm text-foreground font-medium mb-2">
            🔒 プレミアム機能
          </p>
          <p className="text-[10px] lg:text-sm text-muted-foreground">
            回答のカスタマイズ機能(回答の長さ・言語選択・自動スクロール制御)の利用には有効なライセンスが必要です。
          </p>
        </div>
      )}

      {/* Response Length */}
      <ResponseLength />

      {/* Language Selector */}
      <LanguageSelector />

      {/* Auto-Scroll Toggle */}
      <AutoScrollToggle />
    </PageLayout>
  );
};

export default Responses;
