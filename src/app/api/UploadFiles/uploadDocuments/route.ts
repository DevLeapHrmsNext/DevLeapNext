import { funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { apiStatusFailureCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { apiUploadDocs } from "@/app/pro_utils/constantFunAddData";

export async function POST(request: NextRequest) {

    try {
            const { fields, files } = await parseForm(request);
            if (!files || !files.file) {
                return NextResponse.json({ error: "No files received." }, { status: 400 });
            }
            let fileUploadResponse;
            fileUploadResponse=await apiUploadDocs(files.file[0],fields.customer_id[0],fields.client_id[0],fields.docName[0] || "")
                          
                        

        if(fileUploadResponse && fileUploadResponse.length>0){
        return NextResponse.json({status:1 ,message: "File uploaded", data:fileUploadResponse}, { status: apiStatusSuccessCode })

        }else{
                    return NextResponse.json({status:0 ,message: "Failed to upload file", }, { status: apiStatusSuccessCode })

        }

    }catch(e){
        console.log(error);
        return funSendApiException(error)
        
    }
}