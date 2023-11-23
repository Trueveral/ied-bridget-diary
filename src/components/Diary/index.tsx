"use client";

import {
  getSavedDiaries,
  getSavedDiariesByUser,
  supabase,
} from "@/Helpers/AI/base";
import { globalState } from "@/States/states";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { MessageType, UserType } from "../Hooks/base";
import { type RealtimeChannel } from "@supabase/supabase-js";
import cn from "classnames";
import s from "./style.module.css";
import { DiaryUserMessage } from "./UserMessage";
import { DiaryAssistantMessage } from "./AssistantMessage";
import { FixedSizeList as List } from "react-window";

export const Diary = () => {
  const { user } = useSnapshot(globalState);
  const [showMyDiaries, setShowMyDiaries] = useState(false);
  const [limit, setLimit] = useState(100);
  const [diaries, setDiaries] = useState<any[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      let fetchedDiaries: any;
      if (showMyDiaries) {
        fetchedDiaries = await getSavedDiariesByUser(user.id!!, limit);
      } else {
        fetchedDiaries = await getSavedDiaries(limit);
      }
      setDiaries(fetchedDiaries.data);
    };

    fetchDiaries();

    channelRef.current = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Message" },
        payload => {
          fetchDiaries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current!!);
    };
  }, [user.id, showMyDiaries, limit]);

  const handleToggleDiaries = () => {
    setShowMyDiaries(!showMyDiaries);
    setLimit(100);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value);
    if (newLimit >= 1 && newLimit <= 500) {
      setLimit(newLimit);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen z-0">
        <div
          className={`flex flex-col overflow-y-scroll h-full w-full gap-2 p-20 `}
        >
          <h1 className="text-2xl font-bold">Saved Diaries</h1>
          <div className="flex items-center gap-6">
            <button
              className="px-4 py-2 bg-black/50 text-white rounded-xl hover:bg-white/20 transition-all"
              onClick={handleToggleDiaries}
            >
              {showMyDiaries
                ? "Show all saved diaries"
                : "Show my saved diaries"}
            </button>
            <div className="text-white cursor-default">Limit</div>
            <input
              type="number"
              min="1"
              title="limit"
              max="500"
              value={limit}
              onChange={handleLimitChange}
              className="px-2 py-1 border rounded bg-black/50 text-white/80 hover:bg-white/20 transition-all select-none"
            />
          </div>
          <div
            className={`${cn(
              s.diariesMask
            )} flex flex-col overflow-y-scroll h-full gap-2 pt-24 pb-24 text-white `}
          >
            {diaries.map((message: any) => (
              <div
                key={message.id}
                className="flex flex-col w-full h-fit justify-start items-start"
              >
                <div className="flex flex-col w-full h-fit gap-3">
                  <div>
                    {message.role === "user" ? (
                      <DiaryUserMessage
                        username={message.User.username}
                        message={message.text}
                      />
                    ) : (
                      <DiaryAssistantMessage message={message.text} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
