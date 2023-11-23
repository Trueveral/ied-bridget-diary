import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useSnapshot } from "valtio";
import { globalState } from "@/States/states";
import { Float } from "@react-three/drei";

export const CollectionsScene = () => {
  const obj = useLoader(OBJLoader, "/objects/Dream3.obj");
  const { link } = useSnapshot(globalState);
  const { scale, intensity } = useSpring({
    scale: link === "collections" ? [6, 6, 6] : [0, 0, 0],
    intensity: link === "collections" ? 1 : 0,
    config: { mass: 1, tension: 50, friction: 180 },
  });

  return (
    <group position={[0, 0, -5.5]}>
      <a.mesh scale={scale as any} rotation={[0, Math.PI / 2, Math.PI / 2]}>
        <meshPhysicalMaterial
          attach={"material"}
          transparent
          emissive={new THREE.Color(0x0433ff)}
          roughness={0}
          metalness={0}
          ior={1.8}
          reflectivity={0.6}
          iridescence={0.6}
          clearcoat={0.8}
        />
        <primitive object={obj} />
      </a.mesh>
      <a.pointLight
        position={[0, 0, 0]}
        intensity={intensity as any}
        color={new THREE.Color(0x0433ff)}
      />
    </group>
  );
};
