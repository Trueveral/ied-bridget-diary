import { useState } from "react";
import { Icon } from "@iconify/react";
import { useSnapshot } from "valtio";
import { z } from "zod";
import { aiState } from "@/states/states";
import { handleBlock } from "@/helpers/ai/dataExchange";
import { RecordButton, SendButton, TerminateButton } from "./Button";
import { Input } from "./Input";

export const AIInput = () => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const { user, conversationId, inputText } = useSnapshot(aiState);

  // create a context for inputText

  const handleSend = async () => {
    aiState.userMessage = aiState.inputText;
    aiState.responseText = "";
    aiState.inputText = "";
    aiState.status = "sending";

    const response = await fetch("/api/dify/v1/chat-messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer app-VN5puGCnSY0v5nS37sVdYdMC`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: "",
        query: inputText,
        response_mode: "blocking",
        conversation_id: "",
        user: user,
      }),
    });
    // handleStream(responseRef.current ? responseRef.current : response);
    handleBlock(response);
  };

  const handleSendMock = async () => {
    aiState.responseText = "";
    aiState.status = "sending";
    aiState.userMessage = inputText;
    aiState.inputText = "";
    await new Promise(resolve => setTimeout(resolve, 3000));
    await fetch("/api/loripsum/3/short/plaintext", {
      method: "GET",
    })
      .then((response: Response) => {
        return response.text();
      })
      .then((data: string) => {
        aiState.responseText = data;
      });
    aiState.status = "responding";
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
    // setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      // setIsRecording(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 min-w-min flex gap-2">
      <Input onSendCallback={handleSendMock} />
      <SendButton onSendCallback={handleSendMock} />
      <RecordButton onSendCallback={handleSendMock} />
      <TerminateButton onTerminateCallback={handleSendMock} />
    </div>
  );
};
