import { useCompletion } from "@/hooks";
import { Audio } from "./Audio";
import { Input } from "./Input";
import { UseCompletionReturn } from "@/types";

export { Audio } from "./Audio";

export const Completion = ({ isHidden }: { isHidden: boolean }) => {
  const completion = useCompletion();

  return (
    <>
      <Audio {...completion} />
      <Input {...completion} isHidden={isHidden} />
    </>
  );
};

/** Audio ボタンを除いた Input 部分のみ。completion を外から受け取る（2カラムレイアウト用）。 */
export const CompletionInput = ({
  isHidden,
  completion,
}: {
  isHidden: boolean;
  completion: UseCompletionReturn;
}) => {
  return <Input {...completion} isHidden={isHidden} />;
};
