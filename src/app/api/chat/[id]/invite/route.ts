import { db } from "@/lib/db";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }){
    try {
        const { userId } = getAuth(request );  
        const requestBody=await request.json();
        const {email}=requestBody;
        const user = await currentUser();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })

        }

        if (!params.id) {
            return NextResponse.json({ message: "Invalid chat" }, { status: 400 })
        }
        const sameUser= user?.emailAddresses[0].emailAddress===email;

        if(sameUser){
            return NextResponse.json({message:"You cannot add yourself"},{status:403})
        }
    
        const existingUser=await  db.user.findFirst({
            where:{
                email,
            }
        })
        if(!existingUser || !userId || !user){
            return NextResponse.json({message:"User is not registered yet"},{status:400})
        }
        const id = params.id
        await db.chat.update({
            where:{
                id
            },
            data:{
                participants:{
                    connect:{id:existingUser.id}
                    
                }
        
            }
            })
            return NextResponse.json({message:"User added successfully"},{status:200})
        
    } catch (error:any) {
        return NextResponse.json({message:error.message},{status:500})

    }



}