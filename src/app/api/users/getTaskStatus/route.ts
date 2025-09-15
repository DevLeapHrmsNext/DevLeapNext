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
        const {client_id, branch_id }  = await request.json();
    
          let query = supabase
          .from("leap_client_sub_projects")
          .select(`sub_project_name`)
          .eq('client_id',client_id);
        //   if(branch_id){
        //     query=query.eq('branch_id',branch_id)
        //   }
          const {data:projectData,error:error}=await query;
          if(error){
            return NextResponse.json({ message: apiwentWrong ,error:error}, 
                  { status: apiStatusFailureCode });
          }
           if(projectData){
            return NextResponse.json({ message: "All Project list" ,status:1 ,data:projectData}, 
                  { status: apiStatusSuccessCode });
          }
    }catch(error){
        return funSendApiException(error);
    }
}