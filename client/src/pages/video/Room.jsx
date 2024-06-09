import React, { useState } from "react";

const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  return <div>Room</div>;
};

export default Room;
