import sharp from "sharp";
import { Rembg } from "rembg-node";

class RemBgService {
  async removeBackground(
    imageBuffer: Buffer,
    returnBuffer: true
  ): Promise<Buffer>;
  async removeBackground(
    imageBuffer: Buffer,
    returnBuffer?: false
  ): Promise<sharp.Sharp>;
  async removeBackground(
    imageBuffer: Buffer,
    returnBuffer = false
  ): Promise<Buffer | sharp.Sharp> {
    const input = sharp(imageBuffer);
    const rembg = new Rembg({ logging: true });
    const output = await rembg.remove(input);

    if (returnBuffer) {
      return output.png().toBuffer();
    }

    return output;
  }
}

export const remBgService = new RemBgService();
