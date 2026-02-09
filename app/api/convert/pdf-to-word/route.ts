import { NextRequest } from "next/server";
import { PDFParse } from "pdf-parse";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    await parser.destroy();

    const text = textResult.text || "";
    const lines = text.split("\n").filter((line: string) => line.trim());

    const doc = new Document({
      sections: [
        {
          children: lines.map(
            (line: string) =>
              new Paragraph({
                children: [new TextRun({ text: line, size: 24 })],
                spacing: { after: 120 },
              })
          ),
        },
      ],
    });

    const docxBuffer = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(docxBuffer);

    const outputName = file.name.replace(/\.pdf$/i, ".docx");

    return new Response(uint8, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${outputName}"`,
      },
    });
  } catch (error) {
    console.error("[PDF_TO_WORD]", error);
    return Response.json(
      { error: "Failed to convert PDF to Word" },
      { status: 500 }
    );
  }
}
