
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, shrotcutsUpdated, } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";


export async function POST(request: NextRequest) {

    try {
        const formData = await request.formData();
        const fdata = {
            client_id: formData.get('client_id'),
            branch_id: formData.get('branch_id'),
            id: formData.get('id'),
            full_day: formData.get('full_day'),
            half_day: formData.get('half_day'),
            lunch_time: formData.get('lunch_time'),
            holiday_per_week: formData.get('holiday_per_week'),
            isInsert: formData.get('is_insert'),
           
        };
        let query ;
        if(fdata.isInsert=="true"){
             query = supabase
            .from('leap_client_working_hour_policy')
            .insert({
                client_id:fdata.client_id,
                branch_id:fdata.branch_id,
                full_day:fdata.full_day,
                half_day:fdata.half_day,
                lunch_time:fdata.lunch_time,
                holiday_per_week:fdata.holiday_per_week,
            });
            
        }else{
             query = supabase
            .from('leap_client_working_hour_policy')
            .update({
                full_day:fdata.full_day,
                half_day:fdata.half_day,
                lunch_time:fdata.lunch_time,
                holiday_per_week:fdata.holiday_per_week,
            })
            .eq("id", fdata.id);
        }
        

        const {error: getPermissionsError } = await query;
        if (getPermissionsError) {
            return funSendApiErrorMessage(getPermissionsError, "Permissions not fetched")
        }else{
            return NextResponse.json({ message:"Working hour for branch updated successfully", status: 1 }, { status: apiStatusSuccessCode });
        }
        


    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }
}
