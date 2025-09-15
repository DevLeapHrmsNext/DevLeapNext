
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, apiStatusFailureCode, apiwentWrong,  } from "@/app/pro_utils/stringConstants";
import { calculateNumDays, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try{
        const formData = await request.formData();

    const fdata = {
        client_id:formData.get('client_id'),
        branch_id:formData.get('branch_id'),
    }
    
    const { data:allData, error:earningsError } = await supabase.from("leap_client_salary_components")
            .select("*,leap_salary_components(id,salary_component_name,salary_add,is_other_component_client_id),leap_salary_payable_days(id,payable_time)")
            .eq("client_id", fdata.client_id).eq("branch_id",fdata.branch_id).eq('is_deleted',false);
    
    if(earningsError){
      console.log("this is the earningsError=======================",earningsError);
        
      return funSendApiErrorMessage("","Failed to fetch components");
    }else{
        let earningsData:any[]=[],deductionsData:any[]=[];
        for(let i=0;i<allData.length;i++){
            if(allData[i].leap_salary_components.salary_add){
                earningsData.push(allData[i]);
            }else{
                deductionsData.push(allData[i])
            }
        }
        return NextResponse.json({status:1, message: clientAssetSuccess ,data:{earningComponents:earningsData,deductionComponents:deductionsData}}, { status: apiStatusSuccessCode });
    }
}catch(error){
    console.log(error);
    return funSendApiException(error);
}
}