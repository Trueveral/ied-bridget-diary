import { supabase } from "./db";

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
