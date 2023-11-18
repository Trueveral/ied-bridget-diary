import { aiState } from "@/states/states";
import { useTransition, animated, useTrail } from "@react-spring/web";
import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import s from "./style.module.css";

export const Presentation = () => {
  const { responseText, userMessage } = useSnapshot(aiState);
  const userWords = userMessage.split(" ");
  const responseWords = responseText.split(" ");

  const responseTrails = useTrail(responseWords.length, {
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  // const responseTransitions = useTransition(responseText, {
  //   from: { opacity: 0, x: 20 },
  //   enter: { opacity: 1, x: 0 },
  //   leave: { opacity: 0, x: 20 },
  //   config: { mass: 5, tension: 2000, friction: 200 },
  //   keys: responseText.map((_, i) => i),
  // });

  const userTrails = useTrail(userWords.length, {
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  return (
    <>
      {/* <div className="max-w-3xl mx-auto my-auto w-1/2 md:w-3/4 sm:w-4/5 flex flex-col justify-center items-start fixed z-20 top-72 text-3xl font-black left-1/2 -translate-x-1/2 overflow-y-auto gap-4">
        <div>Central Academy of Fine Art.</div>
      </div> */}
      <div className="max-w-3xl mx-auto my-auto w-1/2 md:w-3/4 sm:w-4/5 flex flex-col justify-center items-start fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto gap-4">
        <div className="w-full text-center text-3xl font-black text-white flex flex-wrap cursor-default select-none justify-start overflow-x-hidden">
          {userTrails.map((props, index) => (
            <animated.div key={index} style={props}>
              {userWords[index]}&nbsp;
            </animated.div>
          ))}
        </div>
        <div className="w-full text-center text-xl text-white flex flex-wrap cursor-default select-none overflow-y-auto max-h-48 overflow-x-hidden">
          {responseTrails.map((props, index) => (
            <animated.div key={index} style={props} className={`${s.fadeText}`}>
              {responseWords[index]}&nbsp;
            </animated.div>
          ))}
        </div>
        <div className={`${s.fadeText}`}>BVISIONOS0.3</div>
      </div>
    </>
  );
};
