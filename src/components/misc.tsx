import { useSnapshot } from "valtio";
import * as THREE from "three";
import { interactionState } from "./visual";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Plane } from "@react-three/drei";
import { animated, easings, useSpring } from "@react-spring/three";

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
    return (
      <mesh position={[0, 0, 40]}>
          <Plane args={[1000, 1000]} rotation={[0, -Math.PI, 0]} material={new THREE.MeshLambertMaterial({
            color: "#a0a0a0",
            transparent: true,
            opacity: 0.4,

          })} />
        </mesh>
    )
  }
  
  export const RingLight = () => {
    const { activeId } = useSnapshot(interactionState);
    const { intensity } = useSpring({
      intensity: activeId == -1 ? 1000 : 0,
      config: {
        easing: easings.easeInOutSine,
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