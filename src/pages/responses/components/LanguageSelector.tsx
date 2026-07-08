import { Header, Selection } from "@/components";
import { LANGUAGES } from "@/lib";
import { updateLanguage } from "@/lib/storage/response-settings.storage";
import { useState, useEffect, useMemo } from "react";
import { getResponseSettings } from "@/lib";

export const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");

  useEffect(() => {
    const settings = getResponseSettings();
    setSelectedLanguage(settings.language);
  }, []);

  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);
    updateLanguage(languageId);
  };

  const languageOptions = useMemo(() => {
    return LANGUAGES.map((lang) => ({
      label: `${lang.flag} ${lang.name}`,
      value: lang.id,
    }));
  }, []);

  return (
    <div className="space-y-4">
      <Header
        title="回答の言語"
        description="AIの回答に使用する言語を選択します。この設定はすべてのプロバイダー・会話に一括で適用されます。対応言語は選択したLLMプロバイダーによって異なる場合があります"
        isMainTitle
      />

      <div className="max-w-md">
        <Selection
          selected={selectedLanguage}
          onChange={handleLanguageChange}
          options={languageOptions}
          placeholder="言語を選択"
        />
      </div>
    </div>
  );
};
