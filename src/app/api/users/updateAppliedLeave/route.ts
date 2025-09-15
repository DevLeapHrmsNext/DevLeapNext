import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { calculateNumDays, formatDateYYYYMMDD, funCalculateTimeDifference, funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { error } from "console";
import { funGetActivityTypeId } from "@/app/pro_utils/constantFunGetData";
import { addUserActivities, apiUploadDocs } from "@/app/pro_utils/constantFunAddData";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  console.log(request);
  let fileUploadResponse;
  try {
    const { fields, files } = await parseForm(request);
 
     let fileUploadResponse;
      if(files && files.file && files.file.length>0){
                      fileUploadResponse=await apiUploadDocs(files.file[0],fields.customer_id[0],fields.client_id[0],"applied_leave_docs")
                    
                  }
    const totalLeaveDays = calculateNumDays(new Date(fields.from_date), new Date(fields.to_date));
    
    let query = supabase.from("leap_customer_apply_leave")
      .update({
        client_id: fields.client_id[0],
        customer_id: fields.customer_id[0],
        branch_id: fields.branch_id[0] || null,
        leave_type: fields.leave_type[0],
        from_date: fields.from_date[0],
        to_date: fields.to_date[0],
        total_days: fields.duration[0]=="1"? fields.duration[0]:fields.duration[0]=="2"?"0.5":totalLeaveDays,//1-full day leave,2:half day leave
        leave_status: 1,
        attachments: fileUploadResponse ? fileUploadResponse : "",
        leave_reason: fields.leave_reason[0],
        duration:fields.duration[0],
        
      }).eq("id",fields.leave_id[0]);

    const { data,error } = await query;
    if (error) {
      console.log(error);
      return funSendApiErrorMessage(error, "Customer Apply Leave Insert Issue");
    }
    
    const addActivity= await addUserActivities(fields.client_id[0],fields.customer_id[0],fields.branch_id[0],"Leave",fields.leave_type[0],fields.leave_id[0],false);
    if(addActivity=="1"){
      return funSendApiErrorMessage(addActivity, "Customer Leave Activity Insert Issue");

    }
    else {
      return funDataAddedSuccessMessage("Leave Updated Successfully");
    }

  } catch (error) {
    console.log(error);
    return funSendApiException(error);
  }
}


