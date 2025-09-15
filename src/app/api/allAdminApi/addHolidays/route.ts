import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { formatDateYYYYMMDD, funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import moment from "moment";

export async function POST(request: NextRequest) {

  try {

    const formData = await request.formData();
    const fdata = {
      clientId: formData.get('client_id'),
      branchId: formData.get('branch_id'),
      holidayName: formData.get('holiday_name'),
      holidayTypeId: formData.get('holiday_type_id'),
      holidayDate: formData.get('date'),
      holidayYear: formData.get('holiday_year'),
    }
    
    let query = supabase.from("leap_holiday_list")
      .insert({
        holiday_name: fdata.holidayName,
        holiday_type_id: fdata.holidayTypeId,
        date: moment(fdata.holidayDate?.toString() || '', 'YYYY-MM-DD').format('YYYY-MM-DD'), 
        client_id: fdata.clientId, 
        branch_id: fdata.branchId, 
        holiday_year: fdata.holidayYear
      });
    const { error } = await query;
    if (error) {
      return funSendApiErrorMessage(error, "Failed to add holiday");
    }
    else {
      return funDataAddedSuccessMessage("Holiday Added Successfully");
    }

  } catch (error) {
    return funSendApiException(error);
  }
}


