import { MeshTransmissionMaterial } from "@react-three/drei";

export const CrystalMaterial = () => {
  return (
    <MeshTransmissionMaterial
      ior={0.3}
      resolution={2048}
      roughness={0.1}
      distortion={0.5}
      thickness={1}
      anisotropy={1}
      samples={10}
      color="#ffffff"
      transparent
      opacity={0.8}
      distortionScale={0.1}
      temporalDistortion={0.0}
    />
  );
};
