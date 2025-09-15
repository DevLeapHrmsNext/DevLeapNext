// this API is used to get support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import supabase from "@/app/api/supabaseConfig/supabase";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            customer_id: formData.get('customer_id'),
            branch_id: formData.get('branch_id'),
            type_id: formData.get('type_id'),
            description: formData.get('description'),
            priority_level: formData.get('priority_level'),
            active_status: formData.get('active_status'),
            raised_on: formData.get('raised_on'),

        }
        let query = supabase.from('leap_client_employee_requests')
            .select('*, leap_request_master(*), leap_request_priority(priority_name), leap_customer(name), leap_request_status(status)')
            .order('updated_at', {ascending:false});
            
        if (funISDataKeyPresent(formData.get('client_id'))) {
            query = query.eq('client_id', formData.get('client_id'))
        }
        if (funISDataKeyPresent(formData.get('branch_id'))) {
            query = query.eq('branch_id', formData.get('branch_id'))
        }
        if (funISDataKeyPresent(formData.get('customer_id'))) {
            query = query.eq('customer_id', formData.get('customer_id'))
        }
        if (funISDataKeyPresent(formData.get('type_id'))) {
            query = query.eq('type_id', formData.get('type_id'))
        }
        if (funISDataKeyPresent(formData.get('active_status'))) {
            query = query.eq('active_status', formData.get('active_status'))
        }
        if (funISDataKeyPresent(formData.get('priority_level'))) {
            query = query.eq('priority_level', formData.get('priority_level'))
        }
        if (funISDataKeyPresent(formData.get('id')))  {
            query = query.eq('id', formData.get('id'))
        }
       
        if(funISDataKeyPresent(formData.get('start_date')) && funISDataKeyPresent(formData.get('end_date'))){
            query=query.lte('raised_on',formData.get('end_date')).gte('raised_on',formData.get('start_date'));
        }
        
        const { data: supportData, error: supportError } = await query;
        if (supportError) {
            return funSendApiErrorMessage(supportError, "Failed to add task");
        }
        return NextResponse.json({ status: 1, message: "All Support Request", data: supportData }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}