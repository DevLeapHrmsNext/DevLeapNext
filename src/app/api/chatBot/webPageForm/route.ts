import { NextRequest, NextResponse } from "next/server";
import { funSendApiException } from "@/app/pro_utils/constant";
import { apiStatusFailureCode, apiStatusInvalidDataCode, apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { baseUrl } from "@/app/pro_utils/stringRoutes";

export async function POST(request: NextRequest) {
    try {

        const { id, phone_number } = await request.json();
        if (!phone_number || !id) {
        return NextResponse.json({data:{status: 0, message: "Paramaters not passed correctly!" }}, { status: apiStatusFailureCode }
            );
        }
        let url = "";
        // const base_url = "https://v2.leaphrms.com"

        if (id === "1") {
            url = baseUrl + "whats-app/add-task?contact_number=" + phone_number + "&ts=1696000000";
        } else if (id === "2") { // raise support
            url = baseUrl + "whats-app/raise-support?contact_number=" + phone_number + "&ts=1696000000";
        } else if (id === "3") { // upload documents
            url = baseUrl + "whats-app/upload-documents?contact_number=" + phone_number + "&ts=1696000000";
        } else if (id === "4") { // apply leave
            url = baseUrl + "whats-app/apply-leave?contact_number=" + phone_number + "&ts=1696000000";
        } else {
            return NextResponse.json({data:{status: 0, message: "Invalid Type Id. Please choose between 1 to 4." }}, { status: apiStatusFailureCode }
            );
        }

        return NextResponse.json({data:{ status: 1, message: "URLs fetched", URL: url }}, { status: apiStatusSuccessCode });
    } catch (error) {
        return funSendApiException(error);
    }
}