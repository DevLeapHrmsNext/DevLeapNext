// this API is used to get support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import supabase from "@/app/api/supabaseConfig/supabase";

export async function POST(request: NextRequest) {
    try {
        const {client_id, request_id, customer_id, status,notify_customer_id, comments} = await request.json();
       
        let {data:updateData,error:updateError} = await supabase.from('leap_client_employee_requests')
            .update({"active_status":status}).eq("id",request_id)
        
        if (updateError) {
            return funSendApiErrorMessage(updateError, "Failed to update request");
        }
        let {data:insertRequestUpdate,error:insertRequestError} = await supabase.from('leap_client_employee_requests_updates')
            .insert({
                request_id:request_id,
                customer_id:customer_id,
                status:status,
                comments:comments,
                created_at:new Date(),
            });
        (async () => {
            if(notify_customer_id){
            try{
            const {data: shouldNotify, error} = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id",5);
            if(shouldNotify && shouldNotify.length === 0){
            const formData = new FormData();
            formData.append("customer_id", String(notify_customer_id));
            formData.append("title", "Support Request Updated");
            formData.append("notify_type", "5");// its 4 for leave in leap_push_notification_types table
            formData.append("message", "Your support request has been updated.");
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                method: "POST",
                body: formData
            });
            }
        }catch(err){
            console.log(err);   
        }
        }
        })();
        if (insertRequestError) {
            return funSendApiErrorMessage(insertRequestError, "Failed to add task");
        }
        return NextResponse.json({ status: 1, message: "Support Request Updated" }, { status: apiStatusSuccessCode })
    } catch (error) {
        return funSendApiException(error);
    }
}