import { create } from "zustand";

const useConversation = create((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  selectedConversation: null,
  isSearchMessageActive: false,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  setIsSearchMessageActive: (isSearchMessageActive) =>
    set({ isSearchMessageActive }),
}));

export default useConversation;
