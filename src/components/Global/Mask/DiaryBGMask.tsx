"use client";

import { globalState } from "@/States/states";
import { useSnapshot } from "valtio";
import { a, useSpring } from "@react-spring/web";
import s from "./style.module.css";
import cn from "classnames";

export default function DiaryBGMask() {
  const { link } = useSnapshot(globalState);
  const showShow = link === "diary" || link === "conversation";
  const props = useSpring({
    opacity: showShow ? 1 : 0,
    height: showShow ? 4000 : 0,
    width: showShow ? 3000 : 0,
    config: { duration: 1000 },
  });

  return (
    <a.div
      className={`${cn(
        s.diariesMask
      )} fixed bg-black/20 backdrop-blur-2xl top-0 left-0 -z-[5]`}
      style={props}
    />
  );
}
