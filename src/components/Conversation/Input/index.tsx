"use client";
import { ChangeEvent, useRef } from "react";
import { useSnapshot } from "valtio";
import { AIState, conversationAIState, globalState } from "@/States/states";
import { getEmotion } from "@/Helpers/AI/dataExchange";
import {
  RecordButton,
  SendButton,
  StartNewConversationButton,
  TerminateButton,
} from "./ActionButtons";
import AutoHeightTextarea from "./AutoHeightTextArea";
import cn from "classnames";
import s from "./style.module.css";
import {
  getMessagesByUser,
  getMessagesByUserAndConversationId,
  openAIService,
  prepareAIForSending,
  resetAIState,
  supabase,
} from "@/Helpers/AI/base";
import { useAIActionGuard } from "@/components/Hooks/ai";
import { MessageType } from "@/components/Hooks/base";

export const AIInput = () => {
  const { inputText, messageTerminated } = useSnapshot(conversationAIState);
  const abortController = useRef<AbortController | null>(null);
  const isUseInputMethod = useRef(false);
  const { canSend } = useAIActionGuard();
  const { user, conversationId, isFirstMessage } = useSnapshot(globalState);
  const { abortController: stateAbortController } =
    useSnapshot(conversationAIState);

  async function readData(conversationHistory: any[]) {
    const completion = await openAIService.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: conversationHistory,
      stream: true,
      presence_penalty: 0.6,
      temperature: 0.6,
    });

    const messageObj: MessageType = {
      gpt_id: "",
      user_id: user.id!!,
      text: "",
      role: "assistant",
      timestamp: 0,
    };

    conversationAIState.status = "responding";
    conversationAIState.responseCompleted = false;
    conversationAIState.pendingEmotion = true;
    abortController.current = completion.controller;
    conversationAIState.abortController = completion.controller;

    for await (const chunk of completion) {
      const result = chunk.choices[0].delta.content ?? "";

      conversationAIState.responseText += result;

      messageObj.gpt_id = chunk.id;
      messageObj.timestamp = chunk.created;
      messageObj.text += result;

      const finishReason = chunk.choices[0].finish_reason;
      if (finishReason) {
        return {
          finishReason: finishReason,
          messageObj: messageObj,
        };
      }

      // await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  const handleSend = async () => {
    const messages = isFirstMessage
      ? []
      : (await getMessagesByUserAndConversationId(user.id!!, conversationId!!))
          .messages!!.slice()
          .reverse()
          .map((message: MessageType) => {
            return {
              content: message.text,
              role: message.role,
            };
          });

    if (messages.length > 15) {
      messages.splice(0, messages.length - 15);
    }

    const conversationHistory = prepareAIForSending(
      messageTerminated,
      inputText,
      messages
    );

    await readData(conversationHistory)
      .then(data => {
        let finishType = "";
        switch (data?.finishReason) {
          case "stop" || "length":
            conversationAIState.responseCompleted = true;
            conversationAIState.pendingEmotion = false;
            finishType = "emotion";
            break;
          case "content_filter":
            conversationAIState.responseCompleted = true;
            conversationAIState.responseText = "Don't say bad words!";
            conversationAIState.status = "angry";
            conversationAIState.pendingEmotion = false;
            finishType = "final";
            break;
          default:
            console.error(data?.finishReason);
            conversationAIState.responseText = "";
            conversationAIState.userMessage = "";
            conversationAIState.status = "idle";
            conversationAIState.responseCompleted = true;
            conversationAIState.pendingEmotion = false;
            finishType = "final";
            break;
        }
        return {
          finishType,
          messageObj: data?.messageObj,
        };
      })
      .then(async data => {
        if (data.finishType === "emotion") {
          if (data.messageObj) {
            const insertingConversationID = isFirstMessage
              ? await supabase
                  .from("Conversation")
                  .insert([{ user_id: user.id!! }])
                  .select()
                  .then(data => {
                    if (data.error) {
                      console.error(data.error);
                      return;
                    }
                    return data.data?.[0].id;
                  })
              : conversationId;

            if (!insertingConversationID) {
              console.error("insertingConversationID is null");
              return;
            }

            const roles = ["assistant", "user"];
            for (const role of roles) {
              await supabase.from("Message").insert([
                {
                  gpt_id:
                    role === "assistant"
                      ? data.messageObj?.gpt_id
                      : "user_" + data.messageObj?.gpt_id,
                  user_id: user.id,
                  text:
                    role === "assistant"
                      ? data.messageObj?.text
                      : conversationAIState.userMessage,
                  role: role,
                  conversation_id: insertingConversationID,
                },
              ]);
            }

            globalState.isFirstMessage = false;
            globalState.conversationId = insertingConversationID;

            await getEmotion();
          }
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    conversationAIState.inputText = e.target.value;
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
      conversationAIState.inputText = conversationAIState.inputText.replace(
        /\n$/,
        ""
      );
      e.preventDefault();
    }
  };

  const handleTerminate = () => {
    abortController.current?.abort();
    conversationAIState.messageTerminated = true;
    conversationAIState.responseText = "";
    conversationAIState.userMessage = "";
    conversationAIState.status = "idle";
    conversationAIState.responseCompleted = true;
    conversationAIState.pendingEmotion = false;
  };

  const handleStartNewConversation = async () => {
    // transcribe the above curl command to js
    conversationAIState.refreshing = true;
    resetAIState();
    // create new conversation

    conversationAIState.refreshing = false;
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
        <SendButton onSendCallback={handleSend} />
        <TerminateButton onTerminateCallback={handleTerminate} />
        <RecordButton onSendCallback={handleSend} />
        <StartNewConversationButton
          onClickCallback={handleStartNewConversation}
        />
      </div>
    </div>
  );
};
