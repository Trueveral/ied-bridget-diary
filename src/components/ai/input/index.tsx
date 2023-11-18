import { ChangeEvent, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useSnapshot } from "valtio";
import { z } from "zod";
import { aiState } from "@/states/states";
import { AIResponse, exchangeChatMessage } from "@/helpers/ai/dataExchange";
import {
  RecordButton,
  SendButton,
  StartNewConversationButton,
  TerminateButton,
} from "./Button";
import AutoHeightTextarea from "../auto-height-textarea";
import cn from "classnames";
import s from "./style.module.css";

export const AIInput = () => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const { user, conversationId, inputText } = useSnapshot(aiState);

  // create a context for inputText

  const handleSend = async () => {
    aiState.responseText = "";
    aiState.status = "sending";
    aiState.userMessage = inputText;
    aiState.inputText = "";

    exchangeChatMessage(
      {
        onData: (res: AIResponse) => {
          // console.log(res.answer);
          aiState.responseText += res.answer;
          aiState.conversationId = res.conversation_id;
        },
        onError: (err: any) => {
          console.error(err);
        },
      },
      {
        query: inputText,
        conversationID: conversationId,
        user: user,
        responseMode: "streaming",
      }
    );
  };

  const handleSendMock = async () => {
    aiState.responseText = "";
    aiState.status = "sending";
    aiState.userMessage = inputText;
    aiState.inputText = "";
    // await new Promise(resolve => setTimeout(resolve, 2000));
    await fetch("/api/loripsum/3/short/plaintext", {
      method: "GET",
    })
      .then((response: Response) => {
        aiState.status = "responding";
        return response.text();
      })
      .then((data: string) => {
        aiState.responseText = data;
      });
    aiState.status = "idle";
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

  const isUseInputMethod = useRef(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    aiState.inputText = e.target.value;
  };
  const handleKeyUp = (e: any) => {
    if (e.code === "Enter") {
      e.preventDefault();
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current) handleSend();
    } else {
      aiState.status = "idle";
    }
  };

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing;
    aiState.status = "inputing";
    if (e.code === "Enter" && !e.shiftKey) {
      aiState.inputText = aiState.inputText.replace(/\n$/, "");
      e.preventDefault();
    }
  };

  const handleStartNewConversation = () => {
    aiState.conversationId = "";
    aiState.inputText = "";
    aiState.responseText = "";
    aiState.status = "idle";
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 2xl:w-1/2 min-w-min flex gap-2 items-center justify-center max-w-2xl">
      <AutoHeightTextarea
        value={inputText}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        minHeight={48}
        autoFocus
        className={`${cn(
          s.textArea
        )} resize-none block first-line:w-full px-3 py-2 border border-gray-300 bg-gray-300 rounded-2xl text-blue-600 font-bold focus:outline-none`}
      />
      <div className="flex flex-row flex-wrap min-w-max gap-2">
        <SendButton onSendCallback={handleSendMock} />
        <RecordButton onSendCallback={handleSendMock} />
        <TerminateButton onTerminateCallback={handleSendMock} />
        <StartNewConversationButton
          onClickCallback={handleStartNewConversation}
        />
      </div>
    </div>
  );
};
