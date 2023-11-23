import { aiState, chatListState } from "@/States/states";
import { NextResponse } from "next/server";
import { z } from "zod";
import { openAIService } from "./base";
import { MessageType } from "@/components/Hooks/base";

const aiResponseSchema = z.object({
  id: z.string(),
  answer: z.string(),
  created_at: z.number(),
  conversation_id: z.string(),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;
interface IOnData {
  (data: AIResponse): void;
}
interface IOnError {
  (error: any): void;
}
interface IOnCompleted {
  (): void;
}

interface IOnCompletedOpenAI {
  (finishReason: string): void;
}

interface ProcessMessageFn {
  (
    response: Response,
    callbacks: {
      onData?: IOnData;
      onError?: IOnError;
      onCompleted?: IOnCompleted;
    }
  ): void;
}

export const processStream: ProcessMessageFn = (response, callbacks) => {
  if (!response.ok) throw new Error("Network response was not ok");

  const reader = response.body!!.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let bufferObj: any;

  async function read() {
    const result = await reader.read();
    if (result.done) {
      callbacks.onCompleted?.();
      return;
    }
    buffer += decoder.decode(result.value, { stream: true });
    const lines = buffer.split("\n");
    try {
      for (const message of lines) {
        if (!message || !message.startsWith("data: ")) continue;
        try {
          bufferObj = JSON.parse(message.substring(6)); // remove data: and parse as json
        } catch (e) {
          // mute handle message cut off
          continue;
        }
        if (bufferObj.event !== "message") continue;
        callbacks.onData?.(bufferObj);
      }

      buffer = lines[lines.length - 1];
    } catch (e) {
      callbacks.onError?.(e);
      return;
    }
    read();
  }

  read();
};

const processBlock: ProcessMessageFn = (response, callbacks) => {
  if (!response.ok) {
    console.error(response);
    return;
  }
  response
    .json()
    .then((data: AIResponse) => {
      callbacks.onData?.(data);
    })
    .then(() => {
      callbacks.onCompleted?.();
    })
    .catch((e: any) => {
      callbacks.onError?.(e);
    });
};

export const exchangeChatMessage = async (
  callbacks: {
    onData?: any;
    onError?: any;
    onCompleted?: any;
  },
  queryParams: {
    query: string;
    conversationID: string;
    user: string;
    responseMode: "streaming" | "blocking";
  }
) => {
  const { query, conversationID, user, responseMode } = queryParams;

  globalThis
    .fetch("/api/dify/v1/chat-messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {},
        query: query,
        response_mode: responseMode,
        conversation_id: conversationID,
        user: user,
      }),
    })
    .then(response => {
      responseMode === "streaming"
        ? processStream(response, callbacks)
        : processBlock(response, callbacks);
    });
};

export function processOpenAIChatCompletion(conversationHistory: any[]) {
  async function readData() {
    const completion = await openAIService.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages: conversationHistory,
      stream: true,
      presence_penalty: 0.6,
      temperature: 0.6,
    });

    const messageObj: MessageType = {
      id: "",
      user_id: aiState.user,
      text: "",
      role: "assistant",
      timestamp: 0,
    };

    aiState.status = "responding";
    aiState.responseCompleted = false;
    aiState.pendingEmotion = true;
    chatListState.abortController = completion.controller;

    for await (const chunk of completion) {
      const result = chunk.choices[0].delta.content ?? "";

      aiState.responseText += result;

      messageObj.id = chunk.id;
      messageObj.timestamp = chunk.created;
      messageObj.text += result;

      const finishReason = chunk.choices[0].finish_reason;
      if (finishReason) {
        return {
          finishReason: finishReason,
          messageObj: messageObj,
        };
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  const reason = readData();
  return Promise.resolve(reason);
}

export async function getEmotion() {
  aiState.pendingEmotion = true;
  const { type, ratio } = await globalThis
    .fetch(`${process.env.NEXT_PUBLIC_TWINWORD_API_URL}/sentiment_analyze/`, {
      method: "POST",
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_TWINWORD_API_KEY || "",
        "X-RapidAPI-Host": "twinword-twinword-bundle-v1.p.rapidapi.com",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: aiState.responseText,
      }),
    })
    .then(response => {
      if (/^2/.test(response.status.toString())) {
        return response.json();
      }
    })
    .then((data: { type: "positive" | "negative"; ratio: number }) => {
      return {
        type: data.type,
        ratio: data.ratio,
      };
    });

  aiState.pendingEmotion = false;

  if (ratio < 0.2) {
    aiState.status = "narrative";
  } else {
    if (type === "positive") {
      aiState.status = "happy";
    }
    if (type === "negative") {
      if (ratio > 0.6) {
        aiState.status = "angry";
      } else {
        aiState.status = "sad";
      }
    }
  }
}
