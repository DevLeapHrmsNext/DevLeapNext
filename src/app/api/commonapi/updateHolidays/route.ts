import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getLastDateOfYear } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetClientHolidayList } from "@/app/pro_utils/constantFunGetData";


export async function POST(request: NextRequest) {

    try {
       
        const formData = await request.formData();
        const fdata = {

            client_id: formData.get('client_id'),
            // branch_id: formData.get('branch_id'),
            id:formData.get('id'),
            date:formData.get('date'),
            holiday_name:formData.get('holiday_name'),
            holiday_type_id:formData.get('holiday_type_id'),

        };
        let updatequery = supabase.from("leap_holiday_list")
            .update({
                client_id:fdata.client_id,
                // branch_id:fdata.branch_id,
                id:fdata.id,
                date:fdata.date,
                holiday_name:fdata.holiday_name,
                holiday_type_id:fdata.holiday_type_id,
                updated_at: new Date()
            })
            .eq('id', fdata.id)
            .select();

        const { error } = await updatequery;
        if (error) {
            console.log(error);
            
            return funSendApiErrorMessage("Holiday update failed",error);
        }
        // let query = supabase.from("leap_holiday_list")
        // .select(`*,leap_holiday_types(*)`)
        // .eq('client_id', fdata.client_id);
    // if (fdata.branch_id) {
    //     query = query.eq('branch_id', fdata.branch_id);
    // }
    // query = query.gte('date', formatDateYYYYMMDD(getFirstDateOfYear())) // `to_date` must be >= `fromDate`
    //     .lte('date', formatDateYYYYMMDD(getLastDateOfYear())).order('date', { ascending: true });


    const { data: holidayData, error:holidayListError} = await updatequery;
    if (holidayListError) {
        return funSendApiErrorMessage("Failed to fetch Holidays", holidayListError);
    }
   
    const { data: holidayList, error: holidayError } = await updatequery;
    if (holidayError) {
        return funSendApiErrorMessage("failed to get Upcoming holiday",holidayError);
    }
    return NextResponse.json({ status: 1, message: "All Holiday List", data: {holidays: holidayData } },
        { status: apiStatusSuccessCode });


    } catch (error) {


        return funSendApiException(error);

    }

}

