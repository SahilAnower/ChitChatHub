import React, { useEffect, useState } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import { formattedLastSeen } from "../../utils/formattedLastSeen";
import { MdOnlinePrediction } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useToastContext } from "../../context/ToastContext";

const MessageContainer = () => {
  const {
    selectedConversation,
    setSelectedConversation,
    isSearchMessageActive: isSearchActive,
    setIsSearchMessageActive: setIsSearchActive,
  } = useConversation();

  useEffect(() => {
    // cleanup function (unmounts)
    return () => {
      setSelectedConversation(null);
      setIsSearchActive(false);
    };
  }, []);

  const { setVideoCallRequestingId } = useToastContext();
  const { onlineUsers, socket } = useSocketContext();
  const isOnline = onlineUsers.includes(selectedConversation?._id);

  const handleVideoCallRequest = async () => {
    const recieverId = selectedConversation?._id;
    socket.emit("videoJoin", {
      recieverId: recieverId,
    });
    const toastId = toast.loading("Call Ringing...", {
      position: "top-right", // Position of the toast
      style: {
        background: "#333", // Background color
        color: "#fff", // Text color
      },
      icon: "🎥",
      iconTheme: {
        primary: "#fff", // Icon color
        secondary: "#333", // Icon background color
      },
    });
    setVideoCallRequestingId(toastId);
  };

  return (
    <div className="md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-yellow-500 px-4 py-2 mb-2 flex justify-between">
            <div className="flex justify-center items-center gap-2">
              <span className="label-text">To:</span>{" "}
              <span className="text-yellow-700 font-bold">
                {selectedConversation?.fullName}
              </span>
              {!isSearchActive && (
                <span className="flex gap-2">
                  <IoSearchSharp
                    className="text-white font-bold cursor-pointer size-5"
                    onClick={() => setIsSearchActive(true)}
                  />
                </span>
              )}
            </div>
            {!isOnline && selectedConversation.lastSeen && (
              <div>
                <span className="text-yellow-700 font-bold text-xs">
                  {formattedLastSeen(selectedConversation?.lastSeen)}
                </span>
              </div>
            )}
            {isOnline && (
              <div className="flex items-center justify-end">
                <span className="text-yellow-700 font-bold text-xs flex justify-end gap-2 items-center">
                  <span>
                    <MdOnlinePrediction className="text-green-700" />
                  </span>
                  <span>Online</span>
                </span>
              </div>
            )}
            {isOnline && (
              <div className="flex items-center justify-end">
                <span
                  className="text-yellow-700 font-bold text-xs flex justify-end gap-2 items-center"
                  onClick={handleVideoCallRequest}
                >
                  <span>
                    <FaVideo className="text-green-700" />
                  </span>
                  <span>Video Call</span>
                </span>
              </div>
            )}
          </div>

          <Messages
            isSearchActive={isSearchActive}
            setIsSearchActive={setIsSearchActive}
          />
          <MessageInput recieverId={selectedConversation?._id} />
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName} 🌄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center text-yellow-300" />
      </div>
    </div>
  );
};

export default MessageContainer;
