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
        
          const {data:clientData,error:clientError} =await supabase
          .from("leap_client")
          .select(`
            *,
            leap_client_branch_details(*)
          `)
          if(clientError){
            return NextResponse.json({ message: apiwentWrong ,error:clientError}, { status: apiStatusFailureCode });

          }
           if(clientData){
            return NextResponse.json({ message: allClientsData ,clients:clientData}, { status: apiStatusSuccessCode });
          }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}