import { UserType } from "@/components/Hooks/base";
import { generateUUID } from "three/src/math/MathUtils.js";
import { proxy } from "valtio";
import { z } from "zod";

export const countSate = proxy({
  value: 10,
});

export const interactionState = proxy<{
  hoverId: number;
  activeId: number;
  activeRef: THREE.Mesh | null;
  textures: { [key: string]: THREE.Texture } | null;
}>({
  hoverId: -1,
  activeId: -1,
  activeRef: null,
  textures: null,
});

export const aiStateSchema = z.object({
  responseText: z.string(),
  userMessage: z.string(),
  status: z.enum([
    "idle",
    "responding",
    "concentrating",
    "happy",
    "sad",
    "angry",
    "narrative",
  ]),
  pendingEmotion: z.boolean(),
  inputText: z.string(),
  refreshing: z.boolean(),
  messageTerminated: z.boolean(),
  responseCompleted: z.boolean(),
});

type AiState = z.infer<typeof aiStateSchema>;

export const aiState: AiState = proxy({
  responseText: "",
  userMessage: "",
  status: "idle",
  inputText: "",
  pendingEmotion: false,
  refreshing: false,
  messageTerminated: false,
  responseCompleted: false,
});

type ChatListStateType = {
  showMask: boolean;
  contentPS: { width: number; height: number; x: number; y: number };
  abortController: AbortController | null;
};

export const chatListState: ChatListStateType = proxy({
  showMask: false,
  abortController: null,
  contentPS: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
});

type DiaryStateType = {
  savedDiaries: {
    userMessage: string;
    assistantMessage: string;
  }[];
};

export const diaryState: DiaryStateType = proxy({
  savedDiaries: [],
});

type GlobalStateType = {
  user: UserType;
  link: "conversation" | "diary" | "collections" | "about";
  conversationId?: string;
  isFirstMessage?: boolean;
};
export const globalState: GlobalStateType = proxy({
  user: {
    id: "fbf74ce6-0ee0-428d-9985-8db9a467c795",
    username: "Johnny Strawberryseed",
  },
  link: "conversation",
  conversationId: undefined,
  isFirstMessage: true,
});
