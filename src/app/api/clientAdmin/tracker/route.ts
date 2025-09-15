import { createClient } from "@supabase/supabase-js";
import supabase from "../../supabaseConfig/supabase";
import { allAssetData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

export async function POST(request: NextRequest) {

  try {

    const formData = await request.formData();
    const fdata = {
      date: formData.get('date'),
      attendance_id: formData.get('attendance_id'),

    };
    
    const dateObject = moment("2025-02-26", "DD/MM/YYYY").toDate();
    const formattedDate = formatDateYYYYMMDD(dateObject);


    let query = supabase.from("leap_customer_attendance")
      .select('*,leap_working_type(*),leap_customer_attendance_geolocation(*)')
      .eq('date', fdata.date).eq('attendance_id', fdata.attendance_id)


    const { data: totalemployeeData, error: error } = await query;
    if (error) {
      console.log(error);

      return funSendApiErrorMessage("Failed to get data", error)
    }


    else {
      return NextResponse.json({
        message: "Attendance Data",
        status: 1,
        data: totalemployeeData,

      }, { status: apiStatusSuccessCode });
    }
  } catch (error) {
    return funSendApiException(error);
  }
}


