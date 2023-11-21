import { a, useSpring } from "@react-spring/web";
import s from "./style.module.css";
import cn from "classnames";
import { useSnapshot } from "valtio";
import { aiState, chatListState } from "@/states/states";

export const BackgroundMask = () => {
  const { showMask } = useSnapshot(chatListState);

  const props = useSpring({
    opacity: showMask ? 1 : 0,
    config: { duration: 300 },
  });

  return (
    <a.div
      className="w-full h-screen blur-2xl fixed top-0 left-0 -z-10"
      style={props}
    >
      <div className={`${cn(s.backgroundMask)} w-full h-full bg-black/5`}></div>
    </a.div>
  );
};
