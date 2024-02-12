"use client";

import { ReactNode, createContext, useRef, useState } from "react";

import { toast } from "sonner";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  chatId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ chatId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const backupMessage = useRef("");

  //mutate

  async function sendMessage({ message }:any) {
    
    try {
      setIsLoading(true);
      if(!message.trim()){
        return toast.error("Type something to send");
      }
      setMessage("")
      const response = await fetch(`/api/chat/${chatId}/message`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (response.ok) {
        return;
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {setIsLoading(false)}
  }

  const handleInputChange = (e:any) => {
    console.log(e.target.value);
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
        
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
