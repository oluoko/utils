import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const imagePath = path.join(process.cwd(), "processed_images", filename);

  if (!fs.existsSync(imagePath)) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(filename).toLowerCase();

  const contentTypeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  };

  const contentType = contentTypeMap[ext] ?? "application/octet-stream";

  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
