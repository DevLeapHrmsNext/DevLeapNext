import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";

// 🔹 Dynamically set the workerSrc based on the installed version
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

const PDFPreview = ({ url }: { url: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching PDF:", url);

    const loadPDF = async () => {
      try {
        const pdf = await getDocument(url).promise;
        console.log("PDF Loaded:", pdf);

        const page = await pdf.getPage(1);
        console.log("First Page Loaded");

        const viewport = page.getViewport({ scale: 1.0 });

        const canvas = canvasRef.current;
        if (!canvas) {
          console.log("Canvas not found");
          return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
          console.log("Canvas context not found");
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        console.log("PDF Rendered");
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load preview");
      }
    };

    loadPDF();
  }, [url]);

  return error ? (
    <p className="text-danger">{error}</p>
  ) : (
    <canvas ref={canvasRef} style={{ width: "100%", maxHeight: "150px" }} />
  );
};

export default PDFPreview;
