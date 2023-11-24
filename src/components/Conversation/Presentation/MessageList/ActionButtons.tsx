"use client";
import s from "../style.module.css";
import cn from "classnames";
// import { OpenAI } from "openai";
import { supabase } from "@/Helpers/AI/db";
import { useEffect, useState } from "react";

export const SaveButton = ({ messageGPTID }: { messageGPTID: string }) => {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSavedStatus = async () => {
      const { data, error } = await supabase
        .from("Message")
        .select("saved")
        .eq("gpt_id", messageGPTID)
        .single();

      if (data) {
        setSaved(data.saved);
      }
      if (error) {
        setError("Failed to check saved status.");
      }
    };

    checkSavedStatus();
  }, [messageGPTID]);

  const handleSave = async () => {
    if (saved) {
      const { data, error } = await supabase
        .from("Message")
        .update({
          saved: false,
        })
        .eq("gpt_id", messageGPTID)
        .select();

      const { data: userData, error: userError } = await supabase
        .from("Message")
        .update({
          saved: false,
        })
        .eq("gpt_id", "user_" + messageGPTID)
        .select();

      if (data && userData) {
        setSaved(false);
      } else {
        setError("Failed to remove the message.");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } else {
      const { data, error } = await supabase
        .from("Message")
        .update({
          saved: true,
        })
        .eq("gpt_id", messageGPTID)
        .select();

      const { data: userData, error: userError } = await supabase
        .from("Message")
        .update({
          saved: true,
        })
        .eq("gpt_id", "user_" + messageGPTID)
        .select();

      if (data && userData) {
        setSaved(true);
      } else {
        setError("Failed to save the message.");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  return (
    <div
      className={`${cn(
        s.saveButton
      )} place-self-end w-max h-12 p-2 text-white font-semibold transition-all rounded-2xl shadow-lg flex justify-center items-center cursor-pointer bg-black/50`}
      onClick={handleSave}
    >
      {saved ? "Remove" : error ? error : "Save to Bridget's Diary"}
    </div>
  );
};

export const AudioButton = () => {
  // const handleSave = () => {
  //   const openAIService = new OpenAI({
  //     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  //     dangerouslyAllowBrowser: true,
  //   });
  // };

  return (
    <div
      className={`${cn(
        s.saveButton
      )} place-self-end w-max h-12 p-2 text-white font-semibold transition-all rounded-2xl shadow-lg flex justify-center items-center cursor-pointer bg-black/50`}
    >
      {`Hear Bridget's Voice`}
    </div>
  );
};
