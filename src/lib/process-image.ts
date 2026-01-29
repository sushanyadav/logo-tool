import sharp from "sharp";

export async function processLogo(buffer: Buffer, targetHeight: number) {
  // Trim whitespace/transparency
  const trimmed = await sharp(buffer).trim().toBuffer();

  // Resize to target height while maintaining aspect ratio
  const processed = await sharp(trimmed)
    .resize({ height: targetHeight, withoutEnlargement: true })
    .png()
    .toBuffer();

  return processed;
}
