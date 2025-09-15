import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const { fields, files } = await parseForm(request);
    const fdata = {
      client_id: fields.client_id[0],
      id: fields.id[0],
      branch_address: fields.branch_address[0],
      branch_city: fields.branch_city[0],
      contact_details: fields.contact_details[0],
      branch_email: fields.branch_email[0],
      branch_number: fields.branch_number[0],
      time_zone_id: fields.time_zone_id[0],
      is_main_branch: fields.is_main_branch[0],
      is_active: fields.is_active[0]
    };
    if (!fdata.id) {
      return NextResponse.json({ error: "Company ID needed" },{ status: apiStatusInvalidDataCode }
      );
    }
    const { data, error } = await supabase
      .from('leap_client_branch_details')
      .update({
        client_id: fdata.client_id || null,
        branch_address: fdata.branch_address || null,
        branch_city: fdata.branch_city || null,
        contact_details: fdata.contact_details || null,
        branch_email: fdata.branch_email || null,
        branch_number: fdata.branch_number || null,
        time_zone_id: fdata.time_zone_id || 0,
        is_main_branch: fdata.is_main_branch || null,
        is_active: fdata.is_active || null,
        updated_at: new Date(),  
      })
      .eq('id', fdata.id[0])
      .select();
    
    if (error) {
      return funSendApiErrorMessage(error, "Company Update Issue");
    }
    if (data) {
      return NextResponse.json({ message: companyUpdatedData, data: data }, { status: apiStatusSuccessCode });
    }else 
    return NextResponse.json({ message: companyUpdateFailed }, { status: apiStatusFailureCode });
    
  } catch (error) {
    return funSendApiException(error);
  }
}
