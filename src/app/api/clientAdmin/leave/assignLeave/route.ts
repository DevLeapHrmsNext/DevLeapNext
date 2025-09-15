
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, apiStatusFailureCode, apiwentWrong,  } from "@/app/pro_utils/stringConstants";
import { calculateNumDays, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try{
      const { fields, files } = await parseForm(request);

      const totalLeaveDays = await calculateNumDays(new Date(fields.from_date), new Date(fields.to_date));
      console.log("total days leave", totalLeaveDays);
      
    const fdata = {
      client_id: fields.client_id[0],
      branchID: fields.branch_id[0],
      customerID: fields.customer_id[0],
      leaveType: fields.leave_type[0],
        fromDate: fields.from_date[0],
        toDate: fields.to_date[0],
        remark: fields.leave_remark[0],
        duration:fields.duration[0],
    }
    
    const { data,error } = await supabase.from('leap_customer_apply_leave').insert([
        {   
          client_id:fdata.client_id,
            branch_id:fdata.branchID,
          customer_id: fdata.customerID,
            leave_type:fdata.leaveType,
            from_date:fdata.fromDate || null,
            to_date: fdata.toDate || null,
            total_days: totalLeaveDays,
            leave_status: "2",
            isAssigned: "TRUE",
            // approved_by_id: ,
            leave_reason: fdata.remark || null,
            duration: fdata.duration || null,
            // leave_name: fdata.leaveType || null,
            created_at:new Date(),
        }
    ]).select();
    
    if(error){
      return NextResponse.json({status:0, message: apiwentWrong ,error:error}, { status: apiStatusFailureCode });
    }
        return NextResponse.json({status:1, message: clientAssetSuccess ,data:data}, { status: apiStatusSuccessCode });
      
}catch(error){
    console.log(error);
    return funSendApiException(error);
}
}