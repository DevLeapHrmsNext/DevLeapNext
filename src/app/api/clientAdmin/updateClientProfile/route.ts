import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const { fields, files } = await parseForm(request);
    const fdata = {
      client_id: fields.client_id[0],
      company_name: fields.company_name[0],
      company_website_url: fields.company_website_url[0],
      company_email: fields.company_email[0],
      company_number: fields.company_number[0],
      company_location: fields.company_location[0],
      sector_type: fields.sector_type[0],
      
    };
    if (!fdata.client_id) {
      return NextResponse.json({ error: "Company ID needed" },{ status: apiStatusInvalidDataCode }
      );
    }
    const { data, error } = await supabase
      .from('leap_client')
      .update({
        company_name: fdata.company_name || null,
        company_website_url: fdata.company_website_url || null,
        company_email: fdata.company_email || null,
        company_number: fdata.company_number || null,
        company_location: fdata.company_location || null,
        sector_type: fdata.sector_type || null,
        
        updated_at: new Date(),  
      })
      .eq('client_id', fdata.client_id[0])
      .select();
    
    if (error) {
      return funSendApiErrorMessage(error, "Company Update Issue");
    }
    if (data) {
      return NextResponse.json({ message: companyUpdatedData, data: data ,status:1 }, { status: apiStatusSuccessCode });
    }else 
    return NextResponse.json({ message: companyUpdateFailed, status:0 }, { status: apiStatusFailureCode });
    
  } catch (error) {
    return funSendApiException(error);
  }
}
