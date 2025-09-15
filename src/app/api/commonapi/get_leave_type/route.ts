import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { allAssetData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        const formData = await request.formData();
        const fdata = {
            clientId: formData.get('client_id'),
           
        }
        
          let query = supabase
          .from("leap_client_leave")
          .select(`leave_name`)
          .eq('client_id', fdata.clientId)

          const {data:leaveData,error:leaveError} = await query;
          if(leaveError){
            return NextResponse.json({status:0, message: apiwentWrong ,error:leaveError}, { status: apiStatusFailureCode });

          }
           if(leaveData){
            return NextResponse.json({status:1, message: allAssetData ,assetList:leaveData}, { status: apiStatusSuccessCode });
          }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}