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
            list_name:formData.get('list_name'),
            description:formData.get('description'),
            from_date:formData.get('from_date'),
            to_date:formData.get('to_date'),

        };
        
        let query = supabase.from("leap_holiday_year")
            .insert({
                client_id:fdata.client_id,
                list_name:fdata.list_name,
                description:fdata.description,
                from_date:fdata.from_date,
                to_date:fdata.to_date,
                created_at: new Date(),
            });
            
        
        const { error: upcomingError } = await query;
        if (upcomingError) {
            return funSendApiErrorMessage("Failed to add holiday",upcomingError);
        }
        return NextResponse.json({ status: 1, message: "Holiday Year Added", },
            { status: apiStatusSuccessCode });

    } catch (error) {

        console.log("holiday year exception-------",error);
        
        return funSendApiException(error);

    }

}

