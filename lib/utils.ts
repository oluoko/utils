import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import fs from "fs";
import path from "path";

export const processedImagesDir = path.join(process.cwd(), "processed_images");

export function ensureProcessedImagesDir(): void {
  if (!fs.existsSync(processedImagesDir)) {
    fs.mkdirSync(processedImagesDir, { recursive: true });
  }
}

export function getServerImageUrl(imageFileName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return `${baseUrl}/images/${imageFileName}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
