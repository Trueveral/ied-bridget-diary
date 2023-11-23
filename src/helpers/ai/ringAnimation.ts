import { conversationAIState } from "@/States/states";
import { useSpring, a, to } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import * as THREE from "three";
import { springOptions, animationRotations } from "./ringOptions";
import { easing } from "maath";

interface ISpringOptions {
  delay: number;
  reset: boolean;
  fromPosition: [number, number, number];
  toPosition: [number, number, number] | [number, number, number][];
  fromScale: number;
  toScale: number | number[];
  fromRotation: [number, number, number];
  toRotation: [number, number, number];
  springConfig: { mass: number; tension: number; friction: number } | undefined;
}

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
  springOptions: ISpringOptions
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
