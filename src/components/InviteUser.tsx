"use client";
import React, { useState } from "react";
import * as z from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Copy, Loader2, Plus, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email(),
});

interface CreateChatButtonProps {
    chatId:String
}

export default function InviteUser(props: CreateChatButtonProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/${props.chatId}/invite`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      }

      if (!response.ok) {
        toast.error(data.message);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant={"secondary"}>Invite Users</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Users</DialogTitle>
          <DialogDescription>Add members to the chat.</DialogDescription>
        </DialogHeader>
        <div
          className=" border border-primary p-1 absolute cursor-pointer right-4 top-4 rounded-sm opacity-70 ring-offset-primary transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid flex-1 gap-2 "
            >
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the email"
                        className=" w-full"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage  className="text-red-500"/>
                  </FormItem>
                )}
              />
              



              <Button
                type="submit"
                size="sm"
                variant={"secondary"}
                className="px-3 mt-1 flex gap-x-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span>Adding</span>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Add</span>
                    <Plus className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
