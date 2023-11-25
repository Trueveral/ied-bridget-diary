"use client";
import { a, useSpring } from "@react-spring/web";
import s from "../style.module.css";
import cn from "classnames";
import { useSnapshot } from "valtio";
import { conversationChatListState, globalState } from "@/States/states";

export const BackgroundMask = () => {
  const {
    showMask,
    contentPS: { height, width, x, y },
  } = useSnapshot(conversationChatListState);
  const { link } = useSnapshot(globalState);

  const maskProps = useSpring({
    opacity: link === "conversation" ? 1 : 0,
    config: { mass: 1, tension: 500, friction: 50 },
  });

  return (
    <a.div
      className={`fixed -z-10 mx-auto left-1/2 -translate-x-1/2 h-screen w-screen`}
      style={maskProps}
    >
      <div
        className={`${cn(
          s.backgroundMask
        )} h-full w-full bg-black/5 backdrop-blur-xl`}
      ></div>
    </a.div>
  );
};
