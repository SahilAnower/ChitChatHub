import React, { useMemo } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import { useSocketContext } from "../../context/SocketContext";
import VideoCallRequest from "../../components/videocall/VideoCallRequest";
import { useAuthContext } from "../../context/AuthContext";

const Home = () => {
  const { isVideoCallRequesting } = useSocketContext();
  const { authUser } = useAuthContext();

  const isVideoCallIncoming = useMemo(
    () =>
      isVideoCallRequesting?.calling &&
      isVideoCallRequesting?.senderId &&
      isVideoCallRequesting.senderId !== authUser?._id,
    [
      authUser?._id,
      isVideoCallRequesting?.calling,
      isVideoCallRequesting.senderId,
    ]
  );

  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <Sidebar />
      <MessageContainer />
      {isVideoCallIncoming && (
        <VideoCallRequest senderId={isVideoCallRequesting.senderId} />
      )}
    </div>
  );
};

export default Home;
