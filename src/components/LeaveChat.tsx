"use client"
import React, { useState } from "react";
import { Button } from "./ui/button";
import { DoorOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LeaveChat({chatId,id}:{chatId:string,id:string}) {
    const router=useRouter()
    const [loading,setLoading]=useState(false)
    async function leaveChat(){
        try {
            setLoading(true)
            const response=await fetch(`/api/chat/${chatId}/leave`,{
                method:"PATCH"
            })
            const data=await response.json();
            if(response.ok){
                toast.success("Left the chat successfully")
                router.push("/chats")

            }else{
                toast.error(data.message)
            
            }
            
        } catch (error:any) {
            console.log(error.message);
            
        }finally{
            setLoading(false)
        }
    }



  return (
    <Button variant={"destructive"} onClick={()=>leaveChat()} disabled={loading}>
      {loading?(<div className="flex items-center gap-x-2">Leaving Group <Loader2 className="animate-spin ml-2" /></div>):(
        <div className="flex items-center gap-x-2">Leave Group <DoorOpen className="ml-2" /></div>
      )}
    </Button>
  );
}
