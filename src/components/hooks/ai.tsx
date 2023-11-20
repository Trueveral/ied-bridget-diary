import { springOptions } from "@/helpers/ai/ringOptions";
import { calculatePosition, createToArray } from "@/helpers/ai/ringAnimation";
import { aiState } from "@/states/states";
import { useSpring } from "@react-spring/three";
import { use, useEffect } from "react";
import { useSnapshot } from "valtio";

export const useAIActionGuard = () => {
  const { status, inputText, conversationId, refreshing } =
    useSnapshot(aiState);

  const obj = {
    canSend: false,
    canTerminate: false,
    canStartNew: false,
  };

  if (refreshing) return obj;
  obj.canStartNew = conversationId !== "";
  obj.canSend = inputText !== "";
  obj.canTerminate = status === "responding";

  return obj;
};

export const useStreamReader = (response: Response) => {
  if (!response.ok) {
    console.error(response);
    return;
  }

  const reader = response.body!!.getReader();
  let decoder = new TextDecoder("utf-8");
  let data = "";
  let buffer = [];
  let bufferObj: any;

  const read = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        console.log("Stream complete");
        return;
      }
      const lines = data.split("\n");
      try {
        lines.forEach(line => {
          if (!line || !line.startsWith("data:")) return;
          try {
            bufferObj = JSON.parse(line.substring(6));
            aiState.conversationId = bufferObj.id;
            console.log(bufferObj);
          } catch (e) {
            console.error(e);
            return;
          }
          if (bufferObj.event !== "message") return;
        });
      } catch (e) {
        console.error(e);
        return;
      }
      // Continue reading
      read();
    });
  };
  read();
};

export const useRingAnimation = (index: number, useLog: false) => {
  const { status: ringState } = useSnapshot(aiState);
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
    reset: springReset,
    loop: false,
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
