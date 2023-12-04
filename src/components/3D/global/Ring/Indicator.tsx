import { conversationAIState } from "@/States/states";
import { a } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useSnapshot } from "valtio";
import * as THREE from "three";
import { animationRotations } from "@/Helpers/AI/ringOptions";
import { easing } from "maath";
import { useRingAnimation } from "@/components/Hooks/conversation";
import { Caustics, MeshTransmissionMaterial } from "@react-three/drei";

export const RingIndicator = ({ index }: { index: number }) => {
  const ringRef = useRef<THREE.RingGeometry>();
  const meshRef = useRef<any>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  let { status: ringState } = useSnapshot(conversationAIState);

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
      <a.mesh ref={meshRef} position={position as any} scale={scale}>
        <ringGeometry ref={ringRef as any} args={[1, 0.8, 70]} />
        {/* <MeshTransmissionMaterial
            resolution={512}
            thickness={200}
            anisotropy={1}
            chromaticAberration={1}
            temporalDistortion={0}
            distortionScale={0.1}
          /> */}
        <meshBasicMaterial
          ref={materialRef}
          color={0xffffff}
          opacity={0.6}
          transparent={true}
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.5}
        />
      </a.mesh>
    </>
  );
};
