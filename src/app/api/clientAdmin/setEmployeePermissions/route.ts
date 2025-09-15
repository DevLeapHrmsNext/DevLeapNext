
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, shrotcutsUpdated, } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try {
        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            customer_id: formData.get('customer_id'),
            permission_list: formData.get('permission_list') as string,
        };
        let query = supabase
            .from('leap_client_employee_permissions')
            .select('permission_id,is_allowed')
            .eq("customer_id", fdata.customer_id);

        const { data: allPermissions, error: getPermissionsError } = await query;
        if (getPermissionsError) {
            return funSendApiErrorMessage(getPermissionsError, "Permissions not fetched")
        }
        const permissions = JSON.parse(fdata.permission_list);
        let hasError=0;
        console.log("permissions requested body===================",permissions);
        
        if(allPermissions.length==0){
            console.log("all permissions Fetched=====if conidition=================",allPermissions);

        for (let i = 0; i < permissions.length; i++) {
           const{ error: errorInsert }=await  supabase
                .from('leap_client_employee_permissions')
                .insert({
                    client_id: fdata.client_id,
                    customer_id: fdata.customer_id,
                    permission_id: permissions[i].emp_permission_id,
                    is_allowed: permissions[i].isAllowed,
                    created_at: new Date(),
                });
                if(errorInsert){
                    console.log("permissions update=====else conidition=================",errorInsert);

                    hasError=hasError+1;
                }
        }}
        else{
            for (let i = 0; i < permissions.length; i++) {
                const{ error: errorUpdate }=await  supabase
                     .from('leap_client_employee_permissions')
                     .update({
                         is_allowed: permissions[i].isAllowed,
                         
                     }).eq("customer_id",fdata.customer_id).eq("permission_id",permissions[i].emp_permission_id);
                     if(errorUpdate){
                        console.log("permissions update=====else conidition=================",errorUpdate);

                        hasError=hasError+1;
                     }
                    }
                    
        }

        return NextResponse.json({ message: hasError>0?"Permissions set with some issues":"All Permisions set", status: 1 }, { status: apiStatusSuccessCode });

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }
}
