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
        const formData = await request.formData();
    
        
          let query = supabase
          .from("leap_customer")
          .update({device_id:null})
          .eq('client_id',formData.get('client_id')) 
          .eq('customer_id',formData.get('customer_id'));
          
          
          if(formData.get('branch_id')){
            query=query.eq('branch_id',formData.get('branch_id'))
          }
         
          const {data,error}=await query;
          
          if(error){
            return NextResponse.json({ message: apiwentWrong ,error:error}, 
                  { status: apiStatusFailureCode });

          }else{
            return NextResponse.json({ message: "Device reset successfully" ,status:1}, 
              { status: apiStatusSuccessCode });
          }
           

  
    }catch(error){
        return funSendApiException(error);
        
    }
}