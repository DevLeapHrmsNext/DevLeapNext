import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, assetDeletedSuccess, assetDeleteFailed, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function DELETE(request: NextRequest) {
  try {
      const formData = await request.formData();

      const fdata = {
        assetID: formData.get('asset_id') as string
      };

      if (!fdata.assetID) {
        return NextResponse.json({ error: "Asset ID needed" },{ status: apiStatusInvalidDataCode }
        );
      }

    const { error } = await supabase
      .from('leap_asset')
      .update({ 
        is_deleted: true, 
        
      })
      .eq('asset_id', fdata.assetID)
      

    if (error) {
      return funSendApiErrorMessage(error, "Asset Deletion Issue");
    }
    return NextResponse.json(
      { message: assetDeletedSuccess}, 
      { status: apiStatusSuccessCode }
    );
    
  } catch (error) {
    return funSendApiException(error);
  }
}
