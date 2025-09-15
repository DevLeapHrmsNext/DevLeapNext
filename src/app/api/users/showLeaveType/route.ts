import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import {  apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import {  funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        

        const {client_id, branch_id, leave_id } = await request.json();
      
        
          let query = supabase
          .from("leap_client_leave")
          .select(`leave_id, leave_name, leave_discription, leave_category, leave_count, leave_accrual, gender, user_role_applicable, if_unused, leap_leave_type_icon_and_color(bg_color, icon_url)`)
          .eq('client_id', client_id)
          .eq('branch_id', branch_id);

          if(leave_id){
            query = query.eq("leave_id", leave_id);
        }
        
          const {data:leaveData,error} = await query;
          
          if(error){
            return funSendApiErrorMessage(error, "Unable to fetch leave type");

          }
           
          return NextResponse.json({ status: 1, message: " All Leaves", data: leaveData }, 
            { status: apiStatusSuccessCode });

  
    }catch(error){
        return funSendApiException(error);
    }
}