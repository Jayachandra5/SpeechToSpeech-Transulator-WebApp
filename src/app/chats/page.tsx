import { Button } from "@/components/ui/button";

import { currentUser } from "@clerk/nextjs";
import {
  Copy,
  Ghost,
  Loader2,
  MessageSquare,
  Plus,
  Share,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateChatButton from "@/components/CreateChatButton";

export default async function Dashboard() {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/");
  }
  const existingUser = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        id:user.id,
        name: user.firstName!,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl!,
      },
    });
  }

  const chats = await db.chat.findMany({
    where: {
      OR: [
        {
          adminId: existingUser?.id,
        },
        {
          participants: {
            some: {
              id: existingUser?.id,
            },
          },
        },
      ],
    },
    include: {
      participants: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10 p-2">
      <div className="mt-8 flex flex-col md:flex-row   items-start justify-between gap-4">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Chats</h1>
        <div className="flex items-center justify-between gap-3">
          <CreateChatButton />
        </div>
      </div>
      {chats && chats?.length !== 0 ? (
        <ul className="mt-8 grid gird-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-3">
          {chats
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((chat, index) => (
              <li
                key={chat.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition-all hover:shadow-lg "
              >
                <Link href={`/chats/${chat.id}`} className="flex flex-col gap-2">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                        {chat.name.trim()}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 mt-4 flex items-center justify-between py-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    {format(new Date(chat.createdAt), "MMM yyyy")}
                  </div>
                  <div className="flex -space-x-4 rtl:space-x-reverse">
                    {chat.participants.slice(0, 3).map((participant) => (
                      <Avatar key={participant.id}>
                        <AvatarImage
                          src={participant.imageUrl}
                          alt={participant.name}
                        />
                        <AvatarFallback>
                          {participant.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {chat.participants.length > 3 && (
                      <p className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white  border-2 border-white rounded-full  bg-gradient-to-r from-violet-500 to-indigo-500 ">
                        +{chat.participants.length-3}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 ">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Lets&apos;s create your first chat.</p>
        </div>
      )}
    </main>
  );
}
