import sharp from "sharp";

export async function processLogo(
  buffer: Buffer,
  targetHeight: number,
  padding: number = 2
) {
  // Process at 2x resolution for retina displays
  const scale = 2;
  const scaledHeight = targetHeight * scale;
  const scaledPadding = padding * scale;

  // Trim whitespace/transparency
  const trimmed = await sharp(buffer).trim().toBuffer();

  // Add padding by extending with transparent background
  const padded = await sharp(trimmed)
    .extend({
      top: scaledPadding,
      bottom: scaledPadding,
      left: scaledPadding,
      right: scaledPadding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  // Resize to target height while maintaining aspect ratio
  const processed = await sharp(padded)
    .resize({
      height: scaledHeight,
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 1 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return processed;
}
