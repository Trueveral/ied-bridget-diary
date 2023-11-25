import { useAIActionGuard } from "@/components/Hooks/conversation";
import { Icon } from "@iconify/react";
import { useState } from "react";

export const SendButton = ({ onSendCallback }: { onSendCallback: any }) => {
  const { canSend } = useAIActionGuard();
  return (
    <button
      onClick={onSendCallback}
      disabled={!canSend}
      className={`transition ease-in-out duration-300 rounded-full p-2 w-10 h-10 flex items-center justify-center backdrop-blur-lg ${
        canSend
          ? "bg-blue-600 text-white"
          : "bg-white/20 text-gray-500 cursor-not-allowed"
      }`}
      title="Send"
    >
      <Icon icon="mingcute:send-fill" color="white" />
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
      className={`transition ease-in-out duration-300 rounded-full w-10 h-10 flex items-center justify-center p-2 backdrop-blur-lg ${
        canTerminate
          ? "bg-blue-600 text-white"
          : "bg-white/20 text-gray-500 cursor-not-allowed"
      }`}
      title="Terminate"
    >
      <Icon icon="ic:round-stop" color="white" fill="white" />
    </button>
  );
};

export const StartNewConversationButton = ({
  onClickCallback,
}: {
  onClickCallback: any;
}) => {
  const { canStartNew } = useAIActionGuard();
  return (
    <button
      onClick={onClickCallback}
      disabled={!canStartNew}
      className={`transition ease-in-out duration-300 rounded-full w-10 h-10 flex items-center justify-center p-2 ${
        canStartNew
          ? "bg-blue-600 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
      title="Create new"
    >
      <Icon icon="ri:chat-new-fill" color="white" fill="white" />
    </button>
  );
};

export const RecordButton = ({ onSendCallback }: { onSendCallback: any }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<any>(null);
  const [audioData, setAudioData] = useState<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newRecorder = new MediaRecorder(stream);

    newRecorder.start();

    newRecorder.ondataavailable = async e => {
      setAudioData([...audioData, e.data]);
    };

    setRecorder(newRecorder);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    // if (recorder) {
    //   recorder.stop();
    //   setIsRecording(false);
    //   const audioBlob = new Blob(audioData, { type: "audio/mp3" }); // 创建 Blob 对象
    //   // save audio blob to file
    //   const formData = new FormData();
    //   formData.append("file", audioBlob); // 将 Blob 对象添加到 FormData 对象
    //   const transcription = await openAIService.audio.transcriptions.create({
    //     file: audioBlob,
    //     model: "whisper-1",
    //   });
    //   console.log(transcription.text);
    //   setAudioData([]); // 清空音频数据
    // }
  };
  return (
    <button
      // onClick={isRecording ? stopRecording : startRecording}
      className="transition ease-in-out duration-300 rounded-full p-2 bg-blue-600 text-white w-10 h-10 flex items-center justify-center"
      title="Record"
      onClick={() => {
        setIsRecording(!isRecording);
        if (!isRecording) {
          startRecording();
        } else {
          stopRecording();
        }
      }}
    >
      {isRecording ? (
        <Icon icon="ic:round-stop" color="white" fill="white" />
      ) : (
        // 麦克风图标
        <Icon icon="ph:microphone-fill" color="white" fill="white" />
      )}
    </button>
  );
};
