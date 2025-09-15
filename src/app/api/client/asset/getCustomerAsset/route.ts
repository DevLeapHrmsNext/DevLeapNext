import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { allAssetData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        const {client_id, customer_id } = await request.json();
        
          let query = supabase
          .from("leap_customer_asset")
          .select(`id, date_given, asset_id, date_of_return, is_active, remark, asset_pic ,leap_asset( asset_name, asset_type, device_code, asset_status, configuration,
            leap_asset_type( asset_type))`)
          .eq('client_id', client_id)
          .order('date_given', {ascending: false})
          
          if(customer_id){
            query = query.eq("customer_id", customer_id);
        }
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