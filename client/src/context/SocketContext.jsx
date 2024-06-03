import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { VITE_SOCKET_URL } from "../globals";
import { useToastContext } from "./ToastContext";
import toast from "react-hot-toast";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingMap, setTypingMap] = useState({});
  const [isVideoCallRequesting, setIsVideoCallRequesting] = useState({
    senderId: null,
    calling: false,
  });
  const { authUser } = useAuthContext();
  const { videoCallOutgoingRequestId, setVideoCallRequestingId } =
    useToastContext();

  useEffect(() => {
    if (authUser) {
      // ------ for production -------
      // const socket = io("https://chitchathub-upc8.onrender.com", {
      //   query: {
      //     userId: authUser._id,
      //   },
      // });
      // ------ for local --------
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("typing", (data) => {
        if (data && data.senderId) {
          setTypingMap((prevTypingMap) => ({
            ...prevTypingMap,
            [data.senderId]: true,
          }));
        }
      });

      socket.on("typingEnd", (data) => {
        if (data && data.senderId) {
          setTypingMap((prevTypingMap) => ({
            ...prevTypingMap,
            [data.senderId]: false,
          }));
        }
      });

      socket.on("videoJoinRequest", (data) => {
        if (data && data.senderId) {
          setIsVideoCallRequesting((prev) => ({
            ...prev,
            senderId: data.senderId,
            calling: true,
          }));
        }
      });

      socket.on("videoCancel", (data) => {
        if (data && data.senderId) {
          // ----option 1-----
          // toast.dismiss(videoCallOutgoingRequestId);
          // setVideoCallRequestingId(null);
          // ----option 2-----
          toast.error("Video call cancelled!", {
            id: videoCallOutgoingRequestId,
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
          setVideoCallRequestingId(null);
        }
      });

      return () => {
        socket.off("videoJoinRequest");
        socket.off("videoCancel");
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser, videoCallOutgoingRequestId]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typingMap,
        isVideoCallRequesting,
        setIsVideoCallRequesting,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
