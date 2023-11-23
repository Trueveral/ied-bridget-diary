"use client";
import { a, useSpring } from "@react-spring/web";
import s from "./style.module.css";
import cn from "classnames";
import { useSnapshot } from "valtio";
import { aiState, chatListState } from "@/States/states";

export const BackgroundMask = () => {
  const {
    showMask,
    contentPS: { height, width, x, y },
  } = useSnapshot(chatListState);

  const props = useSpring({
    opacity: showMask ? 1 : 0,
    // height: showMask ? height : 0,
    // width: width,
    config: { duration: 300 },
  });

  return (
    <div className="blur-2xl fixed -z-10 w-screen h-screen">
      <a.div
        className={`backdrop-blur-2xl bg-black/30 h-full w-full`}
        style={props}
      ></a.div>
    </div>
  );
};
