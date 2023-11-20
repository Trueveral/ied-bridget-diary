import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export const PointLight = () => {
  const lightRef = useRef<THREE.PointLight>();
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

  useFrame(() => {
    const currentColor = colors[currentColorIndex];
    // easing.dampC(lightRef.current!!.color, currentColor, 1.0);
  });

  return (
    <pointLight
      position={[3, 3, 13]}
      intensity={700}
      color="white"
      distance={1000}
      ref={lightRef}
    />
  );
};
