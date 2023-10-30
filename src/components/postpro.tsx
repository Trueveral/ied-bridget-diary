import { animated, easings, useSpring } from "@react-spring/three";
import { useSnapshot } from "valtio";
import { interactionState } from "./visual";
import {
  Bloom,
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  SMAA,
} from "@react-three/postprocessing";
import React from "react";

export const PostPro = () => {
  const { hoverId, activeId } = useSnapshot(interactionState);
  const AnimatedBrightnessContrast = animated(BrightnessContrast);
  const AnimatedBloom = animated(Bloom);
  const { brightness, intensity: bloomIntensity } = useSpring({
    brightness: activeId == -1 ? 0 : -0.1,
    intensity: activeId == -1 ? 1 : 0.3,
    config: {
      easing: easings.easeInOutSine,
    },
  });

  return (
    <EffectComposer disableNormalPass>
      <AnimatedBloom
        luminanceThreshold={0.3}
        mipmapBlur
        luminanceSmoothing={0.0}
        intensity={bloomIntensity}
      />
      <DepthOfField
        target={[0, 0, 13]}
        focalLength={0.3}
        bokehScale={20}
        height={0}
      />
      <SMAA />
      {/* <AnimatedBrightnessContrast brightness={brightness} contrast={0} /> */}
    </EffectComposer>
  );
};
