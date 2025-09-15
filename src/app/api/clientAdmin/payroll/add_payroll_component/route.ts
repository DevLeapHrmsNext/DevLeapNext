
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, apiStatusFailureCode, apiwentWrong, clientSalaryComponentSuccess,  } from "@/app/pro_utils/stringConstants";
import { calculateNumDays, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try{
        const formData = await request.formData();

    const fdata = {
        client_id:formData.get('client_id'),
        branch_id:formData.get('branch_id'),
        componentID:formData.get('component_ID'),
        payAccuralID:formData.get('pay_accural_id'),
        otherComponentName:formData.get('other_component'),
        enabled:formData.get('enabled'),
        isAddComponent:formData.get('is_add_component'),

    }
    let componentID;
    if(fdata.componentID=="-1" && fdata.otherComponentName){
        const { data:newComponent, error:newAddError } = await supabase.from("leap_salary_components")
        .insert({
            salary_component_name:fdata.otherComponentName,
            salary_add:fdata.isAddComponent,
            created_at:new Date(),
            is_basic_component:false,
            is_other_component_client_id:fdata.client_id
        }).select("id");
        if(newAddError){
            return funSendApiErrorMessage(newAddError,"Failed to add new component")
        }
        componentID=newComponent[0].id;
    }else{
        componentID=fdata.componentID;
    }
    
    
    const {error } = await supabase.from("leap_client_salary_components")
    .insert({
        client_id:fdata.client_id,
        branch_id:fdata.branch_id,
        salary_component_id:componentID,
        is_active:fdata.enabled,
        pay_accural:fdata.payAccuralID,
        created_at:new Date()
    });
    if(error){
        return funSendApiErrorMessage(error,"Failed to add salary component")
    }


        return NextResponse.json({status:1, message: clientSalaryComponentSuccess}, { status: apiStatusSuccessCode });
    
}catch(error){
    console.log(error);
    return funSendApiException(error);
}
}