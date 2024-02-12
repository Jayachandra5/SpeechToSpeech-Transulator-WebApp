"use client";
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteChat({ chatId }: { chatId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteChat = async () => {
    try {
      setLoading(true);
      

      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Chat deleted successfully");
        router.push("/")
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // You can add additional logic here if needed
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Delete Group</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            <span className="font-semibold"> chat</span> and remove your
            messages from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteChat}
            disabled={loading}
          >
            <Button variant={"destructive"} disabled={loading}>
              {loading ? "Deleting..." : "Delete Chat"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
