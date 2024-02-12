import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })

        }
       
        if (!params.id) {
            return NextResponse.json({ message: "Invalid chat" }, { status: 400 })
        }

        const id = params.id




        const category = await db.chat.findUnique({
            where: {
                id: id,
            }
        });
        if (!category) {
            return NextResponse.json({ message: "Chat not found" }, { status: 404 });
        }
        await db.messages.deleteMany({
            where:{
                chatId:params.id
            }
        })
        await db.chat.delete({
            where: {
                id: id
            }
        });
        return NextResponse.json({ message: "Deleted Succesfully" }, { status: 200 })

    } catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
