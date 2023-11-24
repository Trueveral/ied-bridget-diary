"use client";
import { a, useSpring } from "@react-spring/web";
import s from "./style.module.css";
import cn from "classnames";
import { useSnapshot } from "valtio";
import { conversationChatListState } from "@/States/states";

export const BackgroundMask = () => {
  const {
    showMask,
    contentPS: { height, width, x, y },
  } = useSnapshot(conversationChatListState);

  const maskProps = useSpring({
    opacity: showMask ? 1 : 0.5,
    // height: showMask ? height : 0,
    // width: width,
    config: { mass: 1, tension: 500, friction: 50 },
  });

  return (
    <div
      className={`fixed -z-10 w-screen h-screen mx-auto left-1/2 -translate-x-1/2`}
    >
      <a.div
        className={`${cn(
          s.backgroundMask
        )} h-full w-full bg-black/40 backdrop-blur-sm`}
        style={maskProps}
      ></a.div>
    </div>
  );
};
