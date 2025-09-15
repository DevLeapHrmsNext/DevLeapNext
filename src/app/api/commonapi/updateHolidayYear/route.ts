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
            holiday_id: formData.get('holiday_id'),
            holiday_name:formData.get('list_name'),
            from_date:formData.get('from_date'),
            to_date:formData.get('to_date'),
            show_employee:formData.get('show_employee'),

        };
        if(fdata.show_employee && fdata.show_employee=="true"){
            const { error: resetError } = await supabase
                .from("leap_holiday_year")
                .update({ show_employee: false })
                .eq("client_id", fdata.client_id)
                .neq("id", fdata.holiday_id);
                if (resetError) {
                    return funSendApiErrorMessage("Failed to reset other holidays", resetError);
                }
            }
        let query = supabase.from("leap_holiday_year")
            .update({
                list_name:fdata.holiday_name,
                from_date:fdata.from_date,
                to_date:fdata.to_date,
                show_employee: fdata.show_employee,
            }).eq("id", fdata.holiday_id);
            
        
        const { error: upcomingError } = await query;
        if (upcomingError) {
            return funSendApiErrorMessage("Failed to add holiday",upcomingError);
        }
        return NextResponse.json({ status: 1, message: "Holiday year updated successfully", },
            { status: apiStatusSuccessCode });

    } catch (error) {

        console.log("holiday add exception-------",error);
        
        return funSendApiException(error);

    }

}

