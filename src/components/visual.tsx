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
import { proxy } from "valtio";
import { Particles } from "./particles";
import { CrystalArray } from "./crystals";
import { CameraRig } from "./camera";
import { PostPro } from "./postpro";
import { FaceBox, MainComponent, SceneManager } from "./misc";
import { Ring } from "./ring";

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
    <Canvas shadows dpr={[1, 1.5]}>
      {/* <CameraRig /> */}
      {/* <OrthographicCamera makeDefault position={[0, 0, 10]} /> */}
      <MainComponent />
      <color attach="background" args={["#f17070"]} />
      <group>
        <Ring />
        {/* <CrystalArray /> */}
        {/* <Particles count={6000} /> */}
      </group>
      {/* <PostPro /> */}
      <BakeShadows />

      <SceneManager />
      <Environment preset="warehouse" />
    </Canvas>
  );
}
