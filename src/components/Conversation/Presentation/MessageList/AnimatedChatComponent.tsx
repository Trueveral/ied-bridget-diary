"use client";
import {
  conversationAIState,
  conversationChatListState,
} from "@/States/states";
import { useSnapshot } from "valtio";
import cn from "classnames";
import s from "../style.module.css";
import { a, useSpring } from "@react-spring/web";

export const AnimatedChatComponent = () => {
  const { responseCompleted, messageTerminated, responseText, userMessage } =
    useSnapshot(conversationAIState);

  const { showMask } = useSnapshot(conversationChatListState);

  const springProps = useSpring({
    opacity: showMask ? 0.7 : 1,
    config: { duration: 300 },
  });

  return (
    <>
      <a.div
        className="flex flex-col w-full justify-start items-start gap fixed left-1/2 -translate-x-1/2 mx-auto my-auto -translate-y-1/2 top-3/4"
        style={springProps}
      >
        <div className="w-full text-center text-3xl font-black text-white flex flex-wrap cursor-default select-none justify-start overflow-x-hidden">
          {userMessage}
        </div>
        <div
          className={`${cn(
            s.presentationArea
          )} w-full text-xl text-white flex flex-wrap cursor-default select-none overflow-y-scroll max-h-48 overflow-x-hidden`}
        >
          {responseText}
        </div>
      </a.div>
    </>
  );
};
