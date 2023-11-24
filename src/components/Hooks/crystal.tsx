import { useSnapshot } from "valtio";
import { SpringValue, animated, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { textSchema } from "../../Schemas/schemas";
import { z } from "zod";
import { countSate, interactionState } from "@/States/states";

const AnimatedText = animated(Text);

type TextContentArray = z.infer<typeof textSchema>[];

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

export const useCrystalTextNodes = (config: any, contents: any) => {
  const { value: count } = useSnapshot(countSate);
  const texts = useMemo(() => {
    const _temp = Array(count)
      .fill(0)
      .map((v, i) => {
        // eslint-disable-next-line react/display-name
        return ({
          opacity,
          position,
        }: {
          opacity: SpringValue<number>;
          position: SpringValue<[number, number, number]>;
        }) => (
          <AnimatedText {...config} fillOpacity={opacity} position={position}>
            {contents[i]}
          </AnimatedText>
        );
      });
    return _temp;
  }, [config, contents, count]);

  return texts;
};

export const useText = () => {
  const [content, setContent] = useState<TextContentArray | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/content.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    fetchData();
  }, []);

  return content;
};

export const useCrystalTitles = (
  arr: TextContentArray | null,
  count: number
) => {
  const titles = Array(count)
    .fill(0)
    .map((v, i) => (arr ? arr[i].title : "Loading..."));

  return titles;
};

export const useCrystalContents = (
  arr: TextContentArray | null,
  count: number
) => {
  const contents = Array(count)
    .fill(0)
    .map((v, i) => (arr ? arr[i].content : "Loading..."));

  return contents;
};
