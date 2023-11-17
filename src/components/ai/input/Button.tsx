import { useAIActionGuard } from "@/components/hooks/ai";
import { Icon } from "@iconify/react";
import { useState } from "react";

export const SendButton = ({ onSendCallback }: { onSendCallback: any }) => {
  const { canSend } = useAIActionGuard();
  return (
    <button
      onClick={onSendCallback}
      disabled={!canSend}
      className={`transition ease-in-out duration-300 rounded-full p-2 ${
        canSend
          ? "bg-red-500 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {/* 图标插槽，可以替换为任何图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={`h-6 w-6 ${canSend ? "visible" : "invisible"}`}
      >
        {/* 这里是一个示例图标，可以替换为具体的图标 */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </button>
  );
};

export const TerminateButton = ({
  onTerminateCallback,
}: {
  onTerminateCallback: any;
}) => {
  const { canTerminate } = useAIActionGuard();
  return (
    <button
      onClick={onTerminateCallback}
      disabled={!canTerminate}
      className={`transition ease-in-out duration-300 rounded-full p-2 ${
        canTerminate
          ? "bg-red-500 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {/* 图标插槽，可以替换为任何图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={`h-6 w-6 ${canTerminate ? "visible" : "invisible"}`}
      >
        {/* 这里是一个示例图标，可以替换为具体的图标 */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </button>
  );
};

export const RecordButton = ({ onSendCallback }: { onSendCallback: any }) => {
  const [isRecording, setIsRecording] = useState(false);
  return (
    <button
      // onClick={isRecording ? stopRecording : startRecording}
      className="transition ease-in-out duration-300 rounded-full p-2 bg-red-500 text-white"
    >
      {isRecording ? (
        // 正方形图标
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="2"
          />
        </svg>
      ) : (
        // 麦克风图标
        <Icon icon="ph:microphone-fill" color="white" fill="white" />
      )}
    </button>
  );
};
