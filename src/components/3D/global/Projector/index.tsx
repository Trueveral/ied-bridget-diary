import * as THREE from "three";

export const Projector = () => {
  const texture = new THREE.TextureLoader().load("/images/background/1.webp");
  return (
    <spotLight
      position={[0, 0, 2]}
      intensity={0}
      angle={-Math.PI / 4}
      penumbra={1}
      decay={2}
      map={texture}
    ></spotLight>
  );
};
