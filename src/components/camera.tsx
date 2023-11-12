import { CameraControls, OrthographicCamera } from "@react-three/drei";
import { useCameraSoftFollow } from "./hooks/control";

// ref: this code refers to: https://codesandbox.io/s/bst0cy

export const CameraRig = () => {
  useCameraSoftFollow();

  return (
    <>
      <CameraControls>
        <OrthographicCamera
          makeDefault
          rotation={[0, 0, 0]}
          position={[0, 0, -15]}
          zoom={20}
          near={-20}
          far={1000}
        />
      </CameraControls>
    </>
  );
};
