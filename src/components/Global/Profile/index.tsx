"use client";
import { useState, useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/web";
import { resetAIState } from "@/Helpers/AI/base";
import {
  getConversationsByUser,
  getUsersListByName,
  supabase,
} from "@/Helpers/AI/db";
import { globalState } from "@/States/states";
import s from "./style.module.css";
import cn from "classnames";
import { ProfileBadge } from "./Badge";

export const NewProfileButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [canSend, setCanSend] = useState(false);
  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        globalState.user = JSON.parse(storedUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const errorMessage =
    "Please only contain letters, numbers, spaces, and underscores in your name. Your name should be between 1 and 30 characters.";

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

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsersListByName(name.replace(/(\s)*/g, ""), true);

      if (data) {
        const { data: users, error } = data;
        if (error) {
          console.error(error);
          return;
        }
        setUserList(users);
      }
    }
    if (name) {
      fetchUsers();
    }
  }, [name]);

  const props = useSpring({
    opacity: showForm ? 1 : 0,
    blur: showForm ? 0 : 10,
    config: { duration: 100 },
  });

  const handleInputChange = (e: any) => {
    setCanSend(/^[\u4e00-\u9fa5a-zA-Z0-9_\s]{1,30}$/.test(name));
    setName(e.target.value);
  };

  const handleInputKeyDown = (e: any) => {
    if (e.key === "Enter" && canSend) {
      // handleSubmit();
    }
  };

  const handleProfileBadgeClick = () => {
    setShowForm(true);
  };

  const handleUserClick = async (selectedUser?: any) => {
    globalState.user = {
      id: selectedUser.user.id,
      username: selectedUser.user.username,
      created_at: selectedUser.user.created_at,
    };

    resetAIState();

    globalState.conversationId = await getConversationsByUser(
      selectedUser.user.id
    ).then(data => {
      if (!data.data) return null;
      if (data.data[0]) {
        return data.data[0].id;
      } else {
        return null;
      }
    });

    // set user to local storage
    localStorage.setItem("user", JSON.stringify(globalState.user));

    setShowForm(false);
    setName("");
  };

  const handleNewUserClick = async () => {
    const { data: user, error } = await supabase
      .from("User")
      .insert([{ username: name }])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (user) {
      globalState.user = {
        id: user[0].id,
        username: user[0].username,
        created_at: user[0].created_at,
      };
    }
    resetAIState();
    setShowForm(false);
    setName("");
  };
  return (
    <>
      <ProfileBadge handleClick={handleProfileBadgeClick} />
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
                className="border border-gray-300 rounded-xl p-2 mb-2 text-black w-full focus:outline-none resize-none bg-white/80 backdrop-blur-xl"
              />
            </div>
            <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-2xl w-full h-full p-5 rounded-xl text-white">
              <div className="text-lg  font-semibold">
                Select from existing profiles:
              </div>
              {userList.map((user: any) => (
                <div
                  key={user.user.id}
                  className="flex flex-row justify-between w-full items-center opacity-75 hover:opacity-100 transition ease-in-out duration-300"
                >
                  <button
                    className="rounded-lg text-left"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.user.username}
                  </button>
                  <div
                    className={`${cn(
                      s.userSelectionMask
                    )} flex flex-row w-80 whitespace-nowrap overflow-scroll items-center justify-end cursor-default`}
                  >
                    <div>Latest message: &nbsp; </div>
                    <div className="mr-6">
                      {user.latestMessage[1]
                        ? user.latestMessage[1].text
                        : "No messages yet"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={`${
                canSend
                  ? "cursor-pointer opacity-100"
                  : "cursor-default opacity-30"
              } rounded-xl text-left max-w-20 w-fit h-fit pl-4 pr-4 pt-2 pb-2 bg-black/30 backdrop-blur-xl text-white`}
              onClick={() => handleNewUserClick()}
              disabled={!canSend}
            >
              {canSend ? "Create new profile" : errorMessage}
            </button>
          </div>
        </a.div>
      )}
    </>
  );
};
