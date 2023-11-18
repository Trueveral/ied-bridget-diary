import { useSnapshot } from "valtio";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { aiState, interactionState } from "@/states/states";
import { useRef } from "react";
import { easing } from "maath";
import { Float } from "@react-three/drei";
import {
  ShaderPass,
  SavePass,
  RenderPass,
  EffectComposer,
} from "postprocessing";
import { CopyShader, BlendShader } from "three-stdlib";

const Ring = ({
  initialRotation,
  animationRotation,
}: {
  initialRotation: [number, number, number];
  animationRotation: [number, number, number];
}) => {
  const { activeId } = useSnapshot(interactionState);
  const ringRef = useRef<THREE.Mesh>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  const { status } = useSnapshot(aiState);

  const {
    size: { width, height },
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;
  const shouldAnimate = status == "sending" || status == "responding";

  useFrame((state, delta) => {
    if (shouldAnimate) {
      meshRef.current!!.rotation.x += animationRotation[0] * 0.1;
      meshRef.current!!.rotation.y += animationRotation[1] * 0.1;
      meshRef.current!!.rotation.z += animationRotation[2] * 0.1;
    }
    const { x: rx, y: ry, z: rz } = meshRef.current!!.rotation;
    easing.dampE(
      meshRef.current!!.rotation,
      [
        shouldAnimate ? rx : Math.ceil(rx / Math.PI) * Math.PI,
        shouldAnimate ? ry : Math.ceil(ry / Math.PI) * Math.PI,
        shouldAnimate ? rz : Math.ceil(rz / Math.PI) * Math.PI,
      ],
      0.5,
      delta
    );
    easing.damp(materialRef.current!!, "opacity", shouldAnimate ? 1 : 0, 0.5);
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={initialRotation}>
        <ringGeometry
          ref={ringRef}
          args={[1, 0.8, 70]}
          scale={[0.5, 0.5, 0.5]}
        />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          ref={materialRef}
          color="white"
          opacity={1}
          transparent
        />
      </mesh>
    </>
  );
};

export const RingArray = ({ number }: { number: number }) => {
  const rotations = [
    [0.5, 0.3, 0],
    [1, 0.6, 0],
    [1.5, 0.9, 0],
    [2, 2.1, 0],
    [2.5, 2.4, 0],
    [0, 2.7, 0],
  ];
  const animationRotations = [
    [0.1, 0.1, 0.3],
    [0.2, 0.2, 0.3],
    [0.3, 0.3, 0.3],
    [0.4, 0.4, 0.3],
    [0.5, 0.5, 0.3],
    [0.6, 0.6, 0.3],
  ];
  return (
    <>
      <Float speed={2} floatIntensity={1}>
        {rotations.map((r, i) => (
          <Ring
            initialRotation={r}
            animationRotation={animationRotations[i]}
            key={i}
          />
        ))}
      </Float>
    </>
  );
};
