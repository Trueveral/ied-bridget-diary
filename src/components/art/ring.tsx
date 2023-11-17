import { useSnapshot } from "valtio";
import { animated, easings, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { interactionState } from "@/states/states";

export const Ring = () => {
  const { activeId } = useSnapshot(interactionState);
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

  return (
    <>
      <mesh position={[0, 0, 0]}>
        {/* <animated.pointLight
          position={[0, 0, 5]}
          intensity={1000}
          color="white"
          distance={1000}
        /> */}
        <animated.ringGeometry args={[1, 0.8, 70]} />
        <meshBasicMaterial side={THREE.DoubleSide} color="white" opacity={0} />
      </mesh>
    </>
  );
};
