import { db } from "@/lib/db";
import {auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        const requestBody=await request.json();
    const {email,name}=requestBody;
    const {userId}=auth()
    const user = await currentUser();

    
    const existingUser=await db.user.findFirst({
        where:{
            email,
        }
    })
    if(!existingUser || !userId || !user){
        return NextResponse.json({message:"User is not registered yet"},{status:400})
    }





    const sameUser= user?.emailAddresses[0].emailAddress===email;

    if(sameUser){
        return NextResponse.json({message:"You cannot add yourself"},{status:403})
    }

  

   const chat= await db.chat.create({
    data:{
        name,
        admin:{
            connect:{email:user.emailAddresses[0].emailAddress}
        },
        participants:{
            connect:[{id:existingUser.id},{email:user.emailAddresses[0].emailAddress}],
            
        }

    }
    })

    return NextResponse.json({message:"User added successfully",id:chat.id},{status:200})
        
    } catch (error:any) {
        return NextResponse.json({message:error.message},{status:500})

        
    }

}


export async function DELETE(){
    
}