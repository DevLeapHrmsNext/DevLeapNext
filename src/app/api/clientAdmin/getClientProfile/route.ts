import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { companyData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
      const {client_id} = await request.json();
      let query = supabase
          .from("leap_client")
          .select(`*,leap_client_branch_details(*),leap_sector_type(*),leap_client_basic_info(*)`)
          .eq('client_id', client_id)
          const {data:clientData,error:clientError}=await query;
          if(clientError){
            return NextResponse.json({status: 0, message: apiwentWrong ,error:clientError}, { status: apiStatusFailureCode });
          }
           if(clientData){
            return NextResponse.json({status: 1, message: companyData ,clients:clientData}, { status: apiStatusSuccessCode });
          }
    }catch(error){
        return funSendApiException(error);
    }
}