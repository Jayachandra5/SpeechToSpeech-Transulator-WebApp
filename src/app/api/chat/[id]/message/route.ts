import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { id: string } }){
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })

        }
        const user=await currentUser();

        const existingUser=await db.user.findFirst({
            where:{
                email:user?.emailAddresses[0].emailAddress,
            }
        })
        const existingChat= await db.chat.findUnique({
            where:{
                id:params.id
            }
        })
        if(!existingUser || !userId || !user || !existingChat){
            return NextResponse.json({message:"Chat/User does'nt exist"},{status:400})
        }
        const messages=await db.messages.findMany({
            where: {
              chatId:params.id,
            },
            orderBy: {createdAt:"desc"},
            include:{
                sender:true
            }
          });
          

          return NextResponse.json({message:messages},{status:200})
        
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({ message: error.message }, { status: 500 })
        
    }
}
export async function POST (request: NextRequest, { params }: { params: { id: string } }){
    try{
        const { userId } = getAuth(request);
        const requestBody=await request.json();
        const {message}=requestBody;

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })

        }
        const user=await currentUser();

        const existingUser=await db.user.findFirst({
            where:{
                email:user?.emailAddresses[0].emailAddress,
            }
        })
        const existingChat= await db.chat.findUnique({
            where:{
                id:params.id
            }
        })
        if(!existingUser || !userId || !user || !existingChat){
            return NextResponse.json({message:"Chat/User does'nt exist"},{status:400})
        }
        const messages=await db.messages.create({
            data:{
                chatId:params.id,
                senderId:existingUser.id,
                content:message,
            }
        })
      
        
        await pusherServer.trigger("my-channel","my-event",{
            message:`${JSON.stringify(messages)}\n\n`,
        })
        return NextResponse.json({message:"Created message"},{status:200})
    }catch(error:any){
        console.log(error.message)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}