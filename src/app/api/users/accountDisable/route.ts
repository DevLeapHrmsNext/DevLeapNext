import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    try {
        const { client_id, customer_id } = await request.json();

        const { data, error } = await supabase
            .from("leap_customer")
            .select("customer_id, name, employment_status")
            .eq("client_id", client_id)
            .eq("customer_id", customer_id)
            .single();

        if (error) {
            if (error.code === "PGRST116" || error.message.includes("No rows")) {
                return NextResponse.json({ message: "No such employee", status: 0 },
                    { status: apiStatusFailureCode }
                );
            }

            return NextResponse.json({ message: apiwentWrong, error }, { status: apiStatusFailureCode });
        }

        const employmentStatus = data.employment_status ? "active" : "inactive";

        return NextResponse.json(
            {
                message: `Employee is ${employmentStatus}`, status: 1,
                data: data
            },
            { status: apiStatusSuccessCode }
        );

    } catch (error) {
        return funSendApiException(error);
    }
}