import { renameConversation } from "@/Helpers/AI/base";
import { conversationAIState, globalState } from "@/States/states";
import { useSpring, a } from "@react-spring/web";

import { useState, useRef, useEffect } from "react";

export const ConversationCard = ({ conversation }: { conversation: any }) => {
  const { conversationId } = globalState;
  const { status } = conversationAIState;
  const canSwitchConversation = status !== "responding";
  const isSelected = conversationId === conversation.id;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(conversation.title);
  const conversationCardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        conversationCardRef.current &&
        !conversationCardRef.current.contains(event.target)
      ) {
        setIsEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [conversationCardRef]);

  const handleCardClick = (conversationId: string) => {
    globalState.conversationId = conversationId;
    conversationAIState.inputText = "";
    conversationAIState.responseText = "";
    conversationAIState.userMessage = "";
    conversationAIState.responseCompleted = true;
    conversationAIState.pendingEmotion = false;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCompleteClick = async () => {
    setIsEditing(false);
    setNewTitle(newTitle);
    await renameConversation(conversation.id, newTitle);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCompleteClick();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".conversation-card-input")) {
      setIsEditing(false);
    }
  };

  const cardStyleProps = useSpring({
    backgroundColor: isSelected ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
  });

  return (
    <a.button
      key={conversation.id}
      className={`flex flex-row gap-2 p-4 rounded-lg h-12 items-center justify-between w-full`}
      style={cardStyleProps}
      disabled={!canSwitchConversation}
      ref={conversationCardRef}
    >
      {isEditing ? (
        <input
          type="text"
          autoFocus
          aria-label="conversation-card-input"
          className=" bg-transparent text-white/80 font-semibold focus:outline-none"
          value={newTitle}
          placeholder={conversation.title ? conversation.title : "Untitled"}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className={`${
            canSwitchConversation ? "cursor-pointer" : "cursor-not-allowed"
          } text-sm text-white/80 font-semibold w-full text-start`}
          onClick={() => handleCardClick(conversation.id)}
        >
          {conversation.title ? conversation.title : "Untitled"}
        </div>
      )}
      {isEditing ? (
        <button
          className=" text-white/80 focus:outline-none bg-transparent hover:text-white transition ease-in-out duration-300"
          onClick={handleCompleteClick}
        >
          Done
        </button>
      ) : (
        <button
          className=" text-white/80 focus:outline-none bg-transparent hover:text-white transition ease-in-out duration-300"
          onClick={handleEditClick}
        >
          Rename
        </button>
      )}
    </a.button>
  );
};
