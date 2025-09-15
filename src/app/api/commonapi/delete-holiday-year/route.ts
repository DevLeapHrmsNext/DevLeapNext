import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getLastDateOfYear } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetClientHolidayList } from "@/app/pro_utils/constantFunGetData";


export async function DELETE(request: NextRequest) {

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
            is_delete: formData.get('isDelete'),
            pk_id: formData.get('id'),

        };
        
        let query = supabase.from("leap_holiday_year")
            .update({
                is_deleted: fdata.is_delete,
            }).eq("id", fdata.pk_id);
            
        
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

