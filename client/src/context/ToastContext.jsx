import { createContext, useContext, useState } from "react";

export const ToastContext = createContext();

export const useToastContext = () => {
  return useContext(ToastContext);
};

export const ToastContextProvider = ({ children }) => {
  const [videoCallOutgoingRequestId, setVideoCallRequestingId] = useState(null);

  return (
    <ToastContext.Provider
      value={{ videoCallOutgoingRequestId, setVideoCallRequestingId }}
    >
      {children}
    </ToastContext.Provider>
  );
};
