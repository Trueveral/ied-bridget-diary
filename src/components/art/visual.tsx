"use client";

import { Canvas, useFrame } from "@react-three/fiber";
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
import { useRef } from "react";
import { easing } from "maath";
import { PointLight } from "./pointLight";

export default function Visual() {
  return (
    <>
      <Canvas shadows dpr={[1, 1.5]}>
        {/* <CameraRig /> */}
        <AnimatedAICubes />
        <PointLight />
        <color attach="background" args={["#000"]} />
        <group>
          <RingArray number={6} />
          {/* <CrystalArray /> */}
          <Particles count={6000} />
        </group>
        <PostPro />
        <BakeShadows />
        <SceneManager />
        <Environment preset="warehouse" />
      </Canvas>
    </>
  );
}
