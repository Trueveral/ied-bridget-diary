"use client";
import { animated, easings, useSpring } from "@react-spring/three";
import { useSnapshot } from "valtio";
import {
  Bloom,
  BrightnessContrast,
  ChromaticAberration,
  DepthOfField,
  DotScreen,
  EffectComposer,
  Glitch,
  Pixelation,
  SMAA,
  Scanline,
  Sepia,
  Vignette,
} from "@react-three/postprocessing";
import React from "react";
import { interactionState, conversationAIState } from "@/States/states";
import { BlendFunction, GlitchMode } from "postprocessing";
import * as THREE from "three";

const SERET_CODE = "KeasonAya";

export const PostPro = () => {
  const { hoverId, activeId } = useSnapshot(interactionState);
  const { userMessage } = useSnapshot(conversationAIState);
  const secretHit = userMessage.includes(SERET_CODE);
  const AnimatedBrightnessContrast = animated(BrightnessContrast);
  const AnimatedBloom = animated(Bloom);
  const { brightness, intensity: bloomIntensity } = useSpring({
    brightness: activeId == -1 ? 0 : -0.1,
    intensity: secretHit ? 1 : 0,
    config: {
      easing: easings.easeInOutSine,
    },
  });

  return (
    <EffectComposer>
      <AnimatedBloom
        luminanceThreshold={0.3}
        mipmapBlur
        luminanceSmoothing={0.0}
        intensity={0.7}
      />
      {/* <Glitch /> */}
    </EffectComposer>
  );
};
