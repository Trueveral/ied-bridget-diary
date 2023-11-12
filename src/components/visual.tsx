"use client";

import { Canvas } from "@react-three/fiber";
import { BakeShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { proxy } from "valtio";
import { Particles } from "./particles";
import { CrystalArray } from "./crystals";
import { CameraRig } from "./camera";
import { PostPro } from "./postpro";
import { ForegroundPlane, RingLight, SceneManager } from "./misc";
import React, { useMemo } from "react";

export const countSate = proxy({
  value: 10,
});

export const interactionState = proxy<{
  hoverId: number;
  activeId: number;
  activeRef: THREE.Mesh | null;
  textures: { [key: string]: THREE.Texture } | null;
}>({
  hoverId: -1,
  activeId: -1,
  activeRef: null,
  textures: null,
});

export default function Visual() {
  return (
    <Canvas className="bg-black" shadows dpr={[1, 1.5]} eventPrefix="client">
      {/* <PrepareTextures /> */}
      <group>
        <RingLight />
        <CrystalArray />
        {/* <Particles count={6000} /> */}
      </group>
      <group>
        <CameraRig />
        <PostPro />
        <BakeShadows />
      </group>
      <SceneManager />
      <Environment preset="warehouse" />
    </Canvas>
  );
}
