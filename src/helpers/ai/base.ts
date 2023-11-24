import { conversationAIState, globalState } from "@/States/states";
import { generateUUID } from "three/src/math/MathUtils.js";
import { MessageType } from "@/components/Hooks/base";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

export const resetAIState = () => {
  conversationAIState.responseText = "";
  conversationAIState.userMessage = "";
  conversationAIState.status = "idle";
  conversationAIState.inputText = "";
  conversationAIState.pendingEmotion = false;
  conversationAIState.refreshing = false;
  conversationAIState.messageTerminated = false;
  conversationAIState.responseCompleted = false;
  globalState.isFirstMessage = true;
  globalState.conversationId = undefined;
};

export const prepareAIForSending = (
  messageTerminated: boolean,
  inputText: string,
  chatRecords: readonly any[]
) => {
  conversationAIState.messageTerminated = false;
  conversationAIState.responseText = "";
  conversationAIState.userMessage = inputText;
  conversationAIState.inputText = "";
  conversationAIState.status = "responding";
  conversationAIState.pendingEmotion = false;
  conversationAIState.responseCompleted = false;
  // aiState.messageTerminated = false;

  const conversationHistory = [
    {
      role: "system",
      content: `${process.env.NEXT_PUBLIC_PROMPT}`,
    },
    ...chatRecords,
    {
      role: "user",
      content: conversationAIState.userMessage,
    },
  ];

  return conversationHistory;
};
