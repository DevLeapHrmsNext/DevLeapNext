import { useEffect, useState } from "react";
import mammoth from "mammoth";

const DOCXFilePreview = ({ url }: { url: string }) => {
  const [text, setText] = useState("Loading preview...");

  useEffect(() => {
    console.log("Fetching DOCX:", url);

    fetch(url)
      .then((res) => {
        console.log("DOCX Response:", res);
        return res.arrayBuffer();
      })
      .then((data) => 
        mammoth.extractRawText({ arrayBuffer: data })
      )
      .then((result) => {
        console.log("DOCX Extracted Text:", result.value);
        setText(result.value.substring(0, 100) + "...");
      })
      .catch((err) => {
        console.error("Error loading DOCX:", err);
        setText("Failed to load preview");
      });
  }, [url]);

  return <p className="small">{text}</p>;
};


export default DOCXFilePreview;
