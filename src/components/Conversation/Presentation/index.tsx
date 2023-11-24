"use server";
import { BackgroundMask } from "./BackgroundMask";
import { AnimatedChatComponent } from "./MessageList/AnimatedChatComponent";
import React, { use } from "react";
import { ChatList } from "./MessageList";
import { PresentationArea } from "./PresentationArea";

export const Presentation = async () => {
  return (
    <>
      {/* <div className="max-w-3xl mx-auto my-auto w-1/2 md:w-3/4 sm:w-4/5 flex flex-col justify-center items-start fixed z-20 top-72 text-3xl font-black left-1/2 -translate-x-1/2 overflow-y-auto gap-4">
        <div>Central Academy of Fine Art.</div>
      </div> */}
      <BackgroundMask />
      <PresentationArea>
        <div>
          <div className="h-4/5 mt-20 justify-end items-end">
            <ChatList initialMessages={[]} />
          </div>
          <div className="h-2/5">
            <AnimatedChatComponent />
          </div>
        </div>
      </PresentationArea>
      {/* <div className={`${s.fadeText}`}>BVISIONOS0.3</div> */}
    </>
  );
};
