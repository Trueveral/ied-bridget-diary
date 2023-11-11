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

const loader = new THREE.TextureLoader().setPath('images/background/');



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

// const PrepareTextures = () => {
//   const textures = useMemo(()=>{
//     const textures = {} as {[key:string]:THREE.Texture};
//     Array(10).fill(0).map((_,i)=>`${i+1}.webp`).forEach((v,i)=>{
//       const texture = loader.load( v );
//       texture.minFilter = THREE.LinearFilter;
//       texture.magFilter = THREE.LinearFilter;
//       texture.colorSpace = THREE.SRGBColorSpace;
//       textures[`${9-i}`] = texture;
//     })
//     return textures;
//   }, []);

//   interactionState.textures = textures;
//   return null;
// }

export default function Visual() {
  return (
    <Canvas className=" bg-black" shadows dpr={[1, 1.5]} eventPrefix="client">
      {/* <PrepareTextures /> */}
      <ForegroundPlane />
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