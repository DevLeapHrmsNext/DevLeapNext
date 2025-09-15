import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, apiStatusFailureCode } from "@/app/pro_utils/stringConstants";
import { funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import { apiUploadDocs } from "@/app/pro_utils/constantFunAddData";

export async function POST(request: NextRequest) {

  try {
    // const { data: user, error: userError } = await supabase.auth.getUser();

    // // Handle case where the user is not authenticated
    // if (userError || !user) {
    //   return NextResponse.json(
    //     { error: 'User not authenticated' },
    //     { status: 401 }
    //   );
    // }


    const { fields, files } = await parseForm(request);

    if (!files || !files.file) {
      return NextResponse.json({ error: "No files received." }, { status: apiStatusInvalidDataCode });
    }

    const currentDateTime = new Date();

    let fileUploadResponse;
    if(files && files.file && files.file.length>0){
          fileUploadResponse=await apiUploadDocs(files.file[0],fields.branch_id[0],fields.client_id,"clientdocs")
      
    }
    const { error } = await supabase.from("leap_client_documents")
      .insert({
        client_id: fields.client_id[0], branch_id: fields.branch_id[0],
        document_type_id: fields.document_type_id[0],
        document_url: fileUploadResponse ? fileUploadResponse : "",
        created_at: new Date()
      });

    if (error) {
      console.log(error);

      return NextResponse.json({ message: "file upload data insert error :- ", error: error, status: 0 }, { status: apiStatusFailureCode });
    }
    else {
      return NextResponse.json({ message: "FIle uploaded successfully", status: 1 }, { status: apiStatusSuccessCode })
    }

  } catch (error) {
    return funSendApiException(error);

  }
}