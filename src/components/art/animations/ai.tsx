import { aiState } from "@/states/states";
import { animated, useSpring, useTransition } from "@react-spring/three";
import { Box } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSnapshot } from "valtio";

const FaceBox = ({ position }) => {
  const { status } = useSnapshot(aiState);
  const showCubes = status == "sending" || status == "inputing";
  const boxRef = useRef();
  const materialRef = useRef();
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
      0.7,
      0.3,
      Math.min(1, distance / 5)
    );
    materialRef.current.opacity = initialOpacity;
  }, [position, viewport.width]);

  useFrame(() => {
    const scale =
      initial.current + (Math.sin(3 * clock.getElapsedTime()) + 1) / 2;
    boxRef.current.scale.set(scale, scale, scale);

    easing.damp(
      materialRef.current!!,
      "opacity",
      showCubes ? THREE.MathUtils.lerp(0.7, 0.3, Math.min(1, distance / 5)) : 0,
      0.3
    );
  });

  return (
    <Box ref={boxRef} args={[0.1, 0.1, 0.1]} position={position}>
      <meshStandardMaterial
        ref={materialRef}
        color="white"
        transparent
        opacity={0.3}
      />
    </Box>
  );
};

const FaceBoxArray = () => {
  const { viewport } = useThree();
  const positions = useMemo(() => {
    const positions = [];
    for (let x = -viewport.width / 2; x < viewport.width / 2; x += 0.4) {
      for (let y = -viewport.height / 2; y < viewport.height / 2; y += 0.4) {
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
