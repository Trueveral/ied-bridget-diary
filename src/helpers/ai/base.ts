import { conversationAIState, globalState } from "@/States/states";
import { generateUUID } from "three/src/math/MathUtils.js";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { MessageType } from "@/components/Hooks/base";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

export const openAIService = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const resetAIState = () => {
  conversationAIState.responseText = "";
  conversationAIState.userMessage = "";
  conversationAIState.status = "idle";
  conversationAIState.inputText = "";
  conversationAIState.pendingEmotion = false;
  conversationAIState.refreshing = false;
  conversationAIState.messageTerminated = false;
  conversationAIState.responseCompleted = false;
  globalState.isFirstMessage = true;
  globalState.conversationId = undefined;
};

export const prepareAIForSending = (
  messageTerminated: boolean,
  inputText: string,
  chatRecords: readonly any[]
) => {
  conversationAIState.messageTerminated = false;
  conversationAIState.responseText = "";
  conversationAIState.userMessage = inputText;
  conversationAIState.inputText = "";
  conversationAIState.status = "responding";
  conversationAIState.pendingEmotion = false;
  conversationAIState.responseCompleted = false;
  // aiState.messageTerminated = false;

  const conversationHistory = [
    {
      role: "system",
      content: `${process.env.NEXT_PUBLIC_PROMPT}`,
    },
    ...chatRecords,
    {
      role: "user",
      content: conversationAIState.userMessage,
    },
  ];

  return conversationHistory;
};

const supabaseUrl = "https://jidrpskqigamtxhodmgb.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getMessagesByUser(userId: string) {
  const { data: messages, error } = await supabase
    .from("Message")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });
  return {
    messages,
    error,
  };
}

export async function getMessagesByUserAndConversationId(
  userId: string,
  conversationId: string
) {
  const { data: messages, error } = await supabase
    .from("Message")
    .select("*")
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false });
  return {
    messages,
    error,
  };
}

export async function getMessagesByUserAndConversationIds(
  userId: string,
  conversationId: string[]
) {
  const { data: messages, error } = await supabase
    .from("Message")
    .select("*")
    .eq("user_id", userId)
    .in("conversation_id", conversationId)
    .order("id", { ascending: false });
  return {
    messages,
    error,
  };
}

export async function getSavedDiariesByUser(userId: string, limit?: number) {
  const { data, error } = await supabase
    .from("Message")
    .select("*, User (id, username)")
    .eq("user_id", userId)
    .eq("saved", true)
    .order("created_at", { ascending: false })
    .limit(limit || 300);

  return {
    data,
    error,
  };
}

export async function getUsersListByName(
  name: string,
  conversationPreview: boolean
) {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .ilike("username", `%${name}%`)
    .limit(10);

  if (conversationPreview) {
    const users = data.map((user: any) => user.id);
    const messages = await supabase
      .from("Message")
      .select("*")
      .in("user_id", users)
      .order("id", { ascending: true })
      .limit(2);

    const result = data.map((user: any) => {
      const userMessages = messages.data.filter(
        (message: any) => message.user_id === user.id
      );
      return {
        user,
        latestMessage: userMessages,
      };
    });

    return {
      data: result,
      error,
    };
  }

  return {
    data,
    error,
  };
}

export async function getSavedDiaries(limit?: number) {
  const { data, error } = await supabase
    .from("Message")
    .select("*, User (id, username)")
    .eq("saved", true)
    .order("User (username)", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit || 300);

  return {
    data,
    error,
  };
}

export async function getConversationsByUser(userId: string) {
  const { data, error } = await supabase
    .from("Conversation")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  console.log(data, error);

  return {
    data,
    error,
  };
}

export async function renameConversation(
  conversationId: string,
  newName: string
) {
  const { data, error } = await supabase
    .from("Conversation")
    .update({ title: newName })
    .eq("id", conversationId);

  return {
    data,
    error,
  };
}

export async function getMessageById(userId: string, gptId: string) {
  const { data: message, error } = await supabase
    .from("Message")
    .select("*")
    .eq("user_id", userId)
    .eq("gpt_id", gptId);

  return {
    message,
    users: [message[0].user_id],
    error,
  };
}
