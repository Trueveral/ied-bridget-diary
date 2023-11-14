import {
  CameraControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { useCameraSoftFollow } from "./hooks/control";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

// ref: this code refers to: https://codesandbox.io/s/bst0cy

export const CameraRig = () => {
  // useCameraSoftFollow();
  // const { camera } = useThree();
  // camera.updateProjectionMatrix();

  return (
    <>
      <CameraControls />
      {/* <PerspectiveCamera
        makeDefault
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        zoom={1}
        near={-20}
        far={1000}
        fov={75}
      ></PerspectiveCamera> */}
    </>
  );
};
