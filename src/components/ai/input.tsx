import { useState } from "react";
import { Icon } from "@iconify/react";
import { useSnapshot } from "valtio";
import { z } from "zod";
import { aiState } from "@/states/states";

const aiResponseSchema = z.object({
  id: z.string(),
  answer: z.string(),
  created_at: z.number(),
});

type AiResponse = z.infer<typeof aiResponseSchema>;

export const Input = () => {
  const [text, setText] = useState("");
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user, conversationId, responseText } = useSnapshot(aiState);
  const handleSend = async () => {
    setIsSending(prevState => !prevState);
    await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer app-VN5puGCnSY0v5nS37sVdYdMC`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: "",
        query: text,
        response_mode: "streaming",
        conversation_id: "",
        user: user,
      }),
    });

    const eventSource = new EventSource("/api/proxy/v1/chat-messages");

    eventSource.onmessage = e => {
      console.log(e);
      const data = JSON.parse(e.data);
      console.log(data);
    };
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newRecorder = new MediaRecorder(stream);
    newRecorder.start();

    newRecorder.ondataavailable = async e => {
      const audioBlob = e.data;
      const formData = new FormData();
      formData.append("file", audioBlob);

      const response = await fetch("https://api.dify.ai/v1/audio-to-text", {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_API_TOKEN`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    };

    setRecorder(newRecorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const isInputEmpty = text.length === 0;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 min-w-min flex gap-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 bg-gray-300 rounded-full text-red-400 font-bold focus:outline-none"
        aria-label="Text input"
        placeholder=""
      />
      <button
        onClick={handleSend}
        disabled={isInputEmpty}
        className={`transition ease-in-out duration-300 rounded-full p-2 ${
          isInputEmpty
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-500 text-white"
        }`}
      >
        {/* 图标插槽，可以替换为任何图标 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`h-6 w-6 ${isInputEmpty ? "invisible" : "visible"}`}
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
    </div>
  );
};
