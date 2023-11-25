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
    opacity: showMask ? 0.1 : 1,
    config: { duration: 300 },
  });

  return (
    <>
      <a.div
        className="flex flex-col w-full h-full justify-start items-start gap z-20"
        style={springProps}
      >
        <div className="w-full text-3xl font-black text-white flex flex-wrap cursor-default select-none justify-start max-w-2xl whitespace-nowrap text-ellipsis overflow-x-hidden">
          {userMessage}
        </div>
        <div
          className={`${cn(
            s.chatListMask
          )} w-full text-xl text-white flex flex-wrap cursor-default select-none overflow-y-scroll h-32 overflow-x-hidden`}
        >
          {responseText}
        </div>
      </a.div>
    </>
  );
};
