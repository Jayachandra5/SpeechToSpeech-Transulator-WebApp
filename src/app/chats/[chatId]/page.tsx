import { ChatContextProvider } from "@/components/ChatContext";
import ChatInput from "@/components/ChatInput";
import DeleteChat from "@/components/DeleteChat";
import InviteUser from "@/components/InviteUser";
import LanguagesSwitcher from "@/components/LanguagesSwitcher";
import LeaveChat from "@/components/LeaveChat";
import Messages from "@/components/Messages";
import ParticipantsCard from "@/components/ParticipantsCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { db } from "@/lib/db";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { DoorOpen, Settings, Settings2 } from "lucide-react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import React from "react";



export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const chats = await db.chat.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      participants: true,
    },
  });

  if (!chats) {
    redirect("/");
  }
  const { userId } = auth();
  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <ChatContextProvider chatId={chats.id}>
      <div className="relative min-h-[90vh]  bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="py-2 w-full h-20 mt-3 bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 border rounded-lg ">
          <div className="w-full h-full flex items-center justify-between px-10 bg-white rounded-md">
            <ParticipantsCard participants={chats.participants} />
            <DropdownMenu>
              <DropdownMenuTrigger className="text-lg hidden md:block font-semibold">
                {chats.name}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {chats.participants.map((a, b) => {
                  return (
                    <DropdownMenuItem key={a.id}>{a.name}</DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
             <LanguagesSwitcher/>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Settings className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    {chats.adminId === userId ? (
                      <DeleteChat chatId={chats.id} />
                    ) : (
                      <LeaveChat chatId={chats.id} id={userId} />
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    {chats.adminId === userId ? (
                      <InviteUser chatId={chats.id} />
                    ) : null}
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages chatId={params.chatId} />
        </div>

        <ChatInput isDisable={false} />
      </div>
    </ChatContextProvider>
  );
}
