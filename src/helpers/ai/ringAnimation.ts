import { conversationAIState } from "@/States/states";
import { SpringOptionType } from "@/Types/types";

// Helper functions to simplify the logic

export function calculatePosition(
  index: number,
  ringState: typeof conversationAIState.status,
  value: number[] | number[][]
) {
  if (value.length === 0) return [];
  if (value[0] === undefined) return value;

  return (value as number[]).map((v, i) => {
    if (i === 0) return index * v;
    if (i === 1 && ringState === "narrative") {
      return (index % 2) * v;
    }
    return v;
  });
}

export function createToArray(
  index: number,
  ringState: typeof conversationAIState.status,
  springOptions: SpringOptionType | any
) {
  const { fromPosition, toPosition, fromScale, toScale } = springOptions;
  const isPositionArray = Array.isArray(toPosition[0]);
  const isScaleArray = Array.isArray(toScale);

  const longerLength = Math.max(
    isPositionArray ? toPosition.length : 1,
    isScaleArray ? toScale.length : 1
  );

  return new Array(longerLength).fill(0).map((_, i) => {
    return {
      position: calculatePosition(
        index,
        ringState,
        isPositionArray ? toPosition[i] || fromPosition : toPosition
      ),
      scale: isScaleArray ? toScale[i] || fromScale : toScale,
    };
  });
}
