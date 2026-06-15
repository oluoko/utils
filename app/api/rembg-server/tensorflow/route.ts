import { NextRequest, NextResponse } from "next/server";
import { imageProcessor } from "@/lib/modules/ImageProcessor";
import { remBgService } from "@/lib/modules/RemBg";
import { tensorFlowService } from "@/lib/modules/TensorFlow";
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
    const predictions = await tensorFlowService.detectObject(imageBuffer);
    const imageRembgBuffer = await remBgService.removeBackground(imageBuffer, true);
    const croppedImageBuffer = await tensorFlowService.cropImage(imageRembgBuffer, predictions, false);
    const imageFileName = await imageProcessor.saveProcessedImage(
      imageUrl,
      // cropImage returns sharp.Sharp when returnBuffer = false
      croppedImageBuffer as Awaited<ReturnType<typeof import("sharp")>>,
      processedImagesDir
    );

    return NextResponse.json({ imageUrl: getServerImageUrl(imageFileName) });
  } catch (error) {
    console.error("Error processing image: ", error);
    return NextResponse.json({ error: "Error processing image" }, { status: 500 });
  }
}
