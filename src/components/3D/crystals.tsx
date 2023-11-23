import { useEffect, useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import * as THREE from "three";
import {
  AnimatedProps,
  SpringValue,
  animated,
  useSpringRef,
  useTransition,
} from "@react-spring/three";
import { Euler } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import React from "react";
import {
  useCrystalContents,
  useCrystalInteraction,
  useCrystalTextNodes,
  useCrystalTitles,
  useText,
} from "../Hooks/crystal";
import { CrystalMaterial } from "./materials";
import { countSate, interactionState } from "@/States/states";
// import { z } from "zod";

const Crystal = ({
  args,
  id,
  interaction = false,
  floating = false,
}: {
  args: Record<"position" | "rotation" | "scale", number[]>;
  id: number;
  interaction?: boolean;
  floating?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>();
  const lightRef = useRef<THREE.PointLight>();
  const { position, scale, rotation } = useCrystalInteraction(id, args);

  return (
    <>
      <Float speed={floating ? 3 : 0} rotationIntensity={1} floatIntensity={1}>
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
          ref={meshRef as unknown as React.MutableRefObject<THREE.Mesh>}
          geometry={new THREE.IcosahedronGeometry()}
          scale={
            interaction
              ? (scale as unknown as [number, number, number])
              : (args.scale as unknown as [number, number, number])
          }
          rotation={
            interaction
              ? (rotation as unknown as [number, number, number])
              : (args.rotation as unknown as [number, number, number])
          }
          position={
            interaction
              ? (position as unknown as [number, number, number])
              : (args.position as unknown as [number, number, number])
          }
        >
          <CrystalMaterial />
        </animated.mesh>
      </Float>
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

type CrystalTextProps = AnimatedProps<{
  fontSize: number;
  color: string;
  rotation: Euler;
  font: string;
}>;

const CrystalText = ({
  config,
  contents,
  positions,
}: {
  config: CrystalTextProps;
  contents: string[];
  positions: [number, number, number][];
}) => {
  const { hoverId } = useSnapshot(interactionState);
  const texts = useCrystalTextNodes(config, contents);
  const [prevHoverId, setPrevHoverId] = useState(-1);

  const transRef = useSpringRef();
  const transitions = useTransition(hoverId, {
    ref: transRef,
    keys: null,
    from: {
      opacity: 0,
      position:
        hoverId == -1 ? [0, 0, 0] : positions[hoverId].map((v, i) => v - 1),
    },
    enter: {
      opacity: 1,
      position: hoverId == -1 ? [0, 0, 0] : positions[hoverId],
    },
    leave: {
      opacity: 0,
      position: [0, 0, 0],
    },
  });

  useEffect(() => {
    transRef.start();
  }, [hoverId, transRef]);

  return (
    <>
      {transitions((style, item, t, i) => {
        return item == -1 ? (
          <></>
        ) : (
          <group>
            {texts[item]({
              opacity: style.opacity,
              position: style.position as unknown as SpringValue<
                [number, number, number]
              >,
            })}
          </group>
        );
      })}
    </>
  );
};

export const CrystalArray = () => {
  const { value: count } = useSnapshot(countSate);
  const content = useText();
  const crystals = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const offset = i - count / 2;
      const position = [offset * 6 + Math.random(), 6 * Math.sin(i), -40];
      const scale = [1, 1, 1];
      const rotation = [0, 0, 0];
      temp.push({ position, scale, rotation });
    }
    return temp;
  }, [count]);

  const titles = useCrystalTitles(content, count);
  const contents = useCrystalContents(content, count);

  return (
    <group>
      {crystals.map((psr, i) => {
        return <Crystal key={i} id={i} args={psr} />;
      })}
      <CrystalText
        config={{
          fontSize: 2,
          color: "#fff",
          rotation: [0, 0, 0],
          font: "/fonts/serif.ttf",
        }}
        contents={titles}
        positions={crystals.map(v => v.position as [number, number, number])}
      />
    </group>
  );
};
