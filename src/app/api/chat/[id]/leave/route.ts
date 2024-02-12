import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })

        }

        if (!params.id) {
            return NextResponse.json({ message: "Invalid chat" }, { status: 400 })
        }

        const id = params.id
        await db.chat.update({
            where: { 
                id
            },
            data:{
                participants:{
                disconnect:{id:userId}
                }
            }
        })

       return  NextResponse.json({message:"Left the chat successfully"},{status:200})





    } catch (error:any) {
        return NextResponse.json({message:error.message},{status:500})

    }

}