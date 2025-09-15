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
        const {client_id, branch_id, customer_id }  = await request.json();
    
          let query = supabase
          .from("leap_customer")
          .select(`
            *,
            leap_client_branch_details(*),leap_client(*),department_id(department_id, department_name),designation_id(designation_id,designation_name),work_mode(id, type),employment_type(employment_type_id, employeement_type), manager_id(customer_id,name)
          `).eq('client_id',client_id);
          
          
          if(branch_id){
            query=query.eq('branch_id',branch_id)
          }
          if(customer_id){
            query=query.eq('customer_id',customer_id)
          }
          const {data:customerProfile,error:clientError}=await query;
          
          if(clientError){
            return NextResponse.json({ message: apiwentWrong ,error:clientError}, 
                  { status: apiStatusFailureCode });

          }
           if(customerProfile){
            return NextResponse.json({ message: allClientsData ,status:1,customer_profile:customerProfile}, 
                  { status: apiStatusSuccessCode });
          }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}