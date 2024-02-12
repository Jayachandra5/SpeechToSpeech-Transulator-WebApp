import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }){
    try {
        const user=await db.user.findUnique({
            where:{
                id: params.id
            }
        })
        return NextResponse.json({message:user?.language},{status: 200})
        
    } catch (error) {
        return NextResponse.json({message:"Something went wrong"},{status: 500})
        
    }

}


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }){
    try {
        const requestBody=await request.json()
        const {language}=requestBody
        const user=await db.user.update({
            where:{
                id: params.id
            },data:{
                language
            }
        })
        
        return NextResponse.json({message:user?.language},{status: 200})

        
    } catch (error) {
        return NextResponse.json({message:"Something went wrong"},{status: 500})
        
    }
}