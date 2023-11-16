import { generateUUID } from "three/src/math/MathUtils.js";
import { proxy } from "valtio";

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

export const aiState = proxy({
  user: generateUUID(),
  conversationId: "",
  responseText: "",
})