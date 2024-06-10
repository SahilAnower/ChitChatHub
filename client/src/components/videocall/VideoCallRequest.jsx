import React, { useCallback, useMemo } from "react";
import { FaVideo, FaPhoneAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import useGetConversations from "../../hooks/useGetConversations";
import { useSocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { useToastContext } from "../../context/ToastContext";
import { v4 as uuidv4 } from "uuid";

const VideoCallRequest = ({ senderId, recieverId }) => {
  // // todo: 1. get sender details from senderId
  // todo: 2. onAccept function
  // // todo: 3. onReject function
  const { conversations } = useConversation();
  const { socket, setIsVideoCallRequesting } = useSocketContext();

  const senderDetails = useMemo(() => {
    return conversations.filter(
      (eachConversation) => eachConversation?._id === senderId
    )?.[0];
  }, [conversations, senderId]);

  const onReject = () => {
    // // todo: send socket event of call rejected to the other user
    socket.emit("videoCancel", {
      recieverId: senderId,
    });
    setIsVideoCallRequesting((prev) => ({
      ...prev,
      calling: false,
    }));
  };

  const onAccept = () => {
    // todo: send room join event for both the accepting and sending site
    const randomRoomId = uuidv4();
    socket.emit("videoConnect", {
      senderId,
      recieverId,
      roomId: randomRoomId,
    });
    setIsVideoCallRequesting((prev) => ({
      ...prev,
      calling: false,
    }));
  };

  return (
    <div className="video-call-request fixed top-0 left-0 w-full h-full bg-yellow-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md px-4 py-3 flex flex-col items-center">
        <div className="header">
          <span> Incoming Video Call from </span>
          <span className="w-12 rounded-full">
            <img src={senderDetails.profilePic} alt="user avatar" />
          </span>
          <span>{`${senderDetails.fullName} [${senderDetails.username}]`}</span>
        </div>
        <div className="actions mt-4 flex justify-center space-x-4">
          <button
            onClick={onAccept}
            className="accept-btn bg-yellow-700 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-900"
          >
            <FaVideo className="mr-2" /> Accept
          </button>
          <button
            onClick={onReject}
            className="reject-btn bg-gray-500 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700"
          >
            <FaPhoneAlt className="mr-2" /> Reject
          </button>
        </div>
        <MdClose
          className="close-icon mt-4 self-end cursor-pointer"
          onClick={onReject}
        />
      </div>
    </div>
  );
};

export default VideoCallRequest;
