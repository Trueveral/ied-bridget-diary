"use client";
import {
  conversationAIState,
  conversationChatListState,
  globalState,
} from "@/States/states";
import { Box } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSnapshot } from "valtio";

const FaceBox = ({ position }: { position: THREE.Vector3 }) => {
  const { status, userMessage } = useSnapshot(conversationAIState);
  const showCubes = true;
  const boxRef = useRef<any>();
  const materialRef = useRef<THREE.MeshPhysicalMaterial>();
  const { viewport, clock } = useThree();
  let initial = useRef(0);
  const center = new THREE.Vector2(0, 0);
  const distance = center.distanceTo(new THREE.Vector2(position.x, position.y));
  const { showMask } = useSnapshot(conversationChatListState);
  const { link } = useSnapshot(globalState);

  useEffect(() => {
    const center = new THREE.Vector2(0, 0);
    const distance = center.distanceTo(
      new THREE.Vector2(position.x, position.y)
    );
    const initialScale = THREE.MathUtils.lerp(
      0.01,
      2,
      1 - Math.min(1, distance / 5)
    );
    if (boxRef.current) {
      boxRef.current.scale.set(initialScale, initialScale, initialScale);
    }
    initial.current = initialScale;
    const initialOpacity = THREE.MathUtils.lerp(
      0.6,
      0.4,
      Math.min(1, distance / 5)
    );
    if (materialRef.current) materialRef.current.opacity = initialOpacity;
  }, [position, viewport.width]);

  const colorTable = {
    idle: 0xffffff,
    responding: 0xae6bff,
    happy: 0xe82549,
    sad: 0x0000ff,
    angry: 0xff0000,
    narrative: 0xfff16e,
    concentrating: 0x00ff00,
  };

  const rainbowArray = [
    0xff0000, 0xff8000, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee,
  ];

  const speedTable = {
    idle: 3,
    responding: 6,
    happy: 5,
    sad: 2,
    angry: 5,
    narrative: 4,
    concentrating: 3,
  };

  useFrame((state, delta) => {
    easing.damp(
      materialRef.current!!,
      "opacity",
      showCubes
        ? THREE.MathUtils.lerp(
            status === "responding" ? 0.6 : 0.3,
            status === "responding" ? 0.4 : 0.1,
            Math.min(1, distance / 5)
          )
        : 0,
      0.3
    );

    easing.damp3(
      boxRef.current!!.scale,
      initial.current +
        (Math.sin(speedTable[status] * clock.getElapsedTime()) + 1) / 1.5,
      0.3,
      delta
    );

    if (link === "conversation") {
      easing.dampC(
        materialRef.current!!.color,
        showMask ? 0x000000 : colorTable[status],
        1.0
      );
      easing.dampC(
        materialRef.current!!.emissive,
        showMask ? 0x000000 : 0x0433ff,
        1.0
      );
    }
    if (link === "diary") {
      const color = rainbowArray[Math.floor(Math.random() * 7)];
      easing.dampC(materialRef.current!!.color, color, 2.0);
      easing.dampC(materialRef.current!!.emissive, color, 1.0);
    }
  });

  return (
    <Box ref={boxRef as any} args={[0.1, 0.1, 0.1]} position={position}>
      <meshPhysicalMaterial
        ref={materialRef as any}
        transparent
        emissive={new THREE.Color(0x0433ff)}
        roughness={0}
        metalness={0}
        ior={1.8}
        reflectivity={0.6}
        iridescence={0.6}
        clearcoat={0.8}
      />
    </Box>
  );
};

const FaceBoxArray = () => {
  const positions = useMemo(() => {
    const positions = [];
    for (let x = -7; x < 7; x += 0.4) {
      for (let y = -5; y < 5; y += 0.4) {
        positions.push(new THREE.Vector3(x, y, -1));
      }
    }
    return positions;
  }, []); // 缓存 positions 数组

  return positions.map((position, index) => (
    <FaceBox key={index} position={position} />
  ));
};

export const AnimatedAICubes = () => {
  return <FaceBoxArray />;
};
