import { useSnapshot } from "valtio";
import { animated, useSpring, a, useSpringValue } from "@react-spring/three";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { conversationAIState, interactionState } from "@/States/states";
import { useEffect, useRef, useState } from "react";
import { easing } from "maath";
import * as geometry from "maath/geometry";
import { Float } from "@react-three/drei";
import {
  ShaderPass,
  SavePass,
  RenderPass,
  EffectComposer,
} from "postprocessing";
import { CopyShader, BlendShader } from "three-stdlib";
import { RingIndicator } from "./temp";

const SCALE_FACTOR = 0.3;

const IdleRing = () => {
  const ringRef = useRef<THREE.Mesh>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();

  const {
    size: { width, height },
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <ringGeometry ref={ringRef} args={[1, 0.8, 70]} />
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

const ThinkingRing = ({
  animationRotation,
}: {
  animationRotation: [number, number, number];
}) => {
  const ringRef = useRef<THREE.Mesh>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  const { status, responseText } = useSnapshot(conversationAIState);

  const {
    size: { width, height },
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;
  const shouldAnimate = true;
  const shouldShowFull = true;

  useFrame((state, delta) => {
    meshRef.current!!.rotation.x += animationRotation[0] * 0.1 * 0.7;
    meshRef.current!!.rotation.y += animationRotation[1] * 0.1 * 0.7;
    meshRef.current!!.rotation.z += animationRotation[2] * 0.1 * 0.7;
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
    // easing.damp3(meshRef.current?.position);
  });

  return (
    <>
      <a.mesh ref={meshRef} position={[1, 0, 0]} scale={[1, 1, 1]}>
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

const AngryRing = ({ index }: { index: number }) => {
  const ringRef = useRef<THREE.RingGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  const { status, responseText } = useSnapshot(conversationAIState);
  const {
    size: { width, height },
    clock,
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;

  const { scale, args } = useSpring({
    delay: index * 75,
    loop: () => {
      return { delay: 0, reset: true };
    },
    reset: true,
    from: { scale: 0.7, args: [1, 0.8, 70] },
    to: { scale: 1.2, args: [1, 0, 70] },
    config: { mass: 1.3, tension: 800, friction: 13 },
  });

  return (
    <>
      <a.mesh ref={meshRef} position={[index * 1.2, 0, 0]} scale={scale}>
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

const SadRing = ({ index }: { index: number }) => {
  const ringRef = useRef<THREE.RingGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  const { status, responseText } = useSnapshot(conversationAIState);

  const {
    size: { width, height },
    clock,
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;

  const { scale } = useSpring({
    delay: index * 100,
    loop: () => {
      return { delay: 0 };
    },
    from: { scale: 0 },
    to: [{ scale: 1 }, { scale: 0 }],
    config: { mass: 0.5, tension: 80, friction: 20 },
  });

  return (
    <>
      <a.mesh
        ref={meshRef}
        position={[index * 1.2, 0, 0]}
        scale={scale}
        // rotation={rotation}
      >
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

const HappyRing = ({ index }: { index: number }) => {
  const ringRef = useRef<THREE.RingGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  const { status, responseText } = useSnapshot(conversationAIState);

  const {
    size: { width, height },
    clock,
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;

  const { position } = useSpring({
    delay: index * 100,
    loop: () => {
      return { delay: 0 };
    },
    from: { position: [index * 1.2, 0.5, 0] },
    to: [
      { position: [index * 1.2, 0, 0] },
      { position: [index * 1.2, 0.5, 0] },
    ],
    config: { mass: 2, tension: 900, friction: 20 },
  });

  return (
    <>
      <a.mesh
        ref={meshRef}
        position={position}
        // rotation={rotation}
      >
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

const NarrativeRing = ({ index }: { index: number }) => {
  const ringRef = useRef<THREE.RingGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  const { status, responseText } = useSnapshot(conversationAIState);

  const {
    size: { width, height },
    clock,
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;

  const { position } = useSpring({
    delay: index * 100,
    // loop: true,
    reset: true,
    from: { position: [index * 1.2, (index % 2) * 0.6, 0] },
    to: [
      { position: [index * 1.2, 0, 0] },
      { position: [index * 1.2, (index % 2) * 0.6, 0] },
    ],
    config: { mass: 2, tension: 900, friction: 60 },
  });

  return (
    <>
      <a.mesh
        ref={meshRef}
        position={position}
        // rotation={rotation}
      >
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

const ConcentratedRing = ({ index }: { index: number }) => {
  const ringRef = useRef<THREE.RingGeometry>();
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.MeshBasicMaterial>();
  const { status, responseText } = useSnapshot(conversationAIState);

  const {
    size: { width, height },
    clock,
  } = useThree();
  const outerRadius = width > height ? width * 0.01 : height * 0.01;
  const innerRadius = outerRadius * 0.8;

  const { position, scale } = useSpring({
    loop: true,
    from: { position: [0, 0, 0], scale: 0.8 },
    to: [
      {
        position: [0, 0, 0],
        scale: conversationAIState.status === "idle" ? 2 : 1,
      },
      { position: [0, 0, 0], scale: 0.8 },
    ],
    config: { tension: 200, friction: 14, duration: 700 },
  });

  return (
    <>
      <a.mesh
        ref={meshRef}
        position={position}
        scale={scale}
        // rotation={rotation}
      >
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

export const RingArray = ({ number }: { number: number }) => {
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
      <group>
        <Float speed={0} floatIntensity={1}>
          <mesh scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}>
            {Array(6)
              .fill(0)
              .map((r, i) => (
                <IdleRing key={i} />
              ))}
          </mesh>
        </Float>
        <Float speed={0} floatIntensity={1}>
          <mesh
            scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}
            position={[1, 0, 0]}
          >
            {animationRotations.map((r, i) => (
              <ThinkingRing animationRotation={r} key={i} />
            ))}
          </mesh>
        </Float>
        <Float speed={0} floatIntensity={1}>
          <mesh
            scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}
            position={[2, 0, 0]}
          >
            {Array(6)
              .fill(0)
              .map((r, i) => (
                <HappyRing index={i} key={i} />
              ))}
          </mesh>
        </Float>
        <Float speed={0} floatIntensity={1}>
          <mesh
            scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}
            position={[-1, 2, 0]}
          >
            {Array(6)
              .fill(0)
              .map((r, i) => (
                <SadRing index={i} key={i} />
              ))}
          </mesh>
        </Float>
        <Float speed={0} floatIntensity={1}>
          <mesh
            scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}
            position={[-1, -2, 0]}
          >
            {Array(6)
              .fill(0)
              .map((r, i) => (
                <AngryRing index={i} key={i} />
              ))}
          </mesh>
        </Float>
        <Float speed={0} floatIntensity={1}>
          <mesh
            scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}
            position={[-4, 0, 0]}
          >
            {Array(6)
              .fill(0)
              .map((r, i) => (
                <NarrativeRing index={i} key={i} />
              ))}
          </mesh>
        </Float>
        <Float speed={0} floatIntensity={1}>
          <mesh
            scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}
            position={[-1, 0, 0]}
          >
            {Array(6)
              .fill(0)
              .map((r, i) => (
                <ConcentratedRing index={i} key={i} />
              ))}
          </mesh>
        </Float>
        <Float speed={0} floatIntensity={1}>
          <mesh
            scale={[SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR]}
            position={[-2, -2, 0]}
          >
            {Array(6)
              .fill(0)
              .map((r, i) => (
                <RingIndicator index={i} key={i} />
              ))}
          </mesh>
        </Float>
      </group>
    </>
  );
};
