"use client"
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
  

export default function LanguagesSwitcher() {
    const[loading,setLoading]=useState(false)
    const [value,setValue]=useState("English")
    const router=useRouter()
    const {user}=useUser()
    
    async function getUserLanguage(){
        try {
          
            const response=await fetch(`/api/${user?.id}`)
            const data=await response.json()
            setValue(data.message)
            
        } catch (error:any) {
            console.error(error.message)
        }
    }

    useEffect(()=>{
        getUserLanguage()
    })
    async function  updateLanguage(value:string){
        try{
            setLoading(true)
            const response=await fetch(`/api/${user?.id}/`,{
                method:'PATCH',
                body:JSON.stringify({language:value}),
            })
            const data=await response.json()
            setValue(data.message)
            toast.success("Language updated successfully")
           router.refresh()
            


        }catch (error:any) {
            console.error(error.message)
        }finally{
            setLoading(false)
        }

    }
  return (
    <Select disabled={loading} onValueChange={(value)=>{
        updateLanguage(value)
    }} value={value}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Select Language"    />
    </SelectTrigger>
    <SelectContent>
    {languages.map((language,index)=>(
      <SelectItem value={language.name} key={index}>{language.name}</SelectItem>
    ))}
    </SelectContent>
  </Select>
  )
}
