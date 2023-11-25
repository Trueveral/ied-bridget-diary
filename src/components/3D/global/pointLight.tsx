"use client";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { conversationChatListState } from "@/States/states";
import { useSnapshot } from "valtio";
import { a, useSpring } from "@react-spring/three";

export const PointLight = () => {
  const lightRef = useRef<THREE.PointLight>();
  const { showMask } = useSnapshot(conversationChatListState);
  const colors = [
    new THREE.Color(0xff0000),
    new THREE.Color(0xff7f00),
    new THREE.Color(0xffff00),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff),
    new THREE.Color(0x4b0082),
    new THREE.Color(0x9400d3),
  ];

  // 初始化一个变量来跟踪当前颜色
  let currentColorIndex = 0;

  const { intensity } = useSpring({
    intensity: showMask ? 30 : 700,
    config: { mass: 1, tension: 500, friction: 50 },
  });

  useFrame(() => {
    const currentColor = colors[currentColorIndex];
    // easing.dampC(lightRef.current!!.color, currentColor, 1.0);
  });

  return (
    <a.pointLight
      position={[3, 3, 13]}
      intensity={intensity as any}
      color="white"
      distance={1000}
      ref={lightRef as any}
    />
  );
};
