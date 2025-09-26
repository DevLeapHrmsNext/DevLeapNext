import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusFailureCode, apiStatusInvalidDataCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { baseUrl } from "@/app/pro_utils/stringRoutes";

export async function POST(request: NextRequest) {
    try {

        const { id, phone_number } = await request.json();
        if (!phone_number || !id) {
            return NextResponse.json({ error: "paramaters needed" }, { status: apiStatusInvalidDataCode }
            );
        }
        let url = "";
        // const base_url = "https://v2.leaphrms.com/"

        if (id === "1") {
            url = baseUrl + "whats-app/add-task?contact_number=" + phone_number;
        } else if (id === "2") { // raise support
            url = baseUrl + "whats-app/raise-support?contact_number=" + phone_number;
        } else if (id === "3") { // upload documents
            url = baseUrl + "whats-app/upload-documents?contact_number=" + phone_number;
        } else if (id === "4") { // apply leave
            url = baseUrl + "whats-app/apply-leave?contact_number=" + phone_number;
        } else {
            return NextResponse.json({ error: "Invalid id" }, { status: apiStatusInvalidDataCode }
            );
        }

        return NextResponse.json({ status: 1, message: "URLs fetched", data: url }, { status: apiStatusFailureCode });
    } catch (error) {
        return funSendApiException(error);
    }
}