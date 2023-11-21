import s from "./style.module.css";
import cn from "classnames";

const SaveButton = () => {
  const handleSave = () => {
    console.log("handleSave");
  };

  return (
    <div
      className={`${cn(
        s.saveButton
      )} place-self-end w-max h-12 p-2 text-white font-semibold transition-all rounded-2xl shadow-lg flex justify-center items-center cursor-pointer bg-black/50`}
    >
      {`Save to Bridget's Diary`}
    </div>
  );
};

const AudioButton = () => {
  const handleSave = () => {
    console.log("handleSave");
  };

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

export const ButtonList = () => {
  return (
    <div className="flex flex-row gap-4">
      <SaveButton />
      <AudioButton />
    </div>
  );
};
