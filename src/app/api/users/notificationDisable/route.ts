import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        // const { data: user, error: userError } = await supabase.auth.getUser();
    
    
        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const { client_id, customer_id, status } = await request.json();
    
          let query = supabase
          .from("leap_customer")
          .update({ notification_enabled: status })
          .eq('client_id',client_id) 
          .eq('customer_id',customer_id)
          .select("customer_id, name, notification_enabled");
        
          const {data,error}=await query;
          
          if(error){
            return NextResponse.json({ message: apiwentWrong ,error:error}, 
                  { status: apiStatusFailureCode });

          }else{
            return NextResponse.json({ message: "Notification status updated successfully" ,status:1, data:data}, 
              { status: apiStatusSuccessCode });
          }
           

  
    }catch(error){
        return funSendApiException(error);
        
    }
}