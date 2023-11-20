import s from "./style.module.css";
import cn from "classnames";

export const SaveButton = () => {
  const handleSave = () => {
    console.log("handleSave");
  };

  return (
    <div
      className={`${cn(
        s.saveButton
      )} place-self-end w-fit p-2 text-white font-semibold h-14 transition-all hover:bg-blue-400 bg-blue-500 rounded-2xl shadow-lg flex justify-center items-center cursor-pointer`}
    >
      {`Save to Bridget's Diary`}
    </div>
  );
};
