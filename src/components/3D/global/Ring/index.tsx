"use client";

import {
  AsciiRenderer,
  Caustics,
  FaceControls,
  FaceLandmarker,
  Float,
} from "@react-three/drei";
import { RingIndicator } from "./Indicator";
import { a, useSpring } from "@react-spring/three";
import {
  conversationAIState,
  conversationChatListState,
  globalState,
} from "@/States/states";
import { useSnapshot } from "valtio";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const SCALE_FACTOR = 0.4;

export const RingArray = ({ number }: { number: number }) => {
  let { status, pendingEmotion } = useSnapshot(conversationAIState);
  const { link } = useSnapshot(globalState);
  const meshRef = useRef<THREE.Mesh>();
  const { showMask } = useSnapshot(conversationChatListState);

  let showCenter: any;
  if (pendingEmotion) {
    showCenter = false;
  } else {
    showCenter = status == "idle" || status == "responding";
  }

  const { scale } = useSpring({
    scale: [
      showCenter ? 0.8 : SCALE_FACTOR,
      showCenter ? 0.8 : SCALE_FACTOR,
      showMask ? 0 : showCenter ? 0.8 : SCALE_FACTOR,
    ],
    config: {
      mass: 1,
      tension: 400,
      friction: 80,
    },
  });

  return (
    <Float speed={0} rotationIntensity={1} floatingRange={[0, 0]}>
      <a.mesh scale={scale as any} position={[0, 0, -1]}>
        {Array(6)
          .fill(0)
          .map((r, i) => (
            <RingIndicator index={i} key={i} />
          ))}
      </a.mesh>
    </Float>
  );
};
