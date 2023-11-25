"use client";

import { Canvas } from "@react-three/fiber";
import { BakeShadows, Environment } from "@react-three/drei";
import { Particles } from "./global/particles";

import { CameraRig } from "./basic/camera";
import { PostPro } from "./effects/postpro";
import { AnimatedAICubes } from "./global/Box";

import { RingArray } from "./global/Ring";

import { PointLight } from "./global/pointLight";
import { CollectionsScene } from "./Collections";

export default function Visual() {
  return (
    <>
      <Canvas shadows dpr={[1, 1.5]}>
        <CameraRig />
        <AnimatedAICubes />
        <PointLight />
        <CollectionsScene />
        <color attach="background" args={["#000"]} />
        <group>
          <RingArray number={6} />
          {/* <CrystalArray /> */}
          <Particles count={2000} />
        </group>
        <PostPro />
        <BakeShadows />
        <Environment preset="warehouse" />
      </Canvas>
    </>
  );
}
