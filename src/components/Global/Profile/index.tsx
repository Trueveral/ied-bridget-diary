"use client";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { a, useSpring } from "@react-spring/web";
import { resetAIState, supabase } from "@/Helpers/AI/base";
import { useSnapshot } from "valtio";
import { globalState } from "@/States/states";

export const NewProfileButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [canSend, setCanSend] = useState(false);
  const { user } = useSnapshot(globalState);

  const errorMessage =
    "Your name can only contain uppercase and lowercase letters, numbers and underscores, and cannot exceed 30 characters. Spaces are not allowed.";

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    function handleKeyDown(event: any) {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        if (showForm) {
          setName("");
          setShowForm(false);
        } else {
          setShowForm(true);
        }
      }
      if (event.key === "Escape") {
        setShowForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [formRef, showForm]);

  const props = useSpring({
    opacity: showForm ? 1 : 0,
    blur: showForm ? 0 : 10,
    config: { duration: 100 },
  });

  const handleInputChange = (e: any) => {
    setName(e.target.value);
    setCanSend(/^[\u4e00-\u9fa5a-zA-Z0-9_\s]{1,30}$/.test(name));
  };

  const handleInputKeyDown = (e: any) => {
    if (e.key === "Enter" && canSend) {
      handleSubmit();
    }
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const { data: newUser, error } = await supabase
      .from("User")
      .insert([
        {
          username: name,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    globalState.user = {
      id: newUser!![0].id,
      username: newUser!![0].username,
      created_at: newUser!![0].created_at,
    };

    resetAIState();

    setShowForm(false);
    setName("");
  };

  return (
    <>
      {!showForm && (
        <div className="fixed top-10 right-16 flex-col justify-center items-center w-fit flex z-10">
          <button
            className={`transition ease-in-out duration-300 rounded-full p-2 w-10 h-10 flex items-center justify-center bg-blue-600 text-white"
          }`}
            title="Create new profile"
            onClick={handleButtonClick}
          >
            <Icon icon="fluent:person-add-20-filled" color="white" />
          </button>
          <div className="text-white">{user.username}</div>
        </div>
      )}
      {showForm && (
        <a.div
          ref={formRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent backdrop:blur-2xl p-4 rounded-2xl flex flex-row justify-start items-center w-2/5 gap-4 z-10"
          style={props}
        >
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row w-full gap-4">
              <input
                autoFocus
                type="text"
                value={name}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="Refresh conversation and tell Bridget your name"
                className="border border-gray-300 rounded-xl p-2 mb-2 text-black w-full focus:outline-none resize-none"
              />

              <button
                className={`p-2 w-10 h-10 flex items-center justify-center rounded-full ${
                  canSend
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
          }`}
                title={canSend ? "Submit" : errorMessage}
                onClick={handleSubmit}
              >
                <Icon icon="material-symbols:done-rounded" color="white" />
              </button>
            </div>
          </div>
        </a.div>
      )}
    </>
  );
};
