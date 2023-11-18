"use client";

import { Canvas } from "@react-three/fiber";
import {
  BakeShadows,
  CameraControls,
  Environment,
  Icosahedron,
  OrthographicCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { Particles } from "./particles";
import { CrystalArray } from "./crystals";
import { CameraRig } from "./camera";
import { PostPro } from "./postpro";
import { FaceBox, MainComponent, SceneManager } from "./misc";
import { Ring } from "./ring";
import { AnimatedAICubes } from "./animations/ai/box";
import { useTransition } from "@react-spring/three";
import { RingArray } from "./animations/ai/ring";

export default function Visual() {
  return (
    <>
      <Canvas shadows dpr={[1, 1.5]}>
        {/* <CameraRig /> */}
        <AnimatedAICubes />
        <pointLight
          position={[0, 0, 5]}
          intensity={1000}
          color="white"
          distance={1000}
        />
        <color attach="background" args={["#1900ff"]} />
        <group>
          <RingArray number={6} />
          {/* <CrystalArray /> */}
          <Particles count={6000} />
        </group>
        {/* <PostPro /> */}
        <BakeShadows />
        <SceneManager />
        <Environment preset="warehouse" />
      </Canvas>
    </>
  );
}
