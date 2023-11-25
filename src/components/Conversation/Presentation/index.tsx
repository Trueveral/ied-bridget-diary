"use server";
import { BackgroundMask } from "./Misc/BackgroundMask";
import { AnimatedChatComponent } from "./AnimatedChatComponent";
import React, { use } from "react";
import { ChatList } from "./MessageList";
import { PresentationArea } from "./Misc/PresentationArea";

export const Presentation = async () => {
  return (
    <>
      {/* <div className="max-w-3xl mx-auto my-auto w-1/2 md:w-3/4 sm:w-4/5 flex flex-col justify-center items-start fixed z-20 top-72 text-3xl font-black left-1/2 -translate-x-1/2 overflow-y-auto gap-4">
        <div>Central Academy of Fine Art.</div>
      </div> */}
      {/* <BackgroundMask /> */}
      <PresentationArea>
        <div className="h-3/5 justify-end items-end mt-28">
          <ChatList />
        </div>
        <div className="h-2/6">
          <AnimatedChatComponent />
        </div>
      </PresentationArea>
      {/* <div className={`${s.fadeText}`}>BVISIONOS0.3</div> */}
    </>
  );
};
