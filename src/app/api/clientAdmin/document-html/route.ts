import { NextRequest, NextResponse } from "next/server";
// import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { parseForm } from "@/app/pro_utils/constant";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
// If you get "Cannot find module", you may need to install types or use dynamic import as below:

// let pdfjsLib: any;
// try {
//     pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// } catch (e) {
//     pdfjsLib = null;
// }

import fs from "fs/promises";

export async function POST(req: NextRequest) {
    try {
        const { fields, files } = await parseForm(req);
        console.log("Api is getting called");

        if (!files || !files.file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }
        const file = files.file[0];
        const filePath = file.filepath || file.path;
        const buffer = await fs.readFile(filePath);
        console.log("isBuffer:", Buffer.isBuffer(buffer), "length:", buffer.length,
            "filenamedocx", file.originalFilename.endsWith(".docx"), "filenamepdf", file.originalFilename.endsWith(".pdf"));

        let html = "";

        // if (file.originalFilename.endsWith(".docx")) {
        //     const result = await mammoth.convertToHtml({ buffer });
        //     html = result.value;
        // } else if (file.originalFilename.endsWith(".pdf")) {
        //     try {
        //         const text = await extractTextFromPDF(buffer);
        //         html = `<div>${text.replace(/\n/g, "<br/>")}</div>`;
        //     } catch (e) {
        //         console.log(e);
        //         return NextResponse.json(
        //             { status: 0, message: "Unsupported format. Failed to convert" },
        //             { status: 400 }
        //         );

        //     }
        // } else {
        //     return NextResponse.json(
        //         { status: 0, message: "Unsupported format. Failed to convert" },
        //         { status: 400 }
        //     );
        // }


        return NextResponse.json({
            status: 1,
            message: "File converted successfully",
            data: html
        });
    } catch (error) {
        console.log("this is the exception", error);
        return NextResponse.json(
            { error: "Error processing file", details: String(error) },
            { status: 200 }
        );
    }
}


async function extractTextFromPDF(buffer: Buffer): Promise<string> {
      const pdfParse = require("pdf-parse");

  const pdfData = await pdfParse(buffer);
  return pdfData.text;
}