"use client";

import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
// import { getConversationsByUser } from "api";
import { useTransition, a, useSpring } from "@react-spring/web";
import { conversationAIState, globalState } from "@/States/states";
import { getConversationsByUser } from "@/Helpers/AI/base";
import s from "./style.module.css";
import cn from "classnames";
import { ConversationCard } from "./ConversationCard";

export const ConversationList = () => {
  const { user, conversationId } = useSnapshot(globalState);
  const { userMessage } = useSnapshot(conversationAIState);
  const [conversations, setConversations] = useState<any>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);

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
  }, [user, conversationId]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const transitions = useTransition(conversations.length, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: "auto" },
    leave: { opacity: 0, height: 0 },
  });

  const handleCardClick = (conversationId: string) => {
    globalState.conversationId = conversationId;
  };

  const hoverProps = useSpring({
    opacity: hovered ? 1 : 1,
    config: { mass: 1, tension: 100, friction: 20 },
  });

  return (
    <a.div
      className={`pb-4 fixed my-auto top-1/2 -translate-y-1/2 left-4 w-80 max-h-96 h-fit bg-white/20 backdrop-blur-xl rounded-2xl shadow-md`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={hoverProps}
    >
      <div className="flex flex-col gap-2 p-4 h-full">
        <div className="text-xl font-semibold absolute top-4 cursor-default">
          Conversations
        </div>
        <div className="overflow-scroll flex flex-col gap-2 h-full mt-9">
          {conversations.map((conversation: any, index: number) => (
            <div key={conversation.id}>
              <ConversationCard conversation={conversation} />
            </div>
          ))}
        </div>
      </div>
    </a.div>
  );
};
