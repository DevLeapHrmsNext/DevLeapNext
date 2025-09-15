import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { parseForm, setUploadFileName } from "@/app/pro_utils/constant";
import { addErrorExceptionLog } from "@/app/pro_utils/constantFunAddData";

export const runtime = "nodejs"; // Ensure Node.js runtime for app directory API

// Handle POST request
export const POST = async (req: NextRequest) => {
  let clientid,customer_id;
  try {
    const { fields, files } = await parseForm(req);
    console.log("uplaod Files is called============================== ",req);
    
    const log=await addErrorExceptionLog(fields.client_id[0],fields.customer_id[0],"Upload document api called",JSON.stringify({
        client_id:fields.client_id[0],customer_id:fields.customer_id[0]
    }))
    clientid=fields.client_id[0];
    customer_id=fields.customer_id[0];
    if (!files || !files.file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const uploadedFile = files.file[0];
    const tempFilePath = uploadedFile.path; // Temporary file path
    let filename;
    let uploadDir;
    if(fields.docType[0]==="announcement"){
      filename=setUploadFileName(fields.docType[0]+"_"+fields.branch_id[0]+"_"+uploadedFile.originalFilename);
      uploadDir = path.join(process.cwd(), "/uploads/"+fields.docType[0]+"/"+fields.client_id[0]+"/"+fields.branch_id[0]);
    }else{
      filename=setUploadFileName(fields.docType[0]+"_"+fields.customer_id[0]+"_"+uploadedFile.originalFilename);
      uploadDir = path.join(process.cwd(), "/uploads/"+fields.docType[0]+"/"+fields.client_id[0]);
    }
   
    
    await fs.mkdir(uploadDir, { recursive: true });

    const destination = path.join(uploadDir, filename);
    await fs.copyFile(tempFilePath, destination);
    let fileURL="";
    
    if(fields.docType[0]==="announcement"){
      fileURL=fields.docType[0]+"/"+fields.client_id[0]+"/"+fields.branch_id[0]+"/"+filename
    }else{
      fileURL=fields.docType[0]+"/"+fields.client_id[0]+"/"+filename
    }
     const successlog=await addErrorExceptionLog(fields.client_id[0],fields.customer_id[0],"Upload document api called",JSON.stringify({
        client_id:fields.client_id[0],customer_id:fields.customer_id[0],url:fileURL
    }))
    return NextResponse.json({ message: "File uploaded successfully", status: 1,documentURL:fileURL },{status:200});
  } catch (error) {
    console.error("File upload error:", error);
     const successlog=await addErrorExceptionLog(clientid,customer_id,"Upload document api called",JSON.stringify(error))
    return NextResponse.json({
      message: "File upload failed",
      error: error instanceof Error ? error.message : String(error),
      status: 500,
    });
  }
};
