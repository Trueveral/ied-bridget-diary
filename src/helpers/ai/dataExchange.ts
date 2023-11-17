import { aiState } from "@/states/states";
import { z } from "zod";

const aiResponseSchema = z.object({
  id: z.string(),
  answer: z.string(),
  created_at: z.number(),
});

type AiResponse = z.infer<typeof aiResponseSchema>;

export const handleStream = (
  response: Response,
  onData?: any,
  onCompleted?: any
) => {
  if (!response.ok) {
    console.error(response);
    return;
  }

  const reader = response.body!!.getReader();
  let decoder = new TextDecoder("utf-8");
  let buffer = "";
  let bufferObj: any;

  const read = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        console.log("Stream complete");
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      try {
        lines.forEach(line => {
          if (!line || !line.startsWith("data: ")) return;
          try {
            bufferObj = JSON.parse(line.substring(6));
          } catch (e) {
            console.error(e);
            return;
          }
          if (bufferObj.event !== "message") return;
          aiState.conversationId = bufferObj.id;
          aiState.responseText += bufferObj.answer;
          console.log(bufferObj);
        });
      } catch (e) {
        console.error(e);
        return;
      }
      // Continue reading
      read();
    });
  };
  read();
};

export const handleBlock = async (response: Response) => {
  if (!response.ok) {
    console.error(response);
    return;
  }
  await response
    .json()
    .then(data => {
      aiState.conversationId = data.conversation_id;
      aiState.responseText += data.answer;
    })
    .catch(e => {
      console.error(e);
    });
};
