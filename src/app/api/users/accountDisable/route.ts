import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    try {
        const { client_id, customer_id } = await request.json();

        const { data, error } = await supabase
            .from("leap_customer" )
            .update({employment_status: "false"})
            .eq("client_id", client_id)
            .eq("customer_id", customer_id);

        if (error) {
              return funSendApiErrorMessage(error, "Account Disable Issue");
            }

        return NextResponse.json(
            {
                message: `Employee account is disabled`, status: 1,
                data: data
            },
            { status: apiStatusSuccessCode }
        );

    } catch (error) {
        return funSendApiException(error);
    }
}