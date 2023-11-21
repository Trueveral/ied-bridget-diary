"use client";

import { AIInput } from "./input";
import { Presentation } from "./presentation";
import AnimatedList from "./test";
import { UserNameInput } from "./username";

export const AI = () => {
  return (
    <>
      <Presentation />
      <AIInput />
      {/* <UserNameInput /> */}
    </>
  );
};
