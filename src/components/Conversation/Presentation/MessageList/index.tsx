"use client";
import { MessageType, UserType } from "@/components/Hooks/base";
import {
  AssistantMessageComponent,
  UserMessageComponent,
} from "./ChatComponent";
import s from "../style.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMessagesByUser,
  getMessagesByUserAndConversationId,
  supabase,
} from "@/Helpers/AI/base";
import { useSnapshot } from "valtio";
import {
  conversationAIState,
  conversationChatListState,
  globalState,
} from "@/States/states";
import { a, useSpring } from "@react-spring/web";
import { type RealtimeChannel } from "@supabase/supabase-js";
import { AudioButton, SaveButton } from "./ActionButtons";

export const ChatList = ({
  initialMessages,
}: {
  initialMessages?: MessageType[];
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const { showMask } = useSnapshot(conversationChatListState);
  const { responseCompleted } = useSnapshot(conversationAIState);
  const props = useSpring({
    // height: showMask ? 250 : 0,
    opacity: showMask ? 1 : 0.5,
    config: { duration: 300 },
  });

  const { user, conversationId, isFirstMessage } = useSnapshot(globalState);

  const fetchMessages = useCallback(async () => {
    if (!user.id) return setMessages([]);
    if (!conversationId) return setMessages([]);
    await getMessagesByUserAndConversationId(user.id, conversationId).then(
      data => {
        if (data.messages === null) return setMessages([]);
        setMessages(data.messages);
      }
    );
  }, [user, conversationId]);

  useEffect(() => {
    fetchMessages();

    const channel = supabase.channel("custom-all-channel");
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Message" },
        payload => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, responseCompleted]);

  // Note: the pattern of returning user and assistant messages separately is deliberate.
  // Because the action buttons are attached to the assistant messages
  // It ensures only when there are assistant messages, the action buttons will be shown
  // IE. It forces the messages to be saved in pairs
  return (
    <div
      className={`${s.chatListMask} flex flex-col overflow-y-auto h-full gap-2 pt-24 pb-96 z-20 max-w-3xl`}
      onMouseEnter={() => {
        conversationChatListState.showMask = true;
      }}
      onMouseLeave={() => {
        conversationChatListState.showMask = false;
      }}
    >
      {messages.map((v, i) => {
        return (
          <a.div
            key={i}
            className="flex flex-col w-full h-fit justify-start items-start"
            style={props}
          >
            {i % 2 === 0 ? (
              <UserMessageComponent message={v} />
            ) : (
              <div className="flex flex-col w-full h-fit">
                <AssistantMessageComponent message={v} />
                <div className="flex flex-row gap-4">
                  <SaveButton messageGPTID={v.gpt_id} />
                  <AudioButton />
                </div>
              </div>
            )}
          </a.div>
        );
      })}
    </div>
  );
};
