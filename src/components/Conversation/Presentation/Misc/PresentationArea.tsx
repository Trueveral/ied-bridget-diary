"use client";
import {
  conversationAIState,
  conversationChatListState,
} from "@/States/states";
import React, { useEffect } from "react";
import { useSnapshot } from "valtio";

export const PresentationArea = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { responseText, userMessage, responseCompleted } =
    useSnapshot(conversationAIState);

  const contentRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    conversationChatListState.contentPS = {
      width: contentRef.current?.offsetWidth ?? 0,
      height: contentRef.current?.offsetHeight ?? 0,
      x: contentRef.current?.offsetLeft ?? 0,
      y: contentRef.current?.offsetTop ?? 0,
    };
  }, [responseText]);
  return (
    <div
      className="flex flex-col h-full lg:w-1/2 sm:w-screen md:w-3/4 fixed left-1/2 -translate-x-1/2 mx-auto my-auto top-0 justif-end items-start"
      ref={contentRef}
    >
      {children}
    </div>
  );
};
