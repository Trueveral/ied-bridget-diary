"use client";

import { useState, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { a, useSpring } from "@react-spring/web";
import { globalState } from "@/States/states";
import { getConversationsByUser, supabase } from "@/Helpers/AI/base";
import { ConversationCard } from "./ConversationCard";
import { type RealtimeChannel } from "@supabase/supabase-js";
import s from "./style.module.css";
import cn from "classnames";

export const ConversationList = () => {
  const { user, conversationId } = useSnapshot(globalState);
  const [conversations, setConversations] = useState<any>([]);
  const [hovered, setHovered] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const userId = user?.id;
      if (userId) {
        const { data: conversationIds } = await getConversationsByUser(userId);
        setConversations(conversationIds);
        console.log(conversationIds);
      }
    };

    fetchConversations();
    channelRef.current = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Conversation" },
        payload => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current!!);
    };
  }, [user, conversationId]);

  const hoverProps = useSpring({
    opacity: hovered ? 1 : 0,
    config: { mass: 1, tension: 100, friction: 20 },
  });

  return (
    <a.div
      className={`pb-4 fixed my-auto top-1/2 -translate-y-1/2 left-4 w-80 max-h-96 h-fit bg-white/20 backdrop-blur-xl rounded-2xl shadow-md overflow-y-scroll`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={hoverProps}
    >
      <div className="flex flex-col gap-2 p-4 h-full">
        <div className="text-xl font-semibold top-4 cursor-default sticky">
          Conversations
        </div>
        <div
          className={`${cn(
            s.conversationListMask
          )} overflow-scroll flex flex-col gap-2 h-full mt-9`}
        >
          {conversations.map((conversation: any) => (
            <div key={conversation.id}>
              <ConversationCard conversation={conversation} />
            </div>
          ))}
        </div>
      </div>
    </a.div>
  );
};
