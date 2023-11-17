import { aiState } from "@/states/states";
import { type ChangeEvent, useState } from "react";
import { useSnapshot } from "valtio";

export const Input = ({ onSendCallback }: { onSendCallback: () => void }) => {
  const { inputText } = useSnapshot(aiState);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    aiState.inputText = e.target.value;
  };
  return (
    <input
      type="text"
      value={inputText}
      onChange={handleChange}
      onKeyDown={e => {
        if (e.key === "Enter") {
          onSendCallback();
        } else {
          aiState.status = "inputing";
        }
      }}
      onKeyUp={e => {
        if (e.key === "Enter") {
          aiState.status = "sending";
        } else {
          aiState.status = "idle";
        }
      }}
      className="w-full px-3 py-2 border border-gray-300 bg-gray-300 rounded-full text-red-400 font-bold focus:outline-none"
      aria-label="Text input"
      placeholder=""
    />
  );
};
