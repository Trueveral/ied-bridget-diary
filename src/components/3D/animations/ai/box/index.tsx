import { conversationAIState } from "@/States/states";
import { animated, useSpring, useTransition } from "@react-spring/three";
import { Box } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSnapshot } from "valtio";

const FaceBox = ({ position }) => {
  const { status, userMessage } = useSnapshot(conversationAIState);
  const SERET_CODE = "KeasonAya";
  const secretHit = true;
  const showCubes = true;
  const boxRef = useRef();
  const materialRef = useRef();
  const meshRef = useRef();
  const { viewport, clock } = useThree();
  let initial = useRef(0);
  const center = new THREE.Vector2(0, 0);
  const distance = center.distanceTo(new THREE.Vector2(position.x, position.y));

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
    boxRef.current.scale.set(initialScale, initialScale, initialScale);
    initial.current = initialScale;
    const initialOpacity = THREE.MathUtils.lerp(
      0.6,
      0.4,
      Math.min(1, distance / 5)
    );
    materialRef.current.opacity = initialOpacity;
  }, [position, viewport.width]);

  // prepare hex for rainbow
  // const colors = [
  //   new THREE.Color(0xffffff), // white
  //   new THREE.Color(0xff0000), // red
  //   new THREE.Color(0xff7f00), // orange
  //   new THREE.Color(0xffff00), // yellow
  //   new THREE.Color(0x00ff00), // green
  //   new THREE.Color(0x0000ff), // blue
  //   new THREE.Color(0x4b0082), // indigo
  //   new THREE.Color(0x9400d3), // violet
  // ];

  const colorTable = {
    idle: 0xffffff,
    responding: 0xae6bff,
    happy: 0x34eb98,
    sad: 0x0000ff,
    angry: 0xff0000,
    narrative: 0xfff16e,
  };

  const speedTable = {
    idle: 3,
    responding: 6,
    happy: 5,
    sad: 2,
    angry: 5,
    narrative: 4,
  };

  // let currentColorIndex = 0;

  useFrame((state, delta) => {
    // const scale =
    //   initial.current +
    //   (Math.sin(speedTable[status] * clock.getElapsedTime()) + 1) / 2;
    // boxRef.current.scale.set(scale, scale, scale);
    // const secretHit = true;

    // const currentColor = colors[currentColorIndex];

    // // change color every 2 seconds
    // if (clock.getElapsedTime() % 1 < 0.1 && secretHit) {
    //   currentColorIndex = (currentColorIndex + 1) % colors.length;
    // }

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

    easing.dampC(materialRef.current!!.color, colorTable[status], 1.0);
  });

  return (
    <Box ref={boxRef} args={[0.1, 0.1, 0.1]} position={position}>
      <meshPhysicalMaterial
        ref={materialRef}
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
  const { viewport } = useThree();
  const positions = useMemo(() => {
    const positions = [];
    for (let x = -7; x < 7; x += 0.4) {
      for (let y = -5; y < 5; y += 0.4) {
        positions.push(new THREE.Vector3(x, y, -1));
      }
    }
    return positions;
  }, [viewport.width, viewport.height]);

  return positions.map((position, index) => (
    <FaceBox key={index} position={position} />
  ));
};

export const AnimatedAICubes = () => {
  // const { status } = useSnapshot(aiState);
  // const showCubes = status == "sending";
  // const transitions = useTransition(showCubes, {
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  // });
  // return (
  //   <>
  //     {transitions((style, item) => {
  //       return item ? <AnimatedBoxArray /> : <></>;
  //     })}
  //   </>
  // );
  return <FaceBoxArray />;
};
