import { User } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function ParticipantsCard({
  participants,
}: {
  participants: User[];
}) {
  return (
    <div className="flex -space-x-0 rtl:space-x-reverse">
      {participants.slice(0, 11).map((participant) => (
        <TooltipProvider key={participant.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={participant.imageUrl}
                  alt={participant.name}
                />
                <AvatarFallback>{participant.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{participant.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {participants.length > 10 && (
        <p className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white  border-2 border-white rounded-full  bg-gradient-to-r from-violet-500 to-indigo-500 ">
          +{participants.length - 3}
        </p>
      )}
    </div>
  );
}
