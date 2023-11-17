import { aiState } from "@/states/states";
import { useTransition, animated, useTrail } from "@react-spring/web";
import React from "react";
import { useSnapshot } from "valtio";

export const Presentation = () => {
  const { responseText, userMessage } = useSnapshot(aiState);
  const responseWords = responseText.split(" ");
  const userWords = userMessage.split(" ");

  const responseTrails = useTrail(responseWords.length, {
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  const userTrails = useTrail(userWords.length, {
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  return (
    <div className="max-w-screen-lg mx-auto my-auto w-1/2 flex flex-col justify-center items-center fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-3/4 text-center text-xl text-white flex flex-wrap cursor-default select-none">
        {userTrails.map((props, index) => (
          <animated.div key={index} style={props}>
            {userWords[index]}&nbsp;
          </animated.div>
        ))}
      </div>
      <div className="text-center text-xl text-white flex flex-wrap cursor-default select-none">
        {responseTrails.map((props, index) => (
          <animated.div key={index} style={props}>
            {responseWords[index]}&nbsp;
          </animated.div>
        ))}
      </div>
    </div>
  );
};
