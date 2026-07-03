import { InfoIcon, MicIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger, Button } from "@/components";
import { AutoSpeechVAD } from "./AutoSpeechVad";
import { UseCompletionReturn } from "@/types";
import { useApp } from "@/contexts";

export const Audio = ({
  micOpen,
  setMicOpen,
  enableVAD,
  setEnableVAD,
  submit,
  setState,
}: UseCompletionReturn) => {
  const { selectedSttProvider, pluelyApiEnabled, selectedAudioDevices } =
    useApp();

  const speechProviderStatus = selectedSttProvider.provider;

  return (
    <Popover open={micOpen} onOpenChange={setMicOpen}>
      <PopoverTrigger asChild>
        {(pluelyApiEnabled || speechProviderStatus) && enableVAD ? (
          <AutoSpeechVAD
            key={selectedAudioDevices.input.id}
            submit={submit}
            setState={setState}
            setEnableVAD={setEnableVAD}
            microphoneDeviceId={selectedAudioDevices.input.id}
          />
        ) : (
          <Button
            size="icon"
            onClick={() => {
              setEnableVAD(!enableVAD);
            }}
            className="cursor-pointer"
            title="音声入力の切り替え"
          >
            <MicIcon className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        className={`w-80 p-3 ${
          pluelyApiEnabled || speechProviderStatus ? "hidden" : ""
        }`}
        sideOffset={8}
      >
        <div className="text-sm select-none">
          <div className="font-semibold text-orange-600 mb-1">
            音声プロバイダーの設定が必要です
          </div>
          <p className="text-muted-foreground">
            {!speechProviderStatus ? (
              <>
                <div className="mt-2 flex flex-row gap-1 items-center text-orange-600">
                  <InfoIcon size={16} />
                  {selectedSttProvider.provider ? null : (
                    <p>プロバイダーが未設定です</p>
                  )}
                </div>

                <span className="block mt-2">
                  設定画面で音声プロバイダーを設定すると、音声入力が有効になります。
                </span>
              </>
            ) : null}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
