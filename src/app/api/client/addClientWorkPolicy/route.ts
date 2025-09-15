import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{

        const formData = await request.formData();
        const fdata = {
            clientId:formData.get('client_id') as string,
            fullWorkHours: formData.get('fullday_working_hours') as string,
            halfWorkHours: formData.get('halfday_working_hours') as string,
            weekEndDays: formData.get('total_weekend_days') as string,
            
          }
        
          const { data,error } = await supabase.from('leap_client').update(
            { fullday_working_hours: fdata.fullWorkHours,
              halfday_working_hours: fdata.halfWorkHours,
              total_weekend_days:fdata.weekEndDays
            }).eq('client_id',fdata.clientId ).select();
            
          if(error){
            return funSendApiErrorMessage(error, "Client data fetch error");
          }else{
            return NextResponse.json({ message: clientAddedSuccess ,data:data}, { status: apiStatusSuccessCode });
          }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}