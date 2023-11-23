import { useSnapshot } from "valtio";
import { animated, easings, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { interactionState } from "@/States/states";
import { useRef } from "react";
import { Float } from "@react-three/drei";
import {
  ShaderPass,
  SavePass,
  RenderPass,
  EffectComposer,
} from "postprocessing";
import { CopyShader, BlendShader } from "three-stdlib";

export const Ring = () => {
  const { activeId } = useSnapshot(interactionState);
  const ringRef = useRef<THREE.Mesh>();
  const { intensity } = useSpring({
    intensity: activeId == -1 ? 1000 : 0,
    config: {
      easing: easings.easeInOutSine,
      duration: 200,
    },
  });

  const {
    size: { width, height },
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;

  const { args } = useSpring({
    args: [outerRadius, innerRadius, 70],
    config: {
      easing: easings.easeInOutSine,
      duration: 200,
    },
  });

  return (
    <>
      <animated.mesh position={[0, 0, 0]}>
        {/* <animated.pointLight
            position={[0, 0, 5]}
            intensity={1000}
            color="white"
            distance={1000}
          /> */}
        <ringGeometry ref={ringRef} args={[1, 0.8, 70]} />
        <meshBasicMaterial side={THREE.DoubleSide} color="white" opacity={0} />
      </animated.mesh>
    </>
  );
};
