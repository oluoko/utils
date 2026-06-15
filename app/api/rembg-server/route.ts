import { NextRequest, NextResponse } from "next/server";
import { imageProcessor } from "@/lib/modules/ImageProcessor";
import { remBgService } from "@/lib/modules/RemBg";
import {
  ensureProcessedImagesDir,
  getServerImageUrl,
  processedImagesDir,
} from "@/lib/utils";
import type { ImageRequestBody } from "@/types";

export async function POST(req: NextRequest) {
  ensureProcessedImagesDir();

  const body = (await req.json()) as Partial<ImageRequestBody>;
  const { imageUrl } = body;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL not provided" },
      { status: 400 },
    );
  }

  const existingSkuImage = imageProcessor.checkIfSkuImageExists(
    imageUrl,
    processedImagesDir,
  );
  if (existingSkuImage) {
    return NextResponse.json({ imageUrl: getServerImageUrl(existingSkuImage) });
  }

  try {
    const imageBuffer = await imageProcessor.fetchImageUrl(imageUrl);
    const imageWithOutBg = await remBgService.removeBackground(imageBuffer);
    const imageFileName = await imageProcessor.saveProcessedImage(
      imageUrl,
      imageWithOutBg,
      processedImagesDir,
    );

    return NextResponse.json({ imageUrl: getServerImageUrl(imageFileName) });
  } catch (error) {
    console.error("Error processing image: ", error);
    return NextResponse.json(
      { error: "Error processing image" },
      { status: 500 },
    );
  }
}
