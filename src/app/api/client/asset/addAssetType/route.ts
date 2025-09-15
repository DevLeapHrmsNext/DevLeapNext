
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess,  } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try{
      const formData = await request.formData();

    const fdata = {
      assetType: formData.get("asset_type"),
      clientID: formData.get("client_id")
    }
    
    const { data,error } = await supabase.from('leap_asset_type').insert([
        {   
           asset_type:fdata.assetType || null,
           client_id: fdata.clientID || null,
            created_at:new Date(),

        }
    ]).select();
    
    if(error){
        return funSendApiErrorMessage(error,"Asset Insert Issue");
      }
        return NextResponse.json({status:1, message: clientAssetSuccess ,data:data}, { status: apiStatusSuccessCode });
      
}catch(error){
    console.log(error);
    
    return funSendApiException(error);
    
}
}