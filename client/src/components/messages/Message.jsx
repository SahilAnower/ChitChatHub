import PropTypes from "prop-types";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";
import { useState } from "react";
import useUpdateMessage from "../../hooks/useUpdateMessage";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message);

  const { updateMessage } = useUpdateMessage();

  const isFromMe = message.senderId === authUser._id;

  const chatClassName = isFromMe ? "chat-end" : "chat-start";

  const profilePic = isFromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;

  const bubbleBgColor = isFromMe ? "bg-yellow-500" : "";

  const formattedTime = extractTime(message.createdAt);

  const shakeClass = message.shouldShake ? "shake" : "";

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(message.message);
  };
  const handleSaveEdit = () => {
    // // todo: update this message through state
    // todo: send call to backend for message change
    setIsEditing(false);
    updateMessage(editedMessage, message._id);
  };

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
        {isEditing ? (
          <input
            type="text"
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="w-full px-2 py-1 rounded bg-gray-100 text-black"
          />
        ) : (
          message.message
        )}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center text-white font-bold">
        {formattedTime}
        {isFromMe && (
          <div className="ml-2 flex gap-2 items-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="text-green-500 hover:text-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex justify-evenly items-center">
                  {message.status === "DELIVERED" && <p>Delivered</p>}
                  {message.status === "SEEN" && <p>Seen</p>}
                  {message.isEdited && <p>Edited</p>}
                  <button
                    onClick={handleEdit}
                    className="ml-2 text-yellow-500 hover:text-yellow-600 transition shadow-yellow-600 hover:shadow-yellow-700"
                  >
                    Edit
                  </button>
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    shouldShake: PropTypes.bool,
    status: PropTypes.string.isRequired,
    isEdited: PropTypes.bool,
  }).isRequired,
};

export default Message;
