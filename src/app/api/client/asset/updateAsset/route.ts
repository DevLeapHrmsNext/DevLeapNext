import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, assetUpdatedSuccess, assetUpdateFailed } from "@/app/pro_utils/stringConstants";
import { calculateNumDays, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const { fields, files } = await parseForm(request);

//    console.log(fileUploadResponse.documentURL);

    const fdata = {
      client_id: fields.client_id[0],
      branch_id: fields.branch_id[0],
      asset_id:fields.asset_id[0],
      purchased_at:fields.purchased_at[0],
      asset_type:fields.asset_type[0],
      asset_name: fields.asset_name[0],
      asset_status: fields.asset_status[0],
      device_code: fields.device_code[0],
        configuration: fields.configuration[0],
        warranty_date: fields.warranty_date[0],
        remark: fields.remark[0]
    };
// check asset id
    if (!fdata.asset_id) {
      return NextResponse.json({status:0, message: "Asset ID is required" },{ status: apiStatusSuccessCode }
      );
    }

    const { data: currentAsset, error: assetFetchError } = await supabase
    .from('leap_asset')
    .select('asset_status')
    .eq('asset_id', fdata.asset_id)
    .single();

  if (assetFetchError) {
    //return funSendApiErrorMessage(assetFetchError, "Asset Fetch Issue");
   return NextResponse.json({status:0, message: "Asset ID is required"}, { status: apiStatusSuccessCode });
  }

  const currentStatus = currentAsset.asset_status;

    const { data, error } = await supabase
      .from('leap_asset')
      .update({
        client_id:fdata.client_id,
        branch_id:fdata.branch_id,
        asset_id:fdata.asset_id,
        purchased_at: fdata.purchased_at || null,
        asset_type: fdata.asset_type || null,
        asset_name: fdata.asset_name || null,
        asset_status: fdata.asset_status || null,
        device_code: fdata.device_code || null,
        configuration: fdata.configuration || null,
        warranty_date: fdata.warranty_date || null,
        remark: fdata.remark || null,
        updated_at: new Date(),
      })
      .eq('asset_id', fdata.asset_id)
      .select();

    if (error) {
      return funSendApiErrorMessage(error, "Asset Update Issue");
    }
// only when asset status is changed form assigned to something else, then in leap_customer_asset table calculate assigned duration and insert date_of_return
if (currentStatus === "2" && fdata.asset_status !== "2") {
      const { data: customerAsset, error: fetchError } = await supabase
        .from('leap_customer_asset')
        .select('date_given,date_of_return')
        .eq('asset_id', fdata.asset_id)
        .order('date_given', { ascending: false }) 
        .single();

      if (!fetchError && customerAsset) {
        const allotmentDate = customerAsset.date_given;
        const returnDate = new Date();
        const assignedDuration = calculateNumDays(allotmentDate,returnDate);

        await supabase
          .from('leap_customer_asset')
          .update({
            date_of_return: new Date(),
            assigned_duration: assignedDuration,
          })
          .eq('asset_id', fdata.asset_id);
      }
    }

    return NextResponse.json({status:1, message: assetUpdatedSuccess ,data:data}, { status: apiStatusSuccessCode });

  
  } catch (error) {
    return funSendApiException(error);
  }
}