"use client";

export type UserType = {
  id?: string;
  username?: string;
  created_at?: string;
};

export type MessageType = {
  id?: string;
  conversation_id?: string;
  gpt_id: string;
  user_id: string;
  text: string;
  role: "assistant" | "user";
  timestamp?: number;
  saved?: boolean;
};
