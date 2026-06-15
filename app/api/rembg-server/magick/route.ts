import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { imageProcessor } from "@/lib/modules/ImageProcessor";
import { imageMagickService } from "@/lib/modules/ImageMagick";
import { ensureProcessedImagesDir, getServerImageUrl, processedImagesDir } from "@/lib/utils";
import type { ImageRequestBody } from "@/types";

export async function POST(req: NextRequest) {
  ensureProcessedImagesDir();

  const body = (await req.json()) as Partial<ImageRequestBody>;
  const { imageUrl } = body;

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL not provided" }, { status: 400 });
  }

  try {
    const imageBuffer = await imageProcessor.fetchImageUrl(imageUrl);
    const croppedBuffer = await imageMagickService.cropBottom(imageBuffer);
    const imageFileName = imageProcessor.getNewImageFileName(imageUrl);
    const imageFilePath = imageProcessor.getNewImageFilePath(imageFileName, processedImagesDir);

    fs.writeFileSync(imageFilePath, croppedBuffer);

    return NextResponse.json({ imageUrl: getServerImageUrl(imageFileName) });
  } catch (error) {
    console.error("Error processing image: ", error);
    return NextResponse.json({ error: "Error processing image" }, { status: 500 });
  }
}
