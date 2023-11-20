import { Float } from "@react-three/drei";
import { RingIndicator } from "./temp";
import { a, useSpring } from "@react-spring/three";
import { aiState } from "@/states/states";
import { useSnapshot } from "valtio";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const SCALE_FACTOR = 0.2;

export const RingArray = ({ number }: { number: number }) => {
  const { status, pendingEmotion } = useSnapshot(aiState);
  const {
    size: { width, height },
  } = useThree();

  let showCenter: any;
  if (pendingEmotion) {
    showCenter = false;
  } else {
    // temporary fix for 1119 Eastern
    showCenter = status == "idle" || status == "responding";
  }
  useEffect(() => {
    console.log(width, height);
  }, [width, height]);

  const { scale, position } = useSpring({
    scale: [
      showCenter ? 1 : SCALE_FACTOR,
      showCenter ? 1 : SCALE_FACTOR,
      showCenter ? 1 : SCALE_FACTOR,
    ],
    position: [
      showCenter ? 0 : (-width / 800) * 1,
      showCenter ? 0 : (height / 800) * 1,
      0,
    ],
    config: {
      mass: 1,
      tension: 1000,
      friction: 100,
    },
  });

  return (
    <Float speed={0} floatIntensity={1}>
      <a.mesh scale={scale} position={position}>
        {Array(6)
          .fill(0)
          .map((r, i) => (
            <RingIndicator index={i} key={i} />
          ))}
      </a.mesh>
    </Float>
  );
};
