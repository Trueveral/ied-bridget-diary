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
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCompleteClick = () => {
    setIsEditing(false);
    // Call the callback function here
    // ...
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
      className={`${
        canSwitchConversation ? "cursor-pointer" : "cursor-not-allowed"
      } flex flex-row gap-2 p-4 rounded-lg h-12 items-center justify-between w-full`}
      onClick={() => handleCardClick(conversation.id)}
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
        />
      ) : (
        <div className="text-sm text-white/80 font-semibold">
          {conversation.title ? conversation.title : "Untitled"}
        </div>
      )}
      {isEditing ? (
        <button
          className=" text-white/80 focus:outline-none"
          onClick={handleCompleteClick}
        >
          Done
        </button>
      ) : (
        <button
          className=" text-white/80 focus:outline-none"
          onClick={handleEditClick}
        >
          Rename
        </button>
      )}
    </a.button>
  );
};
