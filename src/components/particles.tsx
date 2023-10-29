import * as THREE from "three";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { interactionState } from "./visual";
import { easing } from "maath";

export const Particles = ({ count }: { count: number }) => {
  const dummy = new THREE.Object3D();
  const mesh = useRef<THREE.InstancedMesh>();
  const { activeId } = useSnapshot(interactionState);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // 生成粒子的随机时间
      const t = Math.random() * 100;
      // 生成粒子的随机因子，speed 值越大，粒子运动越快
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      // x,y,z 值有正有负，所以粒子会在整个场景中随机分布
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);
  useFrame(state => {
    // 通过鼠标的位置，设置光源的位置
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      // t最终等于 t += speed / 2
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      // 通过粒子的随机因子，设置粒子的位置
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

    easing.dampC(
      (mesh.current!!.material as THREE.MeshStandardMaterial).color,
      activeId == -1 ? "white" : "black",
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
        ref={mesh}
        args={[undefined, undefined, count]}
        material={
          new THREE.MeshStandardMaterial({
            color: "#a0a0a0",
            roughness: 0.5,
            metalness: 0.5,
            transparent: true,
            opacity: 0.5,
          })
        }
      >
        <sphereGeometry args={[0.3]} />
      </instancedMesh>
    </>
  );
};
