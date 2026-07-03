import { useState, useEffect } from "react";
import { getAppVersion } from "@/lib";

export const useVersion = () => {
  const [version, setVersion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setIsLoading(true);
        const appVersion = await getAppVersion();
        setVersion(appVersion);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch version:", err);
        setError("バージョンの読み込みに失敗しました");
        setVersion("不明");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersion();
  }, []);

  return { version, isLoading, error };
};
