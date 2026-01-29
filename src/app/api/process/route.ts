import { NextRequest, NextResponse } from "next/server";
import { processLogo } from "@/lib/process-image";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const height = parseInt(formData.get("height") as string) || 80;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate height
    const targetHeight = Math.min(Math.max(height, 60), 100);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process the image
    const processedBuffer = await processLogo(buffer, targetHeight);

    // Return as base64 for preview, or as blob for download
    const base64 = processedBuffer.toString("base64");

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
      size: processedBuffer.length,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
