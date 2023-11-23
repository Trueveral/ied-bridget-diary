import { AIInput } from "@/components/Conversation/Input";
import { ConversationList } from "@/components/Conversation/ConverstionList";
import { Presentation } from "@/components/Conversation/Presentation";

export default function AI() {
  return (
    <>
      <Presentation />
      <AIInput />
      <ConversationList />
    </>
  );
}
