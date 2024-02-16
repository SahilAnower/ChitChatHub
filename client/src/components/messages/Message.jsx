import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const isFromMe = message.senderId === authUser._id;

  const chatClassName = isFromMe ? "chat-end" : "chat-start";

  const profilePic = isFromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;

  const bubbleBgColor = isFromMe ? "bg-yellow-500" : "";

  const formattedTime = extractTime(message.createdAt);

  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={profilePic} alt="Chat Bubble Component" />
        </div>
      </div>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
      >
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center text-white font-bold">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
