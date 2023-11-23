import s from "../style.module.css";
import cn from "classnames";
import { MessageType } from "@/components/Hooks/base";

export const UserMessageComponent = ({ message }: { message: MessageType }) => {
  return (
    <div className="w-full text-xl font-black text-white flex flex-wrap cursor-default select-none justify-start overflow-x-hidden">
      {message.text}
    </div>
  );
};

export const AssistantMessageComponent = ({
  message,
}: {
  message: MessageType;
}) => {
  return (
    <div
      className={`${cn(
        s.presentationArea
      )} w-full text-xl text-white flex flex-wrap cursor-default select-none overflow-y-scroll overflow-x-hidden`}
    >
      {message.text}
    </div>
  );
};
