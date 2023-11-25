"use client";
import { ChangeEvent, useId, useRef } from "react";
import { useSnapshot } from "valtio";
import { conversationAIState, globalState } from "@/States/states";
import { getEmotion, readData, readDataChunk } from "@/Helpers/AI/dataExchange";
import {
  RecordButton,
  StartNewConversationButton,
  SendButton,
  TerminateButton,
} from "./ActionButtons";
import AutoHeightTextarea from "./AutoHeightTextArea";
import cn from "classnames";
import s from "./style.module.css";
import { prepareAIForSending, resetAIState } from "@/Helpers/AI/base";
import { getMessagesByUserAndConversationId, supabase } from "@/Helpers/AI/db";
import { useAIActionGuard } from "@/components/Hooks/conversation";
import { MessageType, PreviousMessageType } from "@/Types/types";

export const AIInput = () => {
  const { inputText, messageTerminated } = useSnapshot(conversationAIState);
  const readerRef = useRef<ReadableStreamDefaultController<Uint8Array>>(null);
  const isUseInputMethod = useRef(false);
  const { canSend } = useAIActionGuard();
  const { user, conversationId } = useSnapshot(globalState);

  const handleSend = async () => {
    if (!user.id) {
      return console.error(
        "User context is lost. Please refresh the page. And report this bug to the developer."
      );
    }
    conversationAIState.status = "responding";
    conversationAIState.responseCompleted = false;
    conversationAIState.pendingEmotion = true;

    let previousUserMessages: PreviousMessageType[] = [];

    if (conversationId) {
      const data = await getMessagesByUserAndConversationId(
        user.id,
        conversationId
      );

      if (data.error || !data.messages) {
        console.error(data.error);
        return;
      }

      previousUserMessages = data.messages
        .reverse()
        .map((message: MessageType) => {
          return {
            content: message.text,
            role: message.role,
          };
        });

      if (previousUserMessages.length > 13) {
        previousUserMessages.splice(0, previousUserMessages.length - 13);
      }
    }

    const conversationHistory = prepareAIForSending(
      messageTerminated,
      inputText,
      previousUserMessages,
      user.username!!
    );

    await readData(user.id, conversationHistory, readerRef)
      .then(data => {
        if (!data) {
          throw new Error("An error occurred when reading data.");
        }
        let finishType: "emotion" | "final" = "emotion";
        console.log("finishReason: ", data?.finishReason);
        switch (data?.finishReason) {
          case "stop" || "length":
            conversationAIState.responseCompleted = true;
            conversationAIState.pendingEmotion = false;
            finishType = "emotion";
            break;
          case "content_filter":
            conversationAIState.responseCompleted = true;
            conversationAIState.responseText =
              "Your message seems to contain some inappropriate content. Please try again.";
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
          messageObject: data.messageObject,
        };
      })
      .then(async data => {
        if (data.finishType === "emotion") {
          if (data.messageObject) {
            const insertingConversationID = !conversationId
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
                      ? data.messageObject.gpt_id
                      : "user_" + data.messageObject.gpt_id,
                  user_id: user.id,
                  text:
                    role === "assistant"
                      ? data.messageObject.text
                      : conversationAIState.userMessage,
                  role: role,
                  conversation_id: insertingConversationID,
                },
              ]);
            }

            globalState.conversationId = insertingConversationID;

            await getEmotion();
          }
        }
      })
      .catch(e => {
        conversationAIState.responseText = "";
        conversationAIState.userMessage = "";
        conversationAIState.status = "idle";
        conversationAIState.responseCompleted = true;
        conversationAIState.pendingEmotion = false;
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

  const handleTerminate = async () => {
    if (!readerRef.current) return;
    await (readerRef.current as any).cancel();
    conversationAIState.messageTerminated = true;
    conversationAIState.responseText = "";
    conversationAIState.userMessage = "";
    conversationAIState.status = "idle";
    conversationAIState.responseCompleted = true;
    conversationAIState.pendingEmotion = false;
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 2xl:w-1/2 min-w-min flex gap-2 items-center justify-center max-w-2xl">
      <AutoHeightTextarea
        placeholder="Talk to Bridget... "
        value={inputText}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        minHeight={48}
        autoFocus
        className={`${cn(
          s.textArea
        )} resize-none block first-line:w-full px-3 py-2 bg-black/20 rounded-2xl text-white font-semibold focus:outline-none placeholder-shown:text-gray-400`}
      />
      <div className="flex flex-row flex-wrap min-w-max gap-2">
        <SendButton onSendCallback={handleSend} />
        <TerminateButton onTerminateCallback={handleTerminate} />
        {/* <RecordButton onSendCallback={handleSend} /> */}
      </div>
    </div>
  );
};
