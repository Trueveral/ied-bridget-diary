import { aiState } from "@/states/states";
import { useSnapshot } from "valtio";

export const useAIActionGuard = () => {
  const { status, inputText } = useSnapshot(aiState);
  const inputEmpty = inputText === "";
  switch (status) {
    case "idle":
      return {
        canSend: !inputEmpty,
        canTerminate: false,
      };
    case "sending":
      return {
        canSend: false,
        canTerminate: true,
      };
    case "responding":
      return {
        canSend: false,
        canTerminate: true,
      };
    case "inputing":
      return {
        canSend: !inputEmpty,
        canTerminate: false,
      };
    default:
      return {
        canSend: false,
        canTerminate: true,
      };
  }
};

export const useStreamReader = (response: Response) => {
  if (!response.ok) {
    console.error(response);
    return;
  }

  const reader = response.body!!.getReader();
  let decoder = new TextDecoder("utf-8");
  let data = "";
  let buffer = [];
  let bufferObj: any;

  const read = () => {
    reader.read().then(({ done, value }) => {
      if (done) {
        console.log("Stream complete");
        return;
      }
      const lines = data.split("\n");
      try {
        lines.forEach(line => {
          if (!line || !line.startsWith("data:")) return;
          try {
            bufferObj = JSON.parse(line.substring(6));
            aiState.conversationId = bufferObj.id;
            console.log(bufferObj);
          } catch (e) {
            console.error(e);
            return;
          }
          if (bufferObj.event !== "message") return;
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
