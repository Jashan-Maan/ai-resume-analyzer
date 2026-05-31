import { extractText } from "unpdf";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const { text } = await extractText(new Uint8Array(buffer), {
      mergePages: true,
    });

    if (!text || text.trim().length === 0) {
      throw new Error("PDF appears to be empty or unreadable");
    }

    const cleaned = text.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

    return cleaned;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(
      "Failed to read PDF file. Please check the file and try again.",
    );
  }
}
