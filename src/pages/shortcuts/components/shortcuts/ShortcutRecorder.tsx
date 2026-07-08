import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components";
import { Check, X } from "lucide-react";
import {
  isMacOS,
  validateShortcutKey,
  formatShortcutKeyForDisplay,
} from "@/lib";
import { invoke } from "@tauri-apps/api/core";

interface ShortcutRecorderProps {
  onSave: (key: string) => void;
  onCancel: () => void;
  disabled?: boolean;
  actionId?: string;
}

export const ShortcutRecorder = ({
  onSave,
  onCancel,
  disabled = false,
  actionId,
}: ShortcutRecorderProps) => {
  const [recordedKeys, setRecordedKeys] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const isRecording = true; // Always recording
  const isMoveWindow = actionId === "move_window";
  const minKeys = isMoveWindow ? 1 : 2;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isRecording) return;

      e.preventDefault();
      e.stopPropagation();

      const keys: string[] = [];

      // Add modifiers
      if (e.metaKey || e.ctrlKey) {
        keys.push(isMacOS() ? "cmd" : "ctrl");
      }
      if (e.altKey) keys.push("alt");
      if (e.shiftKey) keys.push("shift");

      // Handle special keys properly
      let mainKey = e.key.toLowerCase();

      // Map special keys to Tauri format
      const specialKeyMap: Record<string, string> = {
        arrowup: "up",
        arrowdown: "down",
        arrowleft: "left",
        arrowright: "right",
        " ": "space",
        escape: "esc",
        enter: "return",
        backspace: "backspace",
        delete: "delete",
        tab: "tab",
        "[": "bracketleft",
        "]": "bracketright",
        ";": "semicolon",
        "'": "quote",
        "`": "grave",
        "\\": "backslash",
        "/": "slash",
        ",": "comma",
        ".": "period",
        "-": "minus",
        "=": "equal",
        "+": "plus",
      };

      if (specialKeyMap[mainKey]) {
        mainKey = specialKeyMap[mainKey];
      }

      if (isMoveWindow) {
        if (["up", "down", "left", "right"].includes(mainKey)) {
          setError(
            "矢印キーはウィンドウ移動用に自動設定されます。修飾キーのみ設定してください。"
          );
          return;
        }
        if (keys.length >= 1) {
          setRecordedKeys(keys);
          setError("");
        } else {
          setError("少なくとも1つの修飾キー(Cmd/Ctrl/Alt/Shift)を含めてください");
        }
      } else {
        if (!["control", "alt", "shift", "meta"].includes(mainKey)) {
          keys.push(mainKey);
        }

        if (keys.length >= 2) {
          setRecordedKeys(keys);
          setError("");
        } else {
          setError(
            "修飾キー(Cmd/Ctrl/Alt/Shift)を1つとキーを1つ以上含めてください"
          );
        }
      }
    },
    [isRecording, isMoveWindow]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!isRecording) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [isRecording]
  );

  useEffect(() => {
    if (isRecording) {
      // Focus the window to ensure key events are captured
      window.focus();

      window.addEventListener("keydown", handleKeyDown, true);
      window.addEventListener("keyup", handleKeyUp, true);

      return () => {
        window.removeEventListener("keydown", handleKeyDown, true);
        window.removeEventListener("keyup", handleKeyUp, true);
      };
    }
  }, [isRecording, handleKeyDown, handleKeyUp]);

  const handleSave = async () => {
    if (recordedKeys.length < minKeys) {
      setError(
        isMoveWindow
          ? "ウィンドウ移動には少なくとも1つの修飾キーが必要です"
          : "ショートカットには修飾キーとキーをそれぞれ1つ以上含めてください"
      );
      return;
    }

    const shortcutKey = recordedKeys.join("+");

    // For move_window, skip validation as we'll add arrow keys in the backend
    if (!isMoveWindow) {
      // Validate with frontend
      if (!validateShortcutKey(shortcutKey)) {
        setError("無効なショートカットの組み合わせです");
        return;
      }

      // Validate with backend
      try {
        const isValid = await invoke<boolean>("validate_shortcut_key", {
          key: shortcutKey,
        });

        if (!isValid) {
          setError("このショートカットの組み合わせはサポートされていません");
          return;
        }
      } catch (e) {
        setError("ショートカットの検証に失敗しました");
        return;
      }
    }

    onSave(shortcutKey);
  };

  const handleCancel = () => {
    setRecordedKeys([]);
    setError("");
    onCancel();
  };

  const displayKey =
    recordedKeys.length > 0
      ? formatShortcutKeyForDisplay(recordedKeys.join("+"))
      : "キー入力を待っています...";

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <div className="px-3 py-2 bg-primary/5 border-2 border-primary/50 rounded-md font-mono text-sm text-center">
            {isRecording ? (
              <span className="text-primary font-medium animate-pulse">
                ⌨️ {displayKey}
              </span>
            ) : (
              <span>{displayKey}</span>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant="default"
          onClick={handleSave}
          disabled={disabled || recordedKeys.length < minKeys}
          title="ショートカットを保存"
        >
          <Check className="h-4 w-4" />
          保存
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={disabled}
          title="キャンセル"
        >
          <X className="h-4 w-4" />
          キャンセル
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {isRecording && !error && (
        <p className="text-xs text-muted-foreground">
          {isMoveWindow
            ? "修飾キーを押してください(例: Cmd+Shift)。矢印キーは自動的に動作します。"
            : "キーの組み合わせを押してください(例: Cmd+Shift+K)"}
        </p>
      )}

      {recordedKeys.length >= minKeys && !error && (
        <p className="text-xs text-green-600">
          ✓ ショートカットを記録しました!「保存」をクリックして適用してください。
        </p>
      )}
    </div>
  );
};
