"use client";
import { globalState } from "@/States/states";
import { useEffect } from "react";

export const UserIDSetter = () => {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      globalState.user = JSON.parse(storedUser);
    }
  }, []);

  return null;
};
