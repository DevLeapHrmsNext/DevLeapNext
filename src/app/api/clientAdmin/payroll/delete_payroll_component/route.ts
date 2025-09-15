import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode,componentDeletedSuccess } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function DELETE(request: NextRequest) {
  try {
      const formData = await request.formData();

      const fdata = {
        table_id: formData.get('id') as string
      };

      if (!fdata.table_id) {
        return NextResponse.json({ error: "Asset ID needed" },{ status: apiStatusInvalidDataCode }
        );
      }

    const { error } = await supabase
      .from('leap_client_salary_components')
      .update({ 
        is_deleted: true,
      })
      .eq('id', fdata.table_id)
      

    if (error) {
      return funSendApiErrorMessage(error, "Component Deletion Issue");
    }
    return NextResponse.json(
      { status:1,message: componentDeletedSuccess}, 
      { status: apiStatusSuccessCode }
    );
    
  } catch (error) {
    return funSendApiException(error);
  }
}
