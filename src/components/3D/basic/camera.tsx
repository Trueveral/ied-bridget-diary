"use client";

import { PerspectiveCamera } from "@react-three/drei";

import { useSpring, animated } from "@react-spring/three";
import { useSnapshot } from "valtio";
import { globalState } from "@/States/states";

// ref: this code refers to: https://codesandbox.io/s/bst0cy

const AnimatedPerspectiveCamera = animated(PerspectiveCamera);

export const CameraRig = () => {
  // useCameraSoftFollow();
  // const { camera } = useThree();
  // camera.updateProjectionMatrix();

  const { link } = useSnapshot(globalState);

  const { position, rotation } = useSpring({
    position:
      link === "diary"
        ? [0, 0, -0.3]
        : link === "collections"
        ? [0, 0, -5]
        : [0, 0, 5],
    rotation:
      link === "diary"
        ? [0, Math.PI / 2 + 0.2, Math.PI / 2]
        : link === "collections"
        ? [0, 0, 0]
        : [0, 0, Math.PI],
    fov: link === "collections" || link === "diary" ? 100 : 50,
    config: { mass: 1, tension: 50, friction: 60 },
  });

  return (
    <>
      <AnimatedPerspectiveCamera
        makeDefault
        position={position as any}
        rotation={rotation as any}
        fov={75}
        near={0.1}
        far={1000}
      />
    </>
  );
};
