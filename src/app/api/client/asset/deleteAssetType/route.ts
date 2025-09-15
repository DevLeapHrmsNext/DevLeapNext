import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, assetDeletedSuccess, assetDeleteFailed, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function DELETE(request: NextRequest) {
  try {
      const formData = await request.formData();

      const fdata = {
        id: formData.get('id') as string
      };

      if (!fdata.id) {
        return NextResponse.json({ error: "Asset ID needed" },{ status: apiStatusInvalidDataCode }
        );
      }
    const {data:hasAsset,error:errAssetAsigned}=await supabase
      .from('leap_asset').select("*", { count: "exact", head: true })
      .eq('asset_type', fdata.id);
    console.log("hasAsset", hasAsset, "errAssetAsigned", errAssetAsigned);
      
    if(!hasAsset){  
    const { error } = await supabase
      .from('leap_asset_type')
      .update({ 
        is_deleted: "TRUE", 
      })
      .eq('id', fdata.id)

    if (error) {
      return funSendApiErrorMessage(error, "Asset Deletion Issue");
    }
    return NextResponse.json(
      {status:1, message: assetDeletedSuccess}, 
      { status: apiStatusSuccessCode }
    );
  }else{
    return NextResponse.json(
      {status:0, message: "Cannot delete type as assets are already assigned under this category type"}, 
      { status: apiStatusSuccessCode }
    );
  }
    
  } catch (error) {
    return funSendApiException(error);
  }
}