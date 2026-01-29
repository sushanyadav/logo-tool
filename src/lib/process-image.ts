import sharp from "sharp";

export async function processLogo(
  buffer: Buffer,
  targetHeight: number,
  padding: number = 2
) {
  // Trim whitespace/transparency
  const trimmed = await sharp(buffer).trim().toBuffer();

  // Get trimmed image metadata
  const metadata = await sharp(trimmed).metadata();
  const trimmedWidth = metadata.width || 100;
  const trimmedHeight = metadata.height || 100;

  // Calculate new dimensions with padding
  const paddedWidth = trimmedWidth + padding * 2;
  const paddedHeight = trimmedHeight + padding * 2;

  // Add padding by extending with transparent background
  const padded = await sharp(trimmed)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  // Resize to target height while maintaining aspect ratio
  const processed = await sharp(padded)
    .resize({ height: targetHeight, withoutEnlargement: true })
    .png()
    .toBuffer();

  return processed;
}
