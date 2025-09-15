
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

  try {
    
    const formData = await request.formData();


    const fdata = {
      client_id: formData.get("client_id"),
      branch_id: formData.get("branch_id"),
      purchased_at: formData.get("purchased_at"),
      warranty_date: formData.get("warranty_date"),
      asset_type: formData.get("asset_type"),
      asset_name: formData.get("asset_name"),
      device_code: formData.get("device_code"),
      condition: formData.get("condition"),
      asset_pic: formData.get("asset_pic") as string,
      remark: formData.get("remark"),
      configuration: formData.get("configuration"),
      vendor_bill: formData.get("vendor_bill"),

    }
    let aseetPictursArray =[]
    if(fdata.asset_pic){
      aseetPictursArray = JSON.parse(fdata.asset_pic);
      console.log(aseetPictursArray);
      
    }

    

    const { data, error } = await supabase.from('leap_asset').insert([
      {
        client_id: fdata.client_id,
        branch_id: fdata.branch_id,
        purchased_at: fdata.purchased_at || null,
        warranty_date: fdata.warranty_date || null,
        asset_type: fdata.asset_type || null,
        asset_name: fdata.asset_name || null,
        asset_pic: aseetPictursArray || [],
        asset_status: "1",
        device_code: fdata.device_code || null,
        condition: fdata.condition || null,
        remark: fdata.remark || null,
        configuration: fdata.configuration || null,
        vendor_bill: fdata.vendor_bill || null,
        created_at: new Date(),

      }
    ]).select();

    if (error) {
      return funSendApiErrorMessage(error, "Asset Insert Issue");
    }

    if (data) {
      return NextResponse.json({ message: clientAssetSuccess, data: data }, { status: apiStatusSuccessCode });
    }

  } catch (error) {
    return funSendApiException(error);
  }
}

