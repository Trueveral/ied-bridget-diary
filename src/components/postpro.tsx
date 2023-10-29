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

export const PostPro = () => {
  const { hoverId, activeId } = useSnapshot(interactionState);
  const AnimatedBrightnessContrast = animated(BrightnessContrast);
  const { brightness } = useSpring({
    brightness: activeId == -1 ? 0 : -0.1,
    config: {
      easing: easings.easeInOutSine,
    },
  });

  return (
    <EffectComposer disableNormalPass>
      <Bloom
        luminanceThreshold={0.3}
        mipmapBlur
        luminanceSmoothing={0.0}
        intensity={1.6}
      />
      <DepthOfField
        target={[0, 0, 13]}
        focalLength={0.3}
        bokehScale={20}
        height={0}
      />
      <SMAA />
      <AnimatedBrightnessContrast brightness={brightness} contrast={0} />
    </EffectComposer>
  );
};
