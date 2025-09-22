// this API is used to get support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import supabase from "@/app/api/supabaseConfig/supabase";

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || ""); // Default: 1
        const pageSize = parseInt(searchParams.get("limit") || ""); // Default: 20 per page

        const { client_id, customer_id, branch_id, type_id, priority_level, active_status, raised_on, id,
            end_date, start_date
        } = await request.json();

        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;

        let query = supabase.from('leap_client_employee_requests')
            .select('*, leap_request_master(*), leap_request_priority(priority_name), leap_customer(name), leap_request_status(status),leap_client_employee_requests_updates(*,leap_customer(name),leap_request_status(status))')
            .order('updated_at', { ascending: false });

        if (client_id && (client_id != "0")) {
            query = query.eq('client_id', client_id)
        }
        if (branch_id && (branch_id != "0")) {
            query = query.eq('branch_id', branch_id)
        }
        if (customer_id && (customer_id != "0")) {
            query = query.eq('customer_id', customer_id)
        }
        if (type_id && (type_id != "0")) {
            query = query.eq('type_id', type_id) 
        } 
        if (active_status && (active_status != "0")) {
            query = query.eq('active_status', active_status)
        }
        if (priority_level && (priority_level != "0")) {
            query = query.eq('priority_level', priority_level)
        }
        if (id && (id != "0")) {
            query = query.eq('id', id)
        }
        if (funISDataKeyPresent(start_date) && funISDataKeyPresent(end_date)!) {
            query = query.gte('raised_on', start_date).lte('raised_on', start_date);
        }
        if (funISDataKeyPresent(start_date && funISDataKeyPresent(end_date))) {
            query = query.lte('raised_on', end_date).gte('raised_on', start_date);
        }
        if (funISDataKeyPresent(raised_on)) {
            query = query.eq('raised_on', raised_on)
        }
        if (start || end) {
            query = query.range(start, end);
        }
        const { data: supportData, error: supportError } = await query;
        if (supportError) {
            return funSendApiErrorMessage(supportError, "Failed to add task");
        } else if (supportData.length == 0 && (start_date || end_date)) {
            if (page == 1) {
                return NextResponse.json({ message: "start date present ifcondition", status: 1, page: page, leavedata: [] }, { status: apiStatusSuccessCode });
            } else {
                return NextResponse.json({ message: "Support support data", status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
            }
        }
        else if (supportData.length == 0 && !start_date && page) {
            return NextResponse.json({ message: "Support support data", status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
        }
        else if (supportData.length == 0 && !active_status && page) {
            return NextResponse.json({ message: "Support support data", status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
        }
        else if (supportData.length == 0 && !priority_level && page) {
            return NextResponse.json({ message: "Support support data", status: 0, page: page - 1 }, { status: apiStatusSuccessCode });
        }
        else {
            return NextResponse.json({ status: 1, message: "All Support Request", data: supportData }, { status: apiStatusSuccessCode })
        }
    } catch (error) {
        return funSendApiException(error);
    }
}