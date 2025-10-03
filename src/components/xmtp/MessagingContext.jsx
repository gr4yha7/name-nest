import { createContext, useContext, useState } from "react";

const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  return (
    <MessagingContext.Provider value={{ isThreadOpen, setIsThreadOpen, syncing, setSyncing }}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessagingContext = () => {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error("useMessagingContext must be used within MessagingProvider");
  return ctx;
};


