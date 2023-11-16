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

export default function Visual() {
  return (
    <>
      <Canvas shadows dpr={[1, 1.5]}>
        {/* <CameraRig /> */}
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
    </>
  );
}
