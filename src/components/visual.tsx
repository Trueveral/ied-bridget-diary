"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { BakeShadows, Plane } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";
import { useSnapshot, proxy } from "valtio";
import { Particles } from "./particles";
import { useSpring, animated, easings } from "@react-spring/three";
import { CrystalArray } from "./crystals";
import { CameraRig } from "./camera";
import { PostPro } from "./postpro";
import { MeshBasicMaterial, MeshLambertMaterial, SpotLight } from "three/src/Three.js";

export const countSate = proxy({
  value: 10,
});

export const interactionState = proxy<{
  hoverId: number;
  activeId: number;
  activeRef: THREE.Mesh | null;
}>({
  hoverId: -1,
  activeId: -1,
  activeRef: null,
});

export default function Visual() {
  return (
    <Canvas className=" bg-black" shadows dpr={[1, 1.5]} eventPrefix="client">
      <ForegroundPlane />
      <group>
        <RingLight />
        <CrystalArray />
        <Particles count={3000} />
      </group>
      
      <group>
        <CameraRig />
        <PostPro />
        <BakeShadows />
      </group>
      <SceneManager />
    </Canvas>
  );
}

const SceneManager = () => {
  const { activeRef } = useSnapshot(interactionState);
  const raycaster = new THREE.Raycaster();
  const { camera } = useThree();
  const { pointer } = useThree();

  useEffect(() => {
    const handleClick = () => {
      if (!activeRef) return;
      const mouse = new THREE.Vector2(pointer.x, pointer.y);
      raycaster.setFromCamera(mouse, camera); 

      if (activeRef) {
        // @ts-ignore
        const intersects = raycaster.intersectObject(activeRef); 
        if (intersects.length == 0) {
          interactionState.activeId = -1;
          interactionState.activeRef = null;
        }
      }
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  return <></>;
};

const ForegroundPlane = () => {
  return (
    <mesh position={[0, 0, 10]}>
        <Plane args={[1000, 1000]} rotation={[0, -Math.PI, 0]} material={new THREE.MeshLambertMaterial({
          color: "#a0a0a0",
          transparent: true,
          opacity: 0.1,
        })} />
      </mesh>
  )
}

const RingLight = () => {
  const { activeId } = useSnapshot(interactionState);
  const { intensity } = useSpring({
    intensity: activeId == -1 ? 1000 : 0,
    config: {
      easing: easings.easeInOutSine,
    },
  });
  return (
    <>
      <mesh position={[0, 0, 5]}>
        <animated.pointLight
          position={[0, 0, 5]}
          intensity={intensity}
          color="white"
          distance={1000}
        />
        <ringGeometry args={[12, 10, 70]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </>
  );
};
