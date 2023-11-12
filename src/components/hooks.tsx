import { useSnapshot } from "valtio";
import { interactionState } from "./visual";
import { useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";

export const useCrystalMouseDetection = (id: number) => {
  const { hoverId, activeId } = useSnapshot(interactionState);
  const thisHovered = hoverId == id;
  const thisActive = activeId == id;
  const hasActive = activeId != -1;

  return {
    thisHovered,
    thisActive,
    hasActive,
  };
};

export const useCrystalInteraction = (id: number, args: any) => {
  // const { hoverId, activeId } = useSnapshot(interactionState);
  const { thisHovered, thisActive, hasActive } = useCrystalMouseDetection(id);
  const { viewport } = useThree();

  const { position, scale, rotation } = useSpring({
    position: [
      thisActive ? viewport.width / 3.5 : args.position[0],
      thisActive ? 3 : args.position[1],
      thisActive ? -17 : 0,
    ],
    scale: hasActive
      ? [thisActive ? 10 : 0, thisActive ? 10 : 0, thisActive ? 10 : 0]
      : thisHovered
      ? [5, 5, 5]
      : [2, 2, 2],
    rotation: hasActive
      ? [thisActive ? 10 : 0, thisActive ? 10 : 0, thisActive ? 10 : 0]
      : thisHovered
      ? [6, 6, 6]
      : [2, 2, 2],
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
      duration: 300,
    },
  });

  return {
    position,
    scale,
    rotation,
  };
};
