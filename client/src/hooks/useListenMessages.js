import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      newMessage.status = "SEEN";
      setMessages([...messages, newMessage]);
      // // todo: set this newMessage as seen for other user through socket
      setTimeout(() => {
        socket.emit("newMessageSeen", { ...newMessage });
      }, 2000);
      sound.play();
    });

    socket?.on("newMessageSeen", ({ messageId }) => {
      const filteredMessages = messages.filter(
        (eachMessage) => eachMessage?._id !== messageId
      );
      const messageToFind = messages.find(
        (eachMessage) => eachMessage?._id === messageId
      );
      messageToFind.status = "SEEN";
      setMessages([...filteredMessages, messageToFind]);
      console.log("messages inside newMessageSeen: ", messages);
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("newMessageSeen");
    };
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
