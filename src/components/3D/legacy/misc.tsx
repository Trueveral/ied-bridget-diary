"use client";

import { useSnapshot } from "valtio";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  FaceControls,
  FaceControlsApi,
  FaceLandmarker,
  Icosahedron,
  Image,
  Plane,
  Sphere,
} from "@react-three/drei";
import { animated, easings, useSpring } from "@react-spring/three";
import React from "react";
import { easing } from "maath";
import { interactionState } from "@/States/states";

export const SceneManager = () => {
  const { activeRef } = useSnapshot(interactionState);
  const raycaster = new THREE.Raycaster();
  const { camera } = useThree();
  const { pointer } = useThree();

  useEffect(() => {
    const handleClick = () => {
      if (!activeRef) return;
      const mouse = new THREE.Vector2(pointer.x, pointer.y);
      raycaster.setFromCamera(mouse, camera);

      if (activeRef) {
        // @ts-ignore
        const intersects = raycaster.intersectObject(activeRef);
        if (intersects.length == 0) {
          interactionState.activeId = -1;
          interactionState.activeRef = null;
        }
      }
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  return <></>;
};

export const ForegroundPlane = () => {
  const loader = new THREE.TextureLoader().setPath("images/background/");
  // const textures = {} as { [key: string]: THREE.Texture };
  const { hoverId, activeId } = useSnapshot(interactionState);
  const imageRef = React.useRef<THREE.Mesh>();
  const coverRef = React.useRef<THREE.Mesh>();
  // Array(10).fill(0).map((_, i) => `${i + 1}.webp`).forEach((v, i) => {
  //   const texture = loader.load(v);
  //   texture.minFilter = THREE.LinearFilter;
  //   texture.magFilter = THREE.LinearFilter;
  //   texture.colorSpace = THREE.SRGBColorSpace;
  //   textures[`${9 - i}`] = texture;
  // })

  // interactionState.textures = textures;

  useFrame((state, delta) => {
    easing.damp(
      imageRef.current!!.material as THREE.MeshBasicMaterial,
      "opacity",
      activeId == -1 ? 0 : 1,
      0.3,
      delta
    );
    easing.damp(
      coverRef.current!!.material as THREE.MeshLambertMaterial,
      "opacity",
      [8, 7, 6, 4, 2].includes(activeId) ? 0.7 : 0,
      0.3,
      delta
    );
  });

  return (
    <mesh>
      <Plane
        args={[100, 80]}
        position={[0, 0, -15.5]}
        rotation={[0, -Math.PI, 0]}
        material={
          new THREE.MeshLambertMaterial({
            color: "#000000",
            transparent: true,
            opacity: 0,
          })
        }
        // @ts-ignore
        ref={coverRef}
      />
      <Image
        // @ts-ignore
        ref={imageRef}
        url={
          activeId == -1
            ? `images/background/black.webp`
            : `images/background/${9 - activeId + 1}.webp`
        }
        position={[0, 0, -15]}
        rotation={[0, -Math.PI, 0]}
        scale={[80, 45]}
        opacity={0}
        transparent
        alt=""
      />
    </mesh>
  );
};
