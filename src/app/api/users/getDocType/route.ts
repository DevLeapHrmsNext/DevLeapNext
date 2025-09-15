import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {

    try {
        const {} = await request.json();

        let query = supabase.from('leap_document_type')
            .select('id, document_name')
            .eq('document_type_id', 5)
            .eq('is_deleted', false);

        const { data: AttendanceData, error: attendanceError } = await query;
        if (attendanceError) {
            return funSendApiErrorMessage(attendanceError, "Failed to fetch");
        }
        return NextResponse.json({ status: 1, message: "Document type data fetched", data: AttendanceData }, { status: apiStatusSuccessCode })

    } catch (error) {
        return funSendApiException(error);
    }
}