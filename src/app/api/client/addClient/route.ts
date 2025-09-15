import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
      const { data: user, error: userError } = await supabase.auth.getUser();
    
    
      // Handle case where the user is not authenticated
      // if (userError || !user) {
      //   return NextResponse.json(
      //     { error: 'User not authenticated' },
      //     { status: 401 }
      //   );
      // }
        const formData = await request.formData();
        const fdata = {
            companyName: formData.get('company_name') as string,
            companyLocation: formData.get('company_location') as string,
            companyNumber: formData.get('company_number') as string,
            companyEmail: formData.get('company_email') as string,
            companyWebsiteUrl: formData.get('company_website_url') as string,
            sectorType: formData.get('sector_type'),
            parent_id: formData.get('parent_id'),
            email_id: formData.get('email_id')as string,
            password: formData.get('password')as string,
            emp_id:formData.get('emp_id')

          }

          const emailPassword = {
            email: fdata.email_id,
            password: fdata.password,
          }
          let signedUserData;
          const { data: signUpData, error:signUpError } = await supabase.auth.signUp(emailPassword);
        console.log("signup error", signUpError);
        if (signUpError) {
            if (signUpError.code != "user_already_exists") {
                return NextResponse.json({ status: 0, error: signUpError.message }, { status: 401 });
            } else {
                const email = fdata.email_id, password = fdata.password;
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) {
                    return NextResponse.json({ status: 0, error: error.message }, { status: 200 });

                } else {
                    signedUserData = data;
                }
            }
        } else {
            signedUserData = signUpData;
        }
        
          const { data:clientTableInsert,error:clientInsertError } = await supabase.from('leap_client').insert([
            {
                company_name:fdata.companyName,
                company_location:fdata.companyName,
                company_number:fdata.companyNumber,
                company_email:fdata.companyEmail,
                company_website_url:fdata.companyWebsiteUrl,
                sector_type:fdata.sectorType,
                created_at:new Date(),
                parent_id:fdata.parent_id ||null,
                is_a_parent: "false",  
            }
        ]).select();
        if(clientInsertError){
          return funSendApiErrorMessage(clientInsertError,"Leap Client insert error");
        }

        let query = supabase.from('leap_customer').insert([
          {
              client_id: clientTableInsert[0].client_id,
              branch_id: null,
              name: fdata.companyName,
              email_id: fdata.email_id,
              user_role: 3,
              authUuid: signedUserData.user!.id,
              emp_id: fdata.emp_id,
              created_at: new Date(),

          }
      ]).select()
        const {data:customerData,error:customerError}=await query;
          if(customerError){
            return funSendApiErrorMessage(customerError,"Leap Client customer insert error");
          }
          else{
            return NextResponse.json({ message: clientAddedSuccess,status:1}, { status: apiStatusSuccessCode });
          }
    }catch(error){
        return funSendApiException(error);
        
    }
}