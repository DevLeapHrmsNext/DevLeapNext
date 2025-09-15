import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {

    try {

        let query = supabase.from('leap_request_master')
            .select('*');
          const { data, error } = await query;
        if (error) {
            return funSendApiErrorMessage(error, "Failed to fetch support request types");
        }
        return NextResponse.json({ status: 1, message: "Support Request Types fetched successfully", data: data }, { status: apiStatusSuccessCode });   
           

    }
    catch (error) {
        return funSendApiException(error);
    }}