import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusFailureCode, companyUpdatedData, companyUpdateFailed } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    try {
        const { id, status } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Attendance ID needed" }, { status: apiStatusInvalidDataCode }
            );
        }

        const { data, error } = await supabase
            .from('leap_customer_attendance')
            .update({
                approval_status: status,
            })
            .eq('attendance_id', id)
            .select("*");

        if (error) {
            return funSendApiErrorMessage(error, "Attendance Update Issue");
        }

        // if (error) {
        //     // console.log(error);
        //     return funSendApiErrorMessage("Update Activity", "Customer Attendance Activity Insert Issue");
        // }
        // let query = supabase
        //     .from('leap_client_useractivites')
        //     .update({activity_status:status})
        //     .eq("activity_related_id",attendance_id);
        //     // .eq("approval_status", 1);
        // const { data:activity, error:activityError } = await query;
        // if (activityError) {
        //   console.log(activityError);
        //   return funSendApiErrorMessage(activityError, "Customer Update Attendance activity Issue");
        // }

        if (data) {
            return NextResponse.json({ status: 1, message: "Attendance approved", data: data }, { status: apiStatusSuccessCode });
        } else
            return NextResponse.json({ message: "Failed to update attendance status" }, { status: apiStatusFailureCode });
    } catch (error) {
        console.log(error);

        return funSendApiException(error);
    }
}