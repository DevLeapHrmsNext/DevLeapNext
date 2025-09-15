
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, leaveUpdateSuccess,  } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
    try{
      const { fields, files } = await parseForm(request);

    const fdata = {
      client_id: fields.client_id[0],
      branchID: fields.branch_id[0],
      leaveType: fields.leave_name[0],
      categoryID: fields.category[0],
      dayCount: fields.count[0],
      leaveAccrual: fields.accrual[0],
      gender:fields.gender[0],
      applicableRole: fields.applicable[0],
      leaveDesc: fields.leave_discription[0],
      ifUnused: fields.if_unused[0],
      validity: fields.valid_period[0],
      leaveID: fields.leave_id[0]

    }
    console.log("-----------leave ID_------------------",fdata.leaveID);
    
    if (!fdata.leaveID) {
        return NextResponse.json({ error: "Leave ID needed" },{ status: apiStatusInvalidDataCode }
        );
      }
    const { data,error } = await supabase.from('leap_client_leave').update([
        {   
          client_id:fdata.client_id,
          branch_id:fdata.branchID,
            leave_name: fdata.leaveType || null,
            leave_category: fdata.categoryID || null,
            leave_count: fdata.dayCount || null,
            leave_accrual: fdata.leaveAccrual || null,
            gender: fdata.gender || null,
            user_role_applicable: fdata.applicableRole || null,
            leave_discription: fdata.leaveDesc || null,
            if_unused: fdata.ifUnused || null,
            validPeriod: fdata.validity || null,
            
            created_at:new Date(),
        }
    ])
    .eq('leave_id',fdata.leaveID)
    .select();
    
    if(error){
      console.log(error);
      
        return funSendApiErrorMessage(error,"Leave Type Update Issue");
      }
        return NextResponse.json({status:1, message: leaveUpdateSuccess ,data:data}, { status: apiStatusSuccessCode });
      
}catch(error){
    console.log(error);
    return funSendApiException(error);
}
}
