"use client";
import {
  CollectionLeftButton,
  CollectionRightButton,
} from "@/components/Collection/Button";

import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTransition, animated } from "@react-spring/web";
import { collectionState } from "@/States/states";
import { CollectionBrief } from "./Brief";

interface ContentData {
  title: string;
  content: string;
}

export const Collection = () => {
  const [content, setContent] = useState<ContentData[]>([]);
  const { activeId } = useSnapshot(collectionState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/collections/content.json");
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error fetching content data:", error);
      }
    };

    fetchData();
  }, []);

  const transitions = useTransition(activeId, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  return (
    <>
      <CollectionLeftButton />
      <CollectionRightButton />
      {/* {transitions((style, index) => ( */}
      <animated.div>
        <CollectionBrief
          title={content[activeId - 1]?.title}
          content={content[activeId - 1]?.content}
        />
      </animated.div>
      {/* ))} */}
    </>
  );
};
