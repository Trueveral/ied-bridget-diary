"use client";
import { globalState } from "@/States/states";
import { Icon } from "@iconify/react";
import { useSnapshot } from "valtio/react";

export const ProfileBadge = ({ handleClick }: { handleClick: () => void }) => {
  const { user } = useSnapshot(globalState);
  return (
    <div className="fixed top-10 right-16 flex-col justify-center items-center w-fit flex z-10">
      <button
        className={`transition ease-in-out duration-300 rounded-full p-2 w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-2xl hover:bg-white/20 text-white"
          }`}
        title="Create new profile"
        onClick={handleClick}
      >
        <Icon icon="fluent:person-add-20-filled" color="white" />
      </button>
      <div className="text-white">{user.username}</div>
    </div>
  );
};
