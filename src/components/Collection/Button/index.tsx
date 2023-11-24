"use client";
import { collectionState } from "@/States/states";
import { Icon } from "@iconify/react";

export const CollectionLeftButton = () => {
  return (
    <button
      className=" rounded-2xl fixed my-auto top-1/2 -translate-y-1/2 w-fit h-28 bg-black/20 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 left-10"
      type="button"
      title="Previous"
      onClick={() => {
        if (collectionState.activeId === 1) {
          collectionState.activeId = collectionState.total;
        } else {
          collectionState.activeId = collectionState.activeId - 1;
        }
      }}
    >
      <Icon className="w-14 h-14" icon="mingcute:left-fill" color="white" />
    </button>
  );
};

export const CollectionRightButton = () => {
  return (
    <button
      className="rounded-2xl fixed my-auto top-1/2 -translate-y-1/2 w-fit h-28 bg-black/20 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 right-10"
      type="button"
      title="Next"
      onClick={() => {
        if (collectionState.activeId === collectionState.total) {
          collectionState.activeId = 1;
        } else {
          collectionState.activeId = collectionState.activeId + 1;
        }
      }}
    >
      <Icon className="w-14 h-14" icon="mingcute:right-fill" color="white" />
    </button>
  );
};
