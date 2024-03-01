import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useListenMessages from "../../hooks/useListenMessages";
import SearchInputMessage from "./SearchInputMessage";

const Messages = ({ isSearchActive, setIsSearchActive }) => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setSearchedMessages(messages);
  }, [messages]);

  const [searchedMessages, setSearchedMessages] = useState(messages);
  const [search, setSearch] = useState("");

  const handleSearchMessage = () => {
    if (!search) {
      setSearchedMessages(messages);
      return;
    }
    setSearchedMessages(
      messages.filter((message) =>
        message.message.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return (
    <div className="px-4 flex-1 overflow-auto relative">
      {!loading && messages.length > 0 && isSearchActive && (
        <SearchInputMessage
          handleSearchMessage={handleSearchMessage}
          search={search}
          setSearch={setSearch}
          setIsSearchActive={setIsSearchActive}
        />
      )}

      <div className={isSearchActive && "mt-12"}>
        {isSearchActive
          ? !loading &&
            searchedMessages.length > 0 &&
            searchedMessages.map((message) => (
              <div key={message._id} ref={lastMessageRef}>
                <Message message={message} />
              </div>
            ))
          : !loading &&
            messages.length > 0 &&
            messages.map((message) => (
              <div key={message._id} ref={lastMessageRef}>
                <Message message={message} />
              </div>
            ))}
      </div>

      {loading &&
        [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center text-white">
          Send a message to start the conversation
        </p>
      )}
      {/* <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message /> */}
    </div>
  );
};

export default Messages;
