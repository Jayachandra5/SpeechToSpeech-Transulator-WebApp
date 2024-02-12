import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
      {
        status: 401,
      },
    );
  }


  const form = await req.formData();

  const file = form.get('file') as File;
  const filename = req.headers.get("x-vercel-filename") || "file.mp3"; 
  const contentType =  "audio/mp3"; 
  const fileType = `.${contentType.split("/")[1]}`;

  // construct final filename based on content-type if not provided
  const finalName = filename.includes(fileType)
    ? filename
    : `${filename}${fileType}`;

  const blob = await put(finalName, file, {
    contentType,
    access: "public",

  });
  console.log(blob.contentDisposition)

  return NextResponse.json(blob);
}
