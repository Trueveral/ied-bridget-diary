import { Plane } from "@react-three/drei";
import * as THREE from "three";

export default function Background() {
  return (
    <>
      {/* <Plane args={[100, 100]} position={[0, 0, -10]}>
        <meshStandardMaterial
          side={THREE.DoubleSide}
          color="black"
          roughness={1000}
        />
      </Plane> */}
      <pointLight position={[-3, 0, -5]} intensity={1599} color={"blue"} />
      <pointLight position={[3, 0, -5]} intensity={1400} color={"green"} />
      <pointLight position={[0, -2, -5]} intensity={1000} color={"blue"} />
      <pointLight position={[0, 2, -5]} intensity={3000} color={"indigo"} />
    </>
  );
}
