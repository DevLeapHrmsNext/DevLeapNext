import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const {id, approval_status } = await request.json();
   
    if (!id) {
      return NextResponse.json({ error: "Company ID needed" },{ status: apiStatusInvalidDataCode }
      );
    }
    const { data, error } = await supabase
      .from('leap_customer_project_task')
      .update({
        approval_status: approval_status|| null,
        updated_at: new Date(),  
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return funSendApiErrorMessage(error, "Task Update Issue");
    }
    if (data) {
      return NextResponse.json({status:1, message: "Task Added Successfully", data: data }, { status: apiStatusSuccessCode });
    }else 
    return NextResponse.json({status:0, message: "Task failure" }, { status: apiStatusFailureCode });
    
  } catch (error) {
    return funSendApiException(error);
  }
}
