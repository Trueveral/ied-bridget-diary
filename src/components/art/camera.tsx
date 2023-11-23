import {
  CameraControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { useCameraSoftFollow } from "../Hooks/control";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
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
    position: link === "collections" ? [0, 0, -5] : [0, 0, 5],
    rotation: link === "collections" ? [0, 0, 0] : [0, 0, Math.PI],
    fov: link === "collections" ? 100 : 50,
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
