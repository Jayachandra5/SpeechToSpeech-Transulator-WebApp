
import { db } from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
const languages = [
    { name: "Arabic", val: "ar" },
    { name: "Bulgarian", val: "bg" },
    { name: "Catalan", val: "ca" },
    { name: "Chinese", val: "zh-CN" },
    { name: "Czech", val: "cs" },
    { name: "Danish", val: "da" },
    { name: "Dutch", val: "nl" },
    { name: "English", val: "en" },
    { name: "French", val: "fr" },
    { name: "German", val: "de" },
    { name: "Greek", val: "el" },
    { name: "Hebrew", val: "iw" },
    { name: "Hindi", val: "hi" },
    { name: "Hungarian", val: "hi" },
    { name: "Icelandic", val: "is" },
    { name: "Indonesian", val: "id" },
    { name: "Italian", val: "it" },
    { name: "Japanese", val: "ja" },
    {name: "Korean", val: "ko" },
    { name:"Kannada" , val: "kn" },
    { name:"Latvian" , val: "lv" },
    { name:"Marathi" ,val: "mr" },
    { name:"Norwegian" , val: "no" },
    {name:"Polish" , val: "pl" },
    {name:"Portuguese" , val: "pt-PT" },
    { name:"Romanian" , val: "ro" },
    { name:"Russian",val:"ru"},
    {name:"Slovak" , val: "sk" },
    {name:"Swedish" , val: "sv" },
    {name:"Swahili" , val: "sw" },
    {name:"Spanish" , val: "es"},
    {name:"Slovenian" , val: "sl" },
    {name:"Turkish" , val:"tr"},
    {name:"Ukrainian" , val: "uk"},
    {name:"Vietnamese" , val: "vi"},
    {name:"Tamil" , val: "ta"},
    {name:"Telugu" , val:"te"},
    {name:"Thai" , val: "th"},
    {name:"Urdu" , val: "ur"},
    {name:"Welsh" , val: "cy"}
  ];
function findValByName(name:any) {
    const language = languages.find(lang => lang.name.toLowerCase() === name.toLowerCase());

    if (language) {
        return language.val;
    } else {
        return null; // Handle the case where the name is not found
    }
}

export async function GET(request: NextRequest){
    try {
        const {userId}=getAuth(request)
        if(!userId) return
        const user=await db.user.findUnique({
            where:{
                id: userId
            }
        })
        const val = findValByName(user?.language);

        
        return NextResponse.json({message:val},{status: 200})
        
    } catch (error) {
        return NextResponse.json({message:"Something went wrong"},{status: 500})
        
    }

}