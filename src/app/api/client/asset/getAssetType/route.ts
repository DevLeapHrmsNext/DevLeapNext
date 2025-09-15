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
          .from("leap_asset_type")
          .select(`*`)
          .eq('client_id', fdata.clientId)
          .eq('is_deleted', false)
          .order('created_at', {ascending: false})
          
          const {data:assetData,error:assetError} = await query;
          if(assetError){
            return NextResponse.json({status:0, message: apiwentWrong ,error:assetError}, { status: apiStatusFailureCode });
          }
           if(assetData){
            return NextResponse.json({status:1, message: allAssetData ,assetList:assetData}, { status: apiStatusSuccessCode });
          }

    }catch(error){
        return funSendApiException(error);
    }
}