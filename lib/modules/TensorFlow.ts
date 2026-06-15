import * as tf from "@tensorflow/tfjs-node";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import sharp from "sharp";

interface Prediction {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

class TensorFlowService {
  async detectObject(imageBuffer: Buffer): Promise<Prediction[]> {
    const model = await cocoSsd.load();
    const decodedImage = tf.node.decodeImage(imageBuffer) as tf.Tensor3D;
    const predictions = await model.detect(decodedImage);
    console.log(predictions);
    decodedImage.dispose(); // clean up tensor to avoid memory leaks
    return predictions as Prediction[];
  }

  async cropImage(
    imageBuffer: Buffer,
    predictions: Prediction[],
    returnBuffer = true
  ): Promise<Buffer | sharp.Sharp> {
    if (predictions.length === 0) {
      throw new Error("No objects detected.");
    }

    const object = predictions[0];
    const image = sharp(imageBuffer);
    const [x, y, width, height] = object.bbox;

    const cropped = image.extract({
      left: Math.round(x),
      top: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    });

    if (returnBuffer) {
      return cropped.toBuffer();
    }

    return cropped;
  }
}

export const tensorFlowService = new TensorFlowService();
