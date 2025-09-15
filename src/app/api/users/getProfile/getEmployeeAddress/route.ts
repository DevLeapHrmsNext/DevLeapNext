import { NextRequest, NextResponse } from "next/server";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";
import supabase from "@/app/api/supabaseConfig/supabase";

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
        const {client_id, branch_id, customer_id} = await request.json();
        
          let query = supabase
          .from("leap_customer_address")
          .select('*').eq('client_id',client_id);
          
          if(branch_id){
            query=query.eq('branch_id',branch_id)
          }
          if(customer_id){
            query=query.eq('customer_id',customer_id)
          }
          const {data:customerAddress,error:addressError}=await query;
          
          if(addressError){
            return NextResponse.json({ message: apiwentWrong ,error:addressError}, 
                  { status: apiStatusFailureCode });
          }
          let emergencyCon = supabase
          .from("leap_employee_emergency_contacts")
          .select('emergency_contact,contact_name,relation(id, relation_type)').eq('customer_id',customer_id);
          if(branch_id){
            emergencyCon=emergencyCon.eq('branch_id',branch_id)
          }
          if(customer_id){
            emergencyCon=emergencyCon.eq('customer_id',customer_id)
          }
          const {data:emergencyContact,error:contactError}=await emergencyCon;
          if(contactError){
            return NextResponse.json({ message: apiwentWrong ,error:contactError}, 
                  { status: apiStatusFailureCode });

          }
           if(customerAddress){
            return NextResponse.json({ message: allClientsData ,status:1,data:{customerAddress:customerAddress,emergencyContact:emergencyContact}}, 
                  { status: apiStatusSuccessCode });
          }

  
    }catch(error){
        return funSendApiException(error);
        
    }
}