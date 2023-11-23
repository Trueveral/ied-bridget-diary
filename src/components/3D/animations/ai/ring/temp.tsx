import { conversationAIState } from "@/States/states";
import { useSpring, a, to } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import * as THREE from "three";
import {
  springOptions,
  animationRotations,
} from "../../../../../Helpers/AI/ringOptions";
import { easing } from "maath";
import { useRingAnimation } from "@/components/Hooks/ai";

export const RingIndicator = ({ index }: { index: number }) => {
  const ringRef = useRef<THREE.RingGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  let { status: ringState } = useSnapshot(conversationAIState);

  const {
    size: { width, height },
  } = useThree();

  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;
  const { position, scale } = useRingAnimation(index, false);

  const animationRotation = animationRotations[index];

  useFrame((state, delta) => {
    meshRef.current!!.rotation.x +=
      ringState === "responding" ? animationRotation[0] * 0.1 * 0.7 : 0;
    meshRef.current!!.rotation.y +=
      ringState === "responding" ? animationRotation[1] * 0.1 * 0.7 : 0;
    meshRef.current!!.rotation.z +=
      ringState === "responding" ? animationRotation[2] * 0.1 * 0.7 : 0;
    const { x: rx, y: ry, z: rz } = meshRef.current!!.rotation;

    easing.dampE(
      meshRef.current!!.rotation,
      [
        Math.ceil(rx / Math.PI) * Math.PI,
        Math.ceil(ry / Math.PI) * Math.PI,
        Math.ceil(rz / Math.PI) * Math.PI,
      ],
      0.5,
      delta
    );
  });

  return (
    <>
      <a.mesh ref={meshRef} position={position} scale={scale}>
        <ringGeometry ref={ringRef} args={[1, 0.8, 70]} />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          ref={materialRef}
          color="white"
          opacity={1}
          transparent
        />
      </a.mesh>
    </>
  );
};
