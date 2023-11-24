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
    <div className="w-screen gap-4 flex flex-col p-9 items-end justify-end h-screen">
      <div className="text-2xl font-bold w-full">{title}</div>
      <div className="text-xl w-full">{content}</div>
    </div>
  );
};
