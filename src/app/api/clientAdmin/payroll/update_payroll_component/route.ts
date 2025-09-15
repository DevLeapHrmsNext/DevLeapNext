
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, apiStatusFailureCode, apiwentWrong, clientSalaryComponentSuccess, clientSalaryUpdateComponentSuccess,  } from "@/app/pro_utils/stringConstants";
import { calculateNumDays, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try{
        const formData = await request.formData();

    const fdata = {
        client_id:formData.get('client_id'),
        branch_id:formData.get('branch_id'),
        main_component_id:formData.get('main_component_id'),
        payAccuralID:formData.get('pay_accural_id'),
        otherComponentName:formData.get('other_component'),
        isEarningComponent:formData.get('is_add_component'),
        enabled:formData.get('enabled'),
        clientComponentID:formData.get('client_component_id'),
        otherComponentByClient:formData.get('is_other_component_client_id'),
    }
    let componentID;
    console.log();
    
    if(fdata.otherComponentByClient=="true"){
        const { data:newComponent, error:newAddError } = await supabase.from("leap_salary_components")
        .update({
            salary_component_name:fdata.otherComponentName,
            salary_add:fdata.isEarningComponent,
            
        }).eq("id",fdata.main_component_id);
        if(newAddError){
            return funSendApiErrorMessage(newAddError,"Failed to update component")
        }
        
    }
    
    
    const {error } = await supabase.from("leap_client_salary_components")
    .update({
        branch_id:fdata.branch_id,
        salary_component_id:fdata.main_component_id,
        is_active:fdata.enabled,
        pay_accural:fdata.payAccuralID,
    }).eq("id",fdata.clientComponentID);
    if(error){
        return funSendApiErrorMessage(error,"Failed update client salary component")
    }


        return NextResponse.json({status:1, message: clientSalaryUpdateComponentSuccess}, { status: apiStatusSuccessCode });
    
}catch(error){
    console.log(error);
    return funSendApiException(error);
}
}