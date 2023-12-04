"use client";

import { useState, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { a, useSpring } from "@react-spring/web";
import { conversationAIState, globalState } from "@/States/states";
import {
  createConversation,
  getConversationsByUser,
  supabase,
} from "@/Helpers/AI/db";
import { ConversationCard } from "./ConversationCard";
import { type RealtimeChannel } from "@supabase/supabase-js";
import s from "./style.module.css";
import cn from "classnames";
import { StartNewConversationButton } from "../Input/ActionButtons";
import { resetAIState } from "@/Helpers/AI/base";

export const ConversationList = () => {
  const { user, conversationId } = useSnapshot(globalState);
  const [conversations, setConversations] = useState<any>([]);
  const [hovered, setHovered] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const userId = user?.id;
      if (userId) {
        const { data: conversationIds } = await getConversationsByUser(userId);
        setConversations(conversationIds);
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

  const handleStartNewConversation = async () => {
    // transcribe the above curl command to js
    conversationAIState.refreshing = true;
    conversationAIState.responseText = "";
    conversationAIState.userMessage = "";
    conversationAIState.status = "idle";
    conversationAIState.inputText = "";
    conversationAIState.pendingEmotion = false;
    conversationAIState.refreshing = false;
    conversationAIState.messageTerminated = false;
    conversationAIState.responseCompleted = false;
    globalState.isFirstMessage = true;
    if (user.id) {
      const { data, error } = await createConversation(user.id);
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        globalState.conversationId = data.id;
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }

    conversationAIState.refreshing = false;
  };

  return (
    <a.div
      className={`pb-4 fixed my-auto top-1/2 -translate-y-1/2 left-4 w-80 max-h-96 h-fit bg-white/5 backdrop-blur-xl rounded-2xl shadow-md overflow-y-scroll`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={scrollRef}
      style={hoverProps}
    >
      <a.div className={`flex flex-col gap-2 p-4 h-full w-full`}>
        <div
          className={`${cn(
            s.conversationTitleMask
          )} flex flex-row justify-between items-center sticky p-1 top-1 h-max w-full z-10 `}
        >
          <div className="text-xl font-semibold cursor-default text-white">
            Conversations
          </div>
          <StartNewConversationButton
            onClickCallback={handleStartNewConversation}
          />
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
      </a.div>
    </a.div>
  );
};
