import { aiState, chatListState } from "@/states/states";
import { useSnapshot } from "valtio";
import s from "./style.module.css";
import cn from "classnames";
import { a, useSpring } from "@react-spring/web";
import { useEffect, useMemo } from "react";
import { ButtonList, SaveButton } from "./Buttons";

const ChatComponent = ({ messages }: { messages: any }) => {
  const { userMessage, assistantMessage } = messages;
  const { responseText, responseCompleted } = useSnapshot(aiState);
  const { showMask } = useSnapshot(chatListState);
  const props = useSpring({
    height: showMask ? 250 : 0,
    opacity: showMask ? 1 : 0,
    config: { duration: 300 },
  });

  return (
    <a.div
      className="flex flex-col w-full justify-start items-start gap"
      style={props}
    >
      <div className="w-full text-center text-3xl font-black text-white flex flex-wrap cursor-default select-none justify-start overflow-x-hidden">
        {userMessage}
      </div>
      <div
        className={`${cn(
          s.presentationArea
        )} w-full text-xl text-white flex flex-wrap cursor-default select-none overflow-y-auto max-h-48 overflow-x-hidden`}
      >
        {assistantMessage}
      </div>
      <ButtonList />
    </a.div>
  );
};

export const AnimatedChatComponent = () => {
  const { responseText, responseCompleted, userMessage } = useSnapshot(aiState);
  return (
    <>
      <a.div className="flex flex-col w-full justify-start items-start gap fixed left-1/2 -translate-x-1/2 mx-auto my-auto -translate-y-1/2 top-3/4">
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
        {responseText && responseCompleted ? <ButtonList /> : null}
      </a.div>
    </>
  );
};

export const ChatList = () => {
  const { chatRecords } = useSnapshot(aiState);
  const length = chatRecords.length;
  // if (length < 2) {
  //   return null;
  // }

  const userMessages = useMemo(() => {
    return chatRecords.filter((v, i) => v.role === "user").map(v => v.content);
  }, [chatRecords]);

  const assistantMessages = useMemo(() => {
    return chatRecords
      .filter((v, i) => v.role === "assistant")
      .map(v => v.content);
  }, [chatRecords]);

  // useEffect(() => {
  //   console.log("chatRecords", chatRecords);
  // });

  return (
    <div
      className={`${s.chatListMask} flex flex-col mt-8 overflow-y-scroll h-full`}
    >
      {userMessages.map((v, i) => {
        return (
          <ChatComponent
            key={i}
            messages={{
              userMessage: v,
              assistantMessage: assistantMessages[i]
                ? assistantMessages[i]
                : "No Response from Bridget",
            }}
          />
        );
      })}
    </div>
  );
};
