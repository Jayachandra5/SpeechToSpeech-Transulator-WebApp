"use client";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { Loader2, MessageSquare } from "lucide-react";
import { Messages } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { pusherClient } from "@/lib/pusher";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

export default function Messages({ chatId }: { chatId: string }) {
  const [messages, setData] = useState<Messages[]>();
  const messageEndRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  console.log(user?.id)

  const [loading, setLoading] = useState(false);
  async function getMessages() {
    try {
      setLoading(true);
      console.log("getMessages");
      const response = await fetch(`/api/chat/${chatId}/message`);
      const data = await response.json();
      const messages = data.message;
      console.time("myTimer");
      for (let i = 0; i < messages.length; i++) {
        
        if (
          user?.id !== messages[i].senderId &&
          messages[i]?.content?.startsWith("https")
        ) {

          console.log(`statred`)
          
          const responseLang=await fetch(`/api/lang`)
          const data= await responseLang.json()
          console.log(data)

          const responseAudio = await fetch(
            `https://9152-2401-4900-5fd4-3e02-a53a-9896-97b3-1d7b.ngrok-free.app/translate/?audio_url=${messages[i].content}&lang=${data.message}`,
            {
              method: "POST",
            }
          );
          const blob = await responseAudio.blob();
          const formData = new FormData();
          const mp3File = new File([blob], "audio.mp3", { type: "audio/mp3" });
          formData.append("file", mp3File, "audio.mp3");
          console.log(formData);
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const url = await response.json();
            messages[i].content=url.url
            console.timeEnd("myTimer");
           
          } else {
            toast.error("Failed to upload audio.");
          }
        } else if( user?.id !== messages[i].senderId ) {
            const responseLang=await fetch(`/api/lang`)
            const data= await responseLang.json()
            console.log(messages[i].content)
            const responseText = await fetch(
              `https://9152-2401-4900-5fd4-3e02-a53a-9896-97b3-1d7b.ngrok-free.app/translate_text/?text=${messages[i].content}&dest_lang=${data.message}`,
              {
                method: "POST",
              }
            );
            const text=await responseText.text()
            console.log(text);
            messages[i].content=text
            
        }else{
          console.log("lol")
        }
      }
      setData(messages);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMessages();
  }, []);
  if (!user) {
    return null;
  }

  const userId = user.id;

  return (
    <>
      <div className="flex max-h-[clac(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto crollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch  ">
        {messages && messages.length > 0 ? (
          messages.map((message, i) => {
            const isNextMessageSamePerson =
              (messages[i - 1]?.senderId === userId) ===
              (messages[i]?.senderId === userId);
            if (i === messages.length - 1) {
              return (
                <Message
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                  key={message.id}
                />
              );
            } else {
              return (
                <Message
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                  key={message.id}
                />
              );
            }
          })
        ) : !loading ? (
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <h3 className="font-semibold text-xl">
              <Loader2 className="animate-spin text-purple-500 " />
            </h3>
            <p className="text-zinc-500 text-sm">
              Breaking the language barier
            </p>
          </div>
        )}
      </div>
      <div ref={messageEndRef} />
    </>
  );
}
