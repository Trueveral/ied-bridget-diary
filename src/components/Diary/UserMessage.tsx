export const DiaryUserMessage = ({
  username,
  message,
}: {
  username: string;
  message: string;
}) => {
  return (
    <div className="text-xl font-semibold place-content-end">
      {username}: {message}
    </div>
  );
};
