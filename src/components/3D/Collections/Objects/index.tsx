import { useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useSnapshot } from "valtio";
import { collectionState, globalState } from "@/States/states";
import { Float, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

export const CollectionObject = ({ id }: { id: number }) => {
  const obj = useLoader(OBJLoader, `/objects/Dream${id}.obj`);
  const { activeId } = useSnapshot(collectionState);
  const { link } = useSnapshot(globalState);
  const { intensity } = useSpring({
    intensity: link === "collections" ? 1 : 0,
    config: { mass: 1, tension: 50, friction: 180 },
  });

  const collectionObjectRef = useRef<THREE.Group>();

  const { scale, position } = useSpring({
    position: activeId === id ? [0, 0, 0] : [0, 0, -2],
    scale: activeId === id && link === "collections" ? [6, 6, 6] : [0, 0, 0],
    config: { mass: 1.3, tension: 100, friction: 17 },
  });

  useFrame((state, delta) => {
    if (collectionObjectRef.current) {
      const second = Date.now();
      collectionObjectRef.current.rotation.y = Math.sin(second * 0.001) * 0.1;
      collectionObjectRef.current.rotation.x = Math.sin(second * 0.001) * 0.1;
      collectionObjectRef.current.position.y = Math.cos(second * 0.001) * 0.004;
    }
  });

  return (
    <a.group
      position={position as any}
      scale={scale as any}
      ref={collectionObjectRef as any}
    >
      <a.mesh rotation={[Math.PI / 2, Math.PI, Math.PI]}>
        <meshPhysicalMaterial
          attach={"material"}
          transparent
          // emissive={new THREE.Color(0x0433ff)}
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
    </a.group>
  );
};
