import { useEffect, useState } from "react";
import xlsToJson from "xls-to-json-lc";

const XLSPreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState("Loading preview...");

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          if (!event.target?.result) return;
          xlsToJson({ input: event.target.result as string }, (err: any, result: any[]) => {
            if (err) {
              console.error("Error parsing XLS:", err);
              setPreview("Error loading preview");
            } else {
              const rows = result.slice(0, 3).map(row => Object.values(row).join(", "));
              setPreview(rows.join("\n") || "No Data");
            }
          });
        };
        
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading Excel file:", error);
        setPreview("Error loading preview");
      }
    };

    loadExcel();
  }, [url]);

  return <pre className="small">{preview}</pre>;
};

export default XLSPreview;
