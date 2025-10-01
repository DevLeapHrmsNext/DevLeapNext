import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    // const { fields, files } = await parseForm(request);
    const formData = await request.formData();

    const fdata = {
      client_id: formData.get('client_id'),
      id: formData.get('id'),
      branch_address: formData.get('branch_address'),
      branch_city: formData.get('branch_city'),
      contact_details: formData.get('contact_details'),
      branch_email: formData.get('branch_email'),
      branch_number: formData.get('branch_number'),
      time_zone_id: formData.get('time_zone_id'),
      is_main_branch: formData.get('is_main_branch'),
      is_active: formData.get('is_active'),
            
    };
    console.log(fdata);
    
    if (!fdata.id) {
      return NextResponse.json({ error: "Company ID needed" },{ status: apiStatusInvalidDataCode }
      );
    }
    const { data, error } = await supabase
      .from('leap_client_branch_details')
      .update({
        branch_address: fdata.branch_address || null,
        branch_city: fdata.branch_city || null,
        contact_details: fdata.contact_details || null,
        branch_email: fdata.branch_email || null,
        branch_number: fdata.branch_number || null,
        // time_zone_id: fdata.time_zone_id!=null ?fdata.time_zone_id: "NULL",
        is_main_branch: fdata.is_main_branch || null,
        is_active: fdata.is_active || null,
        updated_at: new Date(),  
      })
      .eq('id', fdata.id)
      .select();
    
    if (error) {
      console.log(error);
      
      return funSendApiErrorMessage(error, "Company Update Issue");
    }
    if (data && data.length>0) {
      return NextResponse.json({ message: companyUpdatedData, data: data,status:1 }, { status: apiStatusSuccessCode });
    }else {
      return NextResponse.json({ message: companyUpdateFailed,status:0}, { status: apiStatusFailureCode });
    }
    
  } catch (error) {
    return funSendApiException(error);
  }
}
