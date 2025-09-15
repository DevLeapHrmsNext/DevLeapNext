import { useEffect, useState } from "react";
import ExcelJS from "exceljs";

const XLSXFilePreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState("Loading preview...");

  useEffect(() => {
    console.log("Fetching XLSX:", url);
    
    const loadExcel = async () => {
      try {
        const response = await fetch(url);
        console.log("Excel Response:", response);
        
        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        
        console.log("Excel Loaded:", workbook);
        
        const firstSheet = workbook.worksheets[0];
        if (!firstSheet) throw new Error("No sheets found");

        const rows = firstSheet.getSheetValues();
        const formattedRows = rows
          .slice(1, 4)
          .map((row) => (row ? Object.values(row).join(", ") : "Empty row"))
          .join("\n");

        console.log("Excel Preview:", formattedRows);
        setPreview(formattedRows || "No Data");
      } catch (error) {
        console.error("Error loading Excel file:", error);
        setPreview("Failed to load preview");
      }
    };

    loadExcel();
  }, [url]);

  return <pre className="small">{preview}</pre>;
};

export default XLSXFilePreview;
