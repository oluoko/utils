import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import axios from "axios";
import sharp from "sharp";

class ImageProcessor {
  extractSkuFromImageUrl(imageUrl: string): string | null {
    const match = imageUrl.match(/\/s(\d+)-/);
    console.log(match);
    return match ? match[1] : null;
  }

  getNewImageFileName(imageUrl: string): string {
    const skuId = this.extractSkuFromImageUrl(imageUrl);
    const imageId = skuId ?? uuidv4();
    return `${imageId}.png`;
  }

  getNewImageFilePath(imageFileName: string, processedImagesDir: string): string {
    return path.join(processedImagesDir, imageFileName);
  }

  saveImageFile(imagePath: string, imageBuffer: Buffer): void {
    fs.writeFileSync(imagePath, imageBuffer);
  }

  checkIfSkuImageExists(
    imageUrl: string,
    processedImagesDir: string
  ): string | false {
    const skuId = this.extractSkuFromImageUrl(imageUrl);
    if (!skuId) return false;

    const imageFileName = `${skuId}.png`;
    const imagePath = path.join(processedImagesDir, imageFileName);

    if (fs.existsSync(imagePath)) {
      return imageFileName;
    }
    return false;
  }

  async fetchImageUrl(imageUrl: string): Promise<Buffer> {
    const response = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  }

  async saveProcessedImage(
    imageUrl: string,
    imageBuffer: sharp.Sharp,
    processedImagesDir: string
  ): Promise<string> {
    const imageFileName = this.getNewImageFileName(imageUrl);
    const imagePath = this.getNewImageFilePath(imageFileName, processedImagesDir);

    await imageBuffer.webp().toFile(imagePath);

    return imageFileName;
  }
}

export const imageProcessor = new ImageProcessor();
