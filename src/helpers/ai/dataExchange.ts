import { conversationAIState } from "@/States/states";
import { z } from "zod";

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

export async function getEmotion() {
  conversationAIState.pendingEmotion = true;
  const { type, ratio } = await globalThis
    .fetch(`${process.env.NEXT_PUBLIC_TWINWORD_API_URL}/sentiment_analyze/`, {
      method: "POST",
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_TWINWORD_API_KEY || "",
        "X-RapidAPI-Host": "twinword-twinword-bundle-v1.p.rapidapi.com",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: conversationAIState.responseText,
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

  conversationAIState.pendingEmotion = false;

  if (ratio < 0.3) {
    conversationAIState.status = "narrative";
  } else {
    if (type === "positive") {
      conversationAIState.status = "happy";
    }
    if (type === "negative") {
      if (ratio > 0.6) {
        conversationAIState.status = "angry";
      } else {
        conversationAIState.status = "sad";
      }
    }
  }
}

export async function readDataChunk(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  userId: string
) {
  const decoder = new TextDecoder("utf-8");
  let bufferObj: any;
  let buffer = "";
  let done = false;

  let text = "";
  let role = "assistant";
  let gpt_id = "";
  let conversation_id = "";
  let id = "";
  let user_id = userId;

  const timeoutPromise = new Promise<any>((_, reject) =>
    setTimeout(() => reject(new Error("Request time out")), 5000)
  );

  while (!done) {
    const { value, done: readerDone } = await Promise.race([
      reader.read(),
      timeoutPromise,
    ]);

    done = readerDone;
    const decodedValue = decoder.decode(value, { stream: !done });
    buffer += decodedValue;
    const lines = buffer.split("\n");
    try {
      for (const message of lines) {
        if (!message || !message.startsWith("data:")) {
          continue;
        }
        try {
          bufferObj = JSON.parse(message.substring(6));
          const result = bufferObj.choices[0].delta.content ?? "";
          conversationAIState.responseText += result;
          gpt_id = bufferObj.id;
          text += result;
          conversation_id = bufferObj.conversation_id;
          const finishReason = bufferObj.choices[0].finish_reason;
          if (finishReason) {
            return {
              finishReason: finishReason,
              messsageObject: {
                text,
                role,
                gpt_id,
                conversation_id,
                id,
                user_id,
              },
            };
          }
        } catch (e) {
          console.error(
            "An error occurred when fetching messages from AI server. Please report this to the developer.",
            e
          );
          return {
            finishReason: "error",
            messageObject: null,
          };
        }
      }
      buffer = lines[lines.length - 1];
    } catch (e) {
      console.error(
        "An error occurred when fetching messages from AI server. Please report this to the developer.",
        e
      );
      return {
        finishReason: "error",
        messageObject: null,
      };
    }
  }
}

export async function readData(
  userId: string,
  conversationHistory: any[],
  readerRef: any
) {
  const response = await Promise.race([
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106",
        messages: conversationHistory,
        stream: true,
      }),
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 5000)
    ),
  ]);

  if (!response || !response.body) {
    console.error("An error occurred when posting request to model server");
    return;
  }

  if (!/^2/.test(response.status.toString())) {
    console.error(
      "An error occurred when posting request to model server: ",
      response.statusText
    );
    return;
  }

  if (response.body) {
    const reader = response.body.getReader();

    readerRef.current = reader;

    const data = await readDataChunk(reader, userId);
    if (data) {
      return {
        finishReason: data.finishReason,
        messageObject: data.messsageObject,
      };
    }
  }
}
