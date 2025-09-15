import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getLastDateOfYear } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetClientHolidayList } from "@/app/pro_utils/constantFunGetData";


export async function POST(request: NextRequest) {

    try {
        // const { data: user, error: userError } = await supabase.auth.getUser();

        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const formData = await request.formData();
        const fdata = {
            client_id:formData.get('client_id'),
            branch_id:formData.get('branch_id'),
            holiday_name:formData.get('holiday_name'),
            holiday_date:formData.get('date'),
            holiday_type_id:formData.get('holiday_type_id'),

        };
        
        let query = supabase.from("leap_holiday_list")
            .insert({
                client_id:fdata.client_id,
                branch_id:fdata.branch_id,
                holiday_name:fdata.holiday_name,
                date:fdata.holiday_date,
                holiday_type_id:fdata.holiday_type_id,
                created_at: new Date(),
            });
            
        
        const { error: upcomingError } = await query;
        if (upcomingError) {
            return funSendApiErrorMessage("Failed to add holiday",upcomingError);
        }
        return NextResponse.json({ status: 1, message: "Holiday Added", },
            { status: apiStatusSuccessCode });

    } catch (error) {

        console.log("holiday add exception-------",error);
        
        return funSendApiException(error);

    }

}

