import { aiState } from "@/states/states";
import { useState } from "react";
import { useSnapshot } from "valtio";

export const UserNameInput = () => {
  const { user } = useSnapshot(aiState);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (inputText.length === 0) {
      setErrorMessage("用户名不能为空");
    } else if (!/^[a-zA-Z0-9_]{1,30}$/.test(inputText)) {
      setErrorMessage(
        "用户名只能包含大小写英文、数字和下划线 且不能超过30个字符"
      );
    } else {
      // 处理提交逻辑
    }
  };

  return (
    <div className="top-4 right-4 absolute z-50">
      <div className="flex flex-col items-start">
        <input
          type="text"
          aria-label="username"
          value={inputText}
          onChange={handleInputChange}
          // placeholder="请输入用户名"
          onSubmitCapture={handleSubmit}
          className="bg-white text-black font-semibold transition-all rounded-2xl shadow-lg flex justify-center items-center bg-black/50"
        />
        <div className="text-white font-semibold transition-all rounded-2xl shadow-lg flex justify-center items-center bg-black/50">
          {user}
        </div>
        {errorMessage && <div className="text-red-500 mt-2">1111</div>}
      </div>
    </div>
  );
};
