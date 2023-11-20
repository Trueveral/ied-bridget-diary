import { aiState } from "@/states/states";
import { generateUUID } from "three/src/math/MathUtils.js";

export const resetAIState = () => {
  aiState.user = generateUUID();
  aiState.conversationId = "";
  aiState.responseText = "";
  aiState.userMessage = "";
  aiState.status = "idle";
  aiState.inputText = "";
  aiState.pendingEmotion = false;
  aiState.refreshing = false;
  aiState.messageTerminated = false;
};
