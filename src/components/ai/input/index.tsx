import { ChangeEvent, use, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useSnapshot } from "valtio";
import { z } from "zod";
import { aiState } from "@/states/states";
import {
  AIResponse,
  exchangeChatMessage,
  processStream,
} from "@/helpers/ai/dataExchange";
import {
  RecordButton,
  SendButton,
  StartNewConversationButton,
  TerminateButton,
} from "./Button";
import AutoHeightTextarea from "../auto-height-textarea";
import cn from "classnames";
import s from "./style.module.css";
import { escape } from "querystring";
import { generateUUID } from "three/src/math/MathUtils.js";
import { BACKGROUND_INFO_PROMPT, resetAIState } from "@/helpers/ai/base";
import { useAIActionGuard } from "@/components/hooks/ai";
import { OpenAI } from "openai";
import axios from "axios";

const SHE_S_A_RAINBOW =
  "She comes in colours everywhere, She combs her hair, She's like a rainbow, Coming, colours in the air, Oh, everywhere, She comes in colours, She comes in colours everywhere, She combs her hair, She's like a rainbow, Coming, colours in the air, Oh, everywhere, She comes in colours, Have you seen her dressed in blue?, See the sky in front of you, And her face is like a sail, Speck of white so fair and pale, Have you seen a lady fairer?, She comes in colours everywhere, She combs her hair, She's like a rainbow, Coming, colours in the air, Oh, everywhere, She comes in colours, Have you seen her all in gold?, Like a queen in days of old";

export const SERET_CODE = "KeasonAya";

export const AIInput = () => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const { user, conversationId, inputText, userMessage, chatRecords } =
    useSnapshot(aiState);
  const isUseInputMethod = useRef(false);
  const { canSend } = useAIActionGuard();

  const onData = (res: AIResponse) => {
    // console.log(res.answer);
    aiState.responseText += res.answer;
    aiState.conversationId = res.conversation_id;
  };

  const onError = (err: any) => {
    aiState.responseText = "Sorry, an error occurred. Please try again.";
    console.error(err);
  };

  const onCompleted = async () => {
    const { type, ratio } = await globalThis
      .fetch(`${process.env.NEXT_PUBLIC_TWINWORD_API_URL}/sentiment_analyze/`, {
        method: "POST",
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_TWINWORD_API_KEY || "",
          "X-RapidAPI-Host": "twinword-twinword-bundle-v1.p.rapidapi.com",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: aiState.responseText,
        }),
      })
      .then(response => {
        if (/^2/.test(response.status.toString())) {
          return response.json();
        }
      })
      .then((data: { type: "positive" | "negative"; ratio: number }) => {
        return {
          type: data.type,
          ratio: data.ratio,
        };
      });

    if (ratio < 0.2) {
      aiState.status = "narrative";
    } else {
      if (type === "positive") {
        aiState.status = "happy";
      }
      if (type === "negative") {
        if (ratio > 0.6) {
          aiState.status = "angry";
        } else {
          aiState.status = "sad";
        }
      }
    }
  };

  // create a context for inputText

  const handleSend = async () => {
    if (aiState.responseText.length > 0) {
      aiState.chatRecords.push({
        role: "user",
        content: aiState.userMessage,
      });
      aiState.chatRecords.push({
        role: "assistant",
        content: aiState.responseText,
      });
    }

    aiState.responseText = "";
    aiState.userMessage = inputText;
    aiState.inputText = "";

    aiState.status = "responding";
    aiState.pendingEmotion = false;
    aiState.messageTerminated = false;

    // do Open AI.

    const conversationHistory = [
      {
        role: "system",
        content: `${BACKGROUND_INFO_PROMPT}`,
      },
      ...chatRecords,
      {
        role: "user",
        content: aiState.userMessage,
      },
    ];

    const openAIService = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    async function readData() {
      const completion = await openAIService.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: conversationHistory,
        stream: true,
        presence_penalty: 0.6,
        temperature: 0.6,
      });

      let buffer = "";

      aiState.status = "responding";
      aiState.responseCompleted = false;

      for await (const chunk of completion) {
        const result = chunk.choices[0].delta.content ?? "";
        aiState.responseText += result;
        buffer += result;
        aiState.pendingEmotion = true;
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      aiState.responseCompleted = true;
      await onCompleted();
      aiState.pendingEmotion = false;
    }

    readData();
  };
  const handleSendMock = async () => {
    if (aiState.responseText.length > 0) {
      aiState.chatRecords.push({
        role: "user",
        content: aiState.userMessage,
      });
      aiState.chatRecords.push({
        role: "assistant",
        content: aiState.responseText,
      });
    }

    aiState.responseText = "";
    aiState.userMessage = inputText;
    aiState.inputText = "";

    aiState.status = "responding";
    aiState.pendingEmotion = false;
    aiState.messageTerminated = false;

    async function readData() {
      aiState.status = "responding";
      aiState.responseCompleted = false;

      await new Promise(resolve => setTimeout(resolve, 1000));
      aiState.responseText =
        "cbewucbewubcewbcewbcejcnjwenchwec ejwcewcwecwecec\
      cewcewcewhcbewjhbxc hewxnjwebchejwbcejwcw dewbcxgwehvcxbwhejc\
      dbewhbewhcxewjcewb cbewhbcxwejcwe\
      dewjhcbewjhbcwehjbchewjbchejwb";

      aiState.responseCompleted = true;
      aiState.status = "happy";
      aiState.pendingEmotion = false;
    }

    readData();
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    aiState.inputText = e.target.value;
  };
  const handleKeyUp = (e: any) => {
    if (e.code === "Enter") {
      e.preventDefault();
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current && canSend) handleSend();
    }
  };

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing;
    if (e.code === "Enter" && !e.shiftKey) {
      aiState.inputText = aiState.inputText.replace(/\n$/, "");
      e.preventDefault();
    }
  };

  const handleTerminate = async () => {
    aiState.messageTerminated = true;
    aiState.userMessage = "";
    aiState.status = "idle";
  };

  const handleStartNewConversation = async () => {
    // transcribe the above curl command to js
    aiState.refreshing = true;
    await fetch(`/api/dify/v1/conversations/${aiState.conversationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: aiState.user,
      }),
    })
      .then(response => {
        if (/^2/.test(response.status.toString())) {
          return Promise.resolve(response);
        } else {
          throw new Error("Sorry, an error occurred. Please try again.");
        }
      })
      // .then(data => {
      //   if (data.result !== "success") {
      //     throw new Error("Sorry, an error occurred. Please try again.");
      //   }
      //   console.log(data);
      // })
      .catch(error => {
        console.error(error);
        aiState.responseText = error.message;
        aiState.refreshing = false;
      });

    resetAIState();
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
