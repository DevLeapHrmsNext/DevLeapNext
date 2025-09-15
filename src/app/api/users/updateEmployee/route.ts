import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong, authEmailfailure, personaldetailsfailure, personaldetailsSuccess } from "@/app/pro_utils/stringConstants";
import {  funSendApiException } from "@/app/pro_utils/constant";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    
    try{
        // const { data: user, error: userError } = await supabase.auth.getUser();
    
    
        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { message:"User auth not found", error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const formData = await request.formData();
        const uuid=formData.get('authUuid') as string;
        console.log(uuid);
        
        let authQuery;
        console.log(parseInt(formData.get('role_id') as string));
        console.log(formData.get('role_id'));
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SERVICE_ROLE_SUPABASE_KEY!;
          const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
            auth: { autoRefreshToken: false, persistSession: false },
          });
        if(parseInt(formData.get('role_id') as string)==2){
          console.log('if condition called ');
          
          authQuery =  supabaseAdmin.auth.admin.updateUserById(
            uuid,
            { email: formData.get('official_email') as string }
          )
        }else{
          authQuery =  supabase.auth.updateUser({ email: formData.get('official_email') as string});

        }
        const { data: user, error }= await authQuery;
        if(error){
          console.log(error);
          
          return NextResponse.json({ message: authEmailfailure ,error:error}, 
                { status: apiStatusFailureCode });

        }
        
          let query = supabase
          .from("leap_customer")
          .update({
            dob:formData.get('dob'),
            email_id:formData.get('email_id'),
            gender:formData.get('gender'),
            marital_status:formData.get('marital_status'),
            nationality:formData.get('nationality'),
            blood_group:formData.get('blood_group'),
            contact_number:formData.get('contact_number'),
            personalEmail:formData.get('personal_email'),
            employment_status:formData.get('employment_status'),
          }).eq('customer_id',formData.get('customer_id'));
          
          
          
          const {data:customerProfile,error:clientError}=await query;
          
          if(clientError){
            console.log(clientError);
            
            return NextResponse.json({ message: personaldetailsfailure ,error:clientError}, 
                  { status: apiStatusFailureCode });

          }
           
            return NextResponse.json({ message: personaldetailsSuccess,status:1} 
                  );
          

  
    }catch(error){
      console.log(error);
      
        return funSendApiException(error);
        
    }
}