import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { companyData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
      const formData = await request.formData();
      
      let query = supabase
          .from("leap_client")
          .select(`*,leap_client_branch_details(*),leap_sector_type(*)`)
           .eq('parent_id',formData.get('parent_id'))
          //  .eq('client_id',fdata.client_id)
           .eq('is_a_parent', false)
          .order('updated_at', {ascending: false})


          const {data:clientData,error:clientError}=await query;

          if(clientError){
            return NextResponse.json({ status:0,message: apiwentWrong ,error:clientError}, { status: apiStatusFailureCode });
          }
           if(clientData){
            return NextResponse.json({ status:1,message: companyData ,clients:clientData}, { status: apiStatusSuccessCode });
          }
    }catch(error){
      console.log(error);
      
        return funSendApiException(error);
        
    }
}