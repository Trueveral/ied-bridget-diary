import { useFrame, useThree } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { interactionState } from "./visual";
import { easing } from "maath";
import { OrthographicCamera } from "@react-three/drei";

// ref: this code refers to: https://codesandbox.io/s/bst0cy

export const CameraRig = () => {
  const { camera } = useThree();
  const { activeId } = useSnapshot(interactionState);
  useFrame((state, delta) => {
    easing.damp3(
      camera.position,
      [
        activeId < 0 ? 0 + (state.pointer.x * state.viewport.width) / 8 : 0,
        activeId < 0 ? (0 + state.pointer.y) / 5 : 0,
        -15,
      ],
      0.5,
      delta
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <OrthographicCamera
        makeDefault
        rotation={[3.14, 0, 0]}
        position={[0, 0, -15]}
        zoom={20}
        near={-20}
        far={1000}
      />
    </>
  );
};
