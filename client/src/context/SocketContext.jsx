import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { VITE_SOCKET_URL } from "../globals";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingMap, setTypingMap] = useState({});
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("https://chitchathub-upc8.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("typing", (data) => {
        // console.log("Inside client typing socket handler");
        // console.log(data);
        if (data && data.senderId) {
          setTypingMap((prevTypingMap) => ({
            ...prevTypingMap,
            [data.senderId]: true,
          }));
        }
      });

      socket.on("typingEnd", (data) => {
        // console.log("Inside client typingEnd socket handler");
        // console.log(data);
        // console.log(typingMap);
        if (data && data.senderId) {
          setTypingMap((prevTypingMap) => ({
            ...prevTypingMap,
            [data.senderId]: false,
          }));
        }
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, typingMap }}>
      {children}
    </SocketContext.Provider>
  );
};
