import { ConversationType } from "@/Types/types";
import { createClient } from "@supabase/supabase-js";

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
  const { data: users, error } = await supabase
    .from("User")
    .select("*")
    .ilike("username", `%${name}%`)
    .limit(10);

  if (conversationPreview) {
    if (!users) return { data: [], error };
    const userIDList = users.map((user: any) => user.id);
    const messages = await supabase
      .from("Message")
      .select("*")
      .in("user_id", userIDList)
      .order("id", { ascending: true })
      .limit(2);

    if (!messages.data) return { data: [], error };
    const result = users.map((user: any) => {
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
    .order("created_at", { ascending: false });

  return {
    data,
    error,
  };
}

export async function createConversation(userId: string): Promise<{
  data: any;
  error: any;
}> {
  const { data, error } = await supabase
    .from("Conversation")
    .insert([{ user_id: userId }])
    .select();

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

export async function deleteConversation(conversationId: string) {
  const { data, error } = await supabase
    .from("Conversation")
    .delete()
    .eq("id", conversationId);

  return {
    data,
    error,
  };
}
