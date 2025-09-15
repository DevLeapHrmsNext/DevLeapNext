import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { formatDateYYYYMMDD, funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fdata = {
      clientId: formData.get('client_id'),
      branchId: formData.get('branch_id'),
      customerID:formData.get('customer_id'),  
    }
    let query = supabase.from("leap_customer_address")
        .insert({
          client_id:fdata.clientId,
          branch_id:fdata.branchId,
          customer_id:fdata.customerID,
          address_line1:formData.get('address_line1') || null,
          address_line2:formData.get('address_line2') || null,
          city:formData.get('city'),
          state:formData.get('state'),
          postal_code:formData.get('postal_code'),
          country:formData.get('country'),
          latitude:formData.get('latitude') || null,
          longitude:formData.get('longitude') || null,
          is_primary:formData.get('is_primary') || false
        });
    const { error } = await query;
    if (error) {
        return funSendApiErrorMessage(error,"Customer address Insert Error");
    }
    else {
        return funDataAddedSuccessMessage("Address Added Successfully"); 
    }
    
  } catch (error) {
    return funSendApiException(error);
  }
}



