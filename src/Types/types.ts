import { z } from "zod";

export const textSchema = z.object({
  title: z.string(),
  content: z.string(),
});
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
  created_at?: number;
  saved?: boolean;
};

export type ConversationType = {
  id?: string;
  user_id?: string;
  title?: string;
  created_at?: string;
};

export type PreviousMessageType = {
  content: string;
  role: "user" | "assistant";
};

export type SpringOptionType = {
  delay: number;
  reset: boolean;
  fromPosition: [number, number, number];
  toPosition: [number, number, number] | [number, number, number][];
  fromScale: number;
  toScale: number | number[];
  fromRotation: number[];
  toRotation: [number, number, number] | [number, number, number][];
  springConfig: {
    mass?: number;
    tension?: number;
    friction?: number;
    duration?: number;
  };
};

export type SpringOptionsType = {
  [keyof in
    | "idle"
    | "concentrating"
    | "responding"
    | "angry"
    | "sad"
    | "narrative"
    | "happy"]: SpringOptionType;
};
