import { useEffect, useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import * as THREE from "three";
import { AnimatedComponent, animated, useSpring } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Float, Icosahedron, MeshTransmissionMaterial, Text } from "@react-three/drei";
import { countSate, interactionState } from "./visual";
import React from "react";

const AnimatedText = animated(Text);

const Crystal = ({
  args,
  id,
  title,
  content,
}: {
  args: Record<"position" | "rotation" | "scale", number[]>;
  id: number;
  title: string;
  content: string;
}) => {
  const { hoverId, activeId } = useSnapshot(interactionState);
  const meshRef = useRef<THREE.Mesh>();
  const lightRef = useRef<THREE.PointLight>();
  const matRef = useRef<THREE.MeshPhysicalMaterial>();
  const titleMatRef = useRef<THREE.MeshBasicMaterial>();
  const contentMatRef = useRef<THREE.MeshBasicMaterial>();
  // get width and height of the viewport
  const { viewport } = useThree();

  const thisHovered = hoverId == id;
  const thisActive = activeId == id;
  const hasActive = activeId != -1;
  const hasHovered = hoverId != -1;

  const { crystalPosition } = useSpring({
    crystalPosition: [
      thisActive ? viewport.width / 3.5 : args.position[0],
      thisActive ? 3 : args.position[1],
      thisActive ? -17 : 0,
    ],
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
      duration: 300,
    },
  });

  const { fillOpacity: titleFillOpacity, titlePosition } = useSpring({
    fillOpacity: thisHovered || thisActive ? 1 : 0,
    titlePosition: [
      thisActive ? viewport.width / 3.5 : args.position[0],
      thisActive ? 3 : args.position[1],
      thisActive ?  -30 : thisHovered ? -18 : -14,
    ],
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  });

  const { contentFillOpacity, contentPosition } = useSpring({
    contentFillOpacity: thisActive ? 1 :  0,
    contentPosition: [
      thisActive ? viewport.width / 3.5 - 30 : args.position[0],
      thisActive ? 3 : args.position[1],
      thisActive ?  -29 : thisHovered ? -17 : -13,
    ],
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  });

  useFrame((state, delta) => {
    if (hasActive) {
      easing.damp3(
        meshRef.current!!.scale,
        [thisActive ? 10 : 0, thisActive ? 10 : 0, thisActive ? 10 : 0],
        0.5,
        delta
      );
      easing.dampE(
        meshRef.current!!.rotation,
        [thisActive ? 10 : 0, thisActive ? 10 : 0, thisActive ? 10 : 0],
        0.5,
        delta
      );
    } else {
      easing.damp3(meshRef.current!!.scale, thisHovered ? 5 : 2, 0.5, delta);

      easing.dampE(
        meshRef.current!!.rotation,
        [thisHovered ? 6 : 2, thisHovered ? 6 : 2, thisHovered ? 6 : 2],
        0.5,
        delta
      );
    }

    easing.damp(
      matRef.current!!,
      "ior",
      thisHovered || thisActive ? 1 : 1,
      0.5,
      delta
    );
    easing.damp(
      lightRef.current!!,
      "intensity",
      thisActive ? 400 : 100,
      0.5,
      delta
    );
  });

  return (
    <>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <animated.mesh
          onPointerOver={() => {
            interactionState.hoverId = id;
          }}
          onPointerOut={() => {
            interactionState.hoverId = -1;
          }}
          onClick={() => {
            interactionState.activeId = id;
            // @ts-ignore
            interactionState.activeRef = meshRef.current;
          }}
          // @ts-ignore
          ref={meshRef}
          geometry={new THREE.IcosahedronGeometry()}
          {...args}
          // @ts-ignore
          position={crystalPosition}
        >
          <MeshTransmissionMaterial
            ior={0.3}
            resolution={2048}
            roughness={0.1}
            distortion={0.5}
            thickness={1}
            anisotropy={1}
            // @ts-ignore
            ref={matRef}
            samples={10}
            color="#ffffff"
            transparent
            opacity={0.8}
          />
        </animated.mesh>
      </Float>
      <mesh>
        <AnimatedText
          fillOpacity={titleFillOpacity}
          // @ts-ignore
          position={titlePosition}
          whiteSpace={"overflowWrap"}
          strokeOpacity={0}
          maxWidth={10}
          fontSize={2}
          color="#ffffff"
          rotation={[0, 3.14, 0]}
          font={"/fonts/serif.ttf"}
        >
          {title}
          {/* <meshBasicMaterial ref={titleMatRef} transparent opacity={1} /> */}
        </AnimatedText>
      </mesh>
      <AnimatedText
        fillOpacity={contentFillOpacity}
        // @ts-ignore
        position={contentPosition}
        whiteSpace={"overflowWrap"}
        strokeOpacity={0}
        maxWidth={20}
        fontSize={1}
        color="#ffffff"
        rotation={[0, 3.14, 0]}
        font={"/fonts/mono.ttf"}
      >
        {content}
        {/* <meshBasicMaterial ref={contentMatRef} transparent opacity={0} /> */}
      </AnimatedText>
      <mesh position={[args.position[0], args.position[1], -40]}>
        <pointLight
          // @ts-ignore
          ref={lightRef}
          distance={1000}
          intensity={0}
          color="#ffffff"
        />
        </mesh>
    </>
  );
};

export const CrystalArray = () => {
  const { value: count } = useSnapshot(countSate);
  const { hoverId } = useSnapshot(interactionState);
  const [content, setContent] = useState<Record<string, "title"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/data/content.json"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    fetchData();
  }, []); 

  const crystals = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const offset = i - count / 2;
      const position = [offset * 6 + Math.random(), 6 * Math.sin(i), -10];
      const scale = [2, 2, 2];
      const rotation = [0, 0, 0];
      temp.push({ position, scale, rotation });
    }
    return temp;
  }, [count]);

  return (
    <>
      {crystals.map((psr, i) => {
        return (
          <Crystal
            key={i}
            id={i}
            args={psr}
            // @ts-ignore
            title={content ? content[i].title : "Loading..."}
            // @ts-ignore
            content={content ? content[i].content : "Loading..."}
          />
        );
      })}
    </>
  );
};
