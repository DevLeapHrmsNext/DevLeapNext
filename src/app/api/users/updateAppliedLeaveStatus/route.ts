import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const {leave_id, status, status_remark} = await request.json();
    
    if (!leave_id) {
      return NextResponse.json({ error: "Leave ID needed" },{ status: apiStatusInvalidDataCode }
      );
    }
    console.log("-------------- lieave status",status);
    
    const { data, error } = await supabase
      .from('leap_customer_apply_leave')
      .update({
       
        leave_status: status,
        approve_disapprove_remark: status_remark || null,
        isAssigned: "FALSE",
        
      })
      .eq('id', leave_id )
      .select("*");
    
    if (error) {
      return funSendApiErrorMessage(error, "Leave Update Issue");
    }
    
    if (error) {
        // console.log(error);
        return funSendApiErrorMessage("Update Activity", "Customer Leave Activity Insert Issue");
    }
    let query = supabase
        .from('leap_client_useractivites')
        .update({activity_status:status})
        .eq("activity_related_id",leave_id);
        // .eq("asset_status", 1);
    const { data:activity, error:activityError } = await query;
    if (activityError) {
      console.log(activityError);
      return funSendApiErrorMessage(activityError, "Customer Update Leave activity Issue");
    }
    
    if (data) {
      return NextResponse.json({ status: 1, message: "Leave Status Updated", data: data }, { status: apiStatusSuccessCode });
    }else 
    return NextResponse.json({ message: "Failed to update leave status" }, { status: apiStatusFailureCode });
    
  } catch (error) {
    console.log(error);
    
    return funSendApiException(error);
  }
}