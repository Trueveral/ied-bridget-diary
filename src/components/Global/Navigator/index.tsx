"use client";
import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import Link from "next/link";
import { globalState } from "@/States/states";

export const Navigator = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navBarStyle = useSpring({
    width: isMobile ? "100%" : "fit-content",
    // overflowX: isMobile ? "scroll" : "visible",
    backgroundColor: isHovered ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
  });

  const linkStyle = useSpring({
    opacity: isHovered ? 1 : 0.7,
  });

  return (
    <div className="top-10 fixed left-1/2 mx-auto -translate-x-1/2 flex flex-row items-center justify-start h-max z-10 text-white">
      <animated.div
        className={`rounded-full bg-slate-50/50 flex flex-row items-center justify-center gap-6 pl-6 pr-6 min-h-16 h-16 backdrop-blur-2xl`}
        style={navBarStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href="/conversation"
          onClick={() => {
            globalState.link = "conversation";
          }}
        >
          <animated.div style={linkStyle}>Conversation</animated.div>
        </Link>
        <Link
          href="/diary"
          onClick={() => {
            globalState.link = "diary";
          }}
        >
          <animated.div style={linkStyle}>Diary</animated.div>
        </Link>
        <Link
          href="/collections"
          onClick={() => {
            globalState.link = "collections";
          }}
        >
          <animated.div style={linkStyle}>Collections</animated.div>
        </Link>
      </animated.div>
    </div>
  );
};
