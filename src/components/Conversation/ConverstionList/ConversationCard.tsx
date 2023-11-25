import {
  deleteConversation,
  getConversationsByUser,
  renameConversation,
} from "@/Helpers/AI/db";
import { conversationAIState, globalState } from "@/States/states";
import { Icon } from "@iconify/react";
import { useSpring, a } from "@react-spring/web";

import { useState, useRef, useEffect } from "react";

export const ConversationCard = ({ conversation }: { conversation: any }) => {
  const { conversationId, user } = globalState;
  const { status } = conversationAIState;
  const canSwitchConversation = status !== "responding";
  const isSelected = conversationId === conversation.id;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
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
    if (e.key === "Escape") {
      setNewTitle(conversation.title);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleDeleteConfirm = async () => {
    const { data, error } = await deleteConversation(conversation.id);
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setIsDeleteClicked(false);
    }

    const { data: numConversations, error: numConversationsError } =
      await getConversationsByUser(user.id!!);

    if (numConversationsError) {
      console.error(numConversationsError);
      return;
    }

    if (numConversations) {
      if (numConversations.length > 0) {
        globalState.conversationId = numConversations[0].id;
        conversationAIState.inputText = "";
        conversationAIState.responseText = "";
        conversationAIState.userMessage = "";
        conversationAIState.responseCompleted = true;
        conversationAIState.pendingEmotion = false;
      } else {
        globalState.conversationId = undefined;
      }
    }
  };

  const cardStyleProps = useSpring({
    backgroundColor: isSelected
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)",
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
          placeholder={
            conversation.title ? conversation.title : "New Conversation"
          }
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className={`${
            canSwitchConversation ? "cursor-pointer" : "cursor-not-allowed"
          } text-sm text-white/80 font-semibold w-full text-start whitespace-nowrap overflow-hidden overflow-ellipsis`}
          onClick={() => handleCardClick(conversation.id)}
        >
          {conversation.title ? conversation.title : "New Conversation"}
        </div>
      )}
      {isDeleteClicked ? null : isEditing ? (
        <button
          className=" text-white/80 focus:outline-none bg-transparent hover:text-white transition ease-in-out duration-300"
          onClick={handleCompleteClick}
          title="Done"
        >
          <Icon icon="ic:round-check" color="white" fill="white" />
        </button>
      ) : (
        <button
          className=" text-white/80 focus:outline-none bg-transparent hover:text-white transition ease-in-out duration-300"
          onClick={handleEditClick}
          title="Rename"
        >
          <Icon icon="mdi:rename-box" color="white" fill="white" />
        </button>
      )}
      {isEditing ? null : !isDeleteClicked ? (
        <button
          className=" text-white/80 focus:outline-none bg-transparent hover:text-white transition ease-in-out duration-300"
          onClick={() => setIsDeleteClicked(true)}
          title="Delete"
        >
          <Icon icon="mingcute:delete-2-fill" color="white" fill="white" />
        </button>
      ) : (
        <div className="flex flex-row max-w-max gap-2">
          <button
            className=" text-white/80 focus:outline-none bg-transparent hover:text-white transition ease-in-out duration-300"
            onClick={handleDeleteConfirm}
            title="Confirm"
          >
            <Icon icon="ic:round-check" color="white" fill="white" />
          </button>
          <button
            className=" text-white/80 focus:outline-none bg-transparent hover:text-white transition ease-in-out duration-300"
            onClick={() => setIsDeleteClicked(false)}
            title="Cancel"
          >
            <Icon icon="ic:round-close" color="white" fill="white" />
          </button>
        </div>
      )}
    </a.button>
  );
};
