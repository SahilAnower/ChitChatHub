import React, { useEffect, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";

const MessageInput = ({ recieverId }) => {
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const { loading, sendMessage } = useSendMessage();

  const { socket, typingMap } = useSocketContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    await sendMessage(message);
    setMessage("");
  };

  let timeout = null;

  useEffect(() => {
    if (!message) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        socket.emit("typingEnd", {
          recieverId: recieverId,
        });
      }, 300);
      return;
    }
    // send typing event to server
    socket.emit("typing", {
      recieverId: recieverId,
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        socket.emit("typingEnd", {
          recieverId: recieverId,
        });
      }, 300);
    };
  }, [message]);

  const messageInputChangeHandler = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      {typingMap.hasOwnProperty(recieverId) &&
        typingMap[recieverId] == true && (
          <div className="typing-parent">
            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div>
              <p>Typing...</p>
            </div>
          </div>
        )}
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-yellow-700 border-yellow-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={messageInputChangeHandler}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3 text-white"
        >
          {loading ? <div className="loading loading-spinner" /> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
