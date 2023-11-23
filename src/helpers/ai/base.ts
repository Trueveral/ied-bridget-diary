import { aiState, globalState } from "@/States/states";
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
  aiState.responseText = "";
  aiState.userMessage = "";
  aiState.status = "idle";
  aiState.inputText = "";
  aiState.pendingEmotion = false;
  aiState.refreshing = false;
  aiState.messageTerminated = false;
  aiState.responseCompleted = false;
  globalState.isFirstMessage = true;
  globalState.conversationId = undefined;
};

export const prepareAIForSending = (
  messageTerminated: boolean,
  inputText: string,
  chatRecords: readonly any[]
) => {
  aiState.messageTerminated = false;
  aiState.responseText = "";
  aiState.userMessage = inputText;
  aiState.inputText = "";
  aiState.status = "responding";
  aiState.pendingEmotion = false;
  // aiState.messageTerminated = false;

  const conversationHistory = [
    {
      role: "system",
      content: `${process.env.NEXT_PUBLIC_PROMPT}`,
    },
    ...chatRecords,
    {
      role: "user",
      content: aiState.userMessage,
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
