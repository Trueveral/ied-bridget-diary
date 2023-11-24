import { springOptions } from "@/Helpers/AI/ringOptions";
import { calculatePosition, createToArray } from "@/Helpers/AI/ringAnimation";
import {
  conversationAIState,
  conversationChatListState,
  globalState,
} from "@/States/states";
import { useSpring } from "@react-spring/three";
import { use, useEffect } from "react";
import { useSnapshot } from "valtio";
import { useRouter } from "next/router";

export const useAIActionGuard = () => {
  const { status, inputText, refreshing } = useSnapshot(conversationAIState);

  const obj = {
    canSend: false,
    canTerminate: false,
    canStartNew: false,
  };

  if (refreshing) return obj;
  obj.canStartNew = status !== "responding";
  obj.canSend = inputText !== "";
  obj.canTerminate = status === "responding";

  return obj;
};

export const useRingAnimation = (index: number, useLog: false) => {
  const { status: ringState } = useSnapshot(conversationAIState);
  const springDelay = springOptions[ringState].delay * index;
  const springReset = springOptions[ringState].reset;
  const springFromPosition = springOptions[ringState].fromPosition;
  const springToPosition = springOptions[ringState].toPosition;
  const springFromScale = springOptions[ringState].fromScale;
  const springToScale = springOptions[ringState].toScale;
  const springConfig = springOptions[ringState].springConfig;
  let toArray = createToArray(index, ringState, springOptions[ringState]);
  const useToArray =
    Array.isArray(springOptions[ringState].toPosition[0]) ||
    (Array.isArray(springOptions[ringState].toScale) &&
      springOptions[ringState].toScale.length > 1);

  const { position, scale } = useSpring({
    delay: springDelay,
    reverse: true,
    from: {
      position: calculatePosition(index, ringState, springFromPosition),
      scale: springFromScale,
    },
    to: useToArray
      ? toArray
      : {
          position: calculatePosition(
            index,
            ringState,
            springOptions[ringState].toPosition
          ),
          scale: springOptions[ringState].toScale,
        },
    config: springConfig
      ? springConfig
      : { mass: 1, tension: 100, friction: 20 },
  });

  useEffect(() => {
    if (!useLog) return;
    console.log("ringState: ", ringState);
    console.log("toArray: ", toArray);
    console.log("springFromPosition: ", springFromPosition);
    console.log("springToPosition: ", springToPosition);
    console.log("springToScale: ", springToScale);
    console.log("useToArray: ", useToArray);
    console.log("springDelay: ", springDelay * index);
  }, [
    useLog,
    toArray,
    springToPosition,
    springToScale,
    ringState,
    useToArray,
    springDelay,
    springFromPosition,
    index,
  ]);

  return {
    position,
    scale,
  };
};
