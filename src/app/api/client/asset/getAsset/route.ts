import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { allAssetData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        const formData = await request.formData();
        const fdata = {
            clientId: formData.get('client_id'),
            showDeleted:formData.get('showDeleted'),
            typeID: formData.get('asset_type'),
            assetID: formData.get('asset_id') as string,
            customerID: formData.get('customer_id')
        }
        
          let query = supabase
          .from("leap_asset")
          .select(`*,leap_asset_type(asset_type),leap_asset_status(*),leap_customer_asset(customer_id,leap_customer(name), date_given), leap_asset_condition(*)`)
          .eq('client_id', fdata.clientId)
          .order('updated_at', {ascending: false})
          
          if(fdata.assetID){
            query = query.eq("asset_id", fdata.assetID);
        }

        if(fdata.showDeleted && fdata.showDeleted=="true"){
            query=query.eq("is_deleted",fdata.showDeleted);
          }else{
            query=query.eq("is_deleted",false);
          }
          if (fdata.typeID && fdata.typeID!='0') {
            query = query.eq("asset_type", fdata.typeID);
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