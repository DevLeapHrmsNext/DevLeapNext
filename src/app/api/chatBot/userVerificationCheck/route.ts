import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusFailureCode, apiStatusInvalidDataCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {
    try {

        const { client_id, branch_id, phone_number } = await request.json();
        if (!phone_number) {
            return NextResponse.json({ error: "Phone number needed" }, { status: apiStatusInvalidDataCode }
            );
        }
        const { data, error } = await supabase
            .from('leap_customer')
            .select("name")
            .eq('client_id', client_id)
            .eq('branch_id', branch_id)
            .eq('contact_number', phone_number)

        if (error) {
            return funSendApiErrorMessage(error, "Fetching Issue");
        }
        if (data && data.length > 0) {
            return NextResponse.json({ status: 1, message: "Verified User", data: data }, { status: apiStatusSuccessCode });
        } else
            return NextResponse.json({ status: 0, message: "New User" }, { status: apiStatusFailureCode });
    } catch (error) {
        return funSendApiException(error);
    }
}
