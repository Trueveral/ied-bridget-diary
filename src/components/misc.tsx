import { useSnapshot } from "valtio";
import * as THREE from "three";
import { interactionState } from "./visual";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Image, Plane } from "@react-three/drei";
import { animated, easings, useSpring } from "@react-spring/three";
import React from "react";
import { easing } from "maath";

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
  const loader = new THREE.TextureLoader().setPath('images/background/');
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
    easing.damp(imageRef.current!!.material as THREE.MeshBasicMaterial, "opacity", activeId == -1 ? 0 : 1, 0.3, delta);
    easing.damp(coverRef.current!!.material as THREE.MeshLambertMaterial, "opacity", [8,7,6,4,2].includes(activeId) ? 0.7 : 0, 0.3, delta);
  });

  return (
    <mesh>
      <Plane args={[100, 80]} position={[0, 0, -15.5]} rotation={[0, -Math.PI, 0]} material={new THREE.MeshLambertMaterial({
        color: "#000000",
        transparent: true,
        opacity: 0,
      })}
        // @ts-ignore
        ref={coverRef}
      />
      <Image
        // @ts-ignore
        ref={imageRef}
        url={activeId == -1 ? `images/background/black.webp` : `images/background/${9 - (activeId) + 1}.webp`} position={[0, 0, -15]} rotation={[0, -Math.PI, 0]} scale={[80, 45]}
        opacity={0} transparent
      />
    </mesh>
  )
}

export const RingLight = () => {
  const { activeId } = useSnapshot(interactionState);
  const { intensity } = useSpring({
    intensity: activeId == -1 ? 1000 : 0,
    config: {
      easing: easings.easeInOutSine,
      duration: 200,
    },
  });
  return (
    <>
      <mesh position={[0, 0, 5]}>
        <animated.pointLight
          position={[0, 0, 5]}
          intensity={intensity}
          color="white"
          distance={1000}
        />
        <ringGeometry args={[12, 10, 70]} />
        <meshStandardMaterial />
      </mesh>
    </>
  );
};