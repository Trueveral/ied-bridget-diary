import { conversationAIState, globalState } from "@/States/states";
import { prompt } from "@/Helpers/AI/prompt";

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
  chatRecords: readonly any[],
  username: string
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
      content:
        prompt +
        `Refer your interloucutor as ${username}, if it is not a normal name, ignore it.`,
    },
    ...chatRecords,
    {
      role: "user",
      content: conversationAIState.userMessage,
    },
  ];

  return conversationHistory;
};
