import * as THREE from "three";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { easing } from "maath";
import React from "react";
import { useParticles } from "../Hooks/vfx";
import { interactionState } from "@/States/states";

// ref: this code is largely based on: https://codesandbox.io/s/qpfgyp

export const Particles = ({ count }: { count: number }) => {
  const dummy = new THREE.Object3D();
  const { activeId } = useSnapshot(interactionState);
  const mesh = useRef<THREE.InstancedMesh>();
  const particles = useParticles(count);

  useFrame(state => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.setScalar(s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!!.setMatrixAt(i, dummy.matrix);
    });

    easing.damp(
      mesh.current!!.material as THREE.MeshStandardMaterial,
      "opacity",
      activeId == -1 ? 0.5 : 0,
      0.5,
      state.clock.getDelta()
    );

    easing.dampE(
      mesh.current!!.rotation,
      [
        activeId == -1 ? 0 : 100,
        activeId == -1 ? 0 : 10,
        activeId == -1 ? 0 : 10,
      ],
      0.5,
      state.clock.getDelta()
    );

    mesh.current!!.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <instancedMesh
        // @ts-ignore
        ref={mesh}
        args={[undefined, undefined, count]}
        material={
          new THREE.MeshLambertMaterial({
            color: "#ffffff",
            transparent: true,
            opacity: 1,
          })
        }
      >
        <icosahedronGeometry args={[0.15, 0]} />
      </instancedMesh>
    </>
  );
};
