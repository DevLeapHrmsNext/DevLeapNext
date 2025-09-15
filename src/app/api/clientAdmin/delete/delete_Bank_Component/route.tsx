import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, assetDeletedSuccess, assetDeleteFailed, apifailedWithException, DepartmentDeletedSuccess } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function DELETE(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fdata = {
      id: formData.get('id'),
    };

    if (!fdata.id) {
      return NextResponse.json({ error: "Component ID needed" }, { status: apiStatusInvalidDataCode }
      );
    }
    
    
    let query = supabase
        .from('leap_client_bank_details_components')
        .update({
          is_active: false,
        })
        .eq('id', fdata.id)
      
    const { error } = await query;

    if (error) {
      return funSendApiErrorMessage(error, "Department Deletion Issue");
    }
    return NextResponse.json(
      { status: 1, message: DepartmentDeletedSuccess },
      { status: apiStatusSuccessCode }
    );

  } catch (error) {
    return funSendApiException(error);
  }
}