import { aiState, chatListState } from "@/states/states";
import { useTransition, animated, useTrail } from "@react-spring/web";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import s from "./style.module.css";
import cn from "classnames";
import { WordMask } from "./WordMask";
import { SaveButton } from "./Buttons";
import { BackgroundMask } from "./BackgroundMask";
import { AnimatedChatComponent, ChatList } from "./ChatList";

export const Presentation = () => {
  const { responseText, userMessage, chatRecords, responseCompleted } =
    useSnapshot(aiState);
  const userWords = userMessage.split(" ");
  // const responseWords = responseText.split(" ");

  const SERET_CODE = "KeasonAya";
  const secretHit = userMessage.includes(SERET_CODE);

  // const responseTrailsFill = useTrail(responseWords.length, {
  //   from: { opacity: 0, x: 20 },
  //   to: { opacity: 1, x: 0 },
  //   config: { mass: 5, tension: 2000, friction: 200 },
  // });

  // const responseTrails = useTrail(responseText.length, {
  //   from: { opacity: 0, x: 20 },
  //   to: { opacity: 1, x: 0 },
  //   config: { mass: 5, tension: 2000, friction: 200 },
  // });

  const responseTransitions = useTransition(responseText, {
    from: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: 20 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  const userTrails = useTrail(userWords.length, {
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  return (
    <>
      {/* <div className="max-w-3xl mx-auto my-auto w-1/2 md:w-3/4 sm:w-4/5 flex flex-col justify-center items-start fixed z-20 top-72 text-3xl font-black left-1/2 -translate-x-1/2 overflow-y-auto gap-4">
        <div>Central Academy of Fine Art.</div>
      </div> */}
      <div
        className="flex flex-col h-full lg:w-1/2 sm:w-screen md:w-3/4 fixed left-1/2 -translate-x-1/2 mx-auto my-auto top-0 items-start"
        onMouseEnter={() => {
          if (chatRecords.length === 0 && responseText.length === 0) return;
          chatListState.showMask = true;
        }}
        onMouseLeave={() => {
          chatListState.showMask = false;
        }}
      >
        {/* 在这里添加你的其他内容 */}
        <div className="h-3/5">
          <ChatList />
        </div>
        <div className="h-2/5">
          <AnimatedChatComponent />
        </div>
        <BackgroundMask />
      </div>
      {/* <div className={`${s.fadeText}`}>BVISIONOS0.3</div> */}
    </>
  );
};
