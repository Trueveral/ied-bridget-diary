"use client";

import { useSnapshot } from "valtio";
import { collectionState } from "@/States/states";
export const CollectionBrief = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const { activeId } = useSnapshot(collectionState);
  return (
    <div className="w-screen gap-4 flex flex-col p-9 items-start justify-end h-screen text-white -z-10">
      <div className="text-2xl font-bold max-w-3xl">{title}</div>
      <div className="text-xl w-full max-w-3xl">{content}</div>
    </div>
  );
};
