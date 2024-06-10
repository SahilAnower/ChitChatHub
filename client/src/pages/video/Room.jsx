import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../../services/PeerService";
import { useSocketContext } from "../../context/SocketContext";

const Room = () => {
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const { socket, videoRemoteSocketId, setVideoRemoteSocketId } =
    useSocketContext();

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: videoRemoteSocketId, offer });
    setMyStream(stream);
  }, [videoRemoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setVideoRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: videoRemoteSocketId });
  }, [videoRemoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  console.log("remoteStream: ", remoteStream);

  useEffect(() => {
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div className="flex flex-col items-center justify-center overflow-auto bg-gray-400 backdrop-filter backdrop-blur-lg bg-opacity-0 p-8">
      <div className="w-full max-w-4xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-yellow-300 text-center">
          Room Page
        </h1>
        <h4 className="text-xl mb-6 text-yellow-300 text-center">
          {videoRemoteSocketId ? "Connected" : "No one in room"}
        </h4>
        <div className="flex justify-center gap-6 mb-6">
          {myStream && (
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded"
              onClick={sendStreams}
            >
              Send Stream
            </button>
          )}
          {videoRemoteSocketId && (
            <button
              className="bg-white hover:bg-slate-300 text-yellow-500 font-bold py-2 px-6 rounded"
              onClick={handleCallUser}
            >
              CALL
            </button>
          )}
        </div>
        <div className="flex flex-col gap-6 items-center w-full">
          {myStream && (
            <>
              <h1 className="text-2xl font-bold text-yellow-300">My Stream</h1>
              <ReactPlayer
                playing
                muted
                className="rounded-lg border border-gray-700"
                width="100%"
                height="300px"
                url={myStream}
              />
            </>
          )}
          {remoteStream && (
            <>
              <h1 className="text-2xl font-bold text-yellow-300">
                Remote Stream
              </h1>
              <ReactPlayer
                playing
                muted
                className="rounded-lg border border-gray-700"
                width="100%"
                height="300px"
                url={remoteStream}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
