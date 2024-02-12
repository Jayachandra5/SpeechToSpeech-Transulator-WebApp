"use client";
import React, { useContext, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Mic, Mic2, Send, Voicemail } from "lucide-react";
import { Button } from "./ui/button";
import { ChatContext } from "./ChatContext";
import VoiceRecorder from "./AudioRecorder";


export default function ChatInput({ isDisable }: { isDisable: boolean }) {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

 

  return (
    <div className="absolute bottom-0 lg:-bottom-7 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl ">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col ">
          <div className="relative flex flex-col w-full flex-grow p-4 ">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                disabled={isDisable}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
                value={message}
                placeholder="Type your chat.."
                rows={1}
                maxRows={4}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter  scrollbar-w-2 scrolling-touch  "
                autoFocus
              />

              {message.length > 0 ? (
                <Button
                  disabled={isLoading || isDisable}
                  className="absolute bottom-1.5 right-[8px]"
                  aria-label="send message"
                  onClick={(e) => {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              ) : (
                <div className="absolute bottom-1.5 right-[8px]">
                <VoiceRecorder/>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
