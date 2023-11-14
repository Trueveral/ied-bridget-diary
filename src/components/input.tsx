"use client";

import { useState } from "react";

export const Input = () => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    // 你的发送逻辑
  };

  const isInputEmpty = text.length === 0;

  return (
    <div className="appearance-none border-none fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 min-w-min">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-full text-cyan-500 text-red-400"
        aria-label="Text input"
        placeholder="Type here..."
      />
      <button
        onClick={handleSend}
        disabled={isInputEmpty}
        className={`transition ease-in-out duration-300 rounded-full p-2 ${
          isInputEmpty
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-500 text-white"
        }`}
      >
        {/* 图标插槽，可以替换为任何图标 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`h-6 w-6 ${isInputEmpty ? "invisible" : "visible"}`}
        >
          {/* 这里是一个示例图标，可以替换为具体的图标 */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    </div>
  );
};
