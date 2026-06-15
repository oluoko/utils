import gm from "gm";

const imageMagick = gm.subClass({ imageMagick: true });

type Background = "white" | "transparent" | string;

class ImageMagick {
  async cropBottom(
    inputBuffer: Buffer,
    background: Background = "white"
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      imageMagick(inputBuffer)
        .gravity("South")
        .trim()
        .extent(2000, 2000)
        .background(background)
        .toBuffer((err: Error | null, croppedBuffer: Buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(croppedBuffer);
          }
        });
    });
  }
}

export const imageMagickService = new ImageMagick();
