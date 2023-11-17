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
  user: z.string(),
  conversationId: z.string(),
  responseText: z.string(),
  userMessage: z.string(),
  status: z.enum(["idle", "sending", "responding", "inputing"]),
  inputText: z.string(),
});

type AiState = z.infer<typeof aiStateSchema>;

export const aiState: AiState = proxy({
  user: generateUUID(),
  conversationId: "",
  responseText: "",
  userMessage: "",
  status: "idle",
  inputText: "",
});
